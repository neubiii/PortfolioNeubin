<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MediaFrame from '@/components/ui/MediaFrame.vue'
import type { Project } from '@/types'

/**
 * Featured project, editorial row.
 *
 * `flip` mirrors the composition so consecutive rows do not read as a repeated
 * card. The whole row is one link target — there is nothing else to click
 * inside it, so a single anchor keeps the tab order short.
 */
withDefaults(defineProps<{ project: Project; flip?: boolean; eager?: boolean }>(), {
  flip: false,
  eager: false,
})
</script>

<template>
  <RouterLink :to="`/work/${project.slug}`" class="row group" :data-flip="flip">
    <div class="row__media">
      <MediaFrame :item="project.cover" ratio="16/10" interactive :eager="eager" />
    </div>

    <div class="row__body">
      <p class="mono row__index">
        <span class="row__index-num">{{ project.index }}</span>
        <span class="row__index-rule" aria-hidden="true" />
        <span>{{ project.year }}</span>
      </p>

      <h3 class="display row__title">{{ project.title }}</h3>

      <p class="row__hook">{{ project.hook }}</p>

      <ul class="row__tags">
        <li v-for="tag in project.tags" :key="tag" class="mono row__tag">{{ tag }}</li>
        <li class="mono row__tag row__tag--accent">
          {{ project.presentation === 'case-study' ? 'Case study' : 'Visual study' }}
        </li>
      </ul>

      <span class="row__cta">
        <span class="row__cta-text">View project</span>
        <span class="row__cta-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 12h15M13 6l6 6-6 6" stroke-linecap="square" />
          </svg>
        </span>
      </span>
    </div>
  </RouterLink>
</template>

<style scoped>
.row {
  display: grid;
  gap: clamp(1.5rem, 3vw, 2.5rem);
  padding-top: 2rem;
  border-top: 1px solid var(--c-rule);
}

@media (min-width: 56rem) {
  .row {
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    column-gap: clamp(2rem, 5vw, 5rem);
    align-items: start;
  }

  /* Mirror by reordering the grid children, not by reversing the DOM — the
     reading order stays image-then-text in every case. */
  .row[data-flip='true'] .row__media {
    order: 2;
  }

  .row[data-flip='true'] .row__body {
    order: 1;
  }
}

.row__index {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--c-muted);
  margin-bottom: 1.25rem;
}

.row__index-num {
  color: var(--c-accent);
  font-weight: 500;
}

.row__index-rule {
  flex: 1;
  max-width: 3rem;
  height: 1px;
  background: var(--c-rule-strong);
}

.row__title {
  font-size: var(--t-2xl);
  margin-bottom: 1rem;
  transition: color var(--dur) var(--ease-out);
}

.row:hover .row__title,
.row:focus-visible .row__title {
  color: var(--c-accent);
}

.row__hook {
  color: var(--c-muted);
  max-width: 46ch;
  margin-bottom: 1.5rem;
}

.row__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0;
}

/* Hairline separators instead of pills. */
.row__tag {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding-inline: 0.75rem;
  border-left: 1px solid var(--c-rule);
}

.row__tag:first-child {
  padding-left: 0;
  border-left: 0;
}

.row__tag--accent {
  color: var(--c-accent);
}


.row__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 2rem;
  font-weight: 500;
  font-size: var(--t-sm);
}

.row__cta-text {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 0% 1px;
  transition: background-size var(--dur) var(--ease-out);
  padding-bottom: 0.15em;
}

.row:hover .row__cta-text,
.row:focus-visible .row__cta-text {
  background-size: 100% 1px;
}

.row__cta-arrow {
  width: 1em;
  height: 1em;
  transition: transform var(--dur) var(--ease-out);
}

.row:hover .row__cta-arrow,
.row:focus-visible .row__cta-arrow {
  transform: translateX(4px);
}
</style>
