<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { onKeyStroke, useEventListener, useScrollLock, useWindowScroll } from '@vueuse/core'
import ThemeToggle from './ThemeToggle.vue'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { profile } from '@/data/profile'

/** The line the scrollspy reads: below the sticky bar, far enough that a
 *  section counts as current once its own heading has settled under it. */
const SPY_LINE = 128

const route = useRoute()
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 24)

/**
 * Every destination is a section of the home page, so every item is a hash
 * link — including Work, which no longer has a route of its own. Experience
 * appears only once there is experience data; a nav item pointing at an empty
 * section is a dead link.
 */
const links = computed(() => [
  { label: 'Work', to: '/#work' },
  { label: 'About', to: '/#about' },
  { label: 'Skillset', to: '/#skillset' },
  ...(profile.experience.length ? [{ label: 'Experience', to: '/#experience' }] : []),
  { label: 'Contact', to: '/#contact' },
])

const github = profile.links.find((l) => l.label === 'GitHub')

const open = ref(false)
const locked = useScrollLock(document.body)
watch(open, (v) => (locked.value = v))
onKeyStroke('Escape', () => (open.value = false))

/* The home hero is a near-black block, so the header inverts while it is over
   it and returns to the paper treatment once the page scrolls past. */
const heroHeight = ref(0)
const measureHero = () => {
  const el = document.querySelector<HTMLElement>('[data-hero]')
  heroHeight.value = el?.offsetHeight ?? 0
}
onMounted(measureHero)
useEventListener(window, 'resize', measureHero)

watch(
  () => route.fullPath,
  () => {
    open.value = false
    nextTick(measureHero)
  },
)
const overHero = computed(() => !open.value && heroHeight.value > 0 && y.value < heroHeight.value - 96)

/**
 * Which item is lit — a question about where the visitor is, not about what the
 * URL says. The hash goes stale the moment anyone scrolls, and rewriting it
 * continuously would fill the back button with their own scrolling, so the
 * scrollspy answers it and the URL is left alone. Off the home page nothing is
 * lit.
 */
const { active } = useScrollSpy(['work', 'about', 'skillset', 'contact'], SPY_LINE)

const isActive = (to: string) => {
  const [path, hash] = to.split('#')
  if (route.path !== (path || '/')) return false
  return hash ? active.value === hash : false
}
</script>

<template>
  <header class="header" :data-scrolled="scrolled" :data-over-hero="overHero">
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
              :aria-current="isActive(link.to) ? 'true' : undefined"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- One aligned control group: every child is a 2.75rem-tall inline-flex
           box on the same axis, with the divider centred between them. -->
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

    <Transition name="panel">
      <div v-if="open" id="mobile-nav" class="panel">
        <nav class="shell panel__inner" aria-label="Primary (mobile)">
          <ul>
            <li v-for="link in links" :key="link.label">
              <RouterLink
                :to="link.to"
                class="panel__link"
                :data-active="String(isActive(link.to))"
                :aria-current="isActive(link.to) ? 'true' : undefined"
                >{{ link.label }}</RouterLink
              >
            </li>
          </ul>
          <a
            v-if="github"
            :href="github.href"
            target="_blank"
            rel="noopener noreferrer"
            class="meta panel__github"
            >GitHub ↗</a
          >
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  /* Named once: the mobile panel hangs off it and the hero measures against it. */
  --header-h: 4.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--c-paper) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid transparent;
  transition:
    border-color var(--dur) var(--ease-out),
    background-color var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out);
}

.header[data-scrolled='true'] {
  border-bottom-color: var(--c-rule);
}

/* Over the dark hero the bar carries the hero's ink. Re-pointing the tokens
   inverts every child at once — links, divider, toggle. */
.header[data-over-hero='true'] {
  background: transparent;
  backdrop-filter: none;
  border-bottom-color: transparent;
  --c-ink: var(--c-hero-ink);
  --c-muted: var(--c-hero-muted);
  --c-accent: var(--c-hero-accent);
  --c-rule: var(--c-hero-rule);
  --c-rule-strong: var(--c-hero-rule-strong);
  --c-focus: var(--c-hero-ink);
  color: var(--c-hero-ink);
}

