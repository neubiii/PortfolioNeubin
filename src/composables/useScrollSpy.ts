import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

/**
 * Tracks which section is currently in the reading position.
 *
 * Uses a narrow observation band near the top of the viewport rather than
 * `threshold`, so long sections and short sections behave the same way.
 */
export function useScrollSpy(ids: Ref<string[]> | (() => string[])) {
  const active = ref<string>('')
  let observer: IntersectionObserver | null = null

  const list = () => (typeof ids === 'function' ? ids() : ids.value)

  const connect = () => {
    observer?.disconnect()
    const visible = new Set<string>()

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        // Keep document order so overlapping sections resolve predictably.
        const first = list().find((id) => visible.has(id))
        if (first) active.value = first
      },
      { rootMargin: '-12% 0px -70% 0px' },
    )

    for (const id of list()) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    if (!active.value) active.value = list()[0] ?? ''
  }

  onMounted(connect)
  watch(list, connect, { flush: 'post' })
  onBeforeUnmount(() => observer?.disconnect())

  return { active }
}
