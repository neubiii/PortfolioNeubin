<script setup lang="ts">
import { computed } from 'vue'
import { useMotion } from '@/composables/useMotion'
import { profile } from '@/data/profile'

const year = new Date().getFullYear()

/**
 * `useMotion().active` also asks for WebGL, because it answers for the hero's
 * flock. A scroll needs no canvas, so this asks the narrower question: has the
 * visitor paused motion, or does the system say reduce?
 */
const { preference, reducedMotion } = useMotion()
const motionOk = computed(
  () => preference.value === 'on' || (preference.value === 'system' && !reducedMotion.value),
)

/**
 * Back to top. The scroll is smooth only when motion is welcome — under a
 * reduced-motion preference it jumps, which is the point of the setting.
 *
 * Focus moves with it. Scrolling alone leaves the keyboard caret in the footer,
 * so the next Tab would land back where it started; `#main` is the same target
 * the skip link uses and it carries `tabindex="-1"` for exactly this.
 * `preventScroll` lets the smooth scroll play instead of being pre-empted by
 * the jump that focusing would otherwise cause.
 */
const toTop = () => {
  document.getElementById('main')?.focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: motionOk.value ? 'smooth' : 'auto' })
}
</script>

<template>
  <footer class="footer">
    <div class="shell footer__inner">
      <p class="mono footer__item">© {{ year }} {{ profile.name }}</p>

      <!-- A control, not a destination — so a button, set as plain text at the
           opposite end of the rule. `link-grow` is the site's own nav rule: it
           keeps a 44px target while the underline still sits tight under the
           text rather than at the foot of the hit area. -->
      <button type="button" class="mono footer__item footer__top link-grow" @click="toTop">
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--c-paper);
  /* Lighter than it was: the Back to top control carries its own 2.75rem
     target, so the row keeps the height the footer already had. */
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
  /* Flex drops the whitespace between the label and its arrow — put it back. */
  gap: 0.35rem;
  cursor: pointer;
  transition: color var(--dur) var(--ease-out);
}

.footer__top:hover,
.footer__top:focus-visible {
  color: var(--c-ink);
}
</style>
