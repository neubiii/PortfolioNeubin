<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useMotion } from '@/composables/useMotion'

/**
 * The hero statement: a pointer lens onto the construction under the type —
 * design guides over `UI/UX design`, layout boxes over `front-end development`.
 *
 * One semantic `<h1>` carries the sentence; every other layer is `aria-hidden`.
 * The base text and its outlined twin are set from the same words at the same
 * size in the same box, so they register by construction. The sentence never
 * moves or reflows, and reads identically with the interaction off.
 */

/* The two `anchor` groups are the phrases the interaction is pinned to, and
   the only ones that may not break across a line. */
const SEGMENTS: { words: string[]; anchor?: 'design' | 'code' }[] = [
  { words: ['Neubin', 'Sebastian', 'is', 'an', 'experienced', 'professional', 'in'] },
  { words: ['UI/UX', 'design'], anchor: 'design' },
  { words: ['and'] },
  { words: ['front-end', 'development.'], anchor: 'code' },
]

/** Small enough to read as marginalia rather than as content. */
const FRAGMENTS = ['<section>', 'display: grid', 'gap: 12px', '{ }']

/** Flattened once, so every word knows the slot it reports geometry into. */
type Token =
  | { kind: 'word'; text: string; slot: number }
  | { kind: 'hold'; anchor: string; words: { text: string; slot: number }[] }

const TOKENS: Token[] = (() => {
  const out: Token[] = []
  let slot = 0
  for (const seg of SEGMENTS) {
    if (seg.anchor) {
      out.push({
        kind: 'hold',
        anchor: seg.anchor,
        words: seg.words.map((text) => ({ text, slot: slot++ })),
      })
    } else {
      for (const text of seg.words) out.push({ kind: 'word', text, slot: slot++ })
    }
  }
  return out
})()

const { motionOk } = useMotion()

/** A lens needs a pointer that hovers. Coarse input gets the static hero. */
const fine = ref(false)
const enabled = computed(() => fine.value && motionOk.value)

const root = ref<HTMLElement | null>(null)
const slots: HTMLElement[] = []
const open = ref(false)

const setWord = (el: Element | ComponentPublicInstanceLike | null, slot: number) => {
  if (el instanceof HTMLElement) slots[slot] = el
}
type ComponentPublicInstanceLike = { $el?: unknown }

type Box = { x: number; y: number; w: number; h: number; line: number; anchor?: string }

const boxes = shallowRef<Box[]>([])
const size = ref({ w: 0, h: 0 })

const measure = () => {
  const host = root.value
  if (!host || !slots.length) return
  const base = host.getBoundingClientRect()
  if (base.width < 2) return
  size.value = { w: Math.round(base.width), h: Math.round(base.height) }

  const raw = slots.filter(Boolean).map((el) => {
    const r = el.getBoundingClientRect()
    return {
      x: r.left - base.left,
      y: r.top - base.top,
      w: r.width,
      h: r.height,
      anchor: el.dataset.anchor,
    }
  })

  // Words sharing a top edge are one line: the real wrap, not an assumed one.
  const tops: number[] = []
  boxes.value = raw.map((b) => {
    let line = tops.findIndex((t) => Math.abs(t - b.y) < 6)
    if (line === -1) {
      tops.push(b.y)
      line = tops.length - 1
    }
    return { ...b, line }
  })
}

const lines = computed(() => {
  const rows = new Map<number, { line: number; x: number; y: number; w: number; h: number; items: Box[] }>()
  for (const b of boxes.value) {
    const row = rows.get(b.line) ?? { line: b.line, x: b.x, y: b.y, w: 0, h: b.h, items: [] }
    row.x = Math.min(row.x, b.x)
    row.y = Math.min(row.y, b.y)
    row.h = Math.max(row.h, b.h)
    row.items.push(b)
    rows.set(b.line, row)
  }
  return [...rows.values()]
    .map((row) => ({ ...row, w: Math.max(...row.items.map((b) => b.x + b.w)) - row.x }))
    .sort((a, b) => a.line - b.line)
})

/* Distance along the sentence as it is read. The anchors rarely share a line,
   so a purely horizontal ramp between them would run backwards. */
