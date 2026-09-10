<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ArrowUpRight } from 'lucide-vue-next'
import MediaFrame from '@/components/ui/MediaFrame.vue'
import WritingPreview from '@/components/project/WritingPreview.vue'
import { categories, presentationLabel, projectsIn, type CategoryId } from '@/data/projects'
import { writing } from '@/data/writing'

/**
 * The one place work is browsed. Categories filter a single list rather than
 * splitting into three components, so an entry appears under every discipline
 * it claims and adding work is a data change.
 *
 * Above 75rem the composition is three columns — half the index, the preview,
 * the other half — so the last project sits at the same eye level as the first.
 * Below that the preview column is dropped and each row carries what the
 * preview would have shown, since touch has no hover to discover it with.
 *
 * Writing shares the whole composition; only two things differ: a row is an
 * external link rather than a route, and the centre panel is typographic
 * because a post has no screenshot.
 */
const active = ref<CategoryId>('ux')
const tabs = ref<(HTMLButtonElement | null)[]>([])

/**
 * Numbering is per category, not global: the first project in this tab is 01
 * whichever tab it is. A stored index could not do that, since the same project
 * holds a different position in each list it appears in.
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

/**
 * Which row the preview is showing — a project slug or a writing id.
 *
 * `picked` is what the pointer or focus last chose; `current` resolves that to
 * a row that always exists, falling back to the first in the category. So a
 * category opens with its first row already active rather than with none, and
 * leaving the list returns to it without a second piece of state to keep in
 * step. One row is current at any moment, and it is the row the preview shows.
 */
const picked = ref<string | null>(null)

const keys = computed(() =>
  isWriting.value
    ? writingRows.value.map((r) => r.entry.id)
    : projectRows.value.map((r) => r.project.slug),
)

const current = computed(() =>
  picked.value && keys.value.includes(picked.value) ? picked.value : keys.value[0],
)

const preview = computed(
  () =>
    (projectRows.value.find((e) => e.project.slug === current.value) ?? projectRows.value[0])
      ?.project,
)
const writingPreview = computed(
  () => (writingRows.value.find((e) => e.entry.id === current.value) ?? writingRows.value[0])?.entry,
)

