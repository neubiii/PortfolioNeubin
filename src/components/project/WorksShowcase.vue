<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MediaFrame from '@/components/ui/MediaFrame.vue'
import WritingPreview from '@/components/project/WritingPreview.vue'
import { categories, presentationLabel, projectsIn, type CategoryId } from '@/data/projects'
import { writing } from '@/data/writing'

/**
 * The one place work is browsed.
 *
 * Categories are a filter over the same list, not three components: an entry
 * appears under every discipline it claims. Adding work is a data change;
 * nothing here needs to know about it.
 *
 * Above 75rem the composition is three columns — half the index, the preview,
 * the other half — so the last project sits at the same eye level as the first
 * instead of trailing a long single list. Below that the preview column is
 * dropped and each row carries what the preview would have shown, because a
 * touch visitor has no hover to discover anything with.
 *
 * Writing runs through the same composition with two differences: a row is an
 * external link rather than a route, and the centre panel is typographic
 * because a LinkedIn post has no screenshot to show. Everything else — the
 * split, the hover, the dimming, the sticky column — is shared.
 */
const active = ref<CategoryId>('ux')
const tabs = ref<(HTMLButtonElement | null)[]>([])

/**
 * Numbering is per category, not global: the first project in this tab is 01
 * whichever tab it is. A stored index on the project could not do that, because
 * the same project holds a different position in each list it appears in.
 */
const ordinal = (i: number) => String(i + 1).padStart(2, '0')

const isWriting = computed(() => active.value === 'writing')

const projectRows = computed(() =>
  projectsIn(active.value).map((project, i) => ({ project, index: ordinal(i) })),
)
const writingRows = computed(() => writing.map((entry, i) => ({ entry, index: ordinal(i) })))

const count = computed(() => (isWriting.value ? writing.length : projectRows.value.length))

/** The tab counter has to know that writing is not in the project list. */
const countIn = (category: CategoryId) =>
  category === 'writing' ? writing.length : projectsIn(category).length

const activeCategory = computed(
  () => categories.find((c) => c.id === active.value) ?? categories[0],
)

const half = computed(() => Math.ceil(count.value / 2))

/** Two groups so the grid can place them in columns 1 and 3. 5 → 3 / 2. */
const split = <T,>(rows: T[]) => [rows.slice(0, half.value), rows.slice(half.value)]
const groups = computed(() => split(projectRows.value))
const writingGroups = computed(() => split(writingRows.value))

/** Whatever the pointer or focus is on: a project slug or a writing id. */
const previewKey = ref<string | null>(null)

const preview = computed(
  () =>
    (projectRows.value.find((e) => e.project.slug === previewKey.value) ?? projectRows.value[0])
      ?.project,
)
const writingPreview = computed(
  () =>
    (writingRows.value.find((e) => e.entry.id === previewKey.value) ?? writingRows.value[0])?.entry,
)

