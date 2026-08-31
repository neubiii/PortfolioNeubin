import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/work', name: 'work', component: () => import('@/pages/WorkPage.vue') },
  {
    path: '/work/:slug',
    name: 'project',
    component: () => import('@/pages/ProjectPage.vue'),
    props: true,
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFoundPage.vue') },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // Same route, different project: keep the jump instant so the page swap
    // does not read as a scroll animation.
    return { top: 0 }
  },
})
