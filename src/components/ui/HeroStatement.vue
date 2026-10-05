<script setup lang="ts">
/**
 * The hero's semantic heading: one `<h1>` at the display scale, with each
 * discipline phrase held on a single line.
 */
const SEGMENTS: { text: string; hold?: boolean }[] = [
  { text: 'Neubin Sebastian is a professional ' },
  { text: 'UI/UX designer', hold: true },
  { text: ' and ' },
  { text: 'front-end developer', hold: true },
  { text: ' with industry experience.' },
]
</script>

<template>
  <h1 id="hero-title" class="display statement">
    <template v-for="(segment, i) in SEGMENTS" :key="i"
      ><span v-if="segment.hold" class="statement__hold">{{ segment.text }}</span
      ><template v-else>{{ segment.text }}</template></template
    >
  </h1>
</template>

<style scoped>
.statement {
  font-size: clamp(2.25rem, 1.05rem + 4.2vw, 5.25rem);
  /* Optical size wound up: the hairlines and contrast the display voice wants. */
  font-variation-settings:
    'opsz' 144,
    'SOFT' 0,
    'WONK' 1;
  line-height: 1.03;
  letter-spacing: -0.028em;
  margin: 0;
  text-wrap: pretty;
}

/* The two disciplines carry the accent, and neither reads as two half-phrases
   on separate lines. */
.statement__hold {
  color: var(--c-accent);
  white-space: nowrap;
}
</style>
