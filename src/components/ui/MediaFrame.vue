<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { asset, isPlaceholder } from '@/data/assets'
import type { MediaItem } from '@/types'

/**
 * Presents one image: intrinsic aspect, no frame, no background, nothing
 * cropped to fill a box. The three display modes are described on `MediaItem`
 * in `@/types`; `ratio` only reserves space before load and is dropped once
 * the browser knows the real dimensions.
 */
const props = withDefaults(
  defineProps<{
    item: MediaItem
    interactive?: boolean
    eager?: boolean
    flag?: boolean
    /** Forces `crop` mode at this aspect, e.g. `16/10`. */
    ratio?: string
    /** How the image sits inside a `crop` box. `contain` never crops. */
    fit?: 'cover' | 'contain'
    /** Focal point for a cropped image. Falls back to the item's own value. */
    position?: string
  }>(),
  { interactive: false, eager: false, flag: true, fit: 'cover' },
)

const src = computed(() => asset(props.item.src))
const pending = computed(() => props.flag && isPlaceholder(props.item.src))

const mode = computed(() => (props.ratio ? 'crop' : (props.item.display ?? 'natural')))

const loaded = ref(false)
const expanded = ref(false)

/** Reservation only — released once the intrinsic size is known. */
const reserve = computed(() =>
  mode.value === 'crop' || loaded.value ? undefined : props.item.ratio,
)

const captionId = computed(() => `cap-${props.item.src.replace(/\W+/g, '-')}`)
</script>

<template>
  <figure class="frame" :data-mode="mode" :data-interactive="interactive">
    <!-- The only mode with a box of its own. -->
    <div v-if="mode === 'crop'" class="frame__crop" :style="{ aspectRatio: ratio }">
      <img
        v-if="src"
        class="frame__img frame__img--crop"
        :style="{ objectFit: fit, objectPosition: position ?? item.previewPosition ?? 'center' }"
        :src="src"
        :alt="item.alt"
        :aria-hidden="item.alt === '' ? 'true' : undefined"
        :loading="eager ? 'eager' : 'lazy'"
        :decoding="eager ? 'sync' : 'async'"
      />
      <p v-if="pending" class="meta frame__pending">Placeholder</p>
    </div>

    <!-- Collapsed by height, expanded by a real button. Deliberately not an
         inner scroller: one of those swallows the wheel while the pointer is
         over it. -->
    <div v-else-if="mode === 'longform'" class="frame__long" :data-expanded="expanded">
      <img
        v-if="src"
        class="frame__img"
        :src="src"
        :alt="item.alt"
        :aria-hidden="item.alt === '' ? 'true' : undefined"
        loading="lazy"
        decoding="async"
        :style="{ aspectRatio: reserve }"
        @load="loaded = true"
      />
      <div v-if="!expanded" class="frame__fade" aria-hidden="true" />
      <button type="button" class="frame__expand" @click="expanded = !expanded">
        <span>{{ expanded ? 'Collapse' : 'Show full page' }}</span>
        <ChevronDown class="frame__expand-icon" :data-open="expanded" />
      </button>
    </div>

    <img
      v-else-if="src"
      class="frame__img"
      :src="src"
      :alt="item.alt"
      :aria-hidden="item.alt === '' ? 'true' : undefined"
      :aria-describedby="item.caption ? captionId : undefined"
      :loading="eager ? 'eager' : 'lazy'"
      :decoding="eager ? 'sync' : 'async'"
      :style="{ aspectRatio: reserve }"
      @load="loaded = true"
    />

    <figcaption v-if="item.caption" :id="captionId" class="frame__caption">
      {{ item.caption }}
    </figcaption>
  </figure>
</template>

<style scoped>
.frame {
  margin: 0;
  min-width: 0;
}

/* Block, not inline: an inline image sits on the text baseline and leaves a
   descender gap under it that reads as stray padding. */
.frame__img {
  display: block;
  width: 100%;
  height: auto;
  background: none;
  border: 0;
}

.frame__crop {
  position: relative;
  overflow: hidden;
  background: var(--c-surface);
  border: 1px solid var(--c-rule);
}

.frame__img--crop {
  height: 100%;
  transition: transform var(--dur-slow) var(--ease-out);
}

@media (hover: hover) {
  .frame[data-interactive='true'] .frame__crop:hover .frame__img--crop,
  .frame[data-interactive='true'] .frame__crop:focus-within .frame__img--crop {
    transform: scale(1.028);
  }
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

.frame__long {
  position: relative;
}

/* Collapsed by clipping the flow, not by scrolling it. */
.frame__long:not([data-expanded='true']) {
  max-height: min(80vh, 44rem);
  overflow: hidden;
}

.frame__fade {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 8rem;
  background: linear-gradient(to bottom, transparent, var(--c-paper));
  pointer-events: none;
}

.frame__expand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  margin-top: 0.5rem;
  font-family: var(--font-sans);
  font-size: var(--t-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-accent);
  transition: color var(--dur) var(--ease-out);
}

/* While collapsed the control sits over the fade, so it reads as the way out
   of the clip rather than as a caption under an arbitrary cut. */
.frame__long:not([data-expanded='true']) .frame__expand {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0;
}

.frame__expand:hover,
.frame__expand:focus-visible {
  color: var(--c-accent-hover);
}

.frame__expand-icon {
  width: 1em;
  height: 1em;
  transition: transform var(--dur) var(--ease-out);
}

.frame__expand-icon[data-open='true'] {
  transform: rotate(180deg);
}

.frame__caption {
  margin-top: 0.85rem;
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.5;
  max-width: 60ch;
}
</style>
