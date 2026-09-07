<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useInView } from 'motion-v'
import { useMotion } from '@/composables/useMotion'
import { LEVELS, LEVEL_LABEL, byLevel, ofKind } from '@/data/skills'
import type { SkillDomain, SkillItem } from '@/types'

/**
 * Skillset, set as a type field rather than a list.
 *
 * One inventory, two lenses. Nothing is filtered out when the lens changes —
 * every item keeps its place and only its emphasis moves, because the argument
 * is that this is a single toolkit seen from two sides.
 *
 * The scatter is deterministic: each item's indent, trailing space and drift
 * come from three fixed patterns indexed by its position, and position depends
 * on index alone, never on the lens, so switching cannot move anything.
 *
 * Overlap is impossible rather than avoided — the items are inline-blocks in
 * normal text flow and the drift is applied with `vertical-align`, which the
 * line box accounts for, so the browser reserves the space each item needs at
 * every width, including the caption strip beneath it.
 */
const lens = ref<SkillDomain>('ux')

const lenses: { id: SkillDomain; label: string }[] = [
  { id: 'ux', label: 'UI/UX' },
  { id: 'development', label: 'Development' },
]

/**
 * Strongest first, then woven within each band.
 *
 * Sorting by level alone put all ten advanced UI/UX skills ahead of the five
 * advanced development ones, so a lens could open on a wall of ghost type.
 * Dealing the two domains alternately, with shared items every third slot,
 * means neither lens gets a long dim run. Deterministic and lens-independent.
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

/* Indent, trailing space and drift, in em of the item's own size. Co-prime
   lengths keep the field from falling into a pattern the eye can catch. */
const LEAD = [0, 1.5, 0.3, 2.4, 0.7, 0, 1.1, 3, 0.5, 1.8, 0.2, 2.7, 0.9, 0.4]
const TRAIL = [1.5, 2.3, 1.1, 1.9, 2.7, 1.3, 2.1, 1.6, 2.5, 1.2, 1.8]
const DRIFT = [0, -0.26, 0.16, -0.1, 0.32, -0.18, 0.07, 0.24, -0.32]
/* Nothing sizes the words: one size and one weight at every width. Scale would
   be a second, silent claim about proficiency — decodable off the page, and it
   would push the weakest items to where they are hardest to read. Level is
   stated by the caption and nowhere else. */

/**
 * Entrance vectors, one per slot, cycled by position. Thirteen of them, sharing
 * no factor with any of the three placement patterns, so direction never lines
 * up with indent or drift into a visible stripe. All 10–16px: enough to read as
 * arrival, not as travel.
 */
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

/** Eight words settle together, then the next eight — the whole field has
 *  assembled inside a second. */
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

/** In the current lens, or practised on both sides of the work. */
const lit = (item: SkillItem) => item.domains.includes(lens.value)

const countIn = (domain: SkillDomain) =>
  [...practice, ...tooling].filter((item) => item.domains.includes(domain)).length

const setLens = (id: SkillDomain) => {
  lens.value = id
  grazed.value = null
  held.value = null
}

/** Announced, not just shown: the lens is a real change of state. */
const status = computed(() => {
  const label = lenses.find((l) => l.id === lens.value)?.label
  return `${label} emphasised. ${countIn(lens.value)} of ${total} entries in this discipline.`
})

/* ── The annotation ──────────────────────────────────────────────────────
   The level is captioned under its own word rather than floated over the page.
   It can neither push the field around nor land on another word, and both are
   structural: every item permanently reserves a strip of padding beneath
   itself, so revealing the caption changes no geometry. */

/**
 * Pointer and focus are tracked apart so a mouse resting in the field cannot
 * wipe out what a keyboard just selected — scrolling to a focused item slides
 * content under a stationary cursor, firing `pointerleave` after the focus
 * handler. The last device used decides which wins.
 */
