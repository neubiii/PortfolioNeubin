<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import type { ProjectLink } from '@/types'

/**
 * The calls to action for a project, rendered from its `links` array. One
 * component for both page shapes — the rail and the gallery standfirst. A
 * project with no links renders nothing.
 */
const props = withDefaults(
  defineProps<{
    links: ProjectLink[]
    /** `rail` fills the column; `inline` sits in a row under the intro. */
    layout?: 'rail' | 'inline'
  }>(),
  { layout: 'rail' },
)

/** A blank href would render a button that goes nowhere — drop it instead. */
const ready = computed(() => props.links.filter((l) => l.href.trim().length > 0))
</script>

<template>
  <ul v-if="ready.length" class="cta" :data-layout="layout">
    <li v-for="link in ready" :key="link.href">
      <a :href="link.href" target="_blank" rel="noopener noreferrer" class="cta__link">
        <span>{{ link.label }}</span>
        <ArrowUpRight class="cta__mark" />
        <span class="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.cta {
  display: grid;
  gap: 0.5rem;
}

.cta[data-layout='inline'] {
  grid-auto-flow: column;
  justify-content: start;
  gap: 0.75rem;
}

/* Wrapping matters more than the row on a narrow screen. */
@media (max-width: 34rem) {
  .cta[data-layout='inline'] {
    grid-auto-flow: row;
  }
}

.cta__link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  min-height: 2.75rem;
  padding: 0.7rem 1.1rem;
  background: var(--c-cta);
  color: var(--c-on-deep);
  font-weight: 500;
  font-size: var(--t-sm);
  transition: background-color var(--dur) var(--ease-out);
}

.cta[data-layout='inline'] .cta__link {
  justify-content: center;
}

.cta__link:hover,
.cta__link:focus-visible {
  background: var(--c-cta-hover);
}

.cta__mark {
  transition: transform var(--dur) var(--ease-out);
}

.cta__link:hover .cta__mark,
.cta__link:focus-visible .cta__mark {
  transform: translate(0.15rem, -0.15rem);
}

@media (prefers-reduced-motion: reduce) {
  .cta__mark {
    transition: none;
  }

  .cta__link:hover .cta__mark,
  .cta__link:focus-visible .cta__mark {
    transform: none;
  }
}
</style>