// A project can appear under two disciplines, so a key alone would survive a
// tab change. Every category starts at its own first row.
watch(active, () => (picked.value = null))

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
      <div class="works__head">
        <h2 id="works-title" class="label works__title">Work</h2>
        <p class="meta works__count">{{ count }} {{ isWriting ? 'posts' : 'projects' }}</p>
      </div>

      <div class="ruler works__tabs" role="tablist" aria-label="Filter work by category">
        <button
          v-for="(category, i) in categories"
          :key="category.id"
          :ref="(el) => (tabs[i] = el as HTMLButtonElement | null)"
          :id="tabId(category.id)"
          type="button"
          role="tab"
          class="ruler__item"
          :aria-selected="active === category.id"
          :aria-controls="'works-panel'"
          :tabindex="active === category.id ? 0 : -1"
          :data-active="active === category.id"
          @click="active = category.id"
          @keydown="onTabKey($event, i)"
        >
          <span>{{ category.label }}</span>
          <span class="meta tab__count">{{ countIn(category.id) }}</span>
        </button>
      </div>

      <div id="works-panel" role="tabpanel" :aria-labelledby="tabId(active)">
        <Transition name="fade" mode="out-in">
          <div v-if="count" :key="active" class="works__grid" @mouseleave="picked = null">
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
                    :data-dim="current !== entry.id"
                    :data-current="current === entry.id"
                    @mouseenter="picked = entry.id"
                    @focus="picked = entry.id"
                  >
                    <p class="meta entry__meta">
                      <span class="entry__index">{{ index }}</span>
                      <span class="entry__rule" aria-hidden="true" />
                      <span :data-series="Boolean(entry.series)">
                        {{ entry.series ?? entry.source }}
                      </span>
                    </p>

                    <h3 class="entry__title">{{ entry.title }}</h3>

                    <ul class="entry__tags">
                      <li v-for="topic in entry.topics" :key="topic" class="meta entry__tag">
                        {{ topic }}
                      </li>
                    </ul>

                    <!-- Below the preview breakpoint the row has to say what
                         the panel would have said. -->
                    <p class="entry__lede">{{ entry.hook }}</p>

                    <p class="meta entry__go">
                      <span>View {{ entry.source }} post</span>
                      <ArrowUpRight class="entry__go-mark" />
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
                  :data-dim="current !== project.slug"
                  :data-current="current === project.slug"
                  @mouseenter="picked = project.slug"
                  @focus="picked = project.slug"
                >
                  <p class="meta entry__meta">
                    <span class="entry__index">{{ index }}</span>
                    <span class="entry__rule" aria-hidden="true" />
                    <span>{{ project.year }}</span>
                  </p>

                  <h3 class="entry__title">{{ project.title }}</h3>

                  <ul class="entry__tags">
                    <li v-for="tag in project.tags" :key="tag" class="meta entry__tag">{{ tag }}</li>
                  </ul>

                  <p class="meta entry__kind">
                    {{ presentationLabel[project.presentation] }}
                    <ArrowRight class="entry__arrow" />
                  </p>

                  <!-- Below the preview breakpoint the image belongs to the row. -->
                  <div class="entry__media">
                    <MediaFrame :item="project.cover" ratio="16/10" fit="cover" />
                    <p class="entry__hook">{{ project.hook }}</p>
                  </div>
                </RouterLink>
              </li>
            </ol>

            <!-- A fixed 16:10 stage the cover fills, so it is dimensionally
                 stable while every project still uses the whole of it. -->
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
                    <p class="meta preview__name">{{ preview.title }}</p>
                    <p class="preview__hook">{{ preview.hook }}</p>
                  </div>
                </Transition>
              </RouterLink>
            </div>
            </template>
          </div>

          <!-- One honest line on a rule — no skeletons, no placeholder cards
               standing in for work that does not exist. -->
          <p v-else :key="`${active}-empty`" class="meta works__empty">
            {{ activeCategory.empty }}
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.works {
  padding-top: var(--section-y);
  padding-bottom: 0;
}

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

.works__tabs {
  margin-bottom: clamp(1.75rem, 3vw, 2.75rem);
}

.tab__count {
  font-size: var(--t-xs);
  color: var(--c-muted);
}

/* Closed off by a rule, so the category still reads as a section with an
   answer in it rather than as the page running out of content. */
.works__empty {
  color: var(--c-muted);
  font-size: var(--t-sm);
  padding-block: clamp(1.5rem, 3vw, 2.25rem);
  border-bottom: 1px solid var(--c-rule);
  max-width: 46ch;
}

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
   column ends early, which reads as a missing rule. */
.works__col:empty {
  display: none;
}

.entry {
  display: block;
  padding-block: clamp(1.1rem, 2vw, 1.5rem);
  border-bottom: 1px solid var(--c-rule);
  transition: opacity var(--dur) var(--ease-out);
}

/* One row is current from the moment a category opens, so the rest recede
   immediately — but only where the preview column exists to explain why. Below
   that breakpoint every row carries its own image and nothing is dimmed. */
@media (min-width: 75rem) {
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

/* Sans, not the display serif: these are scanned down a list at list size,
   which is where Fraunces stops being readable. */
.entry__title {
  font-family: var(--font-sans);
  font-size: clamp(1.1875rem, 1.05rem + 0.55vw, 1.5rem);
  font-weight: 550;
  line-height: 1.25;
  letter-spacing: -0.012em;
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
  width: 1.05em;
  height: 1.05em;
  flex: none;
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

/* The meta line is a system label everywhere else here — a bare year — so the
   source and series name are set the same way rather than as running text. */
.entry--writing .entry__meta span:last-child {
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* The series name takes the source's place, so a run of parts is visible while
   scanning the list, not only inside the panel. */
.entry__meta [data-series='true'] {
  color: var(--c-accent);
}

/* The current row is the one the preview is showing, so it carries the accent
   the preview would give it. Writing needs this most — selecting a post changes
   the panel instead of navigating — but the two lists behave the same way. */
@media (min-width: 75rem) {
  .entry[data-current='true'] .entry__title {
    color: var(--c-accent);
  }
}

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
   the only thing saying where the row goes. */
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
