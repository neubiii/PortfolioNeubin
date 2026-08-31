<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MediaFrame from '@/components/ui/MediaFrame.vue'
import Reveal from '@/components/ui/Reveal.vue'
import { disciplines, projects, type DisciplineId } from '@/data/projects'

/**
 * The work index.
 *
 * The concept sheet asked for a grid of cards with a hook that follows the
 * cursor. A cursor-tethered card is unreachable by keyboard and lands under the
 * pointer at unpredictable positions, so the same idea is built as a typographic
 * index with one fixed preview: hovering *or focusing* a row raises its image
 * and hook in the right column. Every row behaves identically for mouse, touch
 * and keyboard, and the list itself carries the page.
 */
const active = ref<DisciplineId>('ux')

const visible = computed(() => projects.filter((p) => p.discipline === active.value))

const previewSlug = ref<string | null>(null)
const preview = computed(
  () => visible.value.find((p) => p.slug === previewSlug.value) ?? visible.value[0],
)

// Reset the preview when the filter changes, so it never points at a hidden row.
watch(active, () => (previewSlug.value = null))

const counts = computed(() =>
  Object.fromEntries(
    disciplines.map((d) => [d.id, projects.filter((p) => p.discipline === d.id).length]),
  ),
)
</script>

<template>
  <div class="shell page">
    <!-- ── Page head ─────────────────────────────────────────────────────── -->
    <header class="head">
      <p class="mono head__meta">Index</p>
      <h1 class="display head__title">Work</h1>
      <p class="lede head__lede">
        Product and interface design. Each entry opens either a case study or a visual
        presentation, depending on how much of the process is documented.
      </p>
    </header>

    <!-- ── Discipline filter ─────────────────────────────────────────────── -->
    <div class="filter" role="tablist" aria-label="Filter work by discipline">
      <button
        v-for="d in disciplines"
        :key="d.id"
        type="button"
        role="tab"
        class="filter__tab"
        :aria-selected="active === d.id"
        :data-active="active === d.id"
        @click="active = d.id"
      >
        <span class="filter__label">{{ d.label }}</span>
        <span class="mono filter__count" aria-hidden="true">{{ counts[d.id] }}</span>
      </button>
    </div>

    <!-- ── Index + preview ───────────────────────────────────────────────── -->
    <div v-if="visible.length" class="work">
      <ol class="work__list" @mouseleave="previewSlug = null">
        <li v-for="project in visible" :key="project.slug">
          <RouterLink
            :to="`/work/${project.slug}`"
            class="entry"
            :data-dim="previewSlug !== null && previewSlug !== project.slug"
            @mouseenter="previewSlug = project.slug"
            @focus="previewSlug = project.slug"
          >
            <p class="mono entry__index">{{ project.index }}</p>

            <div class="entry__main">
              <h2 class="display entry__title">{{ project.title }}</h2>

              <ul class="entry__tags">
                <li v-for="tag in project.tags" :key="tag" class="mono entry__tag">{{ tag }}</li>
              </ul>

              <!-- Below the preview breakpoint the image belongs in the row itself. -->
              <div class="entry__inline-media">
                <MediaFrame :item="project.cover" ratio="16/10" />
                <p class="entry__hook">{{ project.hook }}</p>
              </div>
            </div>

            <p class="mono entry__kind">
              {{ project.presentation === 'case-study' ? 'Case study' : 'Gallery' }}
            </p>

            <span class="entry__arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 12h15M13 6l6 6-6 6" stroke-linecap="square" />
              </svg>
            </span>
          </RouterLink>
        </li>
      </ol>

      <!-- Preview column. Decorative: everything in it is already in the row. -->
      <aside class="work__preview" aria-hidden="true">
        <div class="work__preview-inner">
          <Transition name="swap" mode="out-in">
            <div v-if="preview" :key="preview.slug">
              <MediaFrame :item="preview.cover" ratio="16/10" />
              <p class="work__preview-hook">{{ preview.hook }}</p>
            </div>
          </Transition>
        </div>
      </aside>
    </div>

    <!-- ── Honest empty state for the Phase 2 disciplines ────────────────── -->
    <Reveal v-else class="empty">
      <p class="label empty__marker">Phase 2</p>
      <p class="empty__text">
        Nothing here yet. The development and writing sections are being built out next — the
        index above is wired for them already.
      </p>
      <button type="button" class="empty__back" @click="active = 'ux'">
        <span class="link-underline">Back to UI/UX work</span>
      </button>
    </Reveal>
  </div>
</template>

<style scoped>
.page {
  padding-top: clamp(3rem, 7vw, 5.5rem);
  padding-bottom: var(--section-y);
}

/* ── Head ──────────────────────────────────────────────────────────────── */

