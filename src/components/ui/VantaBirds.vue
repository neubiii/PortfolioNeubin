<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useMotion } from '@/composables/useMotion'

/**
 * Vanta BIRDS as the hero's atmosphere.
 *
 * ── Why a ResizeObserver, not a timeout ────────────────────────────────────
 * Vanta measures its container once, in `setSize()`:
 *
 *     this.width  = Math.max(el.offsetWidth,  options.minWidth)
 *     this.height = Math.max(el.offsetHeight, options.minHeight)
 *
 * and builds the camera from that ratio. It then re-measures only on a window
 * `resize` event plus a single `requestAnimationFrame` after construction —
 * and BIRDS overrides `onResize()` with an empty method, so nothing else ever
 * corrects it.
 *
 * On a first visit the two dynamic imports below take real network time, so by
 * the time the effect is constructed the hero has long since been laid out. On
 * a *return* visit those chunks are cached, the imports resolve almost
 * immediately, and the effect can be constructed while the routed hero is
 * still mid-transition and measures ~0 — which the `minWidth`/`minHeight`
 * clamp turns into 200×200. That is the bug: a correctly sized canvas with a
 * camera framed for a 200×200 box, so the flock reads as a small central knot.
 *
 * The fix is to let the element's real geometry drive the lifecycle. A
 * ResizeObserver constructs the effect on the first non-zero measurement and
 * calls `resize()` on every later change, so the initial mount, a route
 * return, a window resize and a late font reflow all take the same path.
 *
 * ── Everything else ────────────────────────────────────────────────────────
 * - `three` and `vanta` are dynamic imports, so ~600 kB of WebGL never enters
 *   the initial bundle and never loads at all under reduced motion.
 * - `mouseControls` is on with `mouseEase`, which lerps the predator toward
 *   the cursor at 0.05/frame instead of snapping — a drift, not a scatter.
 *   Vanta binds that listener to `window` and gates it on the canvas rect, so
 *   the layer stays `pointer-events: none` and never takes a click or a wheel.
 * - `backgroundAlpha: 0` leaves the ground to CSS, so the hero's own
 *   background token carries the theme and the canvas just draws birds.
 * - One instance at a time, guarded by `building` and destroyed on unmount.
 */
const el = ref<HTMLElement | null>(null)
const instance = shallowRef<VantaEffect | null>(null)
const running = ref(false)

const { theme } = useTheme()
const { active } = useMotion()

/**
 * Vanta exposes no pause API. It does keep the animation-loop handle on the
 * instance (`req`) and binds `animationLoop` in its constructor, so pausing is
 * a `cancelAnimationFrame` and resuming is one call back into the loop — a
 * wrapper around the lifecycle Vanta already has, not a patch of its internals.
 * If a future version drops either, `pause()` falls back to a full teardown.
 */
interface VantaEffect {
  destroy: () => void
  resize: () => void
  setOptions: (options: Record<string, unknown>) => void
  animationLoop?: () => void
  req?: number
  prevNow?: number
}

type Factory = (options: Record<string, unknown>) => VantaEffect

let disposed = false
let building = false
let observer: ResizeObserver | null = null
let frame = 0
let lastW = 0
let lastH = 0

/** Vanta's UMD factory lands at a different depth depending on CJS interop. */
const resolveFactory = (mod: unknown): Factory | undefined => {
  let candidate: unknown = mod
  for (let depth = 0; depth < 3; depth++) {
    if (typeof candidate === 'function') return candidate as Factory
    if (!candidate || typeof candidate !== 'object') return undefined
    candidate = (candidate as Record<string, unknown>).default
  }
  return undefined
}

const canRunWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

