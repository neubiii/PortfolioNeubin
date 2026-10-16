<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useInView } from 'motion-v'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useMotion } from '@/composables/useMotion'
import { LEVELS, LEVEL_LABEL, byLevel, ofKind } from '@/data/skills'
import type { SkillDomain, SkillItem } from '@/types'

/**
 * Skillset, set as a type field rather than a list.
 *
 * Changing the lens only changes emphasis: placement comes from the item's
 * index alone, so nothing moves. Items are inline-blocks in normal text flow
 * and the drift is `vertical-align`, which the line box accounts for, so they
 * cannot overlap at any width.
 */
const lens = ref<SkillDomain>('ux')

const lenses: { id: SkillDomain; label: string }[] = [
  { id: 'ux', label: 'UI/UX' },
  { id: 'development', label: 'Development' },
]

/**
 * Skills and Tools share the field; only one is mounted at a time. The two
 * choices are independent — changing discipline keeps the open collection.
 */
type Collection = 'practice' | 'tooling'

const collection = ref<Collection>('practice')

const collections: { id: Collection; label: string }[] = [
  { id: 'practice', label: 'Skills' },
  { id: 'tooling', label: 'Tools' },
]

/** Off: a level is read on hover or focus. On: every level is shown at once. */
const showLevels = ref(false)

/**
 * Strongest first, then the two domains dealt alternately within each band
 * (shared items every third slot) so neither lens opens on a long dim run.
 * Deterministic and lens-independent.
 */
const weave = (items: SkillItem[]): SkillItem[] => {
  const out: SkillItem[] = []

  for (const level of LEVELS) {
    const band = items.filter((item) => item.level === level)
    const lanes = [
      band.filter((i) => i.domains.length === 1 && i.domains[0] === 'development'),
      band.filter((i) => i.domains.length === 1 && i.domains[0] === 'ux'),
    ]
    const shared = band.filter((i) => i.domains.length > 1)

    let lane = 0
    let taken = 0
    while (lanes[0].length || lanes[1].length || shared.length) {
      if (shared.length && taken % 3 === 2) {
        out.push(shared.shift() as SkillItem)
      } else if (lanes[lane].length) {
        out.push(lanes[lane].shift() as SkillItem)
      } else if (lanes[1 - lane].length) {
        out.push(lanes[1 - lane].shift() as SkillItem)
      } else if (shared.length) {
        out.push(shared.shift() as SkillItem)
      }
      lane = 1 - lane
      taken += 1
    }
  }

  return out
}

/* Fixed for the life of the page — the lens never re-sorts it. */
const practice = weave(byLevel(ofKind('skill')))
const tooling = weave(byLevel(ofKind('tool')))

const total = practice.length + tooling.length

/* Indent, trailing space and drift, in em. Co-prime lengths keep the field
   from falling into a visible pattern. */
const LEAD = [0, 1.5, 0.3, 2.4, 0.7, 0, 1.1, 3, 0.5, 1.8, 0.2, 2.7, 0.9, 0.4]
const TRAIL = [1.5, 2.3, 1.1, 1.9, 2.7, 1.3, 2.1, 1.6, 2.5, 1.2, 1.8]
const DRIFT = [0, -0.26, 0.16, -0.1, 0.32, -0.18, 0.07, 0.24, -0.32]
/** Entrance vectors. Thirteen, sharing no factor with the placement patterns,
 *  so direction never lines up with indent or drift into a stripe. */
const ENTER: [number, number][] = [
  [-14, 0],
  [0, 12],
  [13, 0],
  [0, -11],
  [-10, 9],
  [12, -7],
  [0, 15],
  [-12, -6],
  [10, 10],
  [-15, 4],
  [8, -12],
  [14, 6],
  [-8, -11],
]

/* Eight words per beat: the field assembles inside a second. */
const BATCH = 8
const STEP = 70

