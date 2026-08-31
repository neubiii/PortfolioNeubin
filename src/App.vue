<script setup lang="ts">
import { RouterView } from 'vue-router'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ContactBlock from '@/components/layout/ContactBlock.vue'
import GrainOverlay from '@/components/ui/GrainOverlay.vue'
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

  <ContactBlock />
  <SiteFooter />
</template>

<style scoped>
#main {
  outline: none;
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
