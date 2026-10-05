<script lang="ts">
/**
 * Module scope, so it survives a route change but not a document load: the
 * opening plays on every full load of the home page and does not replay when a
 * visitor routes back from a project. Nothing is persisted.
 */
let introPlayed = false
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from 'lucide-vue-next'
import ArrowLink from '@/components/ui/ArrowLink.vue'
import GridRules from '@/components/ui/GridRules.vue'
import HeroIntro from '@/components/ui/HeroIntro.vue'
import HeroStatement from '@/components/ui/HeroStatement.vue'
import MotionToggle from '@/components/ui/MotionToggle.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import AboutSection from '@/components/layout/AboutSection.vue'
import SkillsetSection from '@/components/layout/SkillsetSection.vue'
import VantaBirds from '@/components/ui/VantaBirds.vue'
import WorksShowcase from '@/components/project/WorksShowcase.vue'
import { useMotion } from '@/composables/useMotion'
import { profile } from '@/data/profile'

const { motionOk } = useMotion()

/* Decided during setup rather than on mount, so the settled hero never flashes
   ahead of the sequence. */
const introActive = ref(!introPlayed && motionOk.value)
introPlayed = true

const heroRevealed = ref(!introActive.value)
const finishIntro = () => (introActive.value = false)
</script>

<template>
  <div>
    <!-- Back to front: Vanta canvas → veil → ruler → content. Only the content
         layer takes pointer events. -->
    <section
      class="hero"
      data-hero
      :data-revealed="String(heroRevealed)"
      aria-labelledby="hero-title"
    >
      <VantaBirds class="hero__vanta" />
      <div class="hero__veil" aria-hidden="true" />
      <GridRules class="hero__rules" :columns="4" ticks />

      <!-- Ahead of the hero content in the DOM, so `Skip intro` is the first
           stop inside the hero for a keyboard visitor. -->
      <HeroIntro v-if="introActive" @reveal="heroRevealed = true" @done="finishIntro" />

      <div class="shell hero__inner">
        <p class="meta hero__eyebrow">Let’s fly higher, together.</p>

        <HeroStatement class="hero__statement" />

        <p class="hero__lede">{{ profile.intro }}</p>

        <div class="hero__cta">
          <ArrowLink to="/#work" size="lg">View Neubin&rsquo;s work</ArrowLink>
          <ArrowLink to="/#contact">Contact Neubin</ArrowLink>
        </div>
      </div>

      <div class="shell hero__foot">
        <span class="hero__foot-rule" aria-hidden="true" />

        <div class="hero__foot-controls">
          <MotionToggle />
          <span class="hero__foot-divider" aria-hidden="true" />
          <p class="meta hero__foot-item">
            Scroll <ArrowDown class="hero__foot-arrow" />
          </p>
        </div>
      </div>
    </section>

    <WorksShowcase />

    <AboutSection />

    <SkillsetSection />

    <!-- Renders only when there is real data to show. -->
    <section
      v-if="profile.experience.length"
      class="shell section"
      aria-labelledby="experience-title"
    >
      <SectionHead id="experience" marker="Experience" title="Where I've worked" />

      <ol class="exp">
        <li v-for="role in profile.experience" :key="role.period + role.org" class="exp__row">
          <p class="meta exp__period">{{ role.period }}</p>
          <div>
            <h3 class="exp__title">{{ role.title }}</h3>
            <p class="meta exp__org">{{ role.org }}</p>
          </div>
          <p class="exp__note">{{ role.note }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Hero + header fill one viewport. The bar is 4.5rem plus a 1px hairline;
     `svh` holds under mobile browser chrome. */
  min-height: calc(100svh - 4.5rem - 1px);
  padding-block: var(--hero-top) 0;
  background: var(--c-hero-bg);
  overflow: hidden;

  /* The block's vertical rhythm, in one place for the override below. */
  --hero-top: clamp(4rem, 12vh, 8rem);
  --hero-inner-top: clamp(2rem, 6vh, 4rem);
  --hero-inner-bottom: clamp(2rem, 6vh, 4rem);
  --hero-gap-eyebrow: clamp(1.25rem, 3.5vh, 2rem);
  --hero-gap-lede: clamp(1.5rem, 4vh, 2.25rem);
  --hero-gap-cta: clamp(2rem, 5vh, 3.25rem);

  /* Re-point the palette for this block; every child reads these tokens. */
  --c-ink: var(--c-hero-ink);
  --c-muted: var(--c-hero-muted);
  --c-accent: var(--c-hero-accent);
  --c-accent-hover: var(--c-hero-ink);
  --c-rule: var(--c-hero-rule);
  --c-rule-strong: var(--c-hero-rule-strong);
  --c-focus: var(--c-hero-ink);
  --rules-color: var(--c-hero-rule);
  --rules-tick: var(--c-hero-rule-strong);

  color: var(--c-hero-ink);
}

/* Compact the hero rhythm on short desktop viewports, so the foot stays in
   view. Each value equals the one above at 900px tall, so there is no step. */
