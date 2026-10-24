<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Brain, Send, X } from 'lucide-vue-next'
import type { AnimationItem, LottiePlayer } from 'lottie-web'
import { onKeyStroke, useOnline } from '@vueuse/core'
import { useMotion } from '@/composables/useMotion'
import {
  VASU_OFFLINE,
  VASU_WELCOME,
  matchTopic,
  vasuFollowUps,
  vasuStarters,
  type VasuAction,
  type VasuTopic,
} from '@/data/vasu'


/** Long enough for a cold function, short enough not to feel stuck. */
const REPLY_TIMEOUT_MS = 9000

/** Recent turns sent for context. Enough to resolve "and his UX work?". */
const HISTORY = 8

const MAX_SUGGESTIONS = 2

const HINT_KEY = 'vasu-hint-seen'
const HINT_DELAY_MS = 1000
const HINT_VISIBLE_MS = 9000

type Message = {
  id: number
  from: 'visitor' | 'vasu'
  text: string
  actions?: VasuAction[]
  /** Which topic answered this, so it is not offered again. */
  topicId?: string
  /** What to offer next, resolved when the answer is pushed. */
  followUps?: VasuTopic[]
  /** Marks the honest "I don't know" so the starters come back. */
  unanswered?: boolean
}

const { motionOk } = useMotion()
const route = useRoute()
const browserOnline = useOnline()

const open = ref(false)
const messages = ref<Message[]>([])
const draft = ref('')
const thinking = ref(false)
const status = ref('')
const hint = ref(false)

/**
 * Derived from what the assistant already does rather than from a health
 * check: an answer from `/api/chat` means online, a fall back to the local
 * knowledge means offline. Before the first question, the browser's own view.
 */
const connection = ref<'online' | 'offline'>(browserOnline.value ? 'online' : 'offline')

watch(browserOnline, (up) => {
  if (!up) connection.value = 'offline'
})

const presence = computed(() =>
  connection.value === 'online'
    ? { state: 'online', label: 'Online' }
    : { state: 'offline', label: 'Offline mode' },
)

const launcher = useTemplateRef<HTMLButtonElement>('launcher')
const stage = useTemplateRef<HTMLElement>('stage')
const face = useTemplateRef<HTMLElement>('face')
const title = useTemplateRef<HTMLHeadingElement>('title')
const field = useTemplateRef<HTMLInputElement>('field')
const list = useTemplateRef<HTMLElement>('list')

const last = computed(() => messages.value[messages.value.length - 1])

const answered = computed(() => new Set(messages.value.map((message) => message.topicId)))

/**
 * The starters to begin with, and again whenever Vasu has to say it does not
 * know. Otherwise what the last answer suggests, minus anything already
 * answered, so the conversation moves on rather than circling.
 */
const suggestions = computed<VasuTopic[]>(() => {
  if (thinking.value) return []
  if (!last.value || last.value.unanswered) return vasuStarters.slice(0, MAX_SUGGESTIONS)

  const followUps = last.value.followUps ?? []
  const fresh = followUps.filter((topic) => !answered.value.has(topic.id))
  return (fresh.length ? fresh : followUps).slice(0, MAX_SUGGESTIONS)
})
const canSend = computed(() => draft.value.trim().length > 0 && !thinking.value)

let inflight: AbortController | null = null
let seq = 0

const push = (message: Omit<Message, 'id'>) => messages.value.push({ id: ++seq, ...message })

/** The panel scrolls itself; the page behind it never moves. */
const toLatest = () =>
  nextTick(() => {
    if (list.value) list.value.scrollTop = list.value.scrollHeight
  })

/**
 * One request, no retry. Any failure — non-200, timeout, offline — comes back
 * as an empty string, and the caller answers from the local knowledge instead.
 */
const askServer = async (turns: { role: 'user' | 'assistant'; content: string }[]) => {
  const controller = new AbortController()
  inflight = controller
  const timer = window.setTimeout(() => controller.abort(), REPLY_TIMEOUT_MS)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: turns }),
      signal: controller.signal,
    })
    if (!response.ok) return ''

    const data: unknown = await response.json()
    const answer = (data as { answer?: unknown })?.answer
    return typeof answer === 'string' ? answer.trim() : ''
  } catch {
    return ''
  } finally {
    window.clearTimeout(timer)
    if (inflight === controller) inflight = null
  }
}

