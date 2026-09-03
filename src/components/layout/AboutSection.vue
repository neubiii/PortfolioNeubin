<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { motion, useInView } from 'motion-v'
import { useMotion } from '@/composables/useMotion'
import { asset } from '@/data/assets'
import { profile } from '@/data/profile'

/**
 * About, built as a bento composition.
 *
 * The rest of the site is paper, hairlines and maroon. This one block turns the
 * volume up: a local plum-to-magenta palette, colour-blocked panels and a
 * cut-out portrait on a hard magenta spot. It is the only place on the site
 * where the person outranks the work, so it is the only place that gets to look
 * different — but the type, the grid and the paper it sits on are the site's,
 * which is what keeps it from reading as a foreign object.
 *
 * The layout is one twelve-column grid, not a stack of independent cards: the
 * identity panel runs the full height of the right-hand column, so the two
 * halves are locked together rather than merely adjacent.
 */
const media = {
  portrait: asset('about/portrait-cut'),
  mountains: asset('about/mountains'),
  snow: asset('about/snow'),
  music: asset('about/music-mask'),
}

/* One source of truth for the profile URLs; see `data/profile.ts`. */
const linkedin = profile.links.find((l) => l.label === 'LinkedIn')?.href

/* The headline is set word by word so each full stop can take the accent —
   three claims, three beats, rather than one long string. */
const claims = ['Learner', 'Problem Solver', 'Storyteller']

/**
 * The counts. `value` is what the tally lands on, `decimals` how it is written
 * on the way there, and `suffix` is held back until the count finishes so the
 * plus does not sit next to a number that is still moving.
 */
const stats = [
  {
    value: 10,
    decimals: 0,
    suffix: '+',
    label: 'UI/UX & Development projects',
    read: '10 plus UI/UX and development projects',
  },
  {
    value: 3.5,
    decimals: 1,
    suffix: '',
    label: 'Years professional experience',
    note: 'Across SAP and Accenture',
    read: '3.5 years professional experience, across SAP and Accenture',
  },
]

/* ── Entrance and counters ────────────────────────────────────────────────
   Both run on Motion for Vue rather than on a hand-rolled observer. Two
   previous attempts drove CSS transitions from custom IntersectionObserver
   state and both measured correct while looking wrong in a real browser — the
   first fired while the grid was still a strip at the bottom edge of the
   screen, the second could apply its hidden state and its revealed state in the
   same render when a block was already in view at mount, so the browser never
   painted a start frame to transition from. `whileInView` owns that lifecycle,
   which removes the class of bug entirely.

   `amount: 'some'` with the root's bottom pulled up a quarter gives the
   asymmetry this needs: a block arrives once it crosses into the upper
   three-quarters of the screen, and only leaves once it is completely above the
   viewport. So nothing animates at the very edge of vision, nothing visibly
   fades out while you are still looking at it, and coming back re-runs it. */
const { preference, reducedMotion } = useMotion()

/**
 * `useMotion().active` also asks for WebGL, because it answers for the hero's
 * flock. Nothing here needs a canvas, so this asks the narrower question: has
 * the visitor paused motion, or does the system say reduce?
 */
const motionOk = computed(
  () => preference.value === 'on' || (preference.value === 'system' && !reducedMotion.value),
)

const viewport = { amount: 'some', margin: '0px 0px -25% 0px', once: false } as const
const ease = [0.16, 1, 0.3, 1]

type From = 'left' | 'top' | 'right' | 'bottom'
const offset = { left: { x: -24 }, right: { x: 24 }, top: { y: -20 }, bottom: { y: 20 } }

/** Spread onto a block: `v-bind="from('left')"`. Empty when motion is off. */
const from = (dir: From, delay = 0) =>
  motionOk.value
    ? {
        initial: { opacity: 0, ...offset[dir] },
        whileInView: { opacity: 1, x: 0, y: 0 },
        inViewOptions: viewport,
        transition: { duration: 0.58, delay, ease },
      }
    : {}

