<script setup lang="ts">
import { computed } from 'vue'
import { motion } from 'motion-v'
import { useMotion } from '@/composables/useMotion'
import { asset } from '@/data/assets'
import { profile } from '@/data/profile'

/**
 * The site's closing beat, repeated on every page: a full-bleed maroon block
 * with the email set as large as the hero. It is the only place the accent runs
 * as a surface rather than as a line, which is what makes it land.
 *
 * Everything it says comes from `data/profile.ts` — the address, both profile
 * URLs — so there is one place to correct and no second copy to drift.
 */
const illustration = asset('contact/illustration')

/**
 * `useMotion().active` also asks for WebGL, because it answers for the hero's
 * flock. Nothing here needs a canvas, so this asks the narrower question: has
 * the visitor paused motion, or does the system say reduce?
 */
const { preference, reducedMotion } = useMotion()
const motionOk = computed(
  () => preference.value === 'on' || (preference.value === 'system' && !reducedMotion.value),
)

/**
 * No bottom margin here, unlike About's. This block is the floor of the page:
 * a trigger line held up off the viewport's bottom edge is a line the visitor
 * can never cross, because there is nothing below it left to scroll. With one,
 * the section sat empty maroon and the entrance never played.
 */
const viewport = { amount: 'some', once: false } as const
const ease = [0.16, 1, 0.3, 1]

/** Spread onto a block: `v-bind="rise(0.1)"`. Empty when motion is off, so the
 *  element renders in its final position with nothing to undo. */
const rise = (delay = 0, distance = 16) =>
  motionOk.value
    ? {
        initial: { opacity: 0, y: distance },
        whileInView: { opacity: 1, y: 0 },
        inViewOptions: viewport,
        transition: { duration: 0.58, delay, ease },
      }
    : {}
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-title">
    <div class="shell contact__inner">
      <div class="contact__copy">
        <motion.p class="label contact__marker" v-bind="rise()">Contact</motion.p>

        <motion.h2 id="contact-title" class="display contact__title" v-bind="rise(0.06)">
          Let's get in touch.
        </motion.h2>

        <motion.p class="contact__lede" v-bind="rise(0.12)">
          You never know where a connection might lead — maybe to a strong teammate, a thoughtful
          collaboration, or something genuinely worth building.
        </motion.p>

        <motion.div class="contact__reach" v-bind="rise(0.18)">
          <a :href="`mailto:${profile.email}`" class="contact__email link-underline">
            {{ profile.email }}
          </a>

          <ul class="contact__links">
            <li v-for="link in profile.links" :key="link.label">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="mono contact__link link-underline"
              >
                {{ link.label }} <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      <!-- ── The illustration ───────────────────────────────────────────────
           Standing on the section's own floor rather than floating on it: the
           plate is pulled down through the block's bottom padding so its base
           and the section's base are the same line, and the drawing's arms —
           which the artwork already runs off the bottom of its frame — carry
           straight into it.

           The plate is a deliberate window, not a pretence of transparency.
           The source is line art on a flat ground, so that ground was recoloured
           once, in the file, to the blush this panel is painted in; there is no
           seam to hide and nothing to key out at runtime. -->
      <motion.div class="contact__art" v-bind="rise(0.24, 28)" aria-hidden="true">
        <img class="contact__gif" :src="illustration" alt="" width="500" height="320" />
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  /* The closing block keeps a bottom edge — it is a coloured band, and the
     footer below it is a thin rule rather than another section. The arched
     plate is grounded against this same value, so the two stay in step. */
  --contact-y: var(--section-y);
  /* One right edge for the whole left composition. */
  --contact-measure: 38rem;
  position: relative;
  background: var(--c-deep);
  color: var(--c-on-deep);
  padding-block: var(--contact-y);
  /* The entrance offsets travel a few pixels before they settle; clip rather
     than hide, so no scroll container is created. */
  overflow: clip;
}

.contact__inner {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4rem);
}

/* Two columns from the tablet up, with the text holding the larger share: the
   drawing balances the block, it does not co-star in it. */
