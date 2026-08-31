<script setup lang="ts">
import MediaFrame from '@/components/ui/MediaFrame.vue'
import Reveal from '@/components/ui/Reveal.vue'
import type { CaseSection } from '@/types'

/**
 * Renders one section of a project page.
 *
 * Each kind gets a composition of its own rather than a shared card: a split
 * is a two-up contrast on a rule, stats are a ruled trio with large figures,
 * a quote breaks the measure entirely. That variety is what stops a case study
 * reading like a form someone filled in.
 */
defineProps<{ section: CaseSection }>()
</script>

<template>
  <section :id="section.id" class="cs" :data-kind="section.kind">
    <!-- Heading block, shared by every kind that carries a title. -->
    <header v-if="'title' in section && section.title" class="cs__head">
      <p v-if="'marker' in section && section.marker" class="label cs__marker">
        {{ section.marker }}
      </p>
      <h2 class="display-soft cs__title">{{ section.title }}</h2>
      <p v-if="'lede' in section && section.lede" class="lede cs__lede">{{ section.lede }}</p>
    </header>

    <!-- ── Prose ─────────────────────────────────────────────────────────── -->
    <Reveal v-if="section.kind === 'text'" class="cs__prose">
      <p v-for="(para, i) in section.body" :key="i" class="cs__para">{{ para }}</p>
    </Reveal>

    <!-- ── Two-up contrast ───────────────────────────────────────────────── -->
    <Reveal v-else-if="section.kind === 'split'" class="cs__split">
      <div v-for="col in section.columns" :key="col.label" class="cs__col">
        <p class="label cs__col-label">{{ col.label }}</p>
        <h3 class="cs__col-heading">{{ col.heading }}</h3>
        <p class="cs__col-body">{{ col.body }}</p>
      </div>
    </Reveal>

    <!-- ── Figures ───────────────────────────────────────────────────────── -->
    <template v-else-if="section.kind === 'stats'">
      <Reveal class="cs__stats">
        <div v-for="stat in section.items" :key="stat.label" class="cs__stat">
          <p class="display cs__stat-value">{{ stat.value }}</p>
          <p class="cs__stat-label">{{ stat.label }}</p>
          <p class="cs__stat-note">{{ stat.note }}</p>
        </div>
      </Reveal>
      <p v-if="section.footnote" class="cs__footnote">{{ section.footnote }}</p>
    </template>

    <!-- ── Pull quote ────────────────────────────────────────────────────── -->
    <Reveal v-else-if="section.kind === 'quote'" as="figure" class="cs__quote">
      <blockquote class="display-soft cs__quote-text">{{ section.text }}</blockquote>
      <figcaption class="mono cs__quote-by">{{ section.attribution }}</figcaption>
    </Reveal>

    <!-- ── Numbered sequence ─────────────────────────────────────────────── -->
    <Reveal v-else-if="section.kind === 'steps'" class="cs__steps">
      <div v-for="step in section.items" :key="step.label" class="cs__step">
        <p class="label cs__step-label">{{ step.label }}</p>
        <h3 class="cs__step-heading">{{ step.heading }}</h3>
        <p class="cs__step-body">{{ step.body }}</p>
      </div>
    </Reveal>

    <!-- ── Ruled table ───────────────────────────────────────────────────── -->
    <Reveal v-else-if="section.kind === 'list'" as="dl" class="cs__list">
      <div v-for="row in section.items" :key="row.term" class="cs__row">
        <dt class="cs__term">{{ row.term }}</dt>
        <dd class="cs__detail">{{ row.detail }}</dd>
      </div>
    </Reveal>

    <!-- ── Images ────────────────────────────────────────────────────────── -->
    <Reveal v-else-if="section.kind === 'media'" class="cs__media" :data-layout="section.layout">
      <MediaFrame
        v-for="(item, i) in section.items"
        :key="item.src + i"
        :item="item"
        :eager="i === 0 && section.id === 'hero'"
      />
    </Reveal>
  </section>
</template>

<style scoped>
.cs + .cs {
  margin-top: clamp(3.5rem, 7vw, 6rem);
}

/* A media block that directly follows its own prose belongs to it — tighten. */
.cs[data-kind='media'] {
  margin-top: clamp(2rem, 4vw, 3rem);
}

.cs__head {
  margin-bottom: clamp(1.75rem, 3.5vw, 2.75rem);
}

.cs__marker {
  color: var(--c-accent);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--c-rule);
}

.cs__title {
  font-size: var(--t-2xl);
  max-width: 20ch;
}

.cs__lede {
  margin-top: 1.5rem;
  color: var(--c-muted);
}

/* ── Prose ─────────────────────────────────────────────────────────────── */

