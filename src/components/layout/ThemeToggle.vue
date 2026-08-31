<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme, toggle } = useTheme()

const label = computed(() =>
  theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
)
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    :aria-pressed="theme === 'dark'"
    @click="toggle"
  >
    <span class="theme-toggle__track" aria-hidden="true">
      <span class="theme-toggle__dot" />
    </span>
    <span class="label theme-toggle__text" aria-hidden="true">{{
      theme === 'dark' ? 'Dark' : 'Light'
    }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 0.25rem;
  margin-inline: -0.25rem;
  gap: 0.6rem;
  color: var(--c-muted);
  transition: color var(--dur) var(--ease-out);
}

.theme-toggle:hover,
.theme-toggle:focus-visible {
  color: var(--c-ink);
}

.theme-toggle__track {
  position: relative;
  flex: none;
  width: 2.1rem;
  height: 0.7rem;
  border: 1px solid var(--c-rule-strong);
  display: block;
}

.theme-toggle__dot {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 0.7rem;
  height: 0.7rem;
  background: var(--c-accent);
  transition: transform var(--dur) var(--ease-in-out);
}

[data-theme='dark'] .theme-toggle__dot {
  transform: translateX(1.4rem);
}

.theme-toggle__text {
  width: 3.1ch;
  line-height: 1;
  text-align: left;
}

@media (max-width: 30rem) {
  .theme-toggle__text {
    display: none;
  }
}
</style>
