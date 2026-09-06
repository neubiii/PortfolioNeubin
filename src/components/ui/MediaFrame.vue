<script setup lang="ts">
import { computed, ref } from 'vue'
import { asset, isPlaceholder } from '@/data/assets'
import type { MediaItem } from '@/types'

/**
 * Presents one image.
 *
 * The screenshot is the visual. There is no decorative frame, no background
 * behind it, no forced height, and nothing is cropped to fill a box — a phone
 * screen at 786×1704 renders at 786×1704's aspect and stops there.
 *
 * Three modes, chosen by the data rather than inferred from the aspect ratio:
 *
 * - `natural` (default) — intrinsic aspect, borderless. Every case-study image.
 * - `longform` — a page capture too tall to sit inline (evergrove/page is
 *   2882×8958 ≈ eight screens). Collapsed to a readable height with an explicit
 *   expand control. Deliberately NOT an inner scroll container: one of those
 *   swallows the wheel while the pointer is over it, which is exactly the
 *   scroll trap this component used to have.
 * - `crop` — a cropped tile at a ratio the caller supplies, for the work index,
 *   where a single shared rhythm matters more than each cover's own shape.
 *
 * `ratio` only reserves space before load. It is dropped the moment the browser
 * knows the real dimensions, so a stale value in the data can never distort an
 * image the owner swaps in later.
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
    <!-- crop: the only mode with a box of its own. -->
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
      <p v-if="pending" class="mono frame__pending">Placeholder</p>
    </div>

    <!-- longform: collapsed by height, expanded by a real button. No inner
         scroller, so the wheel always belongs to the page. -->
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
        <span class="frame__expand-icon" :data-open="expanded" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 9l6 6 6-6" stroke-linecap="square" />
          </svg>
        </span>
      </button>
    </div>

    <!-- natural: just the image. -->
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

/* `display: block` on every image: an inline image sits on the text baseline
   and leaves a few pixels of descender gap under it, which reads as stray
   padding inside a figure. */
.frame__img {
  display: block;
  width: 100%;
  height: auto;
  background: none;
  border: 0;
}

/* ── Crop — the work index only ────────────────────────────────────────── */

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

/* ── Longform ──────────────────────────────────────────────────────────── */

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
   of the clip rather than as a caption below an arbitrary cut. */
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

/* ── Caption ───────────────────────────────────────────────────────────── */

.frame__caption {
  margin-top: 0.85rem;
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.5;
  max-width: 60ch;
}
</style>