.cs__prose {
  max-width: var(--measure);
}

.cs__para {
  font-size: var(--t-lg);
  line-height: 1.6;
}

.cs__para + .cs__para {
  margin-top: 1.4rem;
  color: var(--c-muted);
}

/* ── Split ─────────────────────────────────────────────────────────────── */

.cs__split {
  display: grid;
  gap: 2.5rem;
  border-top: 1px solid var(--c-rule-strong);
  padding-top: 2rem;
}

@media (min-width: 48rem) {
  .cs__split {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(2rem, 5vw, 4.5rem);
  }

  /* The rule between the two framings is the point of the comparison. */
  .cs__col + .cs__col {
    padding-left: clamp(2rem, 5vw, 4.5rem);
    margin-left: calc(clamp(2rem, 5vw, 4.5rem) * -1);
    border-left: 1px solid var(--c-rule);
  }
}

.cs__col-label {
  color: var(--c-muted);
  margin-bottom: 1rem;
}

.cs__col-heading {
  font-family: var(--font-display);
  font-variation-settings:
    'opsz' 48,
    'SOFT' 30,
    'WONK' 1;
  font-size: var(--t-xl);
  line-height: 1.15;
  margin-bottom: 1.1rem;
}

.cs__col-body {
  color: var(--c-muted);
  max-width: 46ch;
}

/* ── Stats ─────────────────────────────────────────────────────────────── */

.cs__stats {
  display: grid;
  gap: 2.25rem;
  border-top: 1px solid var(--c-rule-strong);
  padding-top: 2rem;
}

@media (min-width: 48rem) {
  .cs__stats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: clamp(1.5rem, 4vw, 3.5rem);
  }
}

.cs__stat-value {
  font-size: var(--t-3xl);
  color: var(--c-accent);
  line-height: 0.9;
  margin-bottom: 1rem;
}

.cs__stat-label {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding-bottom: 0.85rem;
  margin-bottom: 0.85rem;
  border-bottom: 1px solid var(--c-rule);
}

.cs__stat-note {
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.55;
}

.cs__footnote {
  margin-top: 2rem;
  color: var(--c-muted);
  font-size: var(--t-sm);
  max-width: 72ch;
}

/* ── Quote ─────────────────────────────────────────────────────────────── */

.cs__quote {
  margin: 0;
  padding-block: clamp(1rem, 3vw, 2rem);
}

.cs__quote-text {
  margin: 0;
  font-size: var(--t-2xl);
  line-height: 1.18;
  max-width: 22ch;
  /* Hanging punctuation: the opening mark sits in the margin so the first
     line of type still aligns with everything above it. */
  text-indent: -0.42em;
}

.cs__quote-text::before {
  content: '\201C';
}

.cs__quote-text::after {
  content: '\201D';
}

.cs__quote-by {
  margin-top: 1.75rem;
  color: var(--c-muted);
  padding-top: 1rem;
  border-top: 1px solid var(--c-rule);
  max-width: 46ch;
  text-wrap: balance;
}

/* ── Steps ─────────────────────────────────────────────────────────────── */

.cs__steps {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--c-rule-strong);
}

@media (min-width: 56rem) {
  .cs__steps {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    column-gap: clamp(1.5rem, 3vw, 3rem);
  }
}

.cs__step {
  padding-block: 1.75rem;
  border-bottom: 1px solid var(--c-rule);
}

@media (min-width: 56rem) {
  .cs__step {
    border-bottom: 0;
  }
}

.cs__step-label {
  color: var(--c-accent);
  margin-bottom: 1rem;
}

.cs__step-heading {
  font-size: var(--t-lg);
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  max-width: 24ch;
}

.cs__step-body {
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.6;
  max-width: 42ch;
}

/* ── List ──────────────────────────────────────────────────────────────── */

.cs__list {
  margin: 0;
  border-top: 1px solid var(--c-rule-strong);
}

.cs__row {
  display: grid;
  gap: 0.4rem 2.5rem;
  padding-block: 1.4rem;
  border-bottom: 1px solid var(--c-rule);
}

@media (min-width: 48rem) {
  .cs__row {
    grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
    align-items: baseline;
  }
}

.cs__term {
  font-weight: 500;
}

.cs__detail {
  margin: 0;
  color: var(--c-muted);
  max-width: 62ch;
}

/* ── Media ─────────────────────────────────────────────────────────────── */

.cs__media {
  display: grid;
  gap: clamp(1.25rem, 3vw, 2.25rem);
}

@media (min-width: 48rem) {
  .cs__media[data-layout='pair'] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }

  .cs__media[data-layout='trio'] {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
  }

  .cs__media[data-layout='grid'] {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    align-items: start;
  }
}
</style>