@media (min-width: 62rem) {
  .contact__inner {
    grid-template-columns: minmax(0, 1fr) minmax(20rem, 30rem);
    column-gap: clamp(3rem, 6vw, 6rem);
    align-items: end;
  }
}

/* ── Copy ──────────────────────────────────────────────────────────────── */

.contact__marker {
  color: var(--c-on-deep-muted);
  margin-bottom: 2.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.18);
}

.contact__title {
  font-size: var(--t-3xl);
  margin-bottom: clamp(1.25rem, 2.5vw, 1.75rem);
}

.contact__lede {
  max-width: var(--contact-measure);
  color: var(--c-on-deep-muted);
  font-size: var(--t-lg);
  line-height: 1.55;
  text-wrap: pretty;
}

.contact__reach {
  margin-top: clamp(2.25rem, 5vw, 3.5rem);
}

.contact__email {
  display: inline-block;
  max-width: 100%;
  padding-block: 0.35rem;
  /* Sans: an address is scanned character by character, and the serif's
     punctuation and figures are the hardest part of it to read. The heading
     above stays display — that is the large editorial moment here. */
  font-family: var(--font-sans);
  font-size: clamp(1.25rem, 1.1rem + 0.62vw, 1.625rem);
  font-weight: 500;
  letter-spacing: -0.012em;
  line-height: 1.3;
  /* Long address, narrow phone: break inside the word rather than off the
     edge of the screen. */
  overflow-wrap: anywhere;
  transition: color var(--dur) var(--ease-out);
}

.contact__email:hover,
.contact__email:focus-visible {
  color: var(--c-on-deep-muted);
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  /* The lede's measure exactly — in rem, so the two share a right edge rather
     than each finding its own from its own `ch`. The folio-style link at the
     end of the row then lands on that edge instead of adrift mid-section. */
  max-width: var(--contact-measure);
  margin-top: clamp(1.75rem, 4vw, 2.75rem);
}

.contact__link {
  display: inline-flex;
  align-items: center;
  /* Flex drops the whitespace between the label and its arrow — put it back. */
  gap: 0.35rem;
  min-height: 2.75rem;
  color: var(--c-on-deep-muted);
  transition: color var(--dur) var(--ease-out);
}

.contact__link:hover,
.contact__link:focus-visible {
  color: var(--c-on-deep);
}

.contact :focus-visible {
  outline-color: var(--c-on-deep);
}

/* ── Illustration ──────────────────────────────────────────────────────── */

.contact__art {
  /* Down through the section's bottom padding, so the plate's base and the
     block's base are one line. */
  margin-bottom: calc(var(--contact-y) * -1);
  align-self: end;
  /* The same blush the artwork's own ground was recoloured to, so the drawing
     has no edge of its own inside the panel — and no padding, so the artwork's
     generous internal margins are the window's margins and the illustration
     gets the full width of the column. */
  background: #ecd9d4;
  /* An arch, open at the foot. Three sides are drawn and the fourth is the
     section's own floor, which is what separates a window cut into the block
     from a card laid on top of it — and it is the About portrait's frame,
     quieter and wider. */
  border-radius: clamp(1.75rem, 4vw, 3rem) clamp(1.75rem, 4vw, 3rem) 0 0;
  overflow: hidden;
  position: relative;
  isolation: isolate;
}

/* The blush belongs to the maroon's own family rather than to paper, so the
   window sits inside the block's colour instead of punching a white hole in
   it; a hairline of the section's light keeps the arch from dissolving into
   the ground at its own edge. */
.contact__art::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-bottom: 0;
  border-radius: inherit;
}

.contact__gif {
  display: block;
  width: 100%;
  height: auto;
  /* Its own proportion, always — the drawing is never stretched to fit. */
  aspect-ratio: 500 / 320;
}

/* Phone and small tablet: the contact details read first, the drawing sits
   under them and still stands on the section's floor. Narrower than the
   measure, so it reads as an inset window rather than a band. */
@media (max-width: 61.999rem) {
  .contact__art {
    width: min(100%, 26rem);
    margin-inline: auto;
  }
}
</style>
