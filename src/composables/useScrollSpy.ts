import { computed, onBeforeUnmount, onMounted, ref, unref, watch, type MaybeRefOrGetter } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Which section the visitor is currently reading.
 *
 * Not intersection ratios — these sections differ in height by a factor of
 * four, so two ratios crossing near a boundary flip on every pixel of scroll.
 * This asks which section sits under a fixed line below the sticky header:
 * exactly one can, and the answer changes once per boundary. The observer
 * watches through a zero-height root-margin band pinned at that line.
 *
 * The hero is not a section, so while it is in view the answer is `null`.
 * `ids` takes an array or a ref/getter; a reactive list re-observes.
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

    // The header mounts before the lazy route has rendered any sections. Look
    // again next frame; the budget is a safety valve, not a timer.
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

      // The last section never reaches the line, so at the foot of the page
      // the furthest section that has started is the one being read.
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

      // Going back needs the current section clear of the line, or a hand
      // resting on a boundary toggles the highlight on every twitch.
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

  /** Reaching the foot of the page crosses no boundary, so the observer never
   *  fires there. Watch only for arriving at or leaving the bottom. */
  const onScroll = () => {
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    if (atBottom === wasAtBottom) return
    wasAtBottom = atBottom
    runPick?.()
  }

  /** Sections can arrive late — an image, a font swap — so the observed set is
   *  re-checked when the page height settles. */
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
