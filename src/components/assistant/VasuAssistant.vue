<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import { Brain, MessageCircle, Send, X } from 'lucide-vue-next'
import { onKeyStroke } from '@vueuse/core'
import { useMotion } from '@/composables/useMotion'
import { VASU_FALLBACK, VASU_WELCOME, vasuStarters, type VasuAction, type VasuReply } from '@/data/vasu'

/**
 * Vasu — the portfolio's assistant. Mounted once in the app shell, so the
 * conversation survives routing and closing the panel keeps it.
 *
 * Phase 1 answers come from `data/vasu.ts`; nothing here talks to a network.
 */

/** Stands in for the round trip a real answer will take. */
const THINK_MS = 560

type Message = {
  id: number
  from: 'visitor' | 'vasu'
  text: string
  actions?: VasuAction[]
  /** Marks the honest "I don't know" so the starters come back. */
  unanswered?: boolean
}

const { motionOk } = useMotion()

const open = ref(false)
const messages = ref<Message[]>([])
const draft = ref('')
const thinking = ref(false)
const status = ref('')

const launcher = useTemplateRef<HTMLButtonElement>('launcher')
const title = useTemplateRef<HTMLHeadingElement>('title')
const field = useTemplateRef<HTMLInputElement>('field')
const list = useTemplateRef<HTMLElement>('list')

const last = computed(() => messages.value[messages.value.length - 1])
const showStarters = computed(
  () => !thinking.value && (messages.value.length === 0 || Boolean(last.value?.unanswered)),
)
const canSend = computed(() => draft.value.trim().length > 0 && !thinking.value)

let timer = 0
let seq = 0

const push = (message: Omit<Message, 'id'>) => messages.value.push({ id: ++seq, ...message })

/** The panel scrolls itself; the page behind it never moves. */
const toLatest = () =>
  nextTick(() => {
    if (list.value) list.value.scrollTop = list.value.scrollHeight
  })

/**
 * Phase 1 stand-in for a model: the first starter whose keyword appears in the
 * question wins. Deliberately throwaway — delete it with the mock answers.
 */
const matchReply = (text: string): VasuReply | undefined => {
  const question = text.toLowerCase()
  return vasuStarters.find((s) => s.keywords.some((k) => question.includes(k)))?.reply
}

const ask = (question: string, reply = matchReply(question)) => {
  if (thinking.value) return
  push({ from: 'visitor', text: question })
  thinking.value = true
  status.value = 'Thinking'
  void toLatest()

  timer = window.setTimeout(() => {
    thinking.value = false
    const text = reply?.text ?? VASU_FALLBACK
    push({ from: 'vasu', text, actions: reply?.actions, unanswered: !reply })
    status.value = text
    void toLatest()
  }, THINK_MS)
}

const send = () => {
  const question = draft.value.trim()
  if (!question || thinking.value) return
  draft.value = ''
  ask(question)
}

const show = async () => {
  open.value = true
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

onBeforeUnmount(() => clearTimeout(timer))

const isExternal = (action: VasuAction) => Boolean(action.href && !action.href.startsWith('mailto:'))
</script>

<template>
  <button
    v-if="!open"
    ref="launcher"
    type="button"
    class="vasu__launcher"
    aria-haspopup="dialog"
    @click="show"
  >
    <MessageCircle class="vasu__launcher-icon" aria-hidden="true" />
    Ask Vasu
  </button>

  <Transition name="vasu">
    <section
      v-if="open"
      class="vasu"
      role="dialog"
      aria-labelledby="vasu-title"
      :data-motion="motionOk"
    >
      <header class="vasu__head">
        <div>
          <h2 id="vasu-title" ref="title" class="vasu__name" tabindex="-1">Vasu</h2>
          <p class="vasu__role">Neubin&rsquo;s portfolio assistant</p>
        </div>

        <button type="button" class="vasu__close" aria-label="Close Vasu" @click="hide">
          <X aria-hidden="true" />
        </button>
      </header>

      <div ref="list" class="vasu__log">
        <div class="vasu__intro">
          <p v-for="line in VASU_WELCOME" :key="line" class="vasu__said">{{ line }}</p>
        </div>

        <ol v-if="messages.length" class="vasu__messages">
          <li v-for="message in messages" :key="message.id" :data-from="message.from">
            <p v-if="message.from === 'vasu'" class="vasu__tag">Vasu</p>
            <p :class="message.from === 'vasu' ? 'vasu__said' : 'vasu__asked'">{{ message.text }}</p>

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

        <div v-if="showStarters" class="vasu__starters">
          <button
            v-for="starter in vasuStarters"
            :key="starter.id"
            type="button"
            class="vasu__starter"
            @click="ask(starter.label, starter.reply)"
          >
            {{ starter.label }}
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
          placeholder="Ask Vasu about Neubin&hellip;"
          autocomplete="off"
        />
        <button type="submit" class="vasu__send" :disabled="!canSend" aria-label="Send">
          <Send aria-hidden="true" />
        </button>
      </form>
    </section>
  </Transition>
</template>

<style scoped>
.vasu__launcher,
.vasu {
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: calc(1rem + env(safe-area-inset-bottom));
  font-family: var(--font-sans);
}

.vasu__launcher {
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding-inline: 0.9rem;
  background: var(--c-surface);
  border: 1px solid var(--c-rule);
  border-radius: 0.25rem;
  color: var(--c-ink);
  font-size: var(--t-sm);
  font-weight: 500;
  cursor: pointer;
  transition:
    opacity 320ms var(--ease-out),
    visibility 320ms var(--ease-out),
    border-color var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out);
}

