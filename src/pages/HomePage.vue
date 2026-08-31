<script setup lang="ts">
import ArrowLink from '@/components/ui/ArrowLink.vue'
import Annotation from '@/components/ui/Annotation.vue'
import Reveal from '@/components/ui/Reveal.vue'
import SectionHead from '@/components/ui/SectionHead.vue'
import ProjectRow from '@/components/project/ProjectRow.vue'
import { featuredProjects, projects } from '@/data/projects'
import { profile } from '@/data/profile'
import { asset, isPlaceholder } from '@/data/assets'

const featured = featuredProjects()
const portrait = asset('profile/portrait')
const portraitPending = isPlaceholder('profile/portrait')
</script>

<template>
  <div>
    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="hero" aria-labelledby="hero-title">
      <!-- The column rules are the "live creative background" from the concept,
           resolved as structure rather than as decoration: they show the grid
           the whole page is built on. -->
      <div class="hero__rules" aria-hidden="true">
        <span v-for="n in 5" :key="n" class="hero__rule" :style="{ '--i': n }" />
      </div>

      <div class="shell hero__inner">
        <div class="hero__body">
          <p class="mono hero__eyebrow">
            {{ profile.role }}
            <span class="hero__sep" aria-hidden="true">/</span>
            {{ profile.secondRole }}
          </p>

          <h1 id="hero-title" class="display hero__title">
            I design the<br />
            interface, then<br />
            I <Annotation>build</Annotation> it.
          </h1>

          <p class="lede hero__lede">{{ profile.intro }}</p>

          <div class="hero__cta">
            <ArrowLink to="/work" size="lg">View my work</ArrowLink>
          </div>
        </div>

        <div class="hero__portrait">
          <img :src="portrait" alt="" aria-hidden="true" />
          <p class="mono hero__caption">
            {{ profile.name }}<span v-if="portraitPending" class="hero__caption-flag"> · photo pending</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ── Selected work ─────────────────────────────────────────────────── -->
    <section class="shell section" aria-labelledby="selected-title">
      <SectionHead
        id="selected"
        marker="Selected"
        title="Work worth the scroll"
        :note="`${featured.length} of ${projects.length}`"
      />

      <div class="stack">
        <Reveal v-for="(project, i) in featured" :key="project.slug">
          <ProjectRow :project="project" :flip="i % 2 === 1" :eager="i === 0" />
        </Reveal>
      </div>

      <div class="section__more">
        <ArrowLink to="/work">All work</ArrowLink>
      </div>
    </section>

    <!-- ── About ─────────────────────────────────────────────────────────── -->
    <section class="shell section" aria-labelledby="about-title">
      <SectionHead id="about" marker="About" title="Design and build, not design then hand off" />

      <Reveal class="about">
        <div class="about__prose">
          <p class="about__para">
            Most interface problems only show themselves once the thing is running — when the
            content is the wrong length, the state you forgot appears, or an interaction that
            looked fine in a static frame turns out to be a chore. Working across both sides
            means those get caught while they are still cheap to change.
          </p>
          <p class="about__para about__para--muted">
            So the design work is done with the constraints of the build in mind, and the build
            is done with the intent of the design intact. Fewer things get lost in translation,
            because there is no translation step.
          </p>
        </div>

        <!-- Facts only, straight from `profile.facts`. A row you delete there
             disappears here — nothing is filled in to keep the table even. -->
        <dl class="about__facts">
          <div v-for="fact in profile.facts" :key="fact.term" class="about__fact">
            <dt class="label">{{ fact.term }}</dt>
            <dd class="mono">{{ fact.detail }}</dd>
          </div>
          <div class="about__fact">
            <dt class="label">Contact</dt>
            <dd class="mono">
              <a :href="`mailto:${profile.email}`" class="link-underline tap-target">Email</a>
            </dd>
          </div>
        </dl>
      </Reveal>
    </section>

    <!-- ── Skillset ──────────────────────────────────────────────────────── -->
    <section class="shell section" aria-labelledby="skillset-title">
      <SectionHead id="skillset" marker="Skillset" title="What I actually do" />

      <Reveal class="caps">
        <div v-for="group in profile.capabilities" :key="group.group" class="caps__group">
          <h3 class="label caps__heading">{{ group.group }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item" class="caps__item">{{ item }}</li>
          </ul>
        </div>
      </Reveal>
    </section>

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
  padding-top: clamp(3rem, 9vw, 7rem);
  padding-bottom: clamp(4rem, 10vw, 8rem);
  overflow: hidden;
}

