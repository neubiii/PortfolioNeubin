<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useMotion } from '@/composables/useMotion'

/**
 * Vanta BIRDS as the hero's atmosphere.
 *
 * Two Vanta quirks shape this file; both are worked around deliberately.
 *
 * 1. Sizing. Vanta measures its container once in `setSize()`, clamped to
 *    `minWidth`/`minHeight`, and BIRDS overrides `onResize()` with an empty
 *    method — so nothing ever corrects it. On a return visit the dynamic
 *    imports resolve from cache while the routed hero is still mid-transition
 *    and measures ~0, which the clamp turns into 200x200: a correctly sized
 *    canvas with a camera framed for a tiny box. A ResizeObserver drives the
 *    lifecycle instead, constructing on the first non-zero measurement and
 *    calling `resize()` on every change, so mount, route return, window resize
 *    and late font reflow all take one path.
 *
 * 2. Texture width. BIRDS keeps its simulation size in a module-level `WIDTH`,
 *    seeded at 32 and written only inside the geometry builder — which
 *    `onInit()` runs *after* the GPU compute renderer. So the first build in a
 *    page simulates into 32x32 while its geometry addresses `2 ** quantity`.
 *    Two things fix it: `QUANTITY` must be an integer (a fractional one puts
 *    every reference UV between texel centres, and a cancelled bilinear blend
 *    makes the vertex shader's orientation basis NaN — the collapsed,
 *    'one-winged' triangles), and `build()` verifies the allocated texture
 *    against `2 ** QUANTITY`, rebuilding once if they disagree.
 *
 * `three` and `vanta` are dynamic imports, so ~600 kB of WebGL never enters the
 * initial bundle and never loads at all under reduced motion.
 */
const el = ref<HTMLElement | null>(null)
const instance = shallowRef<VantaEffect | null>(null)
const running = ref(false)

const { theme } = useTheme()
const { active } = useMotion()

/**
 * Vanta exposes no pause API, but it keeps the animation-loop handle on the
 * instance (`req`) and binds `animationLoop` in its constructor — so pausing is
 * a `cancelAnimationFrame` and resuming is one call back into that loop. If a
 * future version drops either, `pause()` falls back to a full teardown.
 */
interface VantaEffect {
  destroy: () => void
  resize: () => void
  setOptions: (options: Record<string, unknown>) => void
  animationLoop?: () => void
  req?: number
  prevNow?: number
  /** Vanta's GPGPU simulation — read only to verify the texture it allocated. */
  gpuCompute?: { variables?: { renderTargets?: { width?: number }[] }[] }
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

/** Colours come from CSS custom properties, so tokens.css stays the one source. */
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

/**
 * Flock size as Vanta's exponent: it simulates a `2 ** QUANTITY` square of
 * boids, so 4 ** QUANTITY birds — 64 on desktop, 16 on a phone. Integers only;
 * see the WIDTH note above.
 */
const QUANTITY = { wide: 3, small: 2 }

/** The texture width Vanta's geometry will address, for the check in build(). */
const expectedWidth = (quantity: number) => 2 ** quantity

const computeWidth = (vanta: VantaEffect) =>
  vanta.gpuCompute?.variables?.[0]?.renderTargets?.[0]?.width

const build = async (correcting = false): Promise<void> => {
  if (building || instance.value || disposed || !el.value) return
  building = true

  try {
    const [THREE, birdsModule] = await Promise.all([
      import('three'),
      import('vanta/dist/vanta.birds.min'),
    ])
    const BIRDS = resolveFactory(birdsModule)
    if (typeof BIRDS !== 'function') throw new TypeError('BIRDS factory not found')

    // The component may have unmounted, or the theme flipped, mid-import.
    if (disposed || !el.value) return

    const small = window.matchMedia('(max-width: 48rem)').matches
    const quantity = small ? QUANTITY.small : QUANTITY.wide
    const { bg, c1, c2 } = palette()

    instance.value = BIRDS({
      el: el.value,
      THREE,

      // A drifting predator rather than a snapping one. Touch and gyro stay off
      // so the flock never fights a phone's scroll.
      mouseControls: true,
      mouseEase: true,
      touchControls: false,
      gyroControls: false,

      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,

      backgroundAlpha: 0,
      backgroundColor: bg,
      color1: c1,
      color2: c2,
      colorMode: 'lerpGradient',

      // Vanta scales the wings by `wingSpan * birdSize`, so its defaults gave a
      // half-span wider than the body. Pulled back so a bird reads as a bird,
      // and a wing turned edge-on vanishes quietly instead of flashing.
      birdSize: small ? 0.9 : 1.05,
      wingSpan: small ? 20.0 : 24.0,
      speedLimit: 2.4,
      separation: 80.0,
      alignment: 26.0,
      cohesion: 18.0,
      quantity,
    })

    running.value = true

    // Did Vanta simulate into the texture its geometry addresses? On the first
    // build in a page it will not have (see the WIDTH note above). Rebuild once
    // through this same path; by then the geometry step has written WIDTH.
    const built = computeWidth(instance.value)
    if (!correcting && built !== undefined && built !== expectedWidth(quantity)) {
      teardown()
      building = false
      return build(true)
    }
  } catch (error) {
    // A failed chunk or an unsupported driver leaves the static hero in place.
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

/** Stop drawing without discarding the flock, so resuming picks the birds up
 *  where they were instead of scattering a fresh set into frame. */
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
    // Drop the stale frame timestamp so the first tick after a pause is an
    // ordinary delta rather than a jump.
    vanta.prevNow = 0
    vanta.animationLoop()
    running.value = true
  }
}

onMounted(() => {
  if (typeof window === 'undefined' || !el.value) return
  if (!canRunWebGL()) return

  // The observer always runs, so the hero's geometry is known the moment the
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

/** A paused flock stays in memory and simply stops being drawn; a resume that
 *  finds nothing built (paused before first paint, or reduced motion
 *  overridden) builds it now. */
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
 * BIRDS bakes its colours into the geometry at construction, so `setOptions()`
 * cannot recolour a live flock — a theme change has to rebuild it.
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
  /* Scenery: never takes a pointer event. Vanta binds its own mouse listener
     to `window`, so this costs no interaction. */
  pointer-events: none;
  background: transparent;
  opacity: 0;
  transition: opacity 900ms var(--ease-out);
}

.vanta :deep(canvas) {
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
