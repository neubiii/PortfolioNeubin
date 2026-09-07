<script setup lang="ts">
import { useMotion } from '@/composables/useMotion'
import { profile } from '@/data/profile'

const year = new Date().getFullYear()

/* `active` from useMotion also asks for WebGL, which answers for the hero's
   flock. A scroll needs no canvas, so ask the narrower question. */
const { motionOk } = useMotion()

/**
 * Smooth only when motion is welcome; a jump otherwise.
 *
 * Focus moves with the scroll — without it the keyboard caret stays in the
 * footer and the next Tab lands back where it started. `#main` carries
 * `tabindex="-1"` for this and for the skip link; `preventScroll` lets the
 * smooth scroll play instead of being pre-empted by focus.
 */
const toTop = () => {
  document.getElementById('main')?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: motionOk.value ? 'smooth' : 'auto' })
}
</script>

<template>
  <footer class="footer">
    <div class="shell footer__inner">
      <p class="meta footer__item">© {{ year }} {{ profile.name }}</p>

      <!-- `link-grow` keeps a 44px target while the underline stays tight
           under the text rather than at the foot of the hit area. -->
      <button type="button" class="meta footer__item footer__top link-grow" @click="toTop">
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--c-paper);
  padding-block: 1rem;
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  justify-content: space-between;
  align-items: center;
}

.footer__item {
  color: var(--c-muted);
  font-size: var(--t-xs);
}

.footer__top {
  gap: 0.35rem;
  cursor: pointer;
  transition: color var(--dur) var(--ease-out);
}

.footer__top:hover,
.footer__top:focus-visible {
  color: var(--c-ink);
}
</style>
