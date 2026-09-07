<script setup lang="ts">
import { computed } from 'vue'
import ProjectLinks from '@/components/project/ProjectLinks.vue'
import { useScrollSpy } from '@/composables/useScrollSpy'
import type { CaseSection, Project } from '@/types'

/**
 * The sticky rail on a case-study page: project metadata, then a contents list
 * that tracks the reading position. Rows with no data are omitted rather than
 * shown empty, and the contents list is a real `nav` of in-page links.
 */
const props = defineProps<{ project: Project }>()

/** Annotated rather than `as const`: the literal terms would narrow the tuple
 *  past what the filter below can name. */
type MetaRow = readonly [term: string, detail: string | undefined]

const meta = computed(() =>
  (
    [
      ['Role', props.project.meta.role],
      ['Platform', props.project.meta.platform],
      ['Timeline', props.project.meta.timeline],
      ['Context', props.project.meta.context],
      ['Method', props.project.meta.method],
      ['Output', props.project.meta.output],
    ] as readonly MetaRow[]
  )
    .filter((row): row is readonly [string, string] => Boolean(row[1]))
    .map(([term, detail]) => ({ term, detail })),
)

const hasTitle = (s: CaseSection): s is CaseSection & { title: string } =>
  'title' in s && typeof s.title === 'string' && s.title.length > 0

const titled = computed(() => props.project.sections.filter(hasTitle))

/** Markers ("03 — Research") read better in a narrow rail than full sentences. */
const navLabel = (s: CaseSection & { title: string }) =>
  'marker' in s && s.marker ? s.marker : s.title

const { active } = useScrollSpy(() => titled.value.map((s) => s.id))
</script>

<template>
  <div class="rail">
    <dl v-if="meta.length" class="rail__meta">
      <div v-for="row in meta" :key="row.term" class="rail__row">
        <dt class="label rail__term">{{ row.term }}</dt>
        <dd class="rail__detail">{{ row.detail }}</dd>
      </div>
    </dl>

    <nav v-if="titled.length > 1" class="rail__toc" aria-label="On this page">
      <p class="label rail__toc-head">On this page</p>
      <ul>
        <li v-for="section in titled" :key="section.id">
          <a
            :href="`#${section.id}`"
            class="rail__link"
            :data-active="active === section.id"
            :aria-current="active === section.id ? 'true' : undefined"
          >
            <span class="rail__tick" aria-hidden="true" />
            <span>{{ navLabel(section) }}</span>
          </a>
        </li>
      </ul>
    </nav>

    <ProjectLinks :links="project.links" />
  </div>
</template>

<style scoped>
.rail {
  display: grid;
  gap: 2.5rem;
  align-content: start;
}

@media (min-width: 64rem) {
  .rail {
    /* Sticky lives on the grid item in ProjectPage; the rail only has to fit
       inside it. No `overscroll-behavior: contain` — the wheel must still reach
       the page once this reaches its end. */
    min-height: 0;
    overflow-y: auto;
    padding-right: 0.5rem;
    scrollbar-width: thin;
  }
}

.rail__meta {
  margin: 0;
  border-top: 1px solid var(--c-rule-strong);
}

.rail__row {
  padding-block: 0.8rem;
  border-bottom: 1px solid var(--c-rule);
}

.rail__term {
  color: var(--c-muted);
  margin-bottom: 0.3rem;
}

.rail__detail {
  margin: 0;
  font-weight: 500;
  font-size: var(--t-sm);
  line-height: 1.4;
}

/* Hidden below the sticky breakpoint, where the page is one column and an
   in-page index earns nothing. */
.rail__toc {
  display: none;
}

@media (min-width: 64rem) {
  .rail__toc {
    display: block;
  }
}

.rail__toc-head {
  color: var(--c-muted);
  padding-bottom: 0.85rem;
  margin-bottom: 0.25rem;
  border-bottom: 1px solid var(--c-rule);
}

.rail__link {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  padding-block: 0.45rem;
  font-size: var(--t-sm);
  line-height: 1.35;
  color: var(--c-muted);
  transition: color var(--dur) var(--ease-out);
}

.rail__tick {
  width: 0.7rem;
  height: 1px;
  flex: none;
  background: var(--c-rule-strong);
  transform: translateY(-0.28rem);
  transition:
    width var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out);
}

.rail__link:hover,
.rail__link:focus-visible {
  color: var(--c-ink);
}

/* Active carries a colour change AND a longer tick — never colour alone. */
.rail__link[data-active='true'] {
  color: var(--c-accent);
}

.rail__link[data-active='true'] .rail__tick {
  width: 1.5rem;
  background: var(--c-accent);
}
</style>