.head {
  display: grid;
  gap: 1.5rem;
  padding-bottom: clamp(2.5rem, 5vw, 4rem);
}

@media (min-width: 56rem) {
  .head {
    grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
    column-gap: clamp(2rem, 6vw, 6rem);
    align-items: end;
  }
}

.head__meta {
  color: var(--c-accent);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: var(--t-xs);
  grid-column: 1 / -1;
}

.head__title {
  font-size: var(--t-4xl);
}

.head__lede {
  color: var(--c-muted);
  padding-bottom: 0.5rem;
}

/* ── Filter ────────────────────────────────────────────────────────────── */

.filter {
  display: flex;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  border-top: 1px solid var(--c-rule-strong);
  border-bottom: 1px solid var(--c-rule-strong);
  padding-block: 0.9rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
  overflow-x: auto;
}

.filter__tab {
  display: inline-flex;
  align-items: baseline;
  min-height: 2.25rem;
  gap: 0.5rem;
  white-space: nowrap;
  color: var(--c-muted);
  font-weight: 500;
  font-size: var(--t-sm);
  padding-bottom: 0.15rem;
  border-bottom: 2px solid transparent;
  transition:
    color var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out);
}

.filter__tab:hover {
  color: var(--c-ink);
}

.filter__tab[data-active='true'] {
  color: var(--c-accent);
  border-bottom-color: var(--c-accent);
}

.filter__count {
  font-size: var(--t-xs);
  color: var(--c-muted);
}

/* ── Index ─────────────────────────────────────────────────────────────── */

.work {
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
}

@media (min-width: 72rem) {
  .work {
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    column-gap: clamp(2.5rem, 6vw, 5rem);
    align-items: start;
  }
}

.work__list {
  border-top: 1px solid var(--c-rule);
}

.entry {
  position: relative;
  display: grid;
  grid-template-columns: 2.5rem minmax(0, 1fr) auto;
  gap: 0 1rem;
  align-items: baseline;
  padding-block: clamp(1.5rem, 3vw, 2.25rem);
  border-bottom: 1px solid var(--c-rule);
  transition: opacity var(--dur) var(--ease-out);
}

/* Dim the rows you are not pointing at — but only once the visitor is
   actually pointing at one, so the list opens neutral rather than half-faded.
   Above the preview breakpoint only, and never on touch. */
@media (hover: hover) and (min-width: 72rem) {
  .entry[data-dim='true'] {
    opacity: 0.42;
  }
}

.entry__index {
  color: var(--c-accent);
  font-size: var(--t-xs);
  padding-top: 0.4rem;
}

.entry__title {
  font-size: var(--t-2xl);
  transition:
    color var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

@media (hover: hover) {
  .entry:hover .entry__title,
  .entry:focus-visible .entry__title {
    color: var(--c-accent);
    transform: translateX(0.4rem);
  }
}

.entry__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0;
  margin-top: 0.75rem;
}

.entry__tag {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding-inline: 0.7rem;
  border-left: 1px solid var(--c-rule);
}

.entry__tag:first-child {
  padding-left: 0;
  border-left: 0;
}

.entry__inline-media {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
}

@media (min-width: 72rem) {
  .entry__inline-media {
    display: none;
  }
}

.entry__hook {
  color: var(--c-muted);
  font-size: var(--t-sm);
  max-width: 52ch;
}

.entry__kind {
  display: none;
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (min-width: 40rem) {
  .entry__kind {
    display: block;
  }
}

.entry__arrow {
  display: none;
}

@media (min-width: 40rem) {
  .entry__arrow {
    display: block;
    width: 1.1rem;
    height: 1.1rem;
    align-self: center;
    color: var(--c-muted);
    opacity: 0;
    transform: translateX(-0.5rem);
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
}

/* ── Preview ───────────────────────────────────────────────────────────── */

.work__preview {
  display: none;
}

@media (min-width: 72rem) {
  .work__preview {
    display: block;
  }
}

.work__preview-inner {
  position: sticky;
  top: 7rem;
}

.work__preview-hook {
  margin-top: 1.25rem;
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.55;
}


.swap-enter-active,
.swap-leave-active {
  transition: opacity 180ms var(--ease-out);
}

.swap-enter-from,
.swap-leave-to {
  opacity: 0;
}

/* ── Empty ─────────────────────────────────────────────────────────────── */

.empty {
  border-top: 1px solid var(--c-rule);
  padding-top: 2rem;
  max-width: 46ch;
}

.empty__marker {
  color: var(--c-accent);
  margin-bottom: 1rem;
}

.empty__text {
  color: var(--c-muted);
  font-size: var(--t-lg);
  line-height: 1.5;
}

.empty__back {
  margin-top: 1.75rem;
  font-size: var(--t-sm);
  font-weight: 500;
}
</style>
