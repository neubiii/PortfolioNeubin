<script setup lang="ts">
/** Paper grain: the one ambient treatment on the site. Static, GPU-cheap and
 *  pointer-transparent. */
</script>

<template>
  <div class="grain" aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <filter id="grain-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-noise)" />
    </svg>
  </div>
</template>

<style scoped>
.grain {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  opacity: var(--grain-opacity);
  mix-blend-mode: multiply;
}

[data-theme='dark'] .grain {
  mix-blend-mode: screen;
}
</style>