const grazed = ref<SkillItem | null>(null)
const held = ref<SkillItem | null>(null)
const via = ref<'pointer' | 'key'>('pointer')

const cue = computed(() =>
  via.value === 'key' ? (held.value ?? grazed.value) : (grazed.value ?? held.value),
)

/**
 * A caption near the right edge would run off the measure, so it hangs from the
 * word's right edge instead. Measured, not guessed: the caption is always in
 * the DOM, so its width is known before it is shown.
 */
const aim = (el: EventTarget | null) => {
  const item = el as HTMLElement | null
  const caption = item?.querySelector<HTMLElement>('.item__cue')
  const field = item?.parentElement
  if (!item || !caption || !field) return
  item.dataset.cueAlign =
    item.offsetLeft + caption.offsetWidth > field.clientWidth ? 'right' : 'left'
}

/** A pointer only wakes items in the current lens; brushing past a recessed one
 *  on the way somewhere else should not caption it. */
const enter = (item: SkillItem, event: PointerEvent) => {
  via.value = 'pointer'
  /* Aimed either way: a recessed item is not captioned by a pointer, but a tap
     or keystroke a moment later must find the width measured here. */
  aim(event.currentTarget)
  if (!lit(item)) return
  grazed.value = item
}

/** Focus and tap are deliberate, so they caption anything — a recessed item
 *  still has to be readable to someone who asked for it by name. */
const hold = (item: SkillItem, event: Event) => {
  held.value = item
  aim(event.currentTarget)
}

const tap = (item: SkillItem, event: MouseEvent) => {
  via.value = 'pointer'
  hold(item, event)
}

/* A roving tabindex, one stop per field. Sixty-four tab stops in one section
   would be worse than no keyboard support, so the field behaves as one
   composite control: tab to it, arrow through it. Every item also carries its
   level in text, so nothing has to be navigated to be read. */
const rove = ref<Record<string, number>>({ practice: 0, tooling: 0 })
const fields = ref<Record<string, HTMLElement | null>>({ practice: null, tooling: null })

const step = (region: string, list: SkillItem[], event: KeyboardEvent) => {
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
    fields.value[region]?.querySelectorAll<HTMLElement>('.item')[rove.value[region]]?.focus()
  })
}

/* Each field assembles on its own arrival rather than both waiting on the
   section. The hidden state lives in CSS from the first paint — the class only
   removes it — so there is always a frame to transition from.

   `active` from useMotion is not the gate here: it also asks about WebGL, which
   is the hero's question. */
const { motionOk } = useMotion()

const practiceInView = useInView(
  computed(() => fields.value.practice),
  { amount: 0.05, margin: '0px 0px -12% 0px' },
)
const toolingInView = useInView(
  computed(() => fields.value.tooling),
  { amount: 0.05, margin: '0px 0px -12% 0px' },
)

/* Under reduced motion the caption still reveals — it is information, not
   decoration. Only the arrival is dropped. */
const settled = (inView: boolean) => (motionOk.value ? inView : true)
</script>

