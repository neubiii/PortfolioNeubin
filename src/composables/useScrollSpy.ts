import { computed, onBeforeUnmount, onMounted, ref, unref, watch, type MaybeRefOrGetter } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Which section the visitor is currently reading.
 *
 * Not intersection ratios: these sections differ in height by a factor of
 * four, so a tall one keeps a larger ratio than a short one filling the screen,
 * and two ratios crossing near a boundary flip back and forth on every pixel of
 * scroll. Instead this asks which section sits under a fixed line just below
 * the sticky header — exactly one can, and the answer changes once per
 * boundary. IntersectionObserver still does the watching, through a
 * zero-height root-margin band pinned at that line.
 *
 * The hero is deliberately not a section: while it is in view the answer is
 * `null` and no nav item is marked.
 *
 * `ids` accepts an array (the home page's fixed sections) or a ref/getter (a
 * case study's contents rail); a reactive list re-observes when it changes.
 */

/** How far the current section must retreat past the line before an earlier one
 *  takes over. Only applies going back up; forward switches are immediate. */
const HYSTERESIS = 28

export function useScrollSpy(ids: MaybeRefOrGetter<string[]>, headerOffset = 96) {
  const active = ref<string | null>(null)
  const route = useRoute()
  const list = computed(() => (typeof ids === 'function' ? ids() : unref(ids)))

  let observer: IntersectionObserver | null = null
  let frame = 0
  /** The current reader, exposed so the bottom-of-page rule can re-ask. */
  let runPick: (() => void) | null = null
  let wasAtBottom = false

  const connect = (attempt = 0) => {
    observer?.disconnect()
    observer = null
    cancelAnimationFrame(frame)
    if (typeof window === 'undefined') return

    const targets = list.value
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    // The header mounts in the app shell, before the lazily-imported route has
    // rendered any sections — and on a route change the outgoing view has to
    // finish transitioning first. Look again next frame until they exist; the
    // frame budget is a safety valve, not a timer.
    if (!targets.length) {
      active.value = null
      if (attempt < 90) frame = requestAnimationFrame(() => connect(attempt + 1))
      return
    }

    const pick = () => {
      const line = headerOffset
      let index = -1
      for (let i = 0; i < targets.length; i++) {
        const box = targets[i].getBoundingClientRect()
        if (box.top <= line && box.bottom > line) index = i
      }

      // The last section is shorter than the viewport, so its top never reaches
      // the line and it could never be current. At the foot of the document the
      // furthest section that has started is the one being read.
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        for (let i = targets.length - 1; i >= 0; i--) {
          if (targets[i].getBoundingClientRect().top < window.innerHeight * 0.5) {
            index = i
            break
          }
        }
      }

      // Forward switches immediately; going back needs the current section to
      // have retreated clear of the line, or a hand resting on a boundary
      // toggles the highlight on every twitch.
      const current = active.value ? targets.findIndex((el) => el.id === active.value) : -1
      if (index >= 0 && current >= 0 && index < current) {
        const box = targets[current].getBoundingClientRect()
        if (box.top <= line + HYSTERESIS) return
      }

      active.value = index >= 0 ? targets[index].id : null
    }

    runPick = pick
    observer = new IntersectionObserver(pick, {
      rootMargin: `-${headerOffset}px 0px -${Math.max(0, window.innerHeight - headerOffset - 1)}px 0px`,
      threshold: 0,
    })
    for (const el of targets) observer.observe(el)
    pick()
  }

  const onResize = () => connect()

  /**
   * The last section is shorter than the viewport, so reaching the foot of the
   * page crosses no boundary and the observer never fires. Watch only for the
   * page arriving at or leaving its own bottom.
   */
  const onScroll = () => {
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    if (atBottom === wasAtBottom) return
    wasAtBottom = atBottom
    runPick?.()
  }

  /** Sections can arrive late within a route — an image finishing, a font
   *  swapping — so the observed set is re-checked when the page height settles. */
  let sizer: ResizeObserver | null = null

  onMounted(() => {
    connect()
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    sizer = new ResizeObserver(() => connect())
    sizer.observe(document.body)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame)
    observer?.disconnect()
    observer = null
    sizer?.disconnect()
    sizer = null
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
  })

  watch(list, () => connect(), { flush: 'post' })

  watch(
    () => route.path,
    () => {
      active.value = null
      connect()
    },
  )

  return { active }
}
