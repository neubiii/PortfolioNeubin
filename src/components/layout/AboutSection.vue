<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { motion, useInView } from 'motion-v'
import { ArrowUpRight, Linkedin } from 'lucide-vue-next'
import { useMotion } from '@/composables/useMotion'
import { asset } from '@/data/assets'
import { profile } from '@/data/profile'


const media = {
  portrait: asset('about/portrait-cut'),
  mountains: asset('about/mountains'),
  snow: asset('about/snow'),
  music: asset('about/music-mask'),
}

const linkedin = profile.links.find((l) => l.label === 'LinkedIn')?.href

/* Set word by word so each full stop can take the accent. */
const claims = ['Learner', 'Problem Solver', 'Storyteller']

/**
 * The counts. `value` is what the tally lands on, `decimals` how it is written
 * on the way there, and `suffix` is held back until the count finishes.
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


const { motionOk } = useMotion()



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

/* Tied to the counts block's own in-view state, so the numbers are on screen
   while they move. It goes false only once the block is fully out of the
   trigger zone, which is why scrolling inside the section does not restart it. */
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
      <div class="about__head">
        <h2 id="about-title" class="label about__marker">About</h2>
      </div>

      <div class="bento">
        <motion.p class="display about__title" v-bind="from('top')">
          <template v-for="(claim, i) in claims" :key="claim"
            ><template v-if="i">{{ ' ' }}</template
            ><span class="about__claim"
              >{{ claim }}<span class="about__stop">.</span></span
            ></template
          >
        </motion.p>

        <motion.article class="panel id" v-bind="from('left')">
          <!-- An arched window cut into the panel. The cut-out stands on its
               floor, so the flat bottom edge of the source reads as the frame's
               own baseline. -->
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
            <p class="meta id__hello">I’m</p>
            <p class="display id__name">Neubin<br />Sebastian</p>
            <p class="meta id__route">
              Kerala <span class="id__arrow" aria-hidden="true">→</span> Mannheim
            </p>

            <a v-if="linkedin" class="id__link" :href="linkedin" target="_blank" rel="noopener noreferrer">
              <Linkedin class="id__glyph" />
              <span class="id__handle">LinkedIn / neubii</span>
              <ArrowUpRight class="id__ext" />
            </a>
          </div>
        </motion.article>

        <motion.article class="panel story" v-bind="from('top', 0.09)">
          <p class="label story__kicker">The short version</p>

          <p class="story__copy">
            Born in Kerala. Currently in Mannheim. Still not sure how someone raised in 30°C weather became obsessed with snow. I like music a little too loud, trips that start with “we’ll figure it out,” meeting people from completely different worlds, and collecting stories that are better told in person than written on a portfolio.

          </p>

          <p class="story__open">
            <span class="meta">Open to</span>
            <span class="story__dots" aria-hidden="true" />
            <span class="meta story__roles">UI/UX Design · Front-end</span>
          </p>
        </motion.article>

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

        <!-- <motion.h3 class="display-soft loves__head" v-bind="from('bottom')">
          Things I love most…
        </motion.h3> -->

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
              <!-- Black line art on transparent, used as a mask so it stays
                   ink-dark on the pale ground rather than tinted into it. -->
              <span v-else class="love__art" aria-hidden="true" />
            </div>

            <p class="love__label">
              <span class="meta love__name">{{ love.label }}</span>
              <span class="meta love__note">{{ love.note }}</span>
            </p>
          </li>
        </motion.ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Local palette ───────────────────────────────────────────────────────
   One anchor and two accents rather than a family of purples. Every pairing is
   fixed ink on a fixed ground, so the colour-blocked panels need no dark-theme
   variant; only the accents that land on the page ground follow the theme. */
/* The counts block enters 24px to the right, which on a narrow screen is 24px
   of horizontal scroll until it arrives. `clip`, not `hidden`: it creates no
   scroll container. */
.about {
  overflow-x: clip;

  --a-navy: #1b2247;
  --a-navy-lit: #262e5c;
  --a-navy-edge: rgb(198 206 240 / 0.2);

  --a-burgundy: #6d1235;
  --a-lilac: #ded3f2;
  --a-blush: #f1cfe0;
  --a-graphite: #171227;

  /* Accents need two values: one legible on the navy panel, one on paper — and
     the paper one has to flip, since a mid-tone rose is 3.2:1 on dark. */
  --a-accent-lift: #e88ab0;
  --a-accent-ink: #9d2660;

  /* Contrast, verified: blush on navy 10.5:1 · white on burgundy 11.5:1 ·
     navy on lilac 11.0:1 · accent on navy 6.8:1 · accent ink on paper
     6.3:1 light / 8.3:1 dark. */
  --a-on-dark: var(--a-blush);
  --a-on-dark-quiet: rgb(241 207 224 / 0.76);

  padding-top: var(--section-y);
  padding-bottom: 0;
}

[data-theme='dark'] .about {
  --a-accent-ink: #e88ab0;
}

/* The Work section's ruler row rather than the marker-and-title block the later
   sections use: this section's title is the statement inside the composition,
   so the opener only names the section. */
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

/* One grid, four rows. The identity panel spans all of them, which makes the
   two halves a single composition rather than a sidebar beside a stack. */
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

/* Tablet: the identity panel goes wide across the top, the rest keeps its bento
   logic underneath rather than collapsing into one column. */
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

/* Square, so the one curve left in the section — the arched window — reads as
   a deliberate shape rather than the largest of several radii. */
.panel {
  position: relative;
  border-radius: 0;
  overflow: hidden;
}

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

/* A single arch — the top corners are one elliptical sweep, the bottom two the
   panel's own radius — recessed a shade so it reads as cut into the panel. */
.id__frame {
  position: relative;
  /* The window has its own proportion rather than the photograph's. */
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
   The source is cropped tight to the subject, so `bottom: 0` puts the body on
   the frame's baseline and `translateX(-50%)` centres the person rather than a
   transparent box. Height is set and width follows, so the side margins stay
   put. */
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

/* A ruled row, the way the rest of the site sets its links, in this panel's
   palette. */
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

/* A ruled row rather than a banner: the same device the card already uses for
   the two cities. */
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

.story__dots {
  flex: 1;
  height: 1px;
  min-width: 1.5rem;
  background-image: linear-gradient(to right, var(--c-rule-strong) 40%, transparent 0);
  background-size: 5px 1px;
  background-repeat: repeat-x;
}

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
     proportional figures would jitter the line on every frame. */
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
   card is one image rather than an image plus a bar. */
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

/* The picture's lower third is darkened so the caption has something settled to
   sit on. Not on the music card: its ground is pale by design. */
.love[data-love='mountains'] .love__media::after,
.love[data-love='snow'] .love__media::after {
  content: '';
  position: absolute;
  inset: 40% 0 0;
  background: linear-gradient(to top, rgb(10 8 20 / 0.36), rgb(10 8 20 / 0));
  pointer-events: none;
}

/* Mask, not image: only the source's alpha is used, so the headphones stay
   ink-dark on the pale ground instead of being tinted into it. */
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
     squares. */
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