const place = (i: number) => ({
  '--lead': `${LEAD[i % LEAD.length]}em`,
  '--trail': `${TRAIL[i % TRAIL.length]}em`,
  '--drift': `${DRIFT[i % DRIFT.length]}em`,
  '--dx': `${ENTER[i % ENTER.length][0]}px`,
  '--dy': `${ENTER[i % ENTER.length][1]}px`,
  '--delay': `${Math.floor(i / BATCH) * STEP}ms`,
})

const items = computed(() => (collection.value === 'practice' ? practice : tooling))

/** In the current lens, or practised on both sides of the work. */
const lit = (item: SkillItem) => item.domains.includes(lens.value)

const countIn = (domain: SkillDomain) =>
  [...practice, ...tooling].filter((item) => item.domains.includes(domain)).length

/** Nothing captioned survives a switch: the word it belonged to may be gone. */
const clearCue = () => {
  grazed.value = null
  held.value = null
}

const setLens = (id: SkillDomain) => {
  lens.value = id
  clearCue()
}

const setCollection = (id: Collection) => {
  collection.value = id
  clearCue()
}

/** Announced, not just shown: both levels are real changes of state. */
const status = computed(() => {
  const discipline = lenses.find((l) => l.id === lens.value)?.label
  const showing = collections.find((c) => c.id === collection.value)?.label
  return `${showing}, ${discipline} emphasised. ${countIn(lens.value)} of ${total} entries in this discipline.`
})

/* ── The annotation ──────────────────────────────────────────────────────
   Each item reserves a strip of padding beneath itself for its level, so
   revealing the caption changes no geometry. */

/**
 * Pointer and focus are tracked apart: scrolling to a focused item slides
 * content under a stationary cursor and fires `pointerleave` after the focus
 * handler, which would otherwise wipe out the keyboard's selection. The last
 * device used wins.
 */
const grazed = ref<SkillItem | null>(null)
const held = ref<SkillItem | null>(null)
const via = ref<'pointer' | 'key'>('pointer')

const cue = computed(() =>
  via.value === 'key' ? (held.value ?? grazed.value) : (grazed.value ?? held.value),
)

/** A caption near the right edge would run off the measure, so it hangs from
 *  the word's right edge instead. Measured while it is still transparent. */
const aim = (el: EventTarget | null) => {
  const item = el as HTMLElement | null
  const caption = item?.querySelector<HTMLElement>('.item__cue')
  const field = item?.parentElement
  if (!item || !caption || !field) return
  item.dataset.cueAlign =
    item.offsetLeft + caption.offsetWidth > field.clientWidth ? 'right' : 'left'
}

/** A pointer only wakes items in the current lens. */
const enter = (item: SkillItem, event: PointerEvent) => {
  via.value = 'pointer'
  /* Aimed either way: a tap or keystroke a moment later needs this width. */
  aim(event.currentTarget)
  if (!lit(item)) return
  grazed.value = item
}

/** Focus and tap are deliberate, so they caption a recessed item too. */
const hold = (item: SkillItem, event: Event) => {
  held.value = item
  aim(event.currentTarget)
}

const tap = (item: SkillItem, event: MouseEvent) => {
  via.value = 'pointer'
  hold(item, event)
}

/* A roving tabindex: the field is one composite control — tab to it, arrow
   through it — rather than one stop per word. Every item carries its level in
   text, so nothing has to be navigated to be read. */
const rove = ref<Record<Collection, number>>({ practice: 0, tooling: 0 })
const field = ref<HTMLElement | null>(null)

const step = (region: Collection, list: SkillItem[], event: KeyboardEvent) => {
  const delta: Record<string, number> = {
    ArrowRight: 1,
    ArrowDown: 1,
    ArrowLeft: -1,
    ArrowUp: -1,
  }
  let next: number
  if (event.key in delta) next = rove.value[region] + delta[event.key]
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = list.length - 1
  else return

  event.preventDefault()
  via.value = 'key'
  rove.value[region] = Math.max(0, Math.min(list.length - 1, next))
  nextTick(() => {
    field.value?.querySelectorAll<HTMLElement>('.item')[rove.value[region]]?.focus()
  })
}

