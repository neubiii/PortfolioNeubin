<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MediaFrame from '@/components/ui/MediaFrame.vue'
import { categories, projectsIn, type CategoryId } from '@/data/projects'

/**
 * The one place work is browsed.
 *
 * Categories are a filter over the same list, not three components: an entry's
 * `discipline` decides which tab it appears under, so Phase 2 adds development
 * work and writing by adding data, with no layout change here.
 *
 * Above 75rem the composition is three columns — half the index, the preview,
 * the other half — so the last project sits at the same eye level as the first
 * instead of trailing a long single list. Below that the preview column is
 * dropped and each row carries its own image, because a touch visitor has no
 * hover to discover imagery with.
 */
const active = ref<CategoryId>('ux')
const tabs = ref<(HTMLButtonElement | null)[]>([])

const visible = computed(() => projectsIn(active.value))
const activeCategory = computed(
  () => categories.find((c) => c.id === active.value) ?? categories[0],
)

const half = computed(() => Math.ceil(visible.value.length / 2))

/** Two groups so the grid can place them in columns 1 and 3. 5 → 3 / 2. */
const groups = computed(() => [
  visible.value.slice(0, half.value),
  visible.value.slice(half.value),
])

const previewSlug = ref<string | null>(null)
const preview = computed(
  () => visible.value.find((p) => p.slug === previewSlug.value) ?? visible.value[0],
)

// A selection from the previous category is meaningless in this one.
watch(active, () => (previewSlug.value = null))

const tabId = (id: string) => `works-tab-${id}`

/** Roving tabindex: arrows move and select, as a tablist should. */
const onTabKey = (event: KeyboardEvent, index: number) => {
  const last = categories.length - 1
  let next: number
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = last
  else return
  event.preventDefault()
  active.value = categories[next].id
  tabs.value[next]?.focus()
}
</script>

<template>
  <section id="work" class="works" aria-labelledby="works-title">
    <div class="shell">
      <!-- A ruler row, not an introduction. The projects are the content. -->
      <div class="works__head">
        <h2 id="works-title" class="label works__title">Work</h2>
        <p class="mono works__count">
          {{ visible.length }} {{ active === 'writing' ? 'posts' : 'projects' }}
        </p>
      </div>

      <!-- Category nav: type on a rule, with the active item carrying the
           accent underline. The same language as the rest of the site's
           navigation — no chips. -->
      <div class="works__tabs" role="tablist" aria-label="Filter work by category">
        <button
          v-for="(category, i) in categories"
          :key="category.id"
          :ref="(el) => (tabs[i] = el as HTMLButtonElement | null)"
          :id="tabId(category.id)"
          type="button"
          role="tab"
          class="tab"
          :aria-selected="active === category.id"
          :aria-controls="'works-panel'"
          :tabindex="active === category.id ? 0 : -1"
          :data-active="active === category.id"
          @click="active = category.id"
          @keydown="onTabKey($event, i)"
        >
          <span>{{ category.label }}</span>
          <span class="mono tab__count">{{ projectsIn(category.id).length }}</span>
        </button>
      </div>

      <div id="works-panel" role="tabpanel" :aria-labelledby="tabId(active)">
        <Transition name="fade" mode="out-in">
          <!-- Populated category -->
          <div v-if="visible.length" :key="active" class="works__grid" @mouseleave="previewSlug = null">
            <ol
              v-for="(group, side) in groups"
              :key="side"
              class="works__col"
              :start="side === 0 ? 1 : half + 1"
              :data-side="side === 0 ? 'left' : 'right'"
            >
              <li v-for="project in group" :key="project.slug">
                <RouterLink
                  :to="`/work/${project.slug}`"
                  class="entry"
                  :data-dim="previewSlug !== null && previewSlug !== project.slug"
                  @mouseenter="previewSlug = project.slug"
                  @focus="previewSlug = project.slug"
                >
                  <p class="mono entry__meta">
                    <span class="entry__index">{{ project.index }}</span>
                    <span class="entry__rule" aria-hidden="true" />
                    <span>{{ project.year }}</span>
                  </p>

                  <h3 class="display entry__title">{{ project.title }}</h3>

                  <ul class="entry__tags">
                    <li v-for="tag in project.tags" :key="tag" class="mono entry__tag">{{ tag }}</li>
                  </ul>

                  <p class="mono entry__kind">
                    {{ project.presentation === 'case-study' ? 'Case study' : 'Visual study' }}
                    <span class="entry__arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M4 12h15M13 6l6 6-6 6" stroke-linecap="square" />
                      </svg>
                    </span>
                  </p>

                  <!-- Below the preview breakpoint the image belongs to the row. -->
                  <div class="entry__media">
                    <MediaFrame :item="project.cover" ratio="16/10" fit="cover" />
                    <p class="entry__hook">{{ project.hook }}</p>
                  </div>
                </RouterLink>
              </li>
            </ol>

            <!-- The visual centre. A fixed 16:10 stage the cover fills, so the
                 stage is dimensionally stable while every project still uses
                 the whole of it. -->
            <div class="works__preview">
              <RouterLink
                v-if="preview"
                :to="`/work/${preview.slug}`"
                class="preview"
                :aria-label="`View ${preview.title}`"
              >
                <div class="preview__stage">
                  <Transition name="fade" mode="out-in">
                    <MediaFrame
                      :key="preview.slug"
                      :item="{ ...preview.cover, alt: '', caption: undefined }"
                      ratio="16/10"
                      fit="cover"
                      :flag="false"
                    />
                  </Transition>
                </div>

                <Transition name="fade" mode="out-in">
                  <div :key="preview.slug" class="preview__body">
                    <p class="mono preview__name">{{ preview.title }}</p>
                    <p class="preview__hook">{{ preview.hook }}</p>
                  </div>
                </Transition>
              </RouterLink>
            </div>
          </div>

          <!-- Empty category. One honest line on a rule — no skeletons, no
               placeholder cards standing in for work that does not exist. -->
          <p v-else :key="`${active}-empty`" class="mono works__empty">
            {{ activeCategory.empty }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.works {
  padding-block: clamp(3.5rem, 7vw, 6rem);
}

/* ── Head ──────────────────────────────────────────────────────────────── */

.works__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1.5rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid var(--c-rule-strong);
}

