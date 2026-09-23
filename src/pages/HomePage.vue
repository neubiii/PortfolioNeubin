<script setup lang="ts">
import { ArrowDown } from 'lucide-vue-next'
import ArrowLink from '@/components/ui/ArrowLink.vue'
import GridRules from '@/components/ui/GridRules.vue'
import HeroStatement from '@/components/ui/HeroStatement.vue'
import MotionToggle from '@/components/ui/MotionToggle.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import AboutSection from '@/components/layout/AboutSection.vue'
import SkillsetSection from '@/components/layout/SkillsetSection.vue'
import VantaBirds from '@/components/ui/VantaBirds.vue'
import WorksShowcase from '@/components/project/WorksShowcase.vue'
import { profile } from '@/data/profile'
</script>

<template>
  <div>
    <!-- Back to front: Vanta canvas → veil → ruler → content. Only the content
         layer takes pointer events. -->
    <section class="hero" data-hero aria-labelledby="hero-title">
      <VantaBirds class="hero__vanta" />
      <div class="hero__veil" aria-hidden="true" />
      <GridRules class="hero__rules" :columns="4" ticks />

      <div class="shell hero__inner">
        <p class="meta hero__eyebrow">Let's fly higher, together.</p>

        <HeroStatement class="hero__statement" />

        <p class="hero__lede">{{ profile.intro }}</p>

        <div class="hero__cta">
          <ArrowLink to="/#work" size="lg">View my work</ArrowLink>
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

.hero__vanta {
  z-index: 0;
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

/* The tracking runs past the gutter at 390px. */
@media (max-width: 30rem) {
  .hero__eyebrow {
    font-size: 0.6875rem;
    letter-spacing: 0.14em;
  }
}

/* Capped short of the shell: at full measure the sentence sets as two
   edge-to-edge lines. Not `ch` — it resolves against the inherited body size,
   not the display size the sentence is set in. */
.hero__statement {
  width: min(100%, 72rem);
}

.hero__lede {
  margin-top: var(--hero-gap-lede);
  max-width: 62ch;
  font-size: var(--t-lg);
  line-height: 1.55;
  color: var(--c-hero-muted);
  text-wrap: pretty;
}

.hero__cta {
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