/* The hidden state lives in CSS from the first paint; the attribute only
   removes it, so there is always a frame to transition from. `motionOk`, not
   `active`: the latter also asks about WebGL, which is the hero's question. */
const { motionOk } = useMotion()

const inView = useInView(field, { amount: 0.05, margin: '0px 0px -12% 0px' })

/* Latched: the arrival plays once, so switching collection only crossfades. */
const arrived = ref(false)
watch(inView, (visible) => {
  if (visible) arrived.value = true
})

/* Reduced motion drops the arrival; the caption still reveals. */
const settled = computed(() => !motionOk.value || arrived.value)
</script>

<template>
  <section id="skillset" class="shell section skillset" aria-labelledby="skillset-title">
    <div class="skillset__head">
      <h2 id="skillset-title" class="label skillset__marker">Skillset</h2>
    </div>

    <p class="skillset__lede">
      I work across the path from understanding a product problem to shipping the
      interface. These are the skills and tools I use for research, UX, component
      design, frontend development and testing.
    </p>

    <div class="ruler skillset__lenses" role="group" aria-label="Emphasise a discipline">
      <button
        v-for="option in lenses"
        :key="option.id"
        type="button"
        class="ruler__item"
        :data-active="lens === option.id"
        :aria-pressed="lens === option.id"
        @click="setLens(option.id)"
      >
        <span>{{ option.label }}</span>
        <span class="meta lens__count">{{ countIn(option.id) }}</span>
      </button>
    </div>

    <!-- Second level, quieter than the first. -->
    <div class="skillset__switch">
      <div class="swap" role="group" aria-label="Show skills or tools">
        <button
          v-for="option in collections"
          :key="option.id"
          type="button"
          class="meta swap__item"
          :data-active="collection === option.id"
          :aria-pressed="collection === option.id"
          @click="setCollection(option.id)"
        >
          {{ option.label }}
        </button>
      </div>

      <button
        type="button"
        class="meta swap__levels"
        :aria-pressed="showLevels"
        @click="showLevels = !showLevels"
      >
        <component :is="showLevels ? EyeOff : Eye" class="swap__eye" aria-hidden="true" />
        {{ showLevels ? 'Hide' : 'Show' }} proficiency
      </button>
    </div>

    <p class="sr-only" role="status">{{ status }}</p>

    <div class="skillset__body">
      <Transition name="swap">
        <ul
          :key="collection"
          ref="field"
          class="field"
          :aria-label="collection === 'practice' ? 'Skills' : 'Tools'"
          :data-in="settled"
          :data-levels="showLevels"
          @keydown="step(collection, items, $event)"
        >
          <li
            v-for="(item, i) in items"
            :key="item.id"
            class="item"
            :data-level="item.level"
            :data-lit="lit(item)"
            :data-cue="cue?.id === item.id"
            :style="place(i)"
            :tabindex="rove[collection] === i ? 0 : -1"
            @pointerenter="enter(item, $event)"
            @pointerleave="grazed = null"
            @focus="((rove[collection] = i), hold(item, $event))"
            @blur="held = null"
            @click="tap(item, $event)"
          >
            <span class="item__word">{{ item.name }}</span>
            <span class="sr-only">, {{ LEVEL_LABEL[item.level] }}</span>
            <!-- Shown because this item was asked for, or because every level
                 is on — and the switch speaks only for the discipline in focus.
                 `aria-hidden`: the level is already in text above. -->
            <span
              v-if="!showLevels || lit(item)"
              class="meta item__cue"
              aria-hidden="true"
              >{{ LEVEL_LABEL[item.level] }}</span
            >
          </li>
        </ul>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.skillset {
  /* Scales the whole scatter: full on desktop, off on a phone. */
  --scatter: 1;
  /* The strip each item reserves for its caption. */
  --cue-room: 1.35rem;
  /* The largest DRIFT value; the caption geometry cancels the drift out. */
  --drift-max: 0.32em;
  /* Entrance offsets are horizontal too. `clip`, so this never scrolls. */
  overflow-x: clip;
}

.skillset__head {
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--c-rule-strong);
}

