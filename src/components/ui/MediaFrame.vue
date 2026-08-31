<script setup lang="ts">
import { computed } from 'vue'
import { asset, isPlaceholder } from '@/data/assets'
import type { MediaItem } from '@/types'

/**
 * Every image on the site sits in this frame: a flat surface, one hairline,
 * square corners, no shadow. The only interaction is a slow inner scale on
 * hover, which reads as the image breathing inside a fixed crop rather than
 * the whole card lifting off the page.
 *
 * Two behaviours worth knowing about:
 *
 * - `ratio` overrides the asset's own aspect so a row of covers crops to one
 *   consistent shape. The index would otherwise go lumpy the moment a project
 *   ships a 4:3 cover next to a 21:9 one.
 * - A very tall asset — a full landing page at 1441×4479 — is put in a capped,
 *   scrollable viewport instead of being allowed to run for five screens. The
 *   page is still readable end to end; it just does not hijack the document.
 *
 * While an asset is still a placeholder the frame says so, quietly. That is
 * more honest than presenting a stand-in as finished work, and it disappears
 * on its own the moment the real export is dropped in.
 */
const props = withDefaults(
  defineProps<{
    item: MediaItem
    interactive?: boolean
    eager?: boolean
    flag?: boolean
    /** Force a crop, e.g. `16/10`. Overrides the item's own ratio. */
    ratio?: string
  }>(),
  { interactive: false, eager: false, flag: true },
)

const src = computed(() => asset(props.item.src))
const pending = computed(() => props.flag && isPlaceholder(props.item.src))

const ratio = computed(() => props.ratio ?? props.item.ratio ?? '16/9')

const numeric = computed(() => {
  const [w, h] = ratio.value.split('/').map(Number)
  return w && h ? w / h : 16 / 9
})

/** Taller than roughly 1:1.9 — a full page shot rather than a screen. */
const tall = computed(() => !props.ratio && numeric.value < 0.53)
</script>

<template>
  <figure class="frame" :data-interactive="interactive" :data-tall="tall">
    <div class="frame__crop" :style="tall ? undefined : { aspectRatio: ratio }">
      <div class="frame__scroll" :class="{ 'frame__scroll--tall': tall }">
        <img
          v-if="src"
          :src="src"
          :alt="item.alt"
          :aria-hidden="item.alt === '' ? 'true' : undefined"
          :loading="eager ? 'eager' : 'lazy'"
          :decoding="eager ? 'sync' : 'async'"
          :style="tall ? undefined : { objectFit: item.fit ?? 'cover' }"
        />
      </div>
      <p v-if="pending" class="mono frame__pending">Placeholder</p>
    </div>

    <figcaption v-if="item.caption || tall" class="frame__caption">
      <span v-if="item.caption">{{ item.caption }}</span>
     <!--<span v-if="tall" class="mono frame__scroll-hint">Scroll to see the full page</span>-->
    </figcaption>
  </figure>
</template>

<style scoped>
.frame {
  margin: 0;
  min-width: 0;
}

.frame__crop {
  position: relative;
  overflow: hidden;
  background: var(--c-surface);
  border: 1px solid var(--c-rule);
}

.frame__scroll {
  width: 100%;
  height: 100%;
}

.frame__scroll img {
  width: 100%;
  height: 100%;
  transition: transform var(--dur-slow) var(--ease-out);
}

/* A full-page shot lives in its own scroll viewport rather than adding five
   screens to the document. */
.frame__scroll--tall {
  height: min(78vh, 46rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.frame__scroll--tall img {
  height: auto;
  transition: none;
}

.frame__pending {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 0.3rem 0.6rem;
  background: var(--c-accent);
  color: var(--c-on-deep);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

@media (hover: hover) {
  .frame[data-interactive='true']:not([data-tall='true']):hover .frame__scroll img,
  .frame[data-interactive='true']:not([data-tall='true']):focus-within .frame__scroll img {
    transform: scale(1.028);
  }
}

.frame__caption {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.5rem;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 0.85rem;
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.5;
}

.frame__caption > span:first-child {
  max-width: 56ch;
}

.frame__scroll-hint {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
