<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import CaseRail from '@/components/project/CaseRail.vue'
import CaseSection from '@/components/project/CaseSection.vue'
import MediaFrame from '@/components/ui/MediaFrame.vue'
import ArrowLink from '@/components/ui/ArrowLink.vue'
import { findProject, nextProject } from '@/data/projects'

const props = defineProps<{ slug: string }>()
const router = useRouter()

const project = computed(() => findProject(props.slug))
const next = computed(() => nextProject(props.slug))

// An unknown slug is a 404, not a blank page.
watch(
  project,
  (value) => {
    if (!value) router.replace({ name: 'not-found' })
  },
  { immediate: true },
)

// The hero image is pulled out of the section list and given the full width
// under the title, so the work is the first thing on the page. A project
// without an explicit hero section leads with its cover rather than with prose.
const hero = computed(() => {
  const explicit = project.value?.sections.find((s) => s.kind === 'media' && s.id === 'hero')
  if (explicit && explicit.kind === 'media') return explicit.items[0]
  return project.value?.cover
})

const body = computed(() =>
  (project.value?.sections ?? []).filter((s) => !(s.kind === 'media' && s.id === 'hero')),
)

const isCaseStudy = computed(() => project.value?.presentation === 'case-study')
</script>

<template>
  <article v-if="project" class="project">
    <!-- ── Title ─────────────────────────────────────────────────────────── -->
    <header class="shell project__head">
      <nav class="project__crumb" aria-label="Breadcrumb">
        <RouterLink to="/#work" class="mono project__back">
          <span aria-hidden="true">←</span> Work
        </RouterLink>
        <span class="mono project__crumb-sep" aria-hidden="true">/</span>
        <span class="mono project__crumb-current">{{ project.title }}</span>
      </nav>

      <p class="label project__eyebrow">{{ project.eyebrow }}</p>

      <h1 class="display project__title">{{ project.headline }}</h1>

      <p class="lede project__summary">{{ project.summary }}</p>

      <ul class="project__tags">
        <li v-for="tag in project.tags" :key="tag" class="mono project__tag">{{ tag }}</li>
        <li class="mono project__tag project__tag--accent">
          {{ isCaseStudy ? 'Case study' : 'Visual study' }}
        </li>
      </ul>
    </header>

    <div v-if="hero" class="shell project__hero">
      <MediaFrame :item="hero" eager />
    </div>

    <!-- ── Body ──────────────────────────────────────────────────────────── -->
    <div class="shell project__body" :data-rail="isCaseStudy">
      <aside v-if="isCaseStudy" class="project__rail">
        <CaseRail :project="project" />
      </aside>

      <div class="project__content">
        <CaseSection v-for="section in body" :key="section.id" :section="section" />

        <p v-if="project.scopeNote" class="project__scope">{{ project.scopeNote }}</p>
      </div>
    </div>

    <!-- ── Pager ─────────────────────────────────────────────────────────── -->
    <nav v-if="next" class="shell project__next" aria-label="Next project">
      <RouterLink :to="`/work/${next.slug}`" class="next">
        <p class="label next__label">Next project</p>
        <h2 class="display next__title">{{ next.title }}</h2>
        <p class="next__hook">{{ next.hook }}</p>
        <span class="next__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 12h15M13 6l6 6-6 6" stroke-linecap="square" />
          </svg>
        </span>
      </RouterLink>

      <div class="project__all">
        <ArrowLink to="/#work">All work</ArrowLink>
      </div>
    </nav>
  </article>
</template>

<style scoped>
/* ── Head ──────────────────────────────────────────────────────────────── */

.project__head {
  padding-top: clamp(2rem, 5vw, 3.5rem);
  padding-bottom: clamp(2rem, 5vw, 3.5rem);
}

.project__crumb {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.75rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
  border-bottom: 1px solid var(--c-rule);
  font-size: var(--t-xs);
}

.project__back {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  color: var(--c-muted);
  transition: color var(--dur) var(--ease-out);
}

.project__back:hover,
.project__back:focus-visible {
  color: var(--c-accent);
}

.project__crumb-sep,
.project__crumb-current {
  color: var(--c-muted);
  font-size: var(--t-xs);
}

.project__eyebrow {
  color: var(--c-accent);
  margin-bottom: 1.5rem;
}

.project__title {
  font-size: var(--t-4xl);
  max-width: 17ch;
  margin-bottom: clamp(1.5rem, 3vw, 2.25rem);
}

.project__summary {
  color: var(--c-muted);
  max-width: 66ch;
}

.project__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0;
  margin-top: 2rem;
}

.project__tag {
  color: var(--c-muted);
  font-size: var(--t-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding-inline: 0.8rem;
  border-left: 1px solid var(--c-rule);
}

.project__tag:first-child {
  padding-left: 0;
  border-left: 0;
}

.project__tag--accent {
  color: var(--c-accent);
}

.project__hero {
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

/* ── Body ──────────────────────────────────────────────────────────────── */

.project__body {
  padding-bottom: clamp(3rem, 7vw, 6rem);
}

@media (min-width: 64rem) {
  .project__body[data-rail='true'] {
    display: grid;
    grid-template-columns: 16rem minmax(0, 1fr);
    column-gap: clamp(2.5rem, 6vw, 6rem);
    /* `stretch`, not `start`: the aside spans the full row so its sticky
       position has somewhere to travel. With `start` the item collapsed to its
       own content height and sticky had zero range — which is why the rail
       scrolled away with the page. */
    align-items: stretch;
  }
}

/* Below the rail breakpoint the meta table still reads well above the content;
   the contents list is redundant there because the page is one column. */
.project__rail {
  margin-bottom: clamp(3rem, 6vw, 4rem);
}

@media (min-width: 64rem) {
  .project__rail {
    margin-bottom: 0;
    position: sticky;
    /* Header is 4.5rem tall; 1.25rem of air under it. */
    top: 5.75rem;
    align-self: start;
    max-height: calc(100vh - 7.5rem);
    display: flex;
    flex-direction: column;
  }
}

.project__content {
  min-width: 0;
}

.project__scope {
  margin-top: clamp(3rem, 6vw, 5rem);
  padding-top: 1.5rem;
  border-top: 1px solid var(--c-rule);
  color: var(--c-muted);
  font-size: var(--t-sm);
  line-height: 1.6;
  max-width: 76ch;
}

/* ── Pager ─────────────────────────────────────────────────────────────── */

.project__next {
  padding-bottom: clamp(3rem, 7vw, 5rem);
}

.next {
  display: block;
  position: relative;
  border-top: 1px solid var(--c-rule-strong);
  padding-top: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--c-rule);
}

.next__label {
  color: var(--c-muted);
  margin-bottom: 1rem;
  transition: color var(--dur) var(--ease-out);
}

.next__title {
  font-size: var(--t-3xl);
  margin-bottom: 1rem;
  transition:
    color var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

.next__hook {
  color: var(--c-muted);
  max-width: 52ch;
}

.next__arrow {
  position: absolute;
  right: 0;
  top: 2rem;
  width: 1.6rem;
  height: 1.6rem;
  color: var(--c-muted);
  transition:
    transform var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out);
}

@media (hover: hover) {
  .next:hover .next__title,
  .next:focus-visible .next__title {
    color: var(--c-accent);
    transform: translateX(0.5rem);
  }
}

.next:hover .next__label,
.next:focus-visible .next__label {
  color: var(--c-accent);
}

.next:hover .next__arrow,
.next:focus-visible .next__arrow {
  transform: translateX(0.4rem);
  color: var(--c-accent);
}

.project__all {
  margin-top: 2.5rem;
}
</style>
