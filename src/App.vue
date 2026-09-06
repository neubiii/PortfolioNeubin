<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ContactBlock from '@/components/layout/ContactBlock.vue'
import GrainOverlay from '@/components/ui/GrainOverlay.vue'
import { router } from '@/router'

/**
 * Contact and the footer close every page, so they live in the shell rather
 * than in each route. That made them the whole page for a moment on a cold
 * load: route components are imported lazily, so the shell painted while
 * `<main>` was still empty, and Contact — the only content there was — filled
 * the viewport until the chunk arrived and pushed it down a screen.
 *
 * `isReady()` settles once the first navigation has resolved, which includes
 * loading that chunk. Holding the page's closing sections until then means
 * they are never on screen without the page they close. No timeout, nothing
 * hidden: they simply are not rendered yet.
 */
const routed = ref(false)
void router.isReady().then(() => (routed.value = true))
</script>

<template>
  <GrainOverlay />
  <SiteHeader />

  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component, route }">
      <Transition name="route" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <template v-if="routed">
    <ContactBlock />
    <SiteFooter />
  </template>
</template>

<style scoped>
/**
 * Sections pay the rhythm on their top edge, which leaves the last one on a
 * page with no closing space — and the next thing down is Contact, a coloured
 * band, so its last line of text ran straight into the maroon. This is the
 * page's own closing space rather than a second padding on whichever section
 * happens to be last: one rule, the same on every route, and the same value
 * every other boundary uses.
 */
#main {
  outline: none;
  padding-bottom: var(--section-y);
}

/* Route change: a short cross-fade with a few pixels of travel. Fast enough
   that it never delays reading the next page. */
.route-enter-active,
.route-leave-active {
  transition:
    opacity 220ms var(--ease-out),
    transform 220ms var(--ease-out);
}

.route-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.route-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .route-enter-active,
  .route-leave-active {
    transition: none;
  }

  .route-enter-from,
  .route-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