.skillset__marker {
  color: var(--c-accent);
  margin: 0;
}

.skillset__lede {
  margin-top: clamp(1.1rem, 2vw, 1.6rem);
  max-width: 58ch;
  color: var(--c-muted);
  font-size: var(--t-lg);
  line-height: 1.5;
}

.skillset__lenses {
  margin-top: clamp(1.1rem, 2vw, 1.6rem);
}

.lens__count {
  font-size: var(--t-xs);
  color: var(--c-muted);
}

.skillset__body {
  position: relative;
  margin-top: clamp(1.1rem, 2vw, 1.6rem);
}

/* Collection on the left, level switch to the right. */
.skillset__switch {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  margin-top: clamp(0.9rem, 1.6vw, 1.25rem);
}

.swap {
  display: flex;
  gap: clamp(1rem, 2vw, 1.75rem);
}

.swap__item,
.swap__levels {
  /* Padding, not min-height: a line of type with a 44px target. */
  padding-block: 0.85rem;
  color: var(--c-muted);
  transition: color var(--dur) var(--ease-out);
}

/* The icon carries the state, the label the action. */
.swap__levels {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.swap__eye {
  width: 0.9375rem;
  height: 0.9375rem;
  flex: none;
}

.swap__levels[aria-pressed='true'] {
  color: var(--c-ink);
}

.swap__levels[aria-pressed='true'] .swap__eye {
  color: var(--c-accent);
}

.swap__item:hover,
.swap__levels:hover,
.swap__item:focus-visible,
.swap__levels:focus-visible {
  color: var(--c-ink);
}

.swap__item[data-active='true'] {
  color: var(--c-ink);
  text-decoration: underline;
  text-decoration-color: var(--c-accent);
  text-underline-offset: 0.45em;
  text-decoration-thickness: 2px;
}

.field {
  /* Text flow, not placement, so nothing can overlap. */
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1;
  text-wrap: pretty;
  /* Sans, not the display serif: technical names are dense and punctuated. */
  font-family: var(--font-sans);
  letter-spacing: -0.005em;
}

.item {
  --d: calc(var(--drift) * var(--scatter));
  position: relative;
  display: inline-block;
  margin-inline: calc(var(--lead) * var(--scatter)) calc(var(--trail) * var(--scatter));
  margin-block: 0.4rem 0;
  /* The caption strip, part of the item's own box so the next line cannot
     rise into it. The drift is added back here and taken off on the caption,
     landing every caption the same distance below the baseline. */
  padding-bottom: calc(var(--cue-room) + var(--d) + var(--drift-max) * var(--scatter));
  /* Not `translate`: `vertical-align` is layout, so the line box holds it. */
  vertical-align: var(--d);
  color: var(--c-ink);
  cursor: default;
  /* One size and weight throughout; the control above names the collection. */
  font-size: clamp(0.96875rem, 0.9225rem + 0.19vw, 1.09375rem);
  font-weight: 500;
  /* Entrance only; the hover response lives on the word inside. */
  transition:
    opacity 520ms var(--ease-out) var(--delay, 0ms),
    transform 560ms var(--ease-out) var(--delay, 0ms);
}

.item__word {
  /* Painted, not laid out, so revealing it cannot reflow the field. */
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1px;
  transition:
    opacity var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out),
    background-size var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

/* Rendered transparent rather than absent, so its width is known before it is
   shown and revealing it costs no layout. */
.item__cue {
  position: absolute;
  left: 0;
  bottom: calc(var(--drift-max) * var(--scatter));
  /* Drawn into the reserved strip, clear of neighbouring descenders. */
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.6875rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--c-accent);
/* Paper behind it: a long caption reaches into the empty strip beside it. */
  background: var(--c-paper);
  padding-right: 0.35em;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-3px);
  transition:
    opacity var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

.item[data-cue-align='right'] .item__cue {
  left: auto;
  right: 0;
  padding-right: 0;
  padding-left: 0.35em;
}

