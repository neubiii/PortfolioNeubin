<script setup lang="ts">
/**
 * The LinkedIn mark beside a writing entry's source. Decorative: the label
 * next to it carries the meaning.
 */
import { Linkedin } from 'lucide-vue-next'
</script>

<template>
  <Linkedin class="mark" />
</template>

<style scoped>
.mark {
  width: 1.05em;
  height: 1.05em;
  flex: none;
  /* Optical alignment against a cap height, not the baseline. */
  transform: translateY(0.1em);
}
</style>