/** Palette comes from CSS custom properties, so tokens.css stays the one source. */
const palette = () => {
  const fallback = { bg: 0x0e0b0b, c1: 0x5e0e1d, c2: 0xa85c68 }
  if (!el.value) return fallback
  const styles = getComputedStyle(el.value)
  const read = (name: string, or: number) => {
    const match = styles.getPropertyValue(name).trim().match(/^#?([0-9a-f]{6})$/i)
    return match ? parseInt(match[1], 16) : or
  }
  return {
    bg: read('--vanta-bg', fallback.bg),
    c1: read('--vanta-c1', fallback.c1),
    c2: read('--vanta-c2', fallback.c2),
  }
}

const build = async () => {
  if (building || instance.value || disposed || !el.value) return
  building = true

  try {
    const [THREE, birdsModule] = await Promise.all([
      import('three'),
      import('vanta/dist/vanta.birds.min'),
    ])
    const BIRDS = resolveFactory(birdsModule)
    if (typeof BIRDS !== 'function') throw new TypeError('BIRDS factory not found')

    // The component may have unmounted, or the theme flipped, while the chunks
    // were in flight.
    if (disposed || !el.value) return

    const small = window.matchMedia('(max-width: 48rem)').matches
    const { bg, c1, c2 } = palette()

    instance.value = BIRDS({
      el: el.value,
      THREE,

      // A drifting predator rather than a snapping one. Touch and gyro stay
      // off: on a phone the flock should never fight the scroll.
      mouseControls: true,
      mouseEase: true,
      touchControls: false,
      gyroControls: false,

      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,

      // CSS owns the ground so the theme swap costs nothing.
      backgroundAlpha: 0,
      backgroundColor: bg,
      color1: c1,
      color2: c2,
      colorMode: 'lerpGradient',

      // Vanta builds each bird from three triangles and scales the wings by
      // `wingSpan * birdSize` — so 28 × 1.3 was an effective 36-unit half-span
      // against a 39-unit body, well past Vanta's own 30 × 1 default. Pulling
      // both back gives a body longer than its wingspan, which reads as a bird
      // rather than as a wide abstract triangle, and makes a wing turned
      // edge-on vanish quietly instead of flashing a long sliver.
      birdSize: small ? 0.9 : 1.05,
      wingSpan: small ? 20.0 : 24.0,
      speedLimit: 2.4,
      separation: 80.0,
      alignment: 26.0,
      cohesion: 18.0,
      quantity: small ? 1.5 : 2.5,
    })

    running.value = true
  } catch (error) {
    // A failed chunk or an unsupported driver leaves the static hero in place,
    // which is a complete design in its own right.
    if (import.meta.env.DEV) console.warn('[vanta] not initialised:', error)
    running.value = false
  } finally {
    building = false
  }
}

const teardown = () => {
  cancelAnimationFrame(frame)
  instance.value?.destroy()
  instance.value = null
  running.value = false
}

/**
 * Stop drawing without discarding the flock, so resuming picks the birds up
 * exactly where they were instead of scattering a fresh set into frame.
 */
const pause = () => {
  const vanta = instance.value
  if (!vanta) return
  if (typeof vanta.req === 'number' && typeof vanta.animationLoop === 'function') {
    cancelAnimationFrame(vanta.req)
    vanta.req = 0
    running.value = false
    return
  }
  // Vanta changed shape under us: fall back to a clean teardown.
  teardown()
}

const resume = () => {
  const vanta = instance.value
  if (!vanta) return
  if (typeof vanta.animationLoop === 'function') {
    // Drop the stale frame timestamp so the first tick after a long pause is
    // an ordinary delta rather than a jump.
    vanta.prevNow = 0
    vanta.animationLoop()
    running.value = true
  }
}

onMounted(() => {
  if (typeof window === 'undefined' || !el.value) return
  if (!canRunWebGL()) return

  // The observer always runs so the hero's geometry is known the moment the
  // visitor asks for motion; `active` decides whether anything is built.
  observer = new ResizeObserver(() => {
    const host = el.value
    if (!host || disposed) return

    const w = Math.round(host.offsetWidth)
    const h = Math.round(host.offsetHeight)
    // Ignore the collapsed measurements a routed element reports before layout.
    if (w < 2 || h < 2) return

    if (!instance.value) {
      lastW = w
      lastH = h
      if (active.value) void build()
      return
    }

    if (w === lastW && h === lastH) return
    lastW = w
    lastH = h
    // Coalesce a drag-resize into one call per frame.
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => instance.value?.resize())
  })

  observer.observe(el.value)
})

/**
 * The visitor's motion choice. A paused flock is kept in memory and simply
 * stops being drawn; a resume that finds nothing built (paused before the
 * first paint, or reduced motion overridden) builds it now.
 */
watch(active, (on) => {
  if (disposed) return
  if (on) {
    if (instance.value) resume()
    else if (lastW > 1) void build()
    return
  }
  pause()
})

/**
 * Theme change. `setOptions()` merges options but BIRDS bakes its colours into
 * the geometry at construction, so a live recolour is not something Vanta
 * supports — the flock has to be rebuilt. That is a rare, deliberate, user-
 * initiated event, and the CSS ground swaps instantly underneath it either way.
 */
watch(theme, async () => {
  if (!instance.value || disposed) return
  const wasRunning = running.value
  teardown()
  await nextTick()
  lastW = 0
  lastH = 0
  if (active.value) {
    await build()
    if (!wasRunning) pause()
  }
})

onBeforeUnmount(() => {
  disposed = true
  observer?.disconnect()
  observer = null
  teardown()
})

defineExpose({ running })
</script>

<template>
  <div ref="el" class="vanta" :data-running="running" aria-hidden="true" />
</template>

<style scoped>
.vanta {
  position: absolute;
  inset: 0;
  /* The canvas is scenery. Nothing here should ever take a pointer event —
     Vanta's own mouse listener is bound to `window`, so this costs no
     interaction. */
  pointer-events: none;
  background: transparent;
  opacity: 0;
  transition: opacity 900ms var(--ease-out);
}

.vanta :deep(canvas) {
  pointer-events: none !important;
  display: block;
}

.vanta[data-running='true'] {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .vanta {
    transition: none;
  }
}
</style>