const flowAt = (x: number, y: number) => {
  const rows = lines.value
  if (!rows.length) return 0
  let best = rows[0]
  let closest = Infinity
  for (const row of rows) {
    const d = Math.abs(y - (row.y + row.h / 2))
    if (d < closest) {
      closest = d
      best = row
    }
  }
  // Of the line's own inked width, not the column: the rag would otherwise map
  // empty margin onto the ramp.
  const across = Math.min(1, Math.max(0, (x - best.x) / Math.max(best.w, 1)))
  return best.line + across
}

/** Where the two anchored phrases sit along that path. */
const anchors = computed(() => {
  const at = (name: string) => {
    const own = boxes.value.filter((b) => b.anchor === name)
    if (!own.length) return null
    const left = Math.min(...own.map((b) => b.x))
    const right = Math.max(...own.map((b) => b.x + b.w))
    const row = lines.value.find((r) => r.line === own[0].line)
    if (!row) return null
    return { flow: own[0].line + ((left + right) / 2 - row.x) / Math.max(row.w, 1) }
  }
  return { design: at('design'), code: at('code') }
})

/** One measurement per line; more than one reads as clutter. */
const gaps = computed(() =>
  lines.value
    .map((row) => {
      const [a, b] = row.items
      if (!a || !b) return null
      const x = a.x + a.w
      const width = b.x - x
      if (width < 7) return null
      return { x, width, y: row.y + row.h * 0.8, label: String(Math.round(width)) }
    })
    .filter((g): g is NonNullable<typeof g> => g !== null),
)

/** Implementation fragments, one per line. */
const fragments = computed(() =>
  lines.value.map((row) => ({
    line: row.line,
    x: row.x + 1,
    // In the gap above the capitals, from the line's own box, so it holds at
    // every size.
    y: row.y + row.h * 0.17,
    text: FRAGMENTS[row.line % FRAGMENTS.length],
  })),
)

/** The lens trails the pointer: an instrument, not a decal on the cursor. */
const target = { x: 0, y: 0, on: 0 }
const eased = { x: 0, y: 0, on: 0 }
let frame = 0
let settled = true
let last = 0

/* Half-life smoothing, so it converges in the same wall-clock time at any
   refresh rate. */
const smooth = (from: number, to: number, halfLife: number, dt: number) =>
  to + (from - to) * Math.pow(2, -dt / halfLife)

/* Where the lens stands between the two disciplines: 0 at `UI/UX design`, 1 at
   `front-end development`. Both mark layers read this one number. */
const mix = () => {
  const { design, code } = anchors.value
  if (!design || !code) return 0
  const span = code.flow - design.flow
  // Line-fractions, not pixels.
  if (Math.abs(span) < 0.02) return 0
  return Math.min(1, Math.max(0, (flowAt(eased.x, eased.y) - design.flow) / span))
}

const paint = () => {
  const host = root.value
  if (!host) return
  host.style.setProperty('--lens-x', `${eased.x.toFixed(1)}px`)
  host.style.setProperty('--lens-y', `${eased.y.toFixed(1)}px`)
  host.style.setProperty('--lens-on', eased.on.toFixed(3))
  host.style.setProperty('--lens-mix', mix().toFixed(3))
  // Masked only while open, so at rest the headline is plain text.
  const lit = eased.on > 0.002
  if (lit !== open.value) open.value = lit
}

const tick = (now: number) => {
  const dt = Math.min(64, last ? now - last : 16)
  last = now

  eased.x = smooth(eased.x, target.x, 62, dt)
  eased.y = smooth(eased.y, target.y, 62, dt)
  // Closing is quicker than following — leaving should feel like lifting the
  // instrument away.
  eased.on = smooth(eased.on, target.on, target.on === 0 ? 40 : 55, dt)

  // Land it: an exponential never quite arrives.
  if (
    Math.abs(target.x - eased.x) < 0.4 &&
    Math.abs(target.y - eased.y) < 0.4 &&
    Math.abs(target.on - eased.on) < 0.02
  ) {
    eased.x = target.x
    eased.y = target.y
    eased.on = target.on
    settled = true
    last = 0
  }

  paint()
  if (!settled) frame = requestAnimationFrame(tick)
}

const run = () => {
  if (!settled) return
  settled = false
  last = 0
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(tick)
}

const onPointerMove = (event: PointerEvent) => {
  if (!enabled.value || event.pointerType !== 'mouse') return
  const host = root.value
  if (!host) return
  const r = host.getBoundingClientRect()
  target.x = event.clientX - r.left
  target.y = event.clientY - r.top
  // Open where the pointer entered, not where it left last time.
  if (target.on === 0) {
    eased.x = target.x
    eased.y = target.y
  }
  target.on = 1
  run()
}

