<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * A single, restrained entrance: content lifts a few pixels into place once,
 * the first time it is scrolled to. Never on a loop, never on every element.
 *
 * Under `prefers-reduced-motion` the CSS collapses the transition, so the
 * content is simply present — the observer still fires and the class still
 * lands, which keeps the markup identical between the two modes.
 */
const props = withDefaults(defineProps<{ delay?: number; as?: string }>(), {
  delay: 0,
  as: 'div',
})

const el = ref<HTMLElement | null>(null)
const shown = ref(false)

const { stop } = useIntersectionObserver(
  el,
  ([entry]) => {
    if (!entry?.isIntersecting) return
    shown.value = true
    stop()
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
)
</script>

<template>
  <component
    :is="props.as"
    ref="el"
    class="reveal"
    :class="{ 'is-shown': shown }"
    :style="{ '--reveal-delay': `${props.delay}ms` }"
  >
    <slot />
  </component>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(14px);
  transition:
    opacity var(--dur-slow) var(--ease-out) var(--reveal-delay, 0ms),
    transform var(--dur-slow) var(--ease-out) var(--reveal-delay, 0ms);
}

.reveal.is-shown {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
  }
}
</style>
