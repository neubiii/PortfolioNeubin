import { computed, onBeforeUnmount, onMounted, ref, unref, watch, type MaybeRefOrGetter } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Which section the visitor is currently reading.
 *
 * ── Why a reference line, not intersection ratios ──────────────────────────
 * The obvious implementation — take whichever section an IntersectionObserver
 * reports as most visible — is unstable here, because these sections differ in
 * height by a factor of four. A tall Work section keeps a larger ratio than a
 * short one even when the short one fills the screen, and two sections whose
 * ratios cross near a boundary swap back and forth on every pixel of scroll.
 *
 * So this asks a simpler question with one answer: which section is under a
 * fixed line just below the sticky header? Exactly one section can be, the
 * answer changes exactly once per boundary, and it cannot oscillate.
 *
 * IntersectionObserver still does the watching — a zero-height root margin
 * band pinned at that line — so nothing runs on scroll frames that the browser
 * would not have run anyway.
 *
 * The hero is deliberately not a section here: while it is in view the answer
 * is `null` and no nav item is marked.
 *
 * `ids` may be a plain array (the home page's fixed sections) or a ref/getter
 * (a case study's contents rail, whose sections come from the project being
 * read); a reactive list re-observes when it changes.
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

  /**
   * The band is one pixel tall, `headerOffset` down from the top of the
   * viewport — just below the sticky header, where a section's own heading
   * arrives. Whatever intersects it is what is being read.
   */
  const connect = (attempt = 0) => {
    observer?.disconnect()
    observer = null
    cancelAnimationFrame(frame)
    if (typeof window === 'undefined') return

    const targets = list.value
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    // The header mounts in the app shell, so on a cold load it runs before the
    // lazily-imported route has rendered any of these sections — and on a route
    // change the outgoing view has to finish its transition first. Rather than
    // guess at either delay, look again next frame until they exist. The frame
    // budget is a safety valve, not a timer: on a page that genuinely has no
    // sections it simply stops.
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

      // The last section is shorter than the viewport, so at maximum scroll its
      // top never reaches the line and it could never be current. At the bottom
      // of the document, the furthest section that has started is the one being
      // read — which is the honest answer there anyway.
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

      // Hysteresis. Moving forward switches the moment a section reaches the
      // line; moving back needs the current one to have retreated well clear of
      // it. Without that, a hand resting a pixel either side of a boundary
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
      // A zero-height band at the reference line: every section boundary
      // crossing it fires, and nothing else does.
      rootMargin: `-${headerOffset}px 0px -${Math.max(0, window.innerHeight - headerOffset - 1)}px 0px`,
      threshold: 0,
    })
    for (const el of targets) observer.observe(el)
    pick()
  }

  /** The band is defined against the viewport, so it is rebuilt when that
   *  changes — and after a route change, when the sections themselves differ. */
  const onResize = () => connect()

  /**
   * The last section is shorter than the viewport, so scrolling to the foot of
   * the page crosses no boundary at all — the band stays inside the section
   * above it and the observer never fires. This watches only for the page
   * arriving at or leaving its own bottom, and asks again when it does.
   */
  const onScroll = () => {
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    if (atBottom === wasAtBottom) return
    wasAtBottom = atBottom
    runPick?.()
  }

  /** Sections can also arrive late within a route — an image finishing, a font
   *  swapping — so the observed set is re-checked when the page's height
   *  settles, not only when the viewport changes. */
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

  /** A reactive list — the case rail's — changes with the project being read. */
  watch(list, () => connect(), { flush: 'post' })

  watch(
    () => route.path,
    () => {
      // Off the home page there are no sections to be inside.
      active.value = null
      connect()
    },
  )

  return { active }
}