const ask = async (question: string, topic = matchTopic(question)) => {
  if (thinking.value) return
  push({ from: 'visitor', text: question })
  thinking.value = true
  status.value = 'Thinking'
  void toLatest()

  const turns = messages.value.slice(-HISTORY).map((message) => ({
    role: message.from === 'vasu' ? ('assistant' as const) : ('user' as const),
    content: message.text,
  }))

  const answer = await askServer(turns)

  thinking.value = false
  connection.value = answer ? 'online' : 'offline'
  const text = answer || topic?.answer || VASU_OFFLINE
  push({
    from: 'vasu',
    text,
    actions: topic?.actions,
    topicId: topic?.id,
    followUps: topic && vasuFollowUps(topic),
    unanswered: !topic,
  })
  status.value = text
  void toLatest()
}

const send = () => {
  const question = draft.value.trim()
  if (!question || thinking.value) return
  draft.value = ''
  void ask(question)
}

let hintTimers: number[] = []
let heroWatch: MutationObserver | null = null

const dismissHint = () => {
  hint.value = false
  hintTimers.forEach(window.clearTimeout)
  hintTimers = []
}

const heroIntroPlaying = () => Boolean(document.querySelector('.hero .intro'))

const scheduleHint = () => {
  hintTimers.push(
    window.setTimeout(() => {
      if (open.value) return
      hint.value = true
      try {
        sessionStorage.setItem(HINT_KEY, '1')
      } catch {
        /* Private mode: the hint simply shows again next load. */
      }
      hintTimers.push(window.setTimeout(() => (hint.value = false), HINT_VISIBLE_MS))
    }, HINT_DELAY_MS),
  )
}

let launcherVasu: AnimationItem | null = null
let headerVasu: AnimationItem | null = null
let player: LottiePlayer | null = null
let frames: unknown = null

/* Loaded after mount so the player and the frames stay out of the entry chunk,
   then reused, so opening the panel costs one more instance and no new fetch. */
const playVasu = async (container: HTMLElement | null) => {
  if (!container) return null

  if (!player) {
    const [lottie, data] = await Promise.all([
      import('lottie-web/build/player/lottie_light'),
      import('@/assets/assistant/vasu_bot_brand.json'),
    ])
    player = lottie.default
    frames = data.default
  }

  const item = player.loadAnimation({
    container,
    renderer: 'svg',
    loop: motionOk.value,
    autoplay: motionOk.value,
    animationData: frames,
  })
  if (!motionOk.value) item.goToAndStop(0, true)
  return item
}

watch(open, async (isOpen) => {
  if (isOpen) {
    launcherVasu?.pause()
    await nextTick()
    headerVasu = await playVasu(face.value)
  } else {
    headerVasu?.destroy()
    headerVasu = null
    if (motionOk.value) launcherVasu?.play()
  }
})

onMounted(async () => {
  launcherVasu = await playVasu(stage.value)

  try {
    if (sessionStorage.getItem(HINT_KEY)) return
  } catch {
    return
  }

  if (!heroIntroPlaying()) {
    scheduleHint()
    return
  }

  // The hero's opening owns the screen for its few seconds, so the hint waits
  // for that element to leave the DOM rather than for a timer of its own.
  heroWatch = new MutationObserver(() => {
    if (heroIntroPlaying()) return
    heroWatch?.disconnect()
    scheduleHint()
  })
  heroWatch.observe(document.body, { childList: true, subtree: true })
})

watch(() => route.path, dismissHint)

const show = async () => {
  open.value = true
  dismissHint()
  await nextTick()
  // A phone keyboard sliding up the instant the panel appears hides the thing
  // it just opened, so the heading takes focus there and the input on desktop.
  if (window.matchMedia('(min-width: 40rem)').matches) field.value?.focus()
  else title.value?.focus()
  void toLatest()
}

const hide = async () => {
  open.value = false
  await nextTick()
  launcher.value?.focus()
}

onKeyStroke('Escape', () => {
  if (open.value) void hide()
})

onBeforeUnmount(() => {
  inflight?.abort()
  heroWatch?.disconnect()
  launcherVasu?.destroy()
  headerVasu?.destroy()
  dismissHint()
})

const isExternal = (action: VasuAction) => Boolean(action.href && !action.href.startsWith('mailto:'))

/** Longer answers are written in two or three paragraphs; keep them as such. */
const paragraphs = (text: string) => text.split('\n\n')
</script>

