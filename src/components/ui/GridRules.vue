<script setup lang="ts">
import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

/**
 * The layout ruler.
 *
 * These are not decorative lines — the element is a `.shell`, so it inherits
 * the exact max-width and gutter every other block on the site uses. The
 * outer two rules therefore land on the real content boundary (the same axis
 * the wordmark and the headline start from), and the interior rules fall on
 * quarter divisions of that measure: columns 1, 4, 7, 10 and 13 of the site's
 * twelve-column grid.
 *
 * Five vertical rules, not thirty. An editorial layout guide, not graph paper.
 */
const props = withDefaults(
  defineProps<{
    /** Cells across the content measure. 4 cells → 5 rules. */
    columns?: number
    /** Cells below 48rem, where quarter divisions get too dense. */
    columnsSm?: number
    /** Adds ruler ticks at the top edge, design-tool style. */
    ticks?: boolean
  }>(),
  { columns: 4, columnsSm: 2, ticks: false },
)

const wide = useMediaQuery('(min-width: 48rem)')
const columns = computed(() => (wide.value ? props.columns : props.columnsSm))
</script>

<template>
  <div class="rules" aria-hidden="true">
    <div class="shell rules__shell">
      <div class="rules__grid" :style="{ '--cols': columns }">
        <span v-for="n in columns" :key="n" class="rules__cell">
          <span v-if="ticks" class="rules__tick" />
        </span>
        <span v-if="ticks" class="rules__tick rules__tick--end" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.rules {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.rules__shell {
  height: 100%;
}

.rules__grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
  height: 100%;
  /* The closing rule on the content boundary. */
  border-right: 1px solid var(--rules-color, var(--c-rule));
}

.rules__cell {
  border-left: 1px solid var(--rules-color, var(--c-rule));
}

/* Ruler ticks sit on the same axes as the rules, so the marks read as a
   measurement scale rather than as ornament. */
.rules__tick {
  position: absolute;
  top: 0;
  left: -1px;
  width: 1px;
  height: 0.7rem;
  background: var(--rules-tick, var(--c-rule-strong));
}

.rules__cell {
  position: relative;
}

.rules__tick--end {
  left: auto;
  right: -1px;
}
</style>
