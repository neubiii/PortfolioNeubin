<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowUpRight } from 'lucide-vue-next'
import { useMotion } from '@/composables/useMotion'
import { asset } from '@/data/assets'
import { profile } from '@/data/profile'

/**
 * The site's closing beat, repeated on every page. Everything it says comes
 * from `data/profile.ts`, so there is no second copy to drift.
 */
const illustration = asset('contact/illustration')

/* `active` from useMotion also asks for WebGL, which answers for the hero's
   flock. Nothing here needs a canvas, so ask the narrower question. */
const { motionOk } = useMotion()

/**
 * No bottom margin on the viewport, unlike About's: this block is the floor of
 * the page, so a trigger line held above the viewport's bottom edge is one the
 * visitor can never cross and the entrance would never play.
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
                class="meta contact__link link-underline"
              >
                {{ link.label }} <ArrowUpRight />
              </a>
            </li>
          </ul>
        </motion.div>
      </div>

      <!-- The plate is a deliberate window, not a pretence of transparency:
           the artwork's flat ground was recoloured once, in the file, to the
           blush this panel is painted in. -->
      <motion.div class="contact__art" v-bind="rise(0.24, 28)" aria-hidden="true">
        <img class="contact__gif" :src="illustration" alt="" width="500" height="320" />
      </motion.div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  /* The closing block keeps a bottom edge; the arched plate is grounded
     against this same value, so the two stay in step. */
  --contact-y: var(--section-y);
  --contact-measure: 38rem;
  position: relative;
  background: var(--c-deep);
  color: var(--c-on-deep);
  padding-block: var(--contact-y);
  /* The entrance travels a few pixels before it settles; clip rather than
     hide, so no scroll container is created. */
  overflow: clip;
}

.contact__inner {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4rem);
}

@media (min-width: 62rem) {
  .contact__inner {
    grid-template-columns: minmax(0, 1fr) minmax(20rem, 30rem);
    column-gap: clamp(3rem, 6vw, 6rem);
    align-items: end;
  }
}

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
  /* Sans: an address is read character by character, which is where the
     serif's punctuation and figures cost the most. The heading stays display. */
  font-family: var(--font-sans);
  font-size: clamp(1.25rem, 1.1rem + 0.62vw, 1.625rem);
  font-weight: 500;
  letter-spacing: -0.012em;
  line-height: 1.3;
  /* Long address, narrow phone: break inside the word rather than off screen. */
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
  /* The lede's measure exactly, in rem, so the two share a right edge. */
  max-width: var(--contact-measure);
  margin-top: clamp(1.75rem, 4vw, 2.75rem);
}

.contact__link {
  display: inline-flex;
  align-items: center;
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

.contact__art {
  /* Down through the section's bottom padding, so the plate's base and the
     block's base are one line. */
  margin-bottom: calc(var(--contact-y) * -1);
  align-self: end;
  /* The blush the artwork's own ground was recoloured to, so the drawing has no
     edge of its own inside the panel. */
  background: #ecd9d4;
  /* An arch, open at the foot: three sides drawn, the fourth is the section's
     own floor — a window cut into the block rather than a card laid on it. */
  border-radius: clamp(1.75rem, 4vw, 3rem) clamp(1.75rem, 4vw, 3rem) 0 0;
  overflow: hidden;
  position: relative;
  isolation: isolate;
}

/* A hairline of the section's light, so the arch does not dissolve into the
   ground at its own edge. */
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
  aspect-ratio: 500 / 320;
}

/* Phone and small tablet: the details read first, the drawing sits under them
   and still stands on the section's floor. */
@media (max-width: 61.999rem) {
  .contact__art {
    width: min(100%, 26rem);
    margin-inline: auto;
  }
}
</style>
