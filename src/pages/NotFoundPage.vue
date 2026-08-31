<script setup lang="ts">
import ArrowLink from '@/components/ui/ArrowLink.vue'
</script>

<template>
  <div class="shell nf">
    <p class="label nf__code">Error 404</p>
    <h1 class="display nf__title">This page took a wrong turn.</h1>
    <p class="lede nf__text">
      The link is broken or the page has moved. The work is all still where it should be.
    </p>
    <div class="nf__actions">
      <ArrowLink to="/#work" size="lg">View the work</ArrowLink>
      <ArrowLink to="/">Back home</ArrowLink>
    </div>
  </div>
</template>

<style scoped>
.nf {
  padding-block: clamp(5rem, 14vw, 11rem);
  max-width: 46rem;
}

.nf__code {
  color: var(--c-accent);
  padding-bottom: 1.25rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--c-rule);
}

.nf__title {
  font-size: var(--t-3xl);
  margin-bottom: 1.5rem;
}

.nf__text {
  color: var(--c-muted);
}

.nf__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
  margin-top: 3rem;
}
</style>