<template>
  <section id="skillset" class="shell section skillset" aria-labelledby="skillset-title">
    <div class="skillset__head">
      <h2 id="skillset-title" class="label skillset__marker">Skillset</h2>
    </div>

    <p class="skillset__lede">
      Two sides of the same toolkit. Pick a discipline to see what I use most.
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

    <p class="sr-only" role="status">{{ status }}</p>

    <div class="skillset__body">
      <section class="region region--practice" aria-labelledby="skillset-practice">
        <h3 id="skillset-practice" class="label region__marker">Skills</h3>
        <ul
          :ref="(el) => (fields.practice = el as HTMLElement)"
          class="field field--practice"
          :data-in="settled(practiceInView)"
          @keydown="step('practice', practice, $event)"
        >
          <li
            v-for="(item, i) in practice"
            :key="item.id"
            class="item"
            :data-level="item.level"
            :data-lit="lit(item)"
            :data-cue="cue?.id === item.id"
            :style="place(i)"
            :tabindex="rove.practice === i ? 0 : -1"
            @pointerenter="enter(item, $event)"
            @pointerleave="grazed = null"
            @focus="((rove.practice = i), hold(item, $event))"
            @blur="held = null"
            @click="tap(item, $event)"
          >
            <span class="item__word">{{ item.name }}</span>
            <span class="sr-only">, {{ LEVEL_LABEL[item.level] }}</span>
            <span class="meta item__cue" aria-hidden="true">{{ LEVEL_LABEL[item.level] }}</span>
          </li>
        </ul>
      </section>

      <!-- Set beside its marker rather than under it, and a notch smaller, so
           the two regions never read as one long run of type. -->
      <section class="region region--tooling" aria-labelledby="skillset-tooling">
        <h3 id="skillset-tooling" class="label region__marker">Tools</h3>
        <ul
          :ref="(el) => (fields.tooling = el as HTMLElement)"
          class="field field--tooling"
          :data-in="settled(toolingInView)"
          @keydown="step('tooling', tooling, $event)"
        >
          <li
            v-for="(item, i) in tooling"
            :key="item.id"
            class="item"
            :data-level="item.level"
            :data-lit="lit(item)"
            :data-cue="cue?.id === item.id"
            :style="place(i)"
            :tabindex="rove.tooling === i ? 0 : -1"
            @pointerenter="enter(item, $event)"
            @pointerleave="grazed = null"
            @focus="((rove.tooling = i), hold(item, $event))"
            @blur="held = null"
            @click="tap(item, $event)"
          >
            <span class="item__word">{{ item.name }}</span>
            <span class="sr-only">, {{ LEVEL_LABEL[item.level] }}</span>
            <span class="meta item__cue" aria-hidden="true">{{ LEVEL_LABEL[item.level] }}</span>
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>

<style scoped>
.skillset {
  /* Scales the whole scatter in one place: full strength on a desktop, eased
     off as the measure narrows, off on a phone. */
  --scatter: 1;
  /* The strip every item reserves beneath itself for its caption. In rem, so it
     does not shrink with the smallest words. */
  --cue-room: 1.6rem;
  /* The largest value in DRIFT, as a plain number: the caption geometry has to
     know it to cancel the drift out. */
  --drift-max: 0.32em;
  /* Entrance offsets are horizontal as well as vertical; clip rather than
     hidden, so nothing here becomes a scroll container. */
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
  max-width: 52ch;
  color: var(--c-muted);
  font-size: var(--t-lg);
  line-height: 1.5;
}

.skillset__lenses {
  margin-top: clamp(1.5rem, 3vw, 2.25rem);
}

.lens__count {
  font-size: var(--t-xs);
  color: var(--c-muted);
}

.skillset__body {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4.5rem);
  margin-top: clamp(2rem, 3.5vw, 3rem);
}

.region__marker {
  color: var(--c-muted);
}

.region--practice .region__marker {
  margin-bottom: clamp(1.25rem, 2.5vw, 2rem);
}

/* Beside the field, in the same 9rem marker column the section heads use. */
@media (min-width: 48rem) {
  .region--tooling {
    display: grid;
    grid-template-columns: 9rem minmax(0, 1fr);
    column-gap: 2rem;
    align-items: start;
  }

  .region--tooling .region__marker {
    padding-top: 0.35rem;
  }
}

.region--tooling .region__marker {
  margin-bottom: 1rem;
}

.field {
  /* Text flow, not placement: every item is an inline-block, which is why
     nothing can land on top of anything else. */
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  line-height: 1;
  text-wrap: pretty;
  /* One face. Technical names are dense and often punctuated — `Node.js /
     Express` — and the display serif made them work to read at these sizes.
     Hierarchy moves to weight and a narrow size range instead. */
  font-family: var(--font-sans);
  letter-spacing: -0.005em;
}