<template>
  <!-- `v-show`, not `v-if`: the Lottie instance outlives opening the panel. -->
  <div v-show="!open" class="vasu__dock">
    <Transition name="vasu-hint">
      <div v-if="hint" class="vasu__hint" role="status">
        <p class="vasu__hint-copy">
          <strong>Welcome to Neubin&rsquo;s portfolio.</strong>
          <span>I&rsquo;m Vasu, your guide to Neubin&rsquo;s work.</span>
          Ask me about his work, projects, skills or experience.
        </p>

        <button
          type="button"
          class="vasu__hint-close"
          aria-label="Dismiss Vasu's message"
          @click="dismissHint"
        >
          <X aria-hidden="true" />
        </button>
      </div>
    </Transition>

    <!-- Named explicitly: the two label lines concatenate without a space. -->
    <button
      ref="launcher"
      type="button"
      class="vasu__launcher"
      aria-haspopup="dialog"
      aria-label="I’m Vasu, Neubin’s portfolio guide"
      @click="show"
    >
      <span class="vasu__bot" aria-hidden="true">
        <span ref="stage" class="vasu__canvas" />
      </span>

      <span class="vasu__launcher-text">
        <span class="vasu__launcher-name">I&rsquo;m Vasu</span>
        <span class="vasu__launcher-role">Neubin&rsquo;s portfolio guide</span>
      </span>
    </button>
  </div>

  <Transition name="vasu">
    <section
      v-if="open"
      class="vasu"
      role="dialog"
      aria-labelledby="vasu-title"
      :data-motion="motionOk"
    >
      <header class="vasu__head">
        <span class="vasu__face" aria-hidden="true">
          <span ref="face" class="vasu__canvas" />
        </span>

        <div class="vasu__identity">
          <div class="vasu__presence">
            <h2 id="vasu-title" ref="title" class="vasu__name" tabindex="-1">Vasu</h2>
            <span class="vasu__dot" :data-state="presence.state" aria-hidden="true" />
            <span class="vasu__state">{{ presence.label }}</span>
          </div>
          <p class="vasu__role">Neubin&rsquo;s portfolio guide</p>
        </div>

        <button type="button" class="vasu__close" aria-label="Close Vasu" @click="hide">
          <X aria-hidden="true" />
        </button>
      </header>

      <div ref="list" class="vasu__log">
        <div class="vasu__intro">
          <p v-for="(line, i) in VASU_WELCOME" :key="line" :data-rank="i">{{ line }}</p>
        </div>

        <ol v-if="messages.length" class="vasu__messages">
          <li v-for="message in messages" :key="message.id" :data-from="message.from">
            <p v-if="message.from === 'vasu'" class="vasu__tag">Vasu</p>

            <template v-if="message.from === 'vasu'">
              <p v-for="(para, i) in paragraphs(message.text)" :key="i" class="vasu__said">
                {{ para }}
              </p>
            </template>
            <p v-else class="vasu__asked">{{ message.text }}</p>

            <p v-if="message.actions" class="vasu__actions">
              <template v-for="action in message.actions" :key="action.label">
                <RouterLink v-if="action.to" :to="action.to" class="link-underline" @click="hide">{{
                  action.label
                }}</RouterLink>
                <a
                  v-else-if="isExternal(action)"
                  :href="action.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-underline"
                  >{{ action.label }}<span class="sr-only"> (opens in a new tab)</span></a
                >
                <a v-else :href="action.href" class="link-underline">{{ action.label }}</a>
              </template>
            </p>
          </li>
        </ol>

        <p v-if="thinking" class="vasu__thinking">
          <Brain class="vasu__brain" aria-hidden="true" />Thinking&hellip;
        </p>

        <div v-if="suggestions.length" class="vasu__starters">
          <p class="vasu__starters-label">Suggested prompts</p>
          <button
            v-for="topic in suggestions"
            :key="topic.id"
            type="button"
            class="vasu__starter"
            :disabled="thinking"
            @click="ask(topic.title, topic)"
          >
            {{ topic.title }}
          </button>
        </div>
      </div>

      <p class="sr-only" aria-live="polite">{{ status }}</p>

      <form class="vasu__compose" @submit.prevent="send">
        <label class="sr-only" for="vasu-input">Ask Vasu about Neubin</label>
        <input
          id="vasu-input"
          ref="field"
          v-model="draft"
          type="text"
          class="vasu__input"
          placeholder="Ask anything about Neubin&hellip;"
          autocomplete="off"
          maxlength="500"
        />
        <button type="submit" class="vasu__send" :disabled="!canSend" aria-label="Send">
          <Send aria-hidden="true" />
        </button>
      </form>
    </section>
  </Transition>
