<script setup lang="ts">
import { useMotion } from '@/composables/useMotion'

/**
 * Pause / resume the hero's decorative flock.
 *
 * Set in the hero's ruler foot, in the same mono the rest of that row uses —
 * a line of type on the page's own grid, not a floating pill. The button names
 * the action it will perform ("Pause motion" / "Resume motion"), which is the
 * standard media-control pattern and needs no `aria-pressed` to be understood:
 * the accessible name changes with the state.
 *
 * It renders only where WebGL exists, so it never offers to resume something
 * that could not run in the first place.
 */
const { active, supported, toggle, label } = useMotion()
</script>

<template>
  <button v-if="supported" type="button" class="motion" @click="toggle">
    <span class="motion__glyph" aria-hidden="true">
      <svg v-if="active" viewBox="0 0 12 12" fill="currentColor">
        <rect x="2" y="1.5" width="2.6" height="9" />
        <rect x="7.4" y="1.5" width="2.6" height="9" />
      </svg>
      <svg v-else viewBox="0 0 12 12" fill="currentColor">
        <path d="M2.5 1.5 L10.5 6 L2.5 10.5 Z" />
      </svg>
    </span>
    <span class="motion__label">{{ label }}</span>
  </button>
</template>

<style scoped>
.motion {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  /* Comfortable target without disturbing the ruler row's baseline. */
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