.item {
  --d: calc(var(--drift) * var(--scatter));
  position: relative;
  display: inline-block;
  margin-inline: calc(var(--lead) * var(--scatter)) calc(var(--trail) * var(--scatter));
  margin-block: 0.4rem 0;
  /* The reserved caption strip, part of the item's own box, so the line box
     grows to hold it and the next line can never rise into a caption.

     The item's own drift is added back here and taken off again on the caption,
     landing every caption the same distance below the baseline however far its
     word has drifted. */
  padding-bottom: calc(var(--cue-room) + var(--d) + var(--drift-max) * var(--scatter));
  /* Not `translate`: `vertical-align` is part of layout, so the line box grows
     to hold the drift instead of the item wandering into the line above. */
  vertical-align: var(--d);
  color: var(--c-ink);
  cursor: default;
  /* One size and one weight for every entry, skills and tools alike. The two
     regions are already told apart by their markers and their place. */
  font-size: clamp(0.96875rem, 0.9225rem + 0.19vw, 1.09375rem);
  font-weight: 500;
  /* Entrance only. The hover response lives on the word inside, so the two
     never contend for the same transform. */
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

/* Always in the DOM — that is how its width is known before it is shown, and
   how the reveal costs no layout. `aria-hidden`, because the item already
   states its level in text. */
.item__cue {
  position: absolute;
  left: 0;
  bottom: calc(var(--drift-max) * var(--scatter));
  /* Drawn into the reserved strip, clear of the descenders of anything that has
     drifted down beside it. */
  height: 0.9rem;
  line-height: 0.9rem;
  font-size: 0.6875rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  white-space: nowrap;
  color: var(--c-accent);
/* Paper behind it: a long caption reaches past its own word into the reserved
   strip beside it, which is empty — the ground makes that visible rather than
   assumed. */
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

.item[data-cue='true'] .item__cue {
  opacity: 1;
  transform: none;
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

/* Nothing is removed, nothing moves. An item outside the lens drops back far
   enough to read as ground rather than figure, but stays a readable word — not
   a disabled control. Items practised on both sides never drop back. */
.item[data-lit='false'] .item__word {
  opacity: 0.36;
}

/* Dark: the same nominal recede reads fainter against a near-black ground, so
   it is carried a little higher. */
:root[data-theme='dark'] .item[data-lit='false'] .item__word {
  opacity: 0.4;
}

@media (hover: hover) {
  .item[data-lit='false']:hover .item__word {
    opacity: 0.55;
  }
}

/* Deliberate: focus and tap reach a recessed item, because someone asked for
   it by name. */
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

/* `:focus`, not `:focus-visible` — a tap has to leave the state up long enough
   to read, and on a phone that is the whole interaction. */
.item:focus {
  outline: none;
}

.item:focus-visible {
  outline: 2px solid var(--c-focus);
  outline-offset: 0.25rem;
}

/* ── Entrance ──────────────────────────────────────────────────────────── */

/* The start state, in CSS from the first paint. Eight words share a delay, so
   the field assembles in six beats rather than sixty-four. */
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

/* Tablet: more structure — the tools drop under their marker and the drift
   comes most of the way out. */
@media (max-width: 64rem) {
  .skillset {
    --scatter: 0.45;
  }
}

/* Phone: readability wins. No scatter at all, no drift, and the field becomes
   an evenly spaced wrap that still keeps size as hierarchy. */
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

/* The site preference is honoured in script — the field is rendered settled
   rather than animated in. This is the OS setting saying the same thing, and it
   leaves the caption working: it is information, not decoration. */
@media (prefers-reduced-motion: reduce) {
  .field[data-in='false'] .item {
    opacity: 1;
    transform: none;
  }

  .item,
  .item__word,
  .item__cue,
  .lens {
    transition: none;
  }
}
</style>