/* ── Counting up ──────────────────────────────────────────────────────────
   Tied to the counts block's own in-view state, so the numbers are on screen
   while they move, and re-armed by the same signal: it goes false only once the
   block is fully out of the trigger zone, which is why scrolling around inside
   the section does not restart it. */
const tallies = ref(stats.map(() => 0))
const counted = ref(false)

const settleCounts = () => {
  tallies.value = stats.map((s) => s.value)
  counted.value = true
}

let raf = 0

const runCount = () => {
  cancelAnimationFrame(raf)
  if (!motionOk.value) {
    settleCounts()
    return
  }
  counted.value = false
  tallies.value = stats.map(() => 0)
  const started = performance.now()
  const span = 1000
  const frame = (now: number) => {
    const t = Math.min(1, (now - started) / span)
    const eased = 1 - Math.pow(1 - t, 3)
    tallies.value = stats.map((s) => s.value * eased)
    if (t < 1) raf = requestAnimationFrame(frame)
    else settleCounts()
  }
  raf = requestAnimationFrame(frame)
}

const counts = ref<HTMLElement | null>(null)
const countsInView = useInView(counts, viewport)

watch(countsInView, (visible) => {
  if (visible) runCount()
})

onMounted(() => {
  if (!motionOk.value) settleCounts()
})

onBeforeUnmount(() => cancelAnimationFrame(raf))

/** Fixed width while it climbs, so `10+` does not shove the label sideways. */
const written = (i: number) => tallies.value[i].toFixed(stats[i].decimals)

const loves = [
  { id: 'mountains', label: 'Mountains', note: 'Ridge lines', src: media.mountains,
    alt: 'Illustration of a snow-capped mountain range above a pine forest' },
  { id: 'snow', label: 'Snow', note: 'First fall', src: media.snow,
    alt: 'Illustration of snow falling over two small houses on a hillside' },
  { id: 'music', label: 'Music', note: 'Most hours', src: null, alt: '' },
] as const
</script>

