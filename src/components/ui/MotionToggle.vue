<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next'
import { useMotion } from '@/composables/useMotion'

/**
 * Pause / resume the hero's flock.
 *
 * The button names the action it will perform, which is the standard
 * media-control pattern and needs no `aria-pressed`: the accessible name
 * changes with the state. Rendered only where WebGL exists, so it never offers
 * to resume something that could not run.
 */
const { active, supported, toggle, label } = useMotion()
</script>

<template>
  <button v-if="supported" type="button" class="motion" @click="toggle">
    <span class="motion__glyph">
      <Pause v-if="active" fill="currentColor" stroke="none" />
      <Play v-else fill="currentColor" stroke="none" />
    </span>
    <span class="motion__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.motion {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding-inline: 0.25rem;
  margin-inline: -0.25rem;
  font-family: var(--font-sans);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-muted);
  transition: color var(--dur) var(--ease-out);
}

.motion:hover,
.motion:focus-visible {
  color: var(--c-ink);
}

.motion__glyph {
  display: block;
  width: 0.68rem;
  height: 0.68rem;
  flex: none;
  color: var(--c-accent);
}

.motion__glyph svg {
  width: 100%;
  height: 100%;
  display: block;
}

.motion__label {
  white-space: nowrap;
}
</style>
