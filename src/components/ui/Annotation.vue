<script setup lang="ts">
/**
 * A hand-drawn maroon underline that draws itself once, after the hero has
 * settled. It is the site's one authored motion moment: it points at the word
 * that carries the positioning, which is a job a decorative animation does not do.
 *
 * Under reduced motion the stroke is simply rendered complete.
 */
withDefaults(defineProps<{ delay?: number }>(), { delay: 900 })
</script>

<template>
  <span class="annotate">
    <span class="annotate__word"><slot /></span>
    <svg
      class="annotate__mark"
      viewBox="0 0 300 22"
      preserveAspectRatio="none"
      aria-hidden="true"
      :style="{ '--annotate-delay': `${delay}ms` }"
    >
      <path
        d="M4 14.5 C 58 6.5, 128 4.5, 205 8 C 244 9.8, 276 12.5, 296 16"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<style scoped>
.annotate {
  position: relative;
  display: inline-block;
  color: var(--c-accent);
}

.annotate__word {
  position: relative;
  z-index: 1;
  color: var(--c-ink);
}

.annotate__mark {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.06em;
  width: 100%;
  height: 0.22em;
  overflow: visible;
}

.annotate__mark path {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  animation: draw 720ms var(--ease-out) forwards;
  animation-delay: var(--annotate-delay, 900ms);
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .annotate__mark path {
    stroke-dashoffset: 0;
    animation: none;
  }
}
</style>