<template>
  <section id="about" class="about" aria-labelledby="about-title">
    <div class="shell">
      <!-- The same ruler row the Work section opens with: the section's own
           name in the accent, on a rule, above everything else. -->
      <div class="about__head">
        <h2 id="about-title" class="label about__marker">About</h2>
      </div>

      <div class="bento">
        <!-- ── Statement ────────────────────────────────────────────────── -->
        <motion.p class="display about__title" v-bind="from('top')">
          <template v-for="(claim, i) in claims" :key="claim"
            ><template v-if="i">{{ ' ' }}</template
            ><span class="about__claim"
              >{{ claim }}<span class="about__stop">.</span></span
            ></template
          >
        </motion.p>

        <!-- ── Identity ─────────────────────────────────────────────────── -->
        <motion.article class="panel id" v-bind="from('left')">
          <!-- An arched window cut into the panel. The cut-out stands on its
               floor and is trimmed by its sides, so the flat bottom edge of the
               source image reads as the frame's own baseline rather than as a
               photograph that ran out. -->
          <div class="id__stage">
            <div class="id__frame">
              <img
                class="id__portrait"
                :src="media.portrait"
                alt="Neubin Sebastian"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div class="id__foot">
            <p class="mono id__hello">I’m</p>
            <p class="display id__name">Neubin<br />Sebastian</p>
            <p class="mono id__route">
              Kerala <span class="id__arrow" aria-hidden="true">→</span> Mannheim
            </p>

            <a v-if="linkedin" class="id__link" :href="linkedin" target="_blank" rel="noopener noreferrer">
              <svg class="id__glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C20.4 8.75 21 11.1 21 14.16V21h-4v-6.06c0-1.45-.03-3.3-2.02-3.3-2.03 0-2.34 1.57-2.34 3.2V21H9V9Z"
                />
              </svg>
              <span class="id__handle">LinkedIn / neubii</span>
              <span class="id__ext" aria-hidden="true">↗</span>
            </a>
          </div>
        </motion.article>

        <!-- ── The short version ────────────────────────────────────────── -->
        <motion.article class="panel story" v-bind="from('top', 0.09)">
          <p class="label story__kicker">The short version</p>

          <p class="story__copy">
            I’m from Kerala — the part of India that goes by God’s Own Country, and it earns
            the name. Mannheim is home now, winters included. I like pulling a problem apart
            and building whatever comes out of it, which is why I’ve never wanted to choose
            between designing the thing and shipping it.
          </p>

          <p class="story__open">
            <span class="mono">Open to</span>
            <span class="story__dots" aria-hidden="true" />
            <span class="mono story__roles">UI/UX Design · Front-end</span>
          </p>
        </motion.article>

        <!-- ── Two counts ───────────────────────────────────────────────── -->
        <motion.div ref="counts" class="stats" v-bind="from('right', 0.15)">
          <article
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="panel stat"
            :data-tone="i === 0 ? 'lilac' : 'burgundy'"
          >
            <p class="display stat__figure" aria-hidden="true">
              {{ written(i) }}<span class="stat__suffix" :data-on="counted">{{ stat.suffix }}</span>
            </p>
            <p class="stat__label" aria-hidden="true">{{ stat.label }}</p>
            <p v-if="stat.note" class="stat__note" aria-hidden="true">{{ stat.note }}</p>
            <!-- The figure is mid-count for a second, so what is announced is
                 the settled fact rather than whatever frame is on screen. -->
            <span class="sr-only">{{ stat.read }}</span>
          </article>
        </motion.div>

        <!-- ── Off the clock ────────────────────────────────────────────── -->
        <motion.h3 class="display-soft loves__head" v-bind="from('bottom')">
          Things I love most…
        </motion.h3>

        <motion.ul class="loves" v-bind="from('bottom', 0.1)">
          <li
            v-for="love in loves"
            :key="love.id"
            class="panel love"
            :data-love="love.id"
            :style="love.id === 'music' ? { '--love-art': `url(${media.music})` } : undefined"
          >
            <div class="love__media">
              <img
                v-if="love.src"
                class="love__img"
                :src="love.src"
                :alt="love.alt"
                loading="lazy"
                decoding="async"
              />
              <!-- The headphones arrive as black line art on transparent, so
                   they are used as a mask. Here that keeps them ink-dark on the
                   pale ground rather than tinting them into the panel. -->
              <span v-else class="love__art" aria-hidden="true" />
            </div>

            <p class="love__label">
              <span class="mono love__name">{{ love.label }}</span>
              <span class="mono love__note">{{ love.note }}</span>
            </p>
          </li>
        </motion.ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Local palette ────────────────────────────────────────────────────────
   One anchor and two accents, rather than a family of purples: a deep
   navy-violet carries the identity panel, burgundy and rose carry the accent
   cards, and a single pale lilac is the one light note — used twice, in the
   count and in the music card, so the two rhyme instead of introducing a
   second light tone. The burgundy is a shade off the site's own maroon, which
   is what keeps this block related to the rest of the page.

   Every pairing is fixed ink on a fixed ground, so the colour-blocked panels
   need no dark-theme variant; only the accents that land on the page ground
   follow the theme. */
/* The entrance offsets the counts block 24px to the right before it arrives,
   which on a narrow screen is 24px of horizontal scroll until it does. Clipped
   rather than hidden: `clip` does not create a scroll container, and nothing in
   this section is meant to bleed sideways past it anyway. */
.about {
  overflow-x: clip;

  --a-navy: #1b2247;
  --a-navy-lit: #262e5c;
  --a-navy-edge: rgb(198 206 240 / 0.2);

  --a-burgundy: #6d1235;
  --a-lilac: #ded3f2;
  --a-blush: #f1cfe0;
  --a-graphite: #171227;

  /* Accents need two values: one legible on the navy panel, one on paper —
     and the paper one has to flip, because a mid-tone rose is 3.2:1 on the
     dark theme's ground. */
  --a-accent-lift: #e88ab0;
  --a-accent-ink: #9d2660;

  /* Contrast, verified: blush on navy 10.5:1 · white on burgundy 11.5:1 ·
     navy on lilac 11.0:1 · accent on navy 6.8:1 · accent ink on paper
     6.3:1 light / 8.3:1 dark. */
  --a-on-dark: var(--a-blush);
  --a-on-dark-quiet: rgb(241 207 224 / 0.76);

  padding-block: var(--section-y);
}