@media (max-height: 56.25rem) {
  .hero {
    --hero-top: max(2rem, 36vh - 216px);
    --hero-inner-top: max(0.75rem, 19vh - 117px);
    --hero-inner-bottom: max(1rem, 17vh - 99px);
    --hero-gap-eyebrow: max(0.875rem, 8vh - 40px);
    --hero-gap-lede: max(1rem, 8vh - 36px);
    --hero-gap-cta: max(1.25rem, 10vh - 45px);
  }
}

/* On a phone the second action wraps to a row of its own; the lead-in above the
   question gives back the height that costs. */
@media (max-width: 30rem) {
  .hero {
    --hero-top: clamp(1.25rem, 4.5vh, 2.5rem);
  }
}

.hero__vanta {
  z-index: 0;
}

/* The hero settles in as the intro fades off it: meta, then headline, then the
   supporting copy and the actions. A small stagger — a settling, not a cascade.
   The last group lands at 900ms, the length of the intro's reveal beat. */
.hero__eyebrow,
.hero__statement,
.hero__lede,
.hero__cta,
.hero__foot {
  transition:
    opacity 720ms var(--ease-out),
    transform 720ms var(--ease-out);
}

.hero__statement {
  transition-delay: 90ms;
}

.hero__lede,
.hero__cta,
.hero__foot {
  transition-delay: 180ms;
}

.hero[data-revealed='false'] .hero__eyebrow,
.hero[data-revealed='false'] .hero__statement,
.hero[data-revealed='false'] .hero__lede,
.hero[data-revealed='false'] .hero__cta,
.hero[data-revealed='false'] .hero__foot {
  opacity: 0;
  transform: translateY(8px);
}

/* Washes toward the hero's ground so a passing bird never costs contrast. */
.hero__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 66% 58% at 50% 47%,
      rgb(var(--c-hero-veil) / 0.86) 0%,
      rgb(var(--c-hero-veil) / 0.6) 42%,
      rgb(var(--c-hero-veil) / 0.22) 68%,
      transparent 84%
    ),
    linear-gradient(to bottom, rgb(var(--c-hero-veil) / 0.55), transparent 22%);
}

.hero__rules {
  z-index: 2;
}

.hero__inner {
  position: relative;
  z-index: 3;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  padding-block: var(--hero-inner-top) var(--hero-inner-bottom);
}

.hero__eyebrow {
  color: var(--c-hero-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: var(--hero-gap-eyebrow);
}

/* Capped short of the shell: at full measure the sentence sets edge to edge,
   and much below this it breaks into four ragged lines on a wide display. Not
   `ch` — it resolves against the inherited body size, not the display size the
   sentence is set in. */
.hero__statement {
  width: min(100%, 76rem);
}

.hero__lede {
  margin-top: var(--hero-gap-lede);
  max-width: 62ch;
  font-size: var(--t-lg);
  line-height: 1.55;
  color: var(--c-hero-muted);
  text-wrap: pretty;
}

/* `flex-end` rather than `baseline`: the two links are set at different sizes,
   and it is their rules that should line up, not their text boxes. */
.hero__cta {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.5rem clamp(1.75rem, 3.5vw, 3rem);
  margin-top: var(--hero-gap-cta);
}

/* An element, not a border, so the controls sit inside the line. */
.hero__foot {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: clamp(0.9rem, 2.5vw, 1.75rem);
  padding-block: 0.35rem;
}

.hero__foot-rule {
  flex: 1 1 auto;
  min-width: 1.5rem;
  height: 1px;
  background: var(--c-hero-rule);
}

.hero__foot-controls {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex: none;
}

.hero__foot-divider {
  width: 1px;
  height: 1.05rem;
  flex: none;
  background: var(--c-hero-rule-strong);
}

.hero__foot-item {
  color: var(--c-hero-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero__foot-arrow {
  display: inline-block;
  vertical-align: -0.14em;
  margin-left: 0.35rem;
  animation: nudge 2.4s var(--ease-in-out) infinite;
}

@keyframes nudge {
  0%,
  72%,
  100% {
    transform: translateY(0);
  }
  84% {
    transform: translateY(0.28rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__foot-arrow {
    animation: none;
  }
}

/* Top edge only, so a boundary is one gap rather than two stacked. */
.section {
  padding-top: var(--section-y);
  padding-bottom: 0;
}

.exp {
  border-top: 1px solid var(--c-rule);
}

.exp__row {
  display: grid;
  gap: 0.5rem 2rem;
  padding-block: 1.75rem;
  border-bottom: 1px solid var(--c-rule);
}

@media (min-width: 56rem) {
  .exp__row {
    grid-template-columns: 9rem minmax(0, 5fr) minmax(0, 6fr);
    align-items: baseline;
  }
}

.exp__period {
  color: var(--c-accent);
}

.exp__title {
  font-size: var(--t-lg);
}

.exp__org {
  color: var(--c-muted);
  margin-top: 0.2rem;
}

.exp__note {
  color: var(--c-muted);
  max-width: 46ch;
}
</style>
