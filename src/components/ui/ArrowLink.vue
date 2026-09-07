<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

/**
 * The site's one call-to-action shape: a ruled row whose arrow travels on
 * hover and focus. Not a pill, not a filled button.
 */
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    /** `deep` inverts for use on the maroon block. */
    tone?: 'default' | 'deep'
    size?: 'md' | 'lg'
  }>(),
  { tone: 'default', size: 'md' },
)

const isExternal = computed(() => Boolean(props.href))
const tag = computed(() => (isExternal.value ? 'a' : RouterLink))
</script>

<template>
  <component
    :is="tag"
    v-bind="
      isExternal
        ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
        : { to: props.to }
    "
    class="arrow-link group"
    :data-tone="props.tone"
    :data-size="props.size"
  >
    <span class="arrow-link__text"><slot /></span>
    <span class="arrow-link__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 12h15M13 6l6 6-6 6" stroke-linecap="square" />
      </svg>
    </span>
  </component>
</template>

<style scoped>
.arrow-link {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  padding-block: 0.7rem;
  border-bottom: 1px solid var(--c-rule-strong);
  color: var(--c-ink);
  font-family: var(--font-sans);
  font-weight: 500;
  letter-spacing: -0.005em;
  transition:
    border-color var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out),
    gap var(--dur) var(--ease-out);
}

.arrow-link[data-size='lg'] {
  font-size: var(--t-lg);
  padding-block: 0.9rem;
}

.arrow-link[data-tone='deep'] {
  color: var(--c-on-deep);
  border-color: rgb(255 255 255 / 0.32);
}

.arrow-link__arrow {
  width: 1.15em;
  height: 1.15em;
  flex: none;
  transition: transform var(--dur) var(--ease-out);
}

.arrow-link__arrow svg {
  width: 100%;
  height: 100%;
}

.arrow-link:hover,
.arrow-link:focus-visible {
  color: var(--c-accent);
  border-color: var(--c-accent);
  gap: 1.25rem;
}

.arrow-link[data-tone='deep']:hover,
.arrow-link[data-tone='deep']:focus-visible {
  color: var(--c-on-deep);
  border-color: var(--c-on-deep);
}

.arrow-link:hover .arrow-link__arrow,
.arrow-link:focus-visible .arrow-link__arrow {
  transform: translateX(3px);
}
</style>
