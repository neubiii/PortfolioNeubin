<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { onKeyStroke, useScrollLock, useWindowScroll } from '@vueuse/core'
import ThemeToggle from './ThemeToggle.vue'
import { profile } from '@/data/profile'

const route = useRoute()
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 24)

/**
 * Phase 1 nav.
 *
 * About / Skillset / Contact are sections of the home page, so they are hash
 * links; Work is a real route. Experience only appears once there is real
 * experience data — a nav item pointing at an empty section is a dead link.
 */
const links = computed(() => [
  { label: 'Work', to: '/work', kind: 'route' as const },
  { label: 'About', to: '/#about', kind: 'hash' as const, hash: '#about' },
  { label: 'Skillset', to: '/#skillset', kind: 'hash' as const, hash: '#skillset' },
  ...(profile.experience.length
    ? [{ label: 'Experience', to: '/#experience', kind: 'hash' as const, hash: '#experience' }]
    : []),
  { label: 'Contact', to: '/#contact', kind: 'hash' as const, hash: '#contact' },
])

const github = profile.links.find((l) => l.label === 'GitHub')

const open = ref(false)
const locked = useScrollLock(document.body)
watch(open, (v) => (locked.value = v))
watch(() => route.fullPath, () => (open.value = false))
onKeyStroke('Escape', () => (open.value = false))

const isActive = (to: string) =>
  to === '/work' ? route.path.startsWith('/work') : route.path === '/' && route.hash === to.slice(1)
</script>

<template>
  <header class="header" :data-scrolled="scrolled">
    <a class="skip" href="#main">Skip to content</a>

    <div class="shell header__bar">
      <RouterLink to="/" class="header__mark" aria-label="Neubii — home">
        <span class="display header__mark-text">{{ profile.handle }}</span>
        <span class="header__mark-dot" aria-hidden="true" />
      </RouterLink>

      <nav class="header__nav" aria-label="Primary">
        <ul class="header__list">
          <li v-for="link in links" :key="link.label">
            <RouterLink
              :to="link.to"
              class="link-grow header__link"
              :data-active="String(isActive(link.to))"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="header__meta">
        <a
          v-if="github"
          :href="github.href"
          target="_blank"
          rel="noopener noreferrer"
          class="link-grow header__github"
        >
          GitHub<span class="sr-only"> (opens in a new tab)</span>
        </a>
        <span class="header__divider" aria-hidden="true" />
        <ThemeToggle />
        <button
          type="button"
          class="header__burger"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          @click="open = !open"
        >
          <span class="header__burger-line" :data-open="open" />
          <span class="header__burger-line" :data-open="open" />
        </button>
      </div>
    </div>

    <!-- Mobile panel. Full-bleed, large type: the nav becomes the page. -->
    <Transition name="panel">
      <div v-if="open" id="mobile-nav" class="panel">
        <nav class="shell panel__inner" aria-label="Primary (mobile)">
          <ul>
            <li v-for="(link, i) in links" :key="link.label" :style="{ '--i': i }">
              <RouterLink :to="link.to" class="display panel__link">{{ link.label }}</RouterLink>
            </li>
          </ul>
          <a
            v-if="github"
            :href="github.href"
            target="_blank"
            rel="noopener noreferrer"
            class="mono panel__github"
            >GitHub ↗</a
          >
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--c-paper) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur) var(--ease-out);
}

.header[data-scrolled='true'] {
  border-bottom-color: var(--c-rule);
}

.skip {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  transform: translateY(-160%);
  background: var(--c-ink);
  color: var(--c-paper);
  padding: 0.55rem 1rem;
  font-family: var(--font-mono);
  font-size: var(--t-sm);
  z-index: 2;
  transition: transform var(--dur) var(--ease-out);
}

.skip:focus-visible {
  transform: translateY(0);
}

.header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 4.5rem;
}

.header__mark {
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  /* 44px target without moving the baseline the wordmark sits on. */
  padding-block: 0.7rem;
}

.header__mark-text {
  font-size: 1.5rem;
  letter-spacing: -0.03em;
}

.header__mark-dot {
  width: 0.3rem;
  height: 0.3rem;
  background: var(--c-accent);
  transition: transform var(--dur) var(--ease-out);
}

.header__mark:hover .header__mark-dot,
.header__mark:focus-visible .header__mark-dot {
  transform: translateY(-0.35rem);
}

.header__nav {
  display: none;
}

@media (min-width: 60rem) {
  .header__nav {
    display: block;
  }
}

.header__list {
  display: flex;
  gap: clamp(1.25rem, 2.4vw, 2.5rem);
}

.header__link {
  font-size: var(--t-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
}

.header__link[data-active='true'] {
  color: var(--c-accent);
}

.header__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header__github {
  display: none;
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header__divider {
  display: none;
  width: 1px;
  height: 1.1rem;
  background: var(--c-rule);
}

@media (min-width: 42rem) {
  .header__github,
  .header__divider {
    display: block;
  }
}

.header__burger {
  display: grid;
  align-content: center;
  gap: 0.32rem;
  min-height: 2.75rem;
  min-width: 2.75rem;
  justify-items: end;
  padding: 0.5rem;
  margin-right: -0.5rem;
}

@media (min-width: 60rem) {
  .header__burger {
    display: none;
  }
}

.header__burger-line {
  display: block;
  width: 1.3rem;
  height: 1px;
  background: var(--c-ink);
  transition: transform var(--dur) var(--ease-in-out);
}

.header__burger-line[data-open='true']:first-child {
  transform: translateY(0.165rem) rotate(45deg);
}

.header__burger-line[data-open='true']:last-child {
  transform: translateY(-0.165rem) rotate(-45deg);
}

.panel {
  position: fixed;
  inset: 4.5rem 0 0;
  background: var(--c-paper);
  border-top: 1px solid var(--c-rule);
  overflow-y: auto;
}

.panel__inner {
  padding-block: clamp(2rem, 8vw, 4rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
}

.panel__link {
  display: block;
  font-size: var(--t-3xl);
  padding-block: 0.35rem;
  border-bottom: 1px solid var(--c-rule);
  transition: color var(--dur) var(--ease-out);
}

.panel li:first-child .panel__link {
  border-top: 1px solid var(--c-rule);
}

.panel__link:hover,
.panel__link:focus-visible {
  color: var(--c-accent);
}

.panel__github {
  margin-top: 3rem;
  color: var(--c-muted);
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity var(--dur) var(--ease-out);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}

</style>
