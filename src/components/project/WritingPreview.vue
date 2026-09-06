<script setup lang="ts">
import { computed } from 'vue'
import ProjectLinks from '@/components/project/ProjectLinks.vue'
import SourceMark from '@/components/ui/SourceMark.vue'
import { seriesPosition } from '@/data/writing'
import type { WritingEntry } from '@/types'

/**
 * The centre panel for a piece of writing.
 *
 * Writing has no screenshot to lead with, so the hook does the work the cover
 * image does elsewhere: set large in the display face, it is the one thing
 * carrying the panel. Everything under it exists to answer "why should I open
 * this" before the visitor leaves for LinkedIn.
 *
 * A piece that belongs to a series gets a faint accent ground and the run's
 * name, marked with the same tick the case-study contents rail uses: one rule
 * per part, the current one longer and in accent. That says "three posts, you
 * are looking at the second" without merging them into a single fake article,
 * and it borrows a device the site already speaks rather than bolting a
 * coloured stripe onto the side of a card.
 */
const props = defineProps<{ entry: WritingEntry }>()

const part = computed(() => seriesPosition(props.entry))

/** Reuses the project call to action, so the button is one component sitewide. */
const links = computed(() => [
  { label: `View ${props.entry.source} post`, href: props.entry.href, kind: 'writeup' as const },
])
</script>

<template>
  <article class="wp" :data-series="Boolean(entry.series)">
    <header class="wp__top">
      <p class="mono wp__source">
        <SourceMark />
        <span>{{ entry.source }}</span>
      </p>
      <p v-if="entry.series" class="mono wp__series">
        <span>{{ entry.series }}</span>
        <span v-if="part" class="wp__ticks" aria-hidden="true">
          <span
            v-for="n in part.total"
            :key="n"
            class="wp__tick"
            :data-on="n === part.index"
          />
        </span>
      </p>
    </header>

    <div class="wp__body">
      <h3 class="mono wp__title">{{ entry.title }}</h3>
      <p class="wp__hook">{{ entry.hook }}</p>
      <p class="wp__summary">{{ entry.summary }}</p>

      <ul class="wp__topics">
        <li v-for="topic in entry.topics" :key="topic" class="mono wp__topic">{{ topic }}</li>
      </ul>
    </div>

    <ProjectLinks :links="links" />
  </article>
</template>

<style scoped>
.wp {
  display: grid;
  /* Body takes the slack so the call to action sits on the floor of the panel
     whatever the summary's length — the button never wanders between items. */
  grid-template-rows: auto 1fr auto;
  gap: clamp(1.5rem, 3vw, 2.25rem);
  padding: clamp(1.4rem, 3vw, 2rem);
  /* Tall enough for the longest entry at the narrowest three-column width, so
     the panel is one fixed size: hovering down the list moves the highlight,
     never the panel's bottom edge. The slack lands above the button, which the
     `1fr` body row keeps pinned to the floor. */
  min-height: 36rem;
  background: var(--c-surface);
  border: 1px solid var(--c-rule);
}

/* The series treatment is a flat tint and the tick row above — no stripe down
   the edge, which is the one thing that would make this read as a card. */
.wp[data-series='true'] {
  background: var(--c-accent-soft);
}

/* ── Top bar ───────────────────────────────────────────────────────────── */

.wp__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--c-rule);
}

.wp__source {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.wp__series {
  display: grid;
  justify-items: end;
  gap: 0.45rem;
  color: var(--c-accent);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-align: right;
}

/* One rule per part, the current one longer — the same signal the case-study
   contents rail uses for the section you are reading. */
.wp__ticks {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.wp__tick {
  width: 0.7rem;
  height: 2px;
  background: var(--c-rule-strong);
  transition:
    width var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out);
}

.wp__tick[data-on='true'] {
  width: 1.5rem;
  background: var(--c-accent);
}

@media (prefers-reduced-motion: reduce) {
  .wp__tick {
    transition: none;
  }
}

/* ── Body ──────────────────────────────────────────────────────────────── */

.wp__body {
  align-content: start;
}

.wp__title {
  font-size: var(--t-xs);
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 1rem;
}

/* The hook is the panel's image. */
.wp__hook {
  font-family: var(--font-sans);
  font-size: clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.01em;
  max-width: 26ch;
  margin-bottom: 1.25rem;
}

.wp__summary {
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.6;
  max-width: 56ch;
}

.wp__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0;
  margin-top: 1.35rem;
}

/* Same ruled divider the project tags use, so the two previews share a rhythm. */
.wp__topic {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding-inline: 0.6rem;
  border-left: 1px solid var(--c-rule-strong);
}

.wp__topic:first-child {
  padding-left: 0;
  border-left: 0;
}
</style>
