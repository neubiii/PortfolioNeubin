<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { Brain } from 'lucide-vue-next'

/**
 * The hero's opening: a recruiter's requirement is typed out, considered,
 * answered, and then gives way to the hero itself. This layer only covers the
 * hero — it never replaces it, so Vanta and the headline are already live
 * behind the ground it paints.
 */
const emit = defineEmits<{ reveal: []; done: [] }>()

const SENTENCE =
  'I’m looking for a curious product thinker with experience in UX design and front-end development.'

/** The stages, in milliseconds, in the order they run — 6.4s end to end. */
const BEATS = {
  lead: 350,
  typing: 2600,
  /** The finished sentence, held still long enough to be read. */
  hold: 350,
  thinking: 1500,
  /** Long enough that the answer is fully up for ~650ms before the hero moves. */
  matched: 900,
  /** The hero settles in through this stage while the layer fades off it. */
  reveal: 800,
  /** The same fade, collapsed, when the visitor asks to get on with it. */
  skipped: 220,
} as const

type Phase = 'sentence' | 'thinking' | 'matched' | 'reveal' | 'complete'

const phase = ref<Phase>('sentence')
const typed = ref('')
const typing = computed(() => phase.value === 'sentence' && typed.value.length < SENTENCE.length)

let timer = 0
let frame = 0

const stop = () => {
  clearTimeout(timer)
  cancelAnimationFrame(frame)
}


const after = (ms: number, fn: () => void) => {
  timer = window.setTimeout(fn, ms)
}


const STEP_CAP = 250

const reveal = (done: () => void) => {
  let last: number | null = null
  let shown = 0
  const tick = (now: number) => {
    if (last !== null) shown += Math.min(now - last, STEP_CAP)
    last = now
    const progress = Math.min(1, shown / BEATS.typing)
    typed.value = SENTENCE.slice(0, Math.round(progress * SENTENCE.length))
    if (progress < 1) frame = requestAnimationFrame(tick)
    else done()
  }
  frame = requestAnimationFrame(tick)
}

/* The chain, last stage first, so each one names the stage it hands over to. */
const toDone = () => {
  phase.value = 'complete'
  emit('done')
}

const toReveal = () => {
  typed.value = SENTENCE
  phase.value = 'reveal'
  emit('reveal')
  after(BEATS.reveal, toDone)
}

const toMatch = () => {
  phase.value = 'matched'
  after(BEATS.matched, toReveal)
}

const toThinking = () => {
  phase.value = 'thinking'
  after(BEATS.thinking, toMatch)
}

const toHold = () => after(BEATS.hold, toThinking)
const toType = () => reveal(toHold)

/* Started on the first painted frame, not on mount: a cold boot can hold the
   main thread past the opening beat, and the line should be seen appearing. */
frame = requestAnimationFrame(() => after(BEATS.lead, toType))

const skip = () => {
  if (phase.value === 'reveal' || phase.value === 'complete') return
  stop()
  toReveal()
  clearTimeout(timer)
  after(BEATS.skipped, toDone)
}

onBeforeUnmount(stop)
</script>

<template>
  <div class="intro" :data-phase="phase">
    <!-- Decorative throughout: the hero's real heading and copy sit behind this
         layer, in the accessibility tree from the first frame. -->
    <div class="intro__inner" aria-hidden="true">
      <p class="intro__line">
        <span class="intro__ghost">{{ SENTENCE }}</span>
        <span class="intro__typed"
          >{{ typed }}<span class="intro__caret" :data-on="typing"
        /></span>
      </p>

      <div class="intro__status">
        <p class="intro__state intro__state--thinking">
          <Brain class="intro__brain" aria-hidden="true" />Thinking
        </p>
        <p class="intro__state intro__state--match">One match found</p>
      </div>
    </div>

    <button type="button" class="intro__skip" @click="skip">Skip intro</button>
  </div>
</template>

<style scoped>

.intro {
  --intro-ground: #050505;
  --intro-ink: #f5efea;
  --intro-muted: #b8aaa3;
  --intro-accent: #e4808f;

  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutter);
  background: var(--intro-ground);
  transition: opacity 620ms var(--ease-out);
}

.intro[data-phase='reveal'] {
  opacity: 0;
  /* The hero is usable from the first frame of the reveal, not the last. */
  pointer-events: none;
}

/* Centred and held to a readable measure — the requirement is the whole screen
   for these few seconds, and the hero's left-aligned composition arrives with
   the hero. */
.intro__inner {
  width: min(90vw, 46rem);
  text-align: center;
  transition:
    opacity 620ms var(--ease-out),
    transform 620ms var(--ease-out);
}

.intro[data-phase='reveal'] .intro__inner {
  opacity: 0;
  transform: translateY(-8px);
}

.intro__line {
  position: relative;
  font-family: var(--font-sans);
  font-size: clamp(1.3125rem, 0.9rem + 1.95vw, 2rem);
  line-height: 1.5;
  letter-spacing: -0.008em;
  color: var(--intro-ink);
}

/* Holds the block's full height from the first frame, so nothing below it
   moves as the line appears. */
.intro__ghost {
  visibility: hidden;
}

.intro__typed {
  position: absolute;
  inset: 0;
}

.intro__caret {
  display: inline-block;
  width: 1px;
  height: 1.05em;
  margin-left: 0.14em;
  vertical-align: -0.17em;
  background: var(--intro-accent);
  opacity: 0;
  transition: opacity var(--dur) var(--ease-out);
}

.intro__caret[data-on='true'] {
  opacity: 1;
}

/* Stacked in one cell so the two states cross over without moving anything. */
.intro__status {
  display: grid;
  justify-items: center;
  margin-top: clamp(2.25rem, 5vh, 3.25rem);
}

.intro__state {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-sans);
  font-size: var(--t-xs);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  opacity: 0;
}

.intro__state--thinking {
  color: var(--intro-muted);
  transition: opacity 240ms var(--ease-out);
}

.intro[data-phase='thinking'] .intro__state--thinking {
  opacity: 1;
}

/* Delayed, so `Thinking` has faded before the answer takes its place. */
.intro__state--match {
  color: var(--intro-accent);
  transform: translateY(4px);
  transition:
    opacity 280ms var(--ease-out) 160ms,
    transform 280ms var(--ease-out) 160ms;
}

.intro[data-phase='matched'] .intro__state--match,
.intro[data-phase='reveal'] .intro__state--match {
  opacity: 1;
  transform: none;
}

/* One breath across the stage — no rotation, no scaling, no glow. */
.intro__brain {
  font-size: 1.375rem;
  color: var(--intro-ink);
}

.intro[data-phase='thinking'] .intro__brain {
  animation: intro-breathe 1500ms var(--ease-in-out);
}

@keyframes intro-breathe {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.intro__skip {
  position: absolute;
  right: var(--gutter);
  bottom: 4rem;
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.25rem;
  font-family: var(--font-sans);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--intro-muted);
  cursor: pointer;
  transition: color var(--dur) var(--ease-out);
}

.intro__skip:hover,
.intro__skip:focus-visible {
  color: var(--intro-ink);
}

.intro__skip:focus-visible {
  outline-color: var(--intro-ink);
}

@media (prefers-reduced-motion: reduce) {
  .intro,
  .intro__inner,
  .intro__caret,
  .intro__state {
    transition: none;
  }

  .intro__brain {
    animation: none;
  }
}
</style>
