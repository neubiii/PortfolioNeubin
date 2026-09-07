<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ContactBlock from '@/components/layout/ContactBlock.vue'
import GrainOverlay from '@/components/ui/GrainOverlay.vue'
import { router } from '@/router'

/**
 * Contact and the footer live in the shell rather than in each route, so on a
 * cold load they were the only thing in the document while the lazily-imported
 * route was still in flight — a screenful of Contact before the page arrived.
 * `isReady()` resolves once that chunk has loaded, so they are simply not
 * rendered until the page they close exists.
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
/* Sections pay their spacing on the top edge, so the last one on a page has
   no closing space of its own — and Contact, the coloured band below, would
   meet it directly. */
#main {
  outline: none;
  padding-bottom: var(--section-y);
}

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