[data-theme='dark'] .about {
  --a-accent-ink: #e88ab0;
}

/* ── Section head ─────────────────────────────────────────────────────────
   Deliberately the Work section's row rather than the marker-and-title block
   the later sections use: this section's own title is the statement inside the
   composition, so the opener only has to name the section. */
.about__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 0.9rem;
  margin-bottom: clamp(1.75rem, 3vw, 2.75rem);
  border-bottom: 1px solid var(--c-rule-strong);
}

.about__marker {
  color: var(--c-accent);
  margin: 0;
}

/* ── The grid ─────────────────────────────────────────────────────────────
   One grid, four rows. The identity panel spans all of them, which is what
   makes the two halves a single composition instead of a sidebar beside a
   stack. */
.bento {
  display: grid;
  gap: clamp(0.75rem, 1.1vw, 1rem);
  grid-template-columns: minmax(0, 1fr);
}

@media (min-width: 64rem) {
  .bento {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-template-rows: auto minmax(0, 1fr) auto auto;
    align-items: stretch;
  }

  .id {
    grid-column: 1 / 5;
    grid-row: 1 / 5;
  }

  .about__title {
    grid-column: 5 / 13;
    grid-row: 1;
  }

  .story {
    grid-column: 5 / 10;
    grid-row: 2;
  }

  .stats {
    grid-column: 10 / 13;
    grid-row: 2;
  }

  .loves__head {
    grid-column: 5 / 13;
    grid-row: 3;
  }

  .loves {
    grid-column: 5 / 13;
    grid-row: 4;
  }
}

/* Tablet: the identity panel goes wide across the top, the rest keeps its
   bento logic underneath rather than collapsing into one column. */