const close = () => {
  target.on = 0
  run()
}

let observer: ResizeObserver | null = null

onMounted(() => {
  if (typeof window === 'undefined') return
  const query = window.matchMedia('(hover: hover) and (pointer: fine)')
  fine.value = query.matches
  query.addEventListener('change', (event) => (fine.value = event.matches))

  // Geometry comes from what the browser actually laid out, so the marks
  // survive a font swap, a resize and every step of the fluid type scale.
  observer = new ResizeObserver(() => measure())
  if (root.value) observer.observe(root.value)
  measure()
  void document.fonts?.ready.then(measure)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  observer = null
})

/** Pausing motion mid-hover should close the lens, not freeze it open. */
watch(enabled, (on) => {
  if (on) return
  target.on = 0
  eased.on = 0
  settled = true
  cancelAnimationFrame(frame)
  paint()
})
</script>

<template>
  <div
    ref="root"
    class="statement"
    :data-lens="enabled"
    :data-open="open"
    :data-motion="motionOk"
    @pointermove="onPointerMove"
    @pointerleave="close"
  >
    <!-- The only copy anything reads. The word spans carry no styling; they
         exist so the marks can find the type. -->
    <h1 id="hero-title" class="display statement__text">
      <template v-for="(token, t) in TOKENS" :key="t">
        <span v-if="token.kind === 'hold'" class="statement__hold"
          ><template v-for="(word, i) in token.words" :key="word.slot"
            ><span
              :ref="(el) => setWord(el, word.slot)"
              class="statement__word"
              :data-anchor="token.anchor"
              >{{ word.text }}</span
            >{{ i < token.words.length - 1 ? ' ' : '' }}</template
          ></span
        >
        <span v-else :ref="(el) => setWord(el, token.slot)" class="statement__word">{{
          token.text
        }}</span>
        {{ t < TOKENS.length - 1 ? ' ' : '' }}
      </template>
    </h1>

    <!-- Inert twins of the sentence, painted only inside the lens. -->
    <div v-if="enabled" class="statement__scan" aria-hidden="true">
      <!-- The same sentence as outline, registered by construction. -->
      <p class="display statement__text statement__ghost">
        <template v-for="(seg, s) in SEGMENTS" :key="s">
          <span v-if="seg.anchor" class="statement__hold">{{ seg.words.join(' ') }}</span>
          <template v-else>{{ seg.words.join(' ') }}</template>
          {{ s < SEGMENTS.length - 1 ? ' ' : '' }}
        </template>
      </p>

      <svg
        class="statement__marks"
        :viewBox="`0 0 ${size.w} ${size.h}`"
        :width="size.w"
        :height="size.h"
        fill="none"
      >
        <!-- Design construction: baseline, word starts, space widths. -->
        <g class="marks marks--design">
          <template v-for="row in lines" :key="`d${row.line}`">
            <line
              :x1="row.x"
              :y1="row.y + row.h * 0.8"
              :x2="row.x + row.w"
              :y2="row.y + row.h * 0.8"
            />
            <line
              class="marks__faint"
              :x1="row.x"
              :y1="row.y + row.h * 0.36"
              :x2="row.x + row.w"
              :y2="row.y + row.h * 0.36"
            />
            <line
              v-for="b in row.items"
              :key="`t${b.line}-${Math.round(b.x)}`"
              class="marks__tick"
              :x1="b.x"
              :y1="row.y + row.h * 0.8 - 8"
              :x2="b.x"
              :y2="row.y + row.h * 0.8 + 8"
            />
            <rect class="marks__node" :x="row.x - 2.5" :y="row.y + row.h * 0.8 - 2.5" width="5" height="5" />
            <rect
              class="marks__node"
              :x="row.x + row.w - 2.5"
              :y="row.y + row.h * 0.8 - 2.5"
              width="5"
              height="5"
            />
          </template>

          <template v-for="(g, i) in gaps" :key="`g${i}`">
            <line :x1="g.x" :y1="g.y" :x2="g.x + g.width" :y2="g.y" />
            <line class="marks__tick" :x1="g.x" :y1="g.y - 4" :x2="g.x" :y2="g.y + 4" />
            <line
              class="marks__tick"
              :x1="g.x + g.width"
              :y1="g.y - 4"
              :x2="g.x + g.width"
              :y2="g.y + 4"
            />
            <text class="marks__num" :x="g.x + g.width / 2" :y="g.y - 8">{{ g.label }}</text>
          </template>
        </g>

        <!-- Implementation: the same words as boxes. -->
        <g class="marks marks--code">
          <rect
            v-for="(b, i) in boxes"
            :key="`b${i}`"
            :x="b.x - 2"
            :y="b.y + 1"
            :width="b.w + 4"
            :height="b.h - 2"
            rx="1"
          />
          <text v-for="f in fragments" :key="`f${f.line}`" class="marks__code" :x="f.x" :y="f.y">{{
            f.text
          }}</text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.statement {
  position: relative;
  /* Script writes these; the values here are the rest state. */
  --lens-x: 50%;
  --lens-y: 50%;
  --lens-on: 0;
  --lens-mix: 0;
  --lens-r: clamp(150px, 12.5vw, 195px);
}