</template>

<style scoped>
.vasu__dock,
.vasu {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  font-family: var(--font-sans);
}

/* Clear of the hero's own foot row, which runs along the bottom of the first
   screen and is where this corner would otherwise land. */
.vasu__dock {
  bottom: calc(4rem + env(safe-area-inset-bottom));
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.65rem;
  transition:
    opacity 320ms var(--ease-out),
    visibility 320ms var(--ease-out);

  /* The drawn character fills only the middle third of its 500x500 canvas, so
     the box is sized to Vasu and the canvas is centred behind it. */
  --vasu-w: 4.25rem;
  --vasu-h: 7.5rem;
  --vasu-canvas: 11.75rem;
  --tail: 4.375rem;
}

.vasu__launcher {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem;
  text-align: center;
  line-height: 1.35;
  color: var(--c-muted);
  transition: color var(--dur) var(--ease-out);
}

.vasu__launcher:hover,
.vasu__launcher:focus-visible {
  color: var(--c-ink);
}

/* Sized to Vasu, not to his canvas. Drawn white for dark grounds, so on paper
   he needs an edge of his own rather than a card behind him. */
.vasu__bot,
.vasu__face {
  position: relative;
  display: block;
  flex: none;
  width: var(--vasu-w);
  height: var(--vasu-h);
  filter: drop-shadow(0 1px 1px rgb(61 10 21 / 0.22)) drop-shadow(0 0 1.5px rgb(61 10 21 / 0.45));
}

[data-theme='dark'] .vasu__face {
  filter: none;
}

.vasu__bot {
  transition: transform 220ms var(--ease-out);
}

.vasu__canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--vasu-canvas);
  height: var(--vasu-canvas);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

[data-theme='dark'] .vasu__bot {
  filter: none;
}

.vasu__launcher:hover .vasu__bot,
.vasu__launcher:focus-visible .vasu__bot {
  transform: translateY(-2px) scale(1.03);
}

.vasu__launcher:active .vasu__bot {
  transform: translateY(0) scale(0.99);
}

.vasu__launcher-name {
  display: block;
  font-size: var(--t-xs);
  font-weight: 500;
}

.vasu__launcher-role {
  display: block;
  font-size: 0.6875rem;
  color: var(--c-muted);
}

/* Vasu alone on a phone. The label stays in the accessibility tree, so the
   launcher keeps one name across every viewport. */
@media (max-width: 30rem) {
  .vasu__dock {
    --vasu-w: 2.75rem;
    --vasu-h: 4.9rem;
    --vasu-canvas: 7.6rem;
    --tail: 1.625rem;
  }

  .vasu__launcher-text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}

/* Glass is reserved for these two overlays, so the assistant reads as a layer
   above the page rather than another block on it. */
.vasu__hint,
.vasu {
  background: var(--c-glass);
  border: 1px solid var(--c-glass-rule);
  box-shadow: 0 1px 2px rgb(31 18 14 / 0.05), 0 12px 28px -12px rgb(31 18 14 / 0.22);
  --c-glass: rgb(255 253 250 / 0.82);
  --c-glass-rule: rgb(195 183 171 / 0.7);
  --c-glass-inset: rgb(246 243 239 / 0.6);
}

@supports (backdrop-filter: blur(1px)) {
  .vasu__hint,
  .vasu {
    backdrop-filter: blur(14px) saturate(1.3);
  }
}

[data-theme='dark'] .vasu__hint,
[data-theme='dark'] .vasu {
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.3), 0 14px 32px -14px rgb(0 0 0 / 0.6);
  --c-glass: rgb(25 20 19 / 0.82);
  --c-glass-rule: rgb(69 59 56 / 0.75);
  --c-glass-inset: rgb(16 13 12 / 0.55);
}

.vasu__hint {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  max-width: min(17.5rem, calc(100vw - 2.5rem));
  padding: 0.75rem 0.4rem 0.8rem 0.9rem;
  border-radius: 6px;
}

