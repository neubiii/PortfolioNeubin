<script setup lang="ts">

const SEGMENTS: { text: string; hold?: boolean }[] = [
  { text: 'Neubin Sebastian is an experienced professional in ' },
  { text: 'UI/UX design', hold: true },
  { text: ' and ' },
  { text: 'front-end development.', hold: true },
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

/* Neither discipline reads as two half-phrases on separate lines. */
.statement__hold {
  white-space: nowrap;
}
</style>