.skip {
  position: absolute;
  left: 1rem;
  top: 0.5rem;
  transform: translateY(-160%);
  background: var(--c-ink);
  color: var(--c-paper);
  padding: 0.55rem 1rem;
  font-family: var(--font-sans);
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
  min-height: var(--header-h);
}

.header__mark {
  /* `baseline`, not `center`: an empty inline-flex item takes its baseline from
     its bottom margin edge, so the dot sits ON the wordmark's baseline. */
  display: inline-flex;
  align-items: baseline;
  gap: 0.22rem;
  /* Padding, not min-height: the target grows around the baseline instead of
     stretching the flex line and pushing the dot out of alignment. */
  padding-block: 0.72rem;
  color: var(--c-ink);
}

.header__mark-text {
  font-size: 1.5rem;
  line-height: 1;
  letter-spacing: -0.03em;
}

.header__mark-dot {
  width: 0.3rem;
  height: 0.3rem;
  flex: none;
  background: var(--c-accent);
  transition: transform var(--dur) var(--ease-out);
}

/* A transform, so the hop never reflows the wordmark or the nav beside it. */
.header__mark:hover .header__mark-dot,
.header__mark:focus-visible .header__mark-dot {
  transform: translateY(-0.32rem);
}

@media (prefers-reduced-motion: reduce) {
  .header__mark-dot {
    transition: none;
  }
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
  align-items: center;
  gap: clamp(1.25rem, 2.4vw, 2.5rem);
}

.header__link {
  font-size: var(--t-sm);
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--c-ink);
}

.header__link[data-active='true'] {
  color: var(--c-accent);
}

.header__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Must stay inline-flex when shown: `display: block` here overrides
   `.link-grow`'s own centring and pushes GitHub off the shared axis. */
.header__github {
  display: none;
  font-family: var(--font-sans);
  font-size: var(--t-xs);
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-muted);
}

.header__github:hover,
.header__github:focus-visible {
  color: var(--c-ink);
}

.header__divider {
  display: none;
  flex: none;
  align-self: center;
  width: 1px;
  height: 1.15rem;
  background: var(--c-rule-strong);
}

@media (min-width: 42rem) {
  .header__github {
    display: inline-flex;
  }

  .header__divider {
    display: block;
  }
}

.header__burger {
  display: none;
  align-content: center;
  justify-items: end;
  gap: 0.32rem;
  min-height: 2.75rem;
  min-width: 2.75rem;
  padding: 0.5rem;
  margin-right: -0.5rem;
}

@media (max-width: 59.999rem) {
  .header__burger {
    display: grid;
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

/**
 * `.header` carries a `backdrop-filter`, and a filtered element becomes the
 * containing block for its fixed descendants — so `position: fixed` here
 * resolved against the 4.5rem bar, not the viewport, and the panel collapsed
 * to the 1px of its own border. Absolute against that same bar is what the
 * layout wants, and it lets the sheet take the height of its contents. The
 * cap only matters on short screens, where it becomes scrollable.
 */
.panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: calc(100dvh - var(--header-h));
  background: var(--c-paper);
  border-top: 1px solid var(--c-rule);
  border-bottom: 1px solid var(--c-rule);
  overflow-y: auto;
  /* No horizontal scroll of its own, whatever a long label does. */
  overflow-x: hidden;
}

.panel__inner {
  padding-block: clamp(1.5rem, 6vw, 2.5rem);
  display: flex;
  flex-direction: column;
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
.panel__link:focus-visible,
.panel__link[data-active='true'] {
  color: var(--c-accent);
}

.panel__github {
  margin-top: 2rem;
  color: var(--c-muted);
}

.panel-enter-active,
.panel-leave-active {
  transition:
    opacity var(--dur) var(--ease-out),
    transform var(--dur) var(--ease-out);
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(-0.75rem);
}

@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active {
    transition: none;
  }

  .panel-enter-from,
  .panel-leave-to {
    opacity: 1;
    transform: none;
  }
}
</style>