.works__title {
  color: var(--c-accent);
  margin: 0;
}

.works__count {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── Category nav ──────────────────────────────────────────────────────── */

.works__tabs {
  display: flex;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  border-bottom: 1px solid var(--c-rule);
  margin-bottom: clamp(1.75rem, 3vw, 2.75rem);
  overflow-x: auto;
  scrollbar-width: none;
}

.works__tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  white-space: nowrap;
  /* Padding, not min-height: it gives the 44px target while keeping the
     underline tight under the label. `min-height` stretched the box and left
     the accent rule floating well below the word it belongs to. */
  padding-block: 0.8rem;
  /* The active rule sits on the tablist's own border, so the underline reads
     as part of the ruler rather than as a separate widget. */
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  color: var(--c-muted);
  font-weight: 500;
  font-size: var(--t-sm);
  transition:
    color var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out);
}

.tab:hover {
  color: var(--c-ink);
}

.tab[data-active='true'] {
  color: var(--c-accent);
  border-bottom-color: var(--c-accent);
}

.tab__count {
  font-size: var(--t-xs);
  color: var(--c-muted);
}

/* ── Empty category ────────────────────────────────────────────────────── */

/* Closed off by a rule so the category still reads as a section with an
   answer in it, rather than as the page running out of content. */
.works__empty {
  color: var(--c-muted);
  font-size: var(--t-sm);
  padding-block: clamp(1.5rem, 3vw, 2.25rem);
  border-bottom: 1px solid var(--c-rule);
  max-width: 46ch;
}

/* ── Composition ───────────────────────────────────────────────────────── */

.works__grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
}

@media (min-width: 75rem) {
  .works__grid {
    grid-template-columns: minmax(0, 5fr) minmax(0, 8fr) minmax(0, 5fr);
    column-gap: clamp(2rem, 4vw, 3.5rem);
    align-items: start;
  }

  .works__col[data-side='left'] {
    grid-column: 1;
  }

  .works__preview {
    grid-column: 2;
    grid-row: 1;
  }

  .works__col[data-side='right'] {
    grid-column: 3;
    grid-row: 1;
  }
}

.works__col {
  border-top: 1px solid var(--c-rule);
}

/* An odd split leaves the right column one row shorter; without this the
   column simply ends early, which reads as a missing rule. */
.works__col:empty {
  display: none;
}

/* ── Entry ─────────────────────────────────────────────────────────────── */

.entry {
  display: block;
  padding-block: clamp(1.1rem, 2vw, 1.5rem);
  border-bottom: 1px solid var(--c-rule);
  transition: opacity var(--dur) var(--ease-out);
}

/* Dim the rest only once the visitor is actually pointing at one, and only
   where the preview exists to reward it. */
@media (hover: hover) and (min-width: 75rem) {
  .entry[data-dim='true'] {
    opacity: 0.4;
  }
}

.entry__meta {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--c-muted);
  font-size: var(--t-xs);
  margin-bottom: 0.5rem;
}

.entry__index {
  color: var(--c-accent);
  font-weight: 500;
}

.entry__rule {
  flex: 1;
  max-width: 2.5rem;
  height: 1px;
  background: var(--c-rule-strong);
}

.entry__title {
  font-size: var(--t-xl);
  transition:
    color var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

@media (hover: hover) {
  .entry:hover .entry__title,
  .entry:focus-visible .entry__title {
    color: var(--c-accent);
    transform: translateX(0.35rem);
  }
}

.entry__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0;
  margin-top: 0.6rem;
}

.entry__tag {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding-inline: 0.6rem;
  border-left: 1px solid var(--c-rule);
}

.entry__tag:first-child {
  padding-left: 0;
  border-left: 0;
}

.entry__kind {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.entry__arrow {
  width: 1rem;
  height: 1rem;
  opacity: 0;
  transform: translateX(-0.4rem);
  transition:
    opacity var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

.entry:hover .entry__arrow,
.entry:focus-visible .entry__arrow {
  opacity: 1;
  transform: none;
  color: var(--c-accent);
}

/* ── Row image — the touch-friendly path ───────────────────────────────── */

.entry__media {
  display: grid;
  gap: 0.85rem;
  margin-top: 1.1rem;
}

@media (min-width: 75rem) {
  .entry__media {
    display: none;
  }
}

.entry__hook {
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.55;
  max-width: 52ch;
}

/* ── Preview ───────────────────────────────────────────────────────────── */

.works__preview {
  display: none;
}

@media (min-width: 75rem) {
  .works__preview {
    display: block;
    position: sticky;
    top: 6rem;
  }
}

.preview {
  display: block;
}

.preview__stage {
  min-width: 0;
}

.preview__body {
  margin-top: 1.1rem;
}

.preview__name {
  color: var(--c-accent);
  font-size: var(--t-xs);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.preview__hook {
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.55;
  max-width: 54ch;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms var(--ease-out);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