// A selection from the previous category is meaningless in this one.
watch(active, () => (previewKey.value = null))

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
        <p class="mono works__count">{{ count }} {{ isWriting ? 'posts' : 'projects' }}</p>
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
          <span class="mono tab__count">{{ countIn(category.id) }}</span>
        </button>
      </div>

      <div id="works-panel" role="tabpanel" :aria-labelledby="tabId(active)">
        <Transition name="fade" mode="out-in">
          <!-- Populated category -->
          <div v-if="count" :key="active" class="works__grid" @mouseleave="previewKey = null">
            <!-- ── Writing: external entries, typographic preview ─────────── -->
            <template v-if="isWriting">
              <ol
                v-for="(group, side) in writingGroups"
                :key="side"
                class="works__col"
                :start="side === 0 ? 1 : half + 1"
                :data-side="side === 0 ? 'left' : 'right'"
              >
                <li v-for="{ entry, index } in group" :key="entry.id">
                  <a
                    :href="entry.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="entry entry--writing"
                    :data-dim="previewKey !== null && previewKey !== entry.id"
                    :data-current="writingPreview?.id === entry.id"
                    @mouseenter="previewKey = entry.id"
                    @focus="previewKey = entry.id"
                  >
                    <p class="mono entry__meta">
                      <span class="entry__index">{{ index }}</span>
                      <span class="entry__rule" aria-hidden="true" />
                      <span :data-series="Boolean(entry.series)">
                        {{ entry.series ?? entry.source }}
                      </span>
                    </p>

                    <h3 class="display entry__title">{{ entry.title }}</h3>

                    <ul class="entry__tags">
                      <li v-for="topic in entry.topics" :key="topic" class="mono entry__tag">
                        {{ topic }}
                      </li>
                    </ul>

                    <!-- Below the preview breakpoint the row has to say what
                         the panel would have said. -->
                    <p class="entry__lede">{{ entry.hook }}</p>

                    <p class="mono entry__go">
                      <span>View {{ entry.source }} post</span>
                      <span class="entry__go-mark" aria-hidden="true">↗</span>
                    </p>
                    <span class="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              </ol>

              <div class="works__preview">
                <Transition name="fade" mode="out-in">
                  <WritingPreview
                    v-if="writingPreview"
                    :key="writingPreview.id"
                    :entry="writingPreview"
                  />
                </Transition>
              </div>
            </template>

            <!-- ── Projects ───────────────────────────────────────────────── -->
            <template v-else>
            <ol
              v-for="(group, side) in groups"
              :key="side"
              class="works__col"
              :start="side === 0 ? 1 : half + 1"
              :data-side="side === 0 ? 'left' : 'right'"
            >
              <li v-for="{ project, index } in group" :key="project.slug">
                <RouterLink
                  :to="`/work/${project.slug}`"
                  class="entry"
                  :data-dim="previewKey !== null && previewKey !== project.slug"
                  @mouseenter="previewKey = project.slug"
                  @focus="previewKey = project.slug"
                >
                  <p class="mono entry__meta">
                    <span class="entry__index">{{ index }}</span>
                    <span class="entry__rule" aria-hidden="true" />
                    <span>{{ project.year }}</span>
                  </p>

                  <h3 class="display entry__title">{{ project.title }}</h3>

                  <ul class="entry__tags">
                    <li v-for="tag in project.tags" :key="tag" class="mono entry__tag">{{ tag }}</li>
                  </ul>

                  <p class="mono entry__kind">
                    {{ presentationLabel[project.presentation] }}
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
            </template>
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

/* ── Writing rows ──────────────────────────────────────────────────────── */

/* The meta line is a system label everywhere else in this component — a bare
   year — so the source and the series name are set the same way rather than
   dropped in as running text. */
.entry--writing .entry__meta span:last-child {
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* The series name takes the source's place, so a run of parts is visible while
   scanning the list and not only inside the panel. */
.entry__meta [data-series='true'] {
  color: var(--c-accent);
}

/* Selecting a post changes the panel instead of navigating, so the row it
   belongs to has to say so — otherwise nothing connects the two. */
@media (min-width: 75rem) {
  .entry--writing[data-current='true'] .entry__title {
    color: var(--c-accent);
  }
}

/* Below the preview breakpoint the hook stands in for the panel. */
.entry__lede {
  display: none;
  margin-top: 1rem;
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.55;
  max-width: 52ch;
}

@media (max-width: 74.99rem) {
  .entry__lede {
    display: block;
  }
}

/* Always visible, unlike the project rows' arrow: on a touch screen this is
   the only thing telling the visitor where the row goes. */
.entry__go {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.9rem;
  color: var(--c-accent);
  font-size: var(--t-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.entry__go-mark {
  transition: transform var(--dur) var(--ease-out);
}

.entry:hover .entry__go-mark,
.entry:focus-visible .entry__go-mark {
  transform: translate(0.15rem, -0.15rem);
}

@media (prefers-reduced-motion: reduce) {
  .entry__go-mark {
    transition: none;
  }

  .entry:hover .entry__go-mark,
  .entry:focus-visible .entry__go-mark {
    transform: none;
  }
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