.vasu__launcher:hover,
.vasu__launcher:focus-visible {
  border-color: var(--c-rule-strong);
  color: var(--c-accent);
}

.vasu__launcher-icon {
  font-size: 1.0625rem;
  color: var(--c-accent);
}

/* Above the bar so a near-full-height mobile sheet is never clipped by it. */
.vasu {
  z-index: 55;
  display: flex;
  flex-direction: column;
  width: min(25rem, calc(100vw - 2rem));
  max-height: min(70svh, 40rem);
  background: var(--c-surface);
  border: 1px solid var(--c-rule);
  border-radius: 0.25rem;
}

@media (max-width: 30rem) {
  .vasu {
    left: max(0.75rem, env(safe-area-inset-left));
    right: max(0.75rem, env(safe-area-inset-right));
    width: auto;
    max-height: min(78svh, 34rem);
  }
}

.vasu__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0.75rem 0.9rem 1.1rem;
  border-bottom: 1px solid var(--c-rule);
}

.vasu__name {
  font-size: var(--t-base);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--c-ink);
}

.vasu__name:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 3px;
}

.vasu__role {
  margin-top: 0.1rem;
  font-size: var(--t-xs);
  color: var(--c-muted);
}

.vasu__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  margin: -0.5rem -0.35rem 0 0;
  font-size: 1.0625rem;
  color: var(--c-muted);
  cursor: pointer;
  transition: color var(--dur) var(--ease-out);
}

.vasu__close:hover,
.vasu__close:focus-visible {
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

.vasu__asked {
  padding: 0.5rem 0.7rem;
  background: var(--c-paper);
  border: 1px solid var(--c-rule);
  border-radius: 0.25rem;
  font-size: var(--t-sm);
  line-height: 1.5;
  color: var(--c-ink);
  overflow-wrap: anywhere;
}

.vasu__intro {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.vasu__intro .vasu__said:last-child {
  color: var(--c-muted);
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

/* Rows rather than pills: a short list of things worth asking. */
.vasu__starters {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--c-rule);
}

.vasu__starter {
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--c-rule);
  text-align: left;
  font-size: var(--t-sm);
  line-height: 1.4;
  color: var(--c-ink);
  cursor: pointer;
  transition: color var(--dur) var(--ease-out);
}

.vasu__starter:hover,
.vasu__starter:focus-visible {
  color: var(--c-accent);
}

.vasu__compose {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.6rem 0.6rem 1rem;
  border-top: 1px solid var(--c-rule);
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

.vasu__input:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 2px;
  border-radius: 1px;
}

.vasu__send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.75rem;
  min-height: 2.75rem;
  flex: none;
  font-size: 1.0625rem;
  color: var(--c-accent);
  cursor: pointer;
  transition: opacity var(--dur) var(--ease-out);
}

.vasu__send:disabled {
  opacity: 0.35;
  cursor: default;
}

.vasu-enter-active,
.vasu-leave-active {
  transition:
    opacity 200ms var(--ease-out),
    transform 200ms var(--ease-out);
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
</style>

<style>
/* The hero's opening owns the screen for its few seconds, so the launcher
   waits for it — a selector rather than shared state between the two. */
body:has(.hero .intro) .vasu__launcher {
  opacity: 0;
  visibility: hidden;
  /* Out at once, back in on the transition above, as the hero settles. */
  transition: none;
}
</style>