@media (min-width: 44rem) and (max-width: 63.99rem) {
  .bento {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  /* Spans the title, the story and the counts, so the panel is tall enough for
     the portrait to still be a portrait rather than an avatar. */
  .id {
    grid-column: 1 / 3;
    grid-row: 1 / 4;
  }

  .about__title,
  .story,
  .stats {
    grid-column: 3 / 6;
  }

  .stats {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
  }

  .loves__head,
  .loves {
    grid-column: 1 / 6;
  }
}

/* ── Panels ───────────────────────────────────────────────────────────── */

/* Square. The composition is sharper for it, and the one curve left in the
   section — the arched window — now reads as a deliberate shape rather than as
   the largest of several radii. */
.panel {
  position: relative;
  border-radius: 0;
  overflow: hidden;
}

/* ── Identity ─────────────────────────────────────────────────────────── */

.id {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: clamp(1.25rem, 2.2vw, 2rem);
  padding: clamp(1.35rem, 2vw, 1.9rem);
  background: var(--a-navy);
  color: var(--a-on-dark);
}

.id__stage {
  position: relative;
  display: grid;
  place-items: end center;
  min-height: 12rem;
}

/* The window. A single arch — the top corners are one elliptical sweep, the
   bottom two are the panel's own radius — recessed a shade below the panel so
   it reads as cut into it rather than laid on top. */
.id__frame {
  position: relative;
  /* The window has its own proportion now. It used to inherit the photograph's,
     which is why the figure filled it edge to edge with nowhere to breathe. */
  height: min(100%, 29rem);
  aspect-ratio: 41 / 52;
  width: auto;
  max-width: 100%;
  overflow: hidden;
  background: var(--a-navy-lit);
  border: 1px solid var(--a-navy-edge);
  border-radius: 50% 50% 0 0 / 42% 42% 0 0;
  transition: transform var(--dur-slow) var(--ease-out);
}

/* Placed inside the window rather than filling it, and standing on its floor.
   The source file is cropped tight to the visible subject, so `bottom: 0` puts
   the body on the frame's baseline rather than on the edge of a transparent
   box, and `translateX(-50%)` centres the person rather than that box. Height
   is what is set — width follows from the aspect — so the side margins are a
   consequence of the size and stay put; the 18% left over goes above the head. */
.id__portrait {
  position: absolute;
  left: 50%;
  bottom: 0;
  z-index: 1;
  display: block;
  height: 82%;
  width: auto;
  max-width: 84%;
  object-fit: contain;
  object-position: bottom center;
  transform: translateX(-50%);
}

.id:hover .id__frame {
  transform: translateY(-0.4rem);
}

.id__foot {
  display: grid;
  gap: 0.35rem;
}

.id__hello {
  color: var(--a-on-dark-quiet);
}

.id__name {
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  line-height: 0.95;
  color: #fff;
}

.id__route {
  margin-top: 0.5rem;
  color: var(--a-on-dark-quiet);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.id__arrow {
  color: var(--a-accent-lift);
  padding-inline: 0.15rem;
}

/* Not a button and not a raw URL: a ruled row, the way the rest of the site
   sets its links, in this panel's palette. */
.id__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.1rem;
  padding-top: 0.9rem;
  border-top: 1px solid rgb(241 207 224 / 0.26);
  color: var(--a-on-dark);
  font-family: var(--font-mono);
  font-size: var(--t-sm);
  transition: color var(--dur) var(--ease-out);
}

.id__glyph {
  width: 1.05rem;
  height: 1.05rem;
  flex: none;
}

.id__ext {
  margin-left: auto;
  transition: transform var(--dur) var(--ease-out);
}

.id__link:hover,
.id__link:focus-visible {
  color: #fff;
}

.id__link:hover .id__ext,
.id__link:focus-visible .id__ext {
  transform: translate(0.2rem, -0.2rem);
}

.id__link:focus-visible {
  outline: 2px solid var(--a-blush);
  outline-offset: 0.35rem;
  border-radius: 0.2rem;
}

/* ── Headline ─────────────────────────────────────────────────────────── */

.about__title {
  align-self: start;
  /* Set as running text with real spaces rather than as flex items with a gap:
     the gap version reads back as "Learner.Problem Solver.Storyteller." */
  font-size: clamp(2.1rem, 5.4vw, 4.5rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.about__claim {
  white-space: nowrap;
}

.about__stop {
  color: var(--a-accent-ink);
}

/* ── The short version ────────────────────────────────────────────────── */

.story {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: clamp(1rem, 1.8vw, 1.5rem);
  padding: clamp(1.5rem, 2.2vw, 2.1rem);
  background: var(--c-surface);
  border: 1px solid var(--c-rule);
}

.story__kicker {
  color: var(--a-accent-ink);
}

.story__copy {
  align-self: start;
  font-size: var(--t-lg);
  line-height: 1.55;
  max-width: 42ch;
  text-wrap: pretty;
}

/* Availability, set as a ruled row rather than a banner: the same device the
   card already used for the two cities, carrying the thing a reader actually
   needs to find. */
.story__open {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.story__roles {
  color: var(--c-ink);
}

/* Drawn rather than stated. */
.story__dots {
  flex: 1;
  height: 1px;
  min-width: 1.5rem;
  background-image: linear-gradient(to right, var(--c-rule-strong) 40%, transparent 0);
  background-size: 5px 1px;
  background-repeat: repeat-x;
}

/* ── Counts ───────────────────────────────────────────────────────────── */

.stats {
  display: grid;
  gap: clamp(0.75rem, 1.1vw, 1rem);
  grid-auto-rows: minmax(0, 1fr);
}

.stat {
  display: grid;
  align-content: center;
  gap: 0.2rem;
  padding: clamp(1.1rem, 1.8vw, 1.6rem);
}

.stat[data-tone='lilac'] {
  background: var(--a-lilac);
  color: var(--a-navy);
}

.stat[data-tone='burgundy'] {
  background: var(--a-burgundy);
  color: #fff;
}

.stat__figure {
  font-size: clamp(2.4rem, 4vw, 3.4rem);
  line-height: 0.9;
  /* Lining, fixed-width digits: the tally runs 0 → 10 and 0.0 → 3.5, and
     proportional figures would jitter the whole line on every frame. */
  font-variant-numeric: tabular-nums lining-nums;
}

/* Held back until the count settles, so the plus never sits beside a number
   that is still moving. */
.stat__suffix {
  opacity: 0;
  transition: opacity var(--dur) var(--ease-out);
}

.stat__suffix[data-on='true'] {
  opacity: 1;
}

.stat__label {
  margin-top: 0.15rem;
  font-size: var(--t-sm);
  line-height: 1.35;
  opacity: 0.92;
  max-width: 22ch;
}

.stat__note {
  margin-top: 0.35rem;
  font-size: var(--t-xs);
  line-height: 1.4;
  opacity: 0.72;
  max-width: 22ch;
}

/* ── Off the clock ────────────────────────────────────────────────────── */

.loves__head {
  align-self: end;
  margin-top: clamp(0.5rem, 1.5vw, 1.25rem);
  font-size: var(--t-xl);
}

.loves {
  display: grid;
  gap: clamp(0.75rem, 1.1vw, 1rem);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* Picture edge to edge, caption sitting on it — no strip underneath, so the
   card is one image rather than an image plus a bar. Only the music card shows
   its ground, and it is the light note of the section. */
.love {
  position: relative;
  transition:
    transform var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out);
}

.love[data-love='mountains'],
.love[data-love='snow'] {
  background: var(--a-navy);
}

.love[data-love='music'] {
  background: var(--a-lilac);
}

.love__media {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.love__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--dur-slow) var(--ease-out);
}

/* The picture's lower third is darkened a touch so the caption block has
   something settled to sit on. Not on the music card: its ground is pale by
   design and a vignette would muddy it. */
.love[data-love='mountains'] .love__media::after,
.love[data-love='snow'] .love__media::after {
  content: '';
  position: absolute;
  inset: 40% 0 0;
  background: linear-gradient(to top, rgb(10 8 20 / 0.36), rgb(10 8 20 / 0));
  pointer-events: none;
}

/* Mask, not image: only the alpha of the source is used, so the headphones
   stay ink-dark on the pale ground instead of being tinted into it. */
.love__art {
  position: absolute;
  inset: 5% 10% 22%;
  background: var(--a-graphite);
  -webkit-mask-image: var(--love-art);
  mask-image: var(--love-art);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
  transition: transform var(--dur-slow) var(--ease-out);
}

/* A translucent block laid on the picture, low and inset — the image carries
   on behind it. */
.love__label {
  position: absolute;
  right: 0.65rem;
  bottom: 0.65rem;
  left: 0.65rem;
  z-index: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0;
  background: rgb(17 13 30 / 0.66);
}

.love__name {
  font-size: var(--t-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #fff;
}

.love__note {
  color: rgb(255 255 255 / 0.86);
  font-size: var(--t-xs);
}

@media (hover: hover) {
  .love:hover {
    transform: translateY(-3px);
    box-shadow: 0 0.75rem 1.5rem rgb(20 26 58 / 0.22);
  }

  .love:hover .love__img,
  .love:hover .love__art {
    transform: scale(1.045);
  }
}

/* ── Small screens ────────────────────────────────────────────────────── */

@media (max-width: 43.99rem) {
  .id__stage {
    min-height: 21rem;
  }

  .stats {
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
  }

  .loves {
    grid-template-columns: minmax(0, 1fr);
  }

  /* Wider crops so three full-width cards stay a band rather than a column of
     squares — the caption treatment is the same one the desktop uses. */
  .love__media {
    aspect-ratio: 16 / 9;
  }

  .love__art {
    inset: 6% 26% 24%;
  }
}

/* ── Reduced motion ───────────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  .stat__suffix {
    opacity: 1;
    transition: none;
  }

  .id__frame,
  .love,
  .love__img,
  .love__art,
  .id__ext,
  .id__link {
    transition: none;
  }

  .love:hover {
    transform: none;
  }

  .love:hover .love__img,
  .love:hover .love__art,
  .id:hover .id__frame {
    transform: none;
  }
}
</style>
