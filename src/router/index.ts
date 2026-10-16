import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/** Sticky header is 4.5rem; this matches `scroll-padding-top` in main.css. */
const HEADER_OFFSET = 104

/**
 * Wait for a hash target to exist before scrolling to it: `<Transition
 * mode="out-in">` means that on a cross-route hash navigation the new page has
 * not mounted when `scrollBehavior` runs. The frame budget is a safety valve.
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
  // Work lives on the home page; older links still land on the showcase.
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