/* The speech tail, centred on Vasu and sitting over the edge it points from. */
.vasu__hint::after {
  content: '';
  position: absolute;
  right: calc(var(--tail) - 0.3rem);
  bottom: -0.3rem;
  width: 0.55rem;
  height: 0.55rem;
  background: var(--c-glass);
  border-right: 1px solid var(--c-glass-rule);
  border-bottom: 1px solid var(--c-glass-rule);
  transform: rotate(45deg);
}

.vasu__hint-copy {
  font-size: var(--t-xs);
  line-height: 1.55;
  color: var(--c-muted);
}

.vasu__hint-copy strong {
  display: block;
  font-weight: 600;
  color: var(--c-ink);
}

.vasu__hint-copy span {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--c-ink);
}

.vasu__hint-close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  min-height: 1.75rem;
  margin-top: -0.15rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--c-faint);
  transition:
    color var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out);
}

.vasu__hint-close:hover,
.vasu__hint-close:focus-visible {
  background: var(--c-accent-soft);
  color: var(--c-ink);
}

.vasu-hint-enter-active,
.vasu-hint-leave-active {
  transition:
    opacity 300ms var(--ease-out),
    transform 300ms var(--ease-out);
}

.vasu-hint-enter-from,
.vasu-hint-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Above the bar so a near-full-height mobile sheet is never clipped by it. */
.vasu {
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: 55;
  display: flex;
  flex-direction: column;
  width: min(25rem, calc(100vw - 2rem));
  max-height: min(70svh, 40rem);
  border-radius: 8px;

  --c-live: #3f7a52;
  --vasu-w: 1.9rem;
  --vasu-h: 3.25rem;
  --vasu-canvas: 5.1rem;
}

[data-theme='dark'] .vasu {
  --c-live: #6fae84;
}

@media (max-width: 30rem) {
  .vasu {
    left: max(0.75rem, env(safe-area-inset-left));
    right: max(0.75rem, env(safe-area-inset-right));
    width: auto;
    max-height: min(78svh, 34rem);
    --vasu-w: 1.65rem;
    --vasu-h: 2.8rem;
    --vasu-canvas: 4.4rem;
  }
}

.vasu__head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 0.75rem 0.75rem 0.9rem;
  border-bottom: 1px solid var(--c-glass-rule);
}

.vasu__identity {
  flex: 1;
  min-width: 0;
}

.vasu__presence {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.vasu__name {
  font-size: var(--t-lg);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--c-ink);
}

.vasu__name:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 3px;
}

.vasu__dot {
  width: 0.375rem;
  height: 0.375rem;
  flex: none;
  margin-left: 0.15rem;
  border-radius: 50%;
  background: var(--c-faint);
}

.vasu__dot[data-state='online'] {
  background: var(--c-live);
}

.vasu[data-motion='true'] .vasu__dot[data-state='online'] {
  animation: vasu-live 3.2s var(--ease-in-out) infinite;
}

@keyframes vasu-live {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

.vasu__state,
.vasu__role {
  font-size: var(--t-xs);
  color: var(--c-muted);
}

.vasu__role {
  margin-top: 0.1rem;
}

.vasu__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
  margin: -0.35rem -0.35rem 0 0;
  border-radius: 4px;
  font-size: 1.0625rem;
  color: var(--c-muted);
  transition:
    color var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out);
}

.vasu__close:hover,
.vasu__close:focus-visible {
  background: var(--c-accent-soft);
  color: var(--c-ink);
}

.vasu__log {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.vasu__messages {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.vasu__messages li[data-from='visitor'] {
  align-self: flex-end;
  max-width: 85%;
}

.vasu__messages li[data-from='vasu'] {
  max-width: 94%;
}

/* Vasu speaks in plain type; the visitor's own words sit in a quiet chip. */
.vasu__said {
  font-size: var(--t-sm);
  line-height: 1.6;
  color: var(--c-ink);
  overflow-wrap: anywhere;
}

/* An answer set in two or three paragraphs, not one block. */
.vasu__messages .vasu__said + .vasu__said {
  margin-top: 0.55rem;
}

.vasu__asked {
  padding: 0.5rem 0.7rem;
  background: var(--c-glass-inset);
  border: 1px solid var(--c-glass-rule);
  border-radius: 6px;
  font-size: var(--t-sm);
  line-height: 1.5;
  color: var(--c-ink);
  overflow-wrap: anywhere;
}

/* The opening lines are Vasu introducing himself, not an answer. */
.vasu__intro {
  padding: 0.85rem 0.9rem;
  background: var(--c-glass-inset);
  border: 1px solid var(--c-glass-rule);
  border-radius: 6px;
  font-size: var(--t-sm);
  line-height: 1.55;
  color: var(--c-muted);
}

.vasu__intro p[data-rank='0'] {
  font-weight: 600;
  color: var(--c-ink);
}

.vasu__intro p[data-rank='1'] {
  margin-bottom: 0.3rem;
  color: var(--c-ink);
}

.vasu__tag {
  margin-bottom: 0.3rem;
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c-accent);
}

.vasu__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1rem;
  margin-top: 0.6rem;
  font-size: var(--t-xs);
}

