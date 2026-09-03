<script setup lang="ts">
import { profile } from '@/data/profile'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="shell footer__inner">
      <p class="mono footer__item">© {{ year }} {{ profile.name }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--c-paper);
  padding-block: 1.75rem;
}

.footer__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  justify-content: space-between;
}

.footer__item {
  color: var(--c-muted);
  font-size: var(--t-xs);
}
</style>
