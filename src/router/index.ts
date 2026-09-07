import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/** Sticky header is 4.5rem; this matches `scroll-padding-top` in main.css. */
const HEADER_OFFSET = 104

/**
 * Wait for a hash target to exist before scrolling to it.
 *
 * The routed view animates with `<Transition mode="out-in">`, so on a
 * cross-route hash navigation (`/work/<slug>` → `/#work`) the new page has not
 * mounted yet when `scrollBehavior` runs. This resolves on the frame the
 * element actually appears — the frame budget is a safety valve, not a delay.
 */
const waitForTarget = (hash: string): Promise<Element | null> =>
  new Promise((resolve) => {
    let frames = 0
    const look = () => {
      const el = document.querySelector(hash)
      if (el) return resolve(el)
      if (++frames > 60) return resolve(null)
      requestAnimationFrame(look)
    }
    requestAnimationFrame(look)
  })

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  // Work now lives on the home page. Kept as a redirect so older links and
  // bookmarks land on the showcase instead of the 404.
  { path: '/work', redirect: () => ({ path: '/', hash: '#work' }) },
  {
    path: '/work/:slug',
    name: 'project',
    component: () => import('@/pages/ProjectPage.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  async scrollBehavior(to, _from, saved) {
    // Back and forward restore where the visitor actually was.
    if (saved) return saved

    if (to.hash) {
      const target = await waitForTarget(to.hash)
      if (!target) return { top: 0 }
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return { el: to.hash, top: HEADER_OFFSET, behavior: still ? 'auto' : 'smooth' }
    }

    return { top: 0 }
  },
})