.statement__text {
  font-size: clamp(2.25rem, 1.05rem + 4.2vw, 5.25rem);
  /* Optical size wound up: the hairlines and contrast the display voice wants. */
  font-variation-settings:
    'opsz' 144,
    'SOFT' 0,
    'WONK' 1;
  line-height: 1.03;
  letter-spacing: -0.028em;
  margin: 0;
  text-wrap: pretty;
}

/* The two anchored phrases never break. */
.statement__hold {
  white-space: nowrap;
}

/* Measured, not styled: no box, no spacing, nothing that could move the line. */
.statement__word {
  display: inline;
}

/* Complementary masks: the solid letter is cut away exactly where its outline
   is revealed, so the letterform reads as continuous across the edge. */
.statement[data-open='true'] .statement__text:not(.statement__ghost) {
  -webkit-mask-image: radial-gradient(
    circle var(--lens-r) at var(--lens-x) var(--lens-y),
    rgb(0 0 0 / calc(1 - var(--lens-on) * 0.8)) 0%,
    rgb(0 0 0 / calc(1 - var(--lens-on) * 0.72)) 44%,
    #000 82%
  );
  mask-image: radial-gradient(
    circle var(--lens-r) at var(--lens-x) var(--lens-y),
    rgb(0 0 0 / calc(1 - var(--lens-on) * 0.8)) 0%,
    rgb(0 0 0 / calc(1 - var(--lens-on) * 0.72)) 44%,
    #000 82%
  );
}

.statement__scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: var(--lens-on);
  -webkit-mask-image: radial-gradient(
    circle var(--lens-r) at var(--lens-x) var(--lens-y),
    #000 0%,
    #000 46%,
    transparent 86%
  );
  mask-image: radial-gradient(
    circle var(--lens-r) at var(--lens-x) var(--lens-y),
    #000 0%,
    #000 46%,
    transparent 86%
  );
}

.statement__ghost {
  position: absolute;
  inset: 0;
  margin: 0;
  color: transparent;
  -webkit-text-stroke: 1.4px var(--c-hero-accent);
}

.statement__marks {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.marks line,
.marks rect {
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  stroke: var(--c-hero-accent);
}

/* Crossfade: guides at one anchor, boxes at the other, both in between. */
.marks--design {
  opacity: clamp(0, calc(1.12 - var(--lens-mix) * 1.5), 1);
}

.marks--code {
  opacity: clamp(0, calc((var(--lens-mix) - 0.2) * 1.6), 1);
}

.marks__faint {
  stroke-dasharray: 3 5;
  opacity: 0.45;
}

.marks__tick {
  opacity: 0.65;
}

.marks__node {
  fill: var(--c-hero-bg);
}

.marks--code rect {
  opacity: 0.6;
}

.marks text {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  fill: var(--c-hero-accent);
  stroke: none;
}

.marks__num {
  text-anchor: middle;
}

/* Restrained on purpose: the lens is the moment, not the entrance. */
.statement[data-motion='true'] .statement__text:not(.statement__ghost) {
  animation: statement-resolve 720ms var(--ease-out) both;
}

@keyframes statement-resolve {
  from {
    opacity: 0;
    transform: translateY(7px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .statement[data-motion='true'] .statement__text:not(.statement__ghost) {
    animation: none;
  }
}
</style>
