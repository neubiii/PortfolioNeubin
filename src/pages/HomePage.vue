<script setup lang="ts">
import ArrowLink from '@/components/ui/ArrowLink.vue'
import Annotation from '@/components/ui/Annotation.vue'
import GridRules from '@/components/ui/GridRules.vue'
import MotionToggle from '@/components/ui/MotionToggle.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import AboutSection from '@/components/layout/AboutSection.vue'
import SkillsetSection from '@/components/layout/SkillsetSection.vue'
import VantaBirds from '@/components/ui/VantaBirds.vue'
import WorksShowcase from '@/components/project/WorksShowcase.vue'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
</script>

<template>
  <div>
    <!-- ── Hero ──────────────────────────────────────────────────────────────
         A near-black block in both themes: it is the ground the flock moves
         across, and fixing it makes the type contrast a constant rather than
         something that depends on the visitor's theme.

         Layering, back to front: Vanta canvas (inert) → veil → layout ruler →
         content. Only the content layer takes pointer events.
    ─────────────────────────────────────────────────────────────────────── -->
    <section class="hero" data-hero aria-labelledby="hero-title">
      <VantaBirds class="hero__vanta" />
      <div class="hero__veil" aria-hidden="true" />
      <GridRules class="hero__rules" :columns="4" ticks />

      <div class="shell hero__inner">
        <p class="mono hero__eyebrow">
          Product Developer
          <span class="hero__slash" aria-hidden="true">/</span>
          UI/UX Developer
        </p>

        <h1 id="hero-title" class="display hero__title">
          I design the interface,<br />
          then I <Annotation :delay="1100">build</Annotation> it.
        </h1>

        <p class="hero__lede">{{ profile.intro }}</p>

        <div class="hero__cta">
          <ArrowLink to="/#work" size="lg">View my work</ArrowLink>
        </div>
      </div>

      <!-- Ruler foot: a measured bottom edge that also carries the two things
           worth saying here — how much work there is, and control over the
           motion behind it. -->
      <div class="shell hero__foot">
        <p class="mono hero__foot-item">{{ projects.length }} projects</p>

        <div class="hero__foot-controls">
          <MotionToggle />
          <span class="hero__foot-divider" aria-hidden="true" />
          <p class="mono hero__foot-item">
            Scroll <span class="hero__foot-arrow" aria-hidden="true">↓</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ── Work — the single browsing experience, anchored at #work ────── -->
    <WorksShowcase />

    <!-- ── About ─────────────────────────────────────────────────────────── -->
    <AboutSection />

    <!-- ── Skillset ──────────────────────────────────────────────────────── -->
    <SkillsetSection />

    <!-- ── Experience — renders only when there is real data to show ─────── -->
    <section
      v-if="profile.experience.length"
      class="shell section"
      aria-labelledby="experience-title"
    >
      <SectionHead id="experience" marker="Experience" title="Where I've worked" />

      <ol class="exp">
        <li v-for="role in profile.experience" :key="role.period + role.org" class="exp__row">
          <p class="mono exp__period">{{ role.period }}</p>
          <div>
            <h3 class="exp__title">{{ role.title }}</h3>
            <p class="mono exp__org">{{ role.org }}</p>
          </div>
          <p class="exp__note">{{ role.note }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
/* ── Hero ──────────────────────────────────────────────────────────────── */

.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Header is sticky and 4.5rem tall, so hero + header fills exactly one
     viewport. `svh` keeps that true under mobile browser chrome. */
  min-height: calc(100svh - 4.5rem);
  padding-block: clamp(4rem, 12vh, 8rem) 0;
  background: var(--c-hero-bg);
  overflow: hidden;

  /* Re-point the palette for this block. Every child — the annotation, the
     arrow link, the rules — reads these, so one declaration inverts the lot. */
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

.hero__vanta {
  z-index: 0;
}

/* Washes toward the hero's own ground — darkening in dark mode, lightening in
   light mode — so a bird crossing behind the headline never costs contrast.
   Not a panel: it has no edge. */
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
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-block: clamp(2rem, 6vh, 4rem);
}

.hero__eyebrow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0 0.15rem;
  max-width: 100%;
  color: var(--c-hero-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  margin-bottom: clamp(1.75rem, 5vh, 3rem);
}

/* Wide tracking is the point of this line, but at 390px it runs past the
   gutter — so it eases off rather than being clipped. */
@media (max-width: 30rem) {
  .hero__eyebrow {
    font-size: 0.6875rem;
    letter-spacing: 0.12em;
  }
}

.hero__slash {
  color: var(--c-hero-accent);
  padding-inline: 0.55rem;
}

.hero__title {
  font-size: var(--t-4xl);
  /* Optical size wound right up: at this scale Fraunces gets the fine
     hairlines and high contrast that carry the editorial voice. */
  font-variation-settings:
    'opsz' 144,
    'SOFT' 0,
    'WONK' 1;
  line-height: 0.98;
  letter-spacing: -0.028em;
  max-width: 18ch;
  text-wrap: balance;
}

.hero__lede {
  margin-top: clamp(1.5rem, 4vh, 2.5rem);
  max-width: 48ch;
  font-size: var(--t-lg);
  line-height: 1.5;
  color: var(--c-hero-muted);
  text-wrap: balance;
}

.hero__cta {
  margin-top: clamp(2rem, 5vh, 3.25rem);
}

/* ── Hero foot ─────────────────────────────────────────────────────────── */

.hero__foot {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.35rem;
  border-top: 1px solid var(--c-hero-rule);
}

.hero__foot-controls {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}

.hero__foot-divider {
  width: 1px;
  height: 1.05rem;
  flex: none;
  background: var(--c-hero-rule-strong);
}

/* On a phone the ruler row keeps the control and drops the count, which the
   work section states again a screen later. */
@media (max-width: 34rem) {
  .hero__foot > .hero__foot-item {
    display: none;
  }

  .hero__foot {
    justify-content: center;
  }
}

.hero__foot-item {
  color: var(--c-hero-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero__foot-arrow {
  display: inline-block;
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

/* ── Shared section rhythm ─────────────────────────────────────────────── */

.section {
  padding-block: var(--section-y);
}



/* ── Experience ────────────────────────────────────────────────────────── */

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
