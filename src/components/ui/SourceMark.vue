<script setup lang="ts">
/**
 * The LinkedIn mark, drawn rather than imported — a whole icon package for one
 * glyph is not worth the bytes.
 *
 * Monochrome and `currentColor` on purpose: it inherits the maroon and ink of
 * whatever it sits in, so the source is legible without dropping LinkedIn's
 * blue into an otherwise editorial palette. Decorative — the visible label
 * beside it carries the meaning.
 */
</script>

<template>
  <svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <rect x="1.4" y="1.4" width="21.2" height="21.2" rx="3.6" fill="none" stroke="currentColor" stroke-width="1.7" />
    <circle cx="7.3" cy="7.4" r="1.55" fill="currentColor" />
    <rect x="6" y="10.2" width="2.6" height="7.6" fill="currentColor" />
    <path
      d="M10.9 10.2h2.5v1.1a3.4 3.4 0 0 1 5.6 2.6v3.9h-2.6v-3.5a1.5 1.5 0 0 0-3 0v3.5h-2.5z"
      fill="currentColor"
    />
  </svg>
</template>

<style scoped>
.mark {
  width: 1.05em;
  height: 1.05em;
  flex: none;
  /* Optical alignment against a mono cap height, not the baseline. */
  transform: translateY(0.1em);
}
</style>