.hero__rules {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-evenly;
  pointer-events: none;
}

.hero__rule {
  width: 1px;
  background: var(--c-rule);
  transform-origin: top;
  animation: rule-in 1s var(--ease-out) backwards;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes rule-in {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__rule {
    animation: none;
  }
}

.hero__inner {
  position: relative;
  display: grid;
  gap: clamp(2.5rem, 6vw, 4rem);
}

@media (min-width: 56rem) {
  .hero__inner {
    grid-template-columns: minmax(0, 8fr) minmax(0, 3fr);
    column-gap: clamp(2rem, 6vw, 6rem);
    align-items: end;
  }
}

.hero__eyebrow {
  color: var(--c-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: var(--t-xs);
  padding-bottom: 1.5rem;
  margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
  border-bottom: 1px solid var(--c-rule);
}

.hero__sep {
  color: var(--c-accent);
  padding-inline: 0.4rem;
}

.hero__title {
  font-size: var(--t-4xl);
  margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
}

.hero__lede {
  color: var(--c-muted);
}

.hero__cta {
  margin-top: clamp(2rem, 4vw, 3rem);
}

.hero__portrait {
  max-width: 22rem;
}

.hero__portrait img {
  width: 100%;
  border: 1px solid var(--c-rule);
  background: var(--c-surface);
  /* Duotone toward the accent, released on hover — the image commits to the
     palette at rest and shows its true colour when you engage with it. */
  filter: grayscale(1) contrast(1.05);
  transition: filter var(--dur-slow) var(--ease-out);
}

.hero__portrait:hover img {
  filter: none;
}

.hero__caption-flag {
  color: var(--c-accent);
}

.hero__caption {
  margin-top: 0.85rem;
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ── Shared section rhythm ─────────────────────────────────────────────── */

.section {
  padding-block: var(--section-y);
}

.section__more {
  margin-top: clamp(2.5rem, 5vw, 4rem);
}

.stack {
  display: grid;
  gap: clamp(3.5rem, 8vw, 6rem);
}

/* ── About ─────────────────────────────────────────────────────────────── */

.about {
  display: grid;
  gap: clamp(2.5rem, 5vw, 4rem);
}

@media (min-width: 56rem) {
  .about {
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    column-gap: clamp(3rem, 8vw, 7rem);
  }
}

.about__para {
  font-size: var(--t-lg);
  line-height: 1.55;
  max-width: 56ch;
}

.about__para + .about__para {
  margin-top: 1.5rem;
}

.about__para--muted {
  color: var(--c-muted);
}

.about__facts {
  margin: 0;
  border-top: 1px solid var(--c-rule);
}

.about__fact {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1.5rem;
  padding-block: 0.9rem;
  border-bottom: 1px solid var(--c-rule);
}

.about__fact dt {
  color: var(--c-muted);
  flex: none;
}

.about__fact dd {
  margin: 0;
  text-align: right;
}

/* ── Capabilities ──────────────────────────────────────────────────────── */

.caps {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
}

@media (min-width: 40rem) {
  .caps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .caps {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.caps__heading {
  color: var(--c-accent);
  padding-bottom: 0.9rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid var(--c-rule-strong);
}

.caps__item {
  padding-block: 0.8rem;
  border-bottom: 1px solid var(--c-rule);
  font-size: var(--t-base);
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
