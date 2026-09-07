<script setup lang="ts">
/**
 * Section opener: a hairline rule, a marker in column 1, the title beside it.
 * The marker is shared with the case-study rail rather than a decorative
 * eyebrow, and carries the section's own name.
 */
defineProps<{
  marker: string
  title: string
  /** Optional right-aligned count or note, set in mono. */
  note?: string
  /** Anchor id. The heading gets `${id}-title`, which sections label themselves by. */
  id: string
  level?: 2 | 3
}>()
</script>

<template>
  <header :id="id" class="section-head rule-t">
    <p class="label section-head__marker">{{ marker }}</p>
    <component :is="`h${level ?? 2}`" :id="`${id}-title`" class="display-soft section-head__title">
      {{ title }}
    </component>
    <p v-if="note" class="meta section-head__note">{{ note }}</p>
  </header>
</template>

<style scoped>
.section-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem 2rem;
  padding-top: 1.25rem;
  margin-bottom: clamp(2.25rem, 4vw, 3.5rem);
}

@media (min-width: 48rem) {
  .section-head {
    grid-template-columns: 9rem minmax(0, 1fr) auto;
    align-items: start;
  }
}

.section-head__marker {
  color: var(--c-accent);
  padding-top: 0.45rem;
}

.section-head__title {
  font-size: var(--t-2xl);
  max-width: 22ch;
}

.section-head__note {
  color: var(--c-muted);
  padding-top: 0.5rem;
}

@media (min-width: 48rem) {
  .section-head__note {
    text-align: right;
  }
}
</style>