.vasu__actions a {
  color: var(--c-accent);
}

.vasu__thinking {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--t-xs);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.vasu__brain {
  font-size: 1.0625rem;
}

.vasu[data-motion='true'] .vasu__brain {
  animation: vasu-breathe 1400ms var(--ease-in-out) infinite;
}

@keyframes vasu-breathe {
  0%,
  100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
}

.vasu__starters {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
}

.vasu__starters-label {
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c-faint);
}

.vasu__starter {
  padding: 0.5rem 0.75rem;
  background: var(--c-glass-inset);
  border: 1px solid var(--c-glass-rule);
  border-radius: 6px;
  text-align: left;
  font-size: var(--t-sm);
  line-height: 1.4;
  color: var(--c-ink);
  transition:
    transform var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out);
}

.vasu__starter:hover:not(:disabled),
.vasu__starter:focus-visible {
  transform: translateY(-1px);
  background: var(--c-accent-soft);
  border-color: var(--c-accent);
  color: var(--c-accent);
}

.vasu__starter:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}

.vasu__starter:disabled {
  opacity: 0.5;
  cursor: default;
}

.vasu__compose {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.6rem;
  padding: 0.15rem 0.15rem 0.15rem 0.75rem;
  background: var(--c-glass-inset);
  border: 1px solid var(--c-glass-rule);
  border-radius: 6px;
  transition:
    border-color var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out);
}

.vasu__compose:focus-within {
  background: var(--c-accent-soft);
  border-color: var(--c-accent);
}

.vasu__input {
  flex: 1;
  min-width: 0;
  min-height: 2.5rem;
  background: none;
  border: 0;
  color: var(--c-ink);
  font-family: var(--font-sans);
  font-size: var(--t-sm);
}

.vasu__input::placeholder {
  color: var(--c-muted);
}

/* The composer shows the focus state, so the field does not ring inside it. */
.vasu__input:focus-visible {
  outline: none;
}

.vasu__send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
  flex: none;
  border-radius: 4px;
  font-size: 1.0625rem;
  color: var(--c-accent);
  transition:
    opacity var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out);
}

.vasu__send:hover:not(:disabled),
.vasu__send:focus-visible {
  background: var(--c-accent-soft);
}

.vasu__send:active:not(:disabled) {
  transform: scale(0.94);
}

.vasu__send:disabled {
  opacity: 0.35;
  cursor: default;
}

.vasu-enter-active,
.vasu-leave-active {
  transition:
    opacity 220ms var(--ease-out),
    transform 220ms var(--ease-out);
}

.vasu-enter-from,
.vasu-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* The visitor's own Pause Motion choice; `prefers-reduced-motion` is handled
   globally in main.css. */
.vasu[data-motion='false'].vasu-enter-active,
.vasu[data-motion='false'].vasu-leave-active {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .vasu-hint-enter-from,
  .vasu-hint-leave-to,
  .vasu-enter-from,
  .vasu-leave-to {
    transform: none;
  }

  .vasu__bot,
  .vasu__starter,
  .vasu__send {
    transition: none;
  }

  .vasu__launcher:hover .vasu__bot,
  .vasu__launcher:focus-visible .vasu__bot,
  .vasu__launcher:active .vasu__bot,
  .vasu__starter:hover:not(:disabled),
  .vasu__starter:focus-visible,
  .vasu__starter:active:not(:disabled),
  .vasu__send:active:not(:disabled) {
    transform: none;
  }
}
</style>

<style>
/* The hero's opening owns the screen for its few seconds, so the launcher
   waits for it — a selector rather than shared state between the two. */
body:has(.hero .intro) .vasu__dock {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: none;
}
</style>