/* Asked for, or all of them at once — the same caption either way. */
.item[data-cue='true'] .item__cue,
.field[data-levels='true'] .item[data-lit='true'] .item__cue {
  opacity: 1;
  transform: none;
}

/* Hung captions collide once they are all up, so here the caption takes its
   own place in the item's box and sets the item's width. Same type, colour and
   distance under the word; the strip it hung in is given back, so the line
   height does not move. */
.field[data-levels='true'] .item {
  padding-bottom: calc(var(--d) + var(--drift-max) * var(--scatter));
}

.field[data-levels='true'] .item[data-lit='true'] .item__cue {
  position: static;
  display: block;
  margin-top: 0.42rem;
  padding: 0;
  background: none;
}

/* A recessed item keeps the caption's space: an inline-block takes its
   baseline from its last line, so without this the captioned words ride up and
   the line goes ragged. Empty, so there is nothing to announce. */
.field[data-levels='true'] .item[data-lit='false']::after {
  /* A space, not nothing: an empty block draws no line box. */
  content: '\00a0';
  display: block;
  margin-top: 0.42rem;
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.6875rem;
  letter-spacing: 0.09em;
}

/* The word's own response is small, because the caption is the information. */
.item[data-cue='true'] .item__word {
  color: var(--c-accent);
  background-size: 100% 1px;
  transform: translateY(-2px);
}

.item[data-cue='true'] {
  z-index: 1;
}

/* An item outside the lens recedes but stays readable — not a disabled
   control. Items practised on both sides never recede. */
.item[data-lit='false'] .item__word {
  opacity: 0.36;
}

/* The same recede reads fainter on a near-black ground. */
:root[data-theme='dark'] .item[data-lit='false'] .item__word {
  opacity: 0.4;
}

@media (hover: hover) {
  .item[data-lit='false']:hover .item__word {
    opacity: 0.55;
  }
}

/* Focus and tap reach a recessed item. */
.item[data-lit='false'][data-cue='true'] .item__word,
.item[data-lit='false']:focus .item__word {
  opacity: 1;
}

/* More contrast: the recede becomes a step down rather than a near-disappearance. */
@media (prefers-contrast: more) {
  .item[data-lit='false'] .item__word,
  :root[data-theme='dark'] .item[data-lit='false'] .item__word {
    opacity: 0.62;
  }
}

/* `:focus`, not `:focus-visible`: a tap has to leave the state up to read. */
.item:focus {
  outline: none;
}

.item:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 0.25rem;
}

/* ── Entrance ──────────────────────────────────────────────────────────── */

/* ── Switching collection ──────────────────────────────────────────────── */

/* Opacity only, and short: the field is being replaced, not animated. */
.swap-enter-active,
.swap-leave-active {
  transition: opacity 140ms var(--ease-out);
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}

.swap-leave-active {
  position: absolute;
  inset: 0 0 auto;
}

/* The start state, in CSS from the first paint. */
.field[data-in='false'] .item {
  opacity: 0;
  transform: translate(var(--dx), var(--dy));
}

/* ── Narrower ──────────────────────────────────────────────────────────── */

/* Laptop: the same field, with the offsets eased so the measure still holds. */
@media (max-width: 80rem) {
  .skillset {
    --scatter: 0.7;
  }
}

/* Tablet: most of the drift comes out. */
@media (max-width: 64rem) {
  .skillset {
    --scatter: 0.45;
  }
}

/* Phone: no scatter, no drift — an evenly spaced wrap. */
@media (max-width: 44rem) {
  .skillset {
    --scatter: 0;
  }

  .item {
    margin-inline-end: 0.9em;
    margin-block: 0.55rem 0;
  }
}

/* ── Reduced motion ────────────────────────────────────────────────────── */

/* The script already renders the field settled; this is the OS setting saying
   the same thing. The caption keeps working — it is information. */
@media (prefers-reduced-motion: reduce) {
  .field[data-in='false'] .item {
    opacity: 1;
    transform: none;
  }

  .item,
  .item__word,
  .item__cue,
  .swap-enter-active,
  .swap-leave-active {
    transition: none;
  }
}
</style>
