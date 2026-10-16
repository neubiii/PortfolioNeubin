import { computed, ref, watch } from 'vue'

/**
 * Two separate questions, deliberately not one.
 *
 * `motionOk` is the accessibility answer — does this visitor want decorative
 * motion at all — and every section's entrance animation reads it. `active`
 * is the hero background: that question plus WebGL plus the hero's play/pause
 * control, which writes to `background` below and to nothing else. Keeping the
 * control out of `motionOk` is what stops it stripping entrance animations off
 * sections mid-session, leaving unrevealed content stuck at `opacity: 0`.
 *
 * Three states rather than a boolean, so the OS preference and an explicit
 * choice can coexist: 'system' follows `prefers-reduced-motion`, 'on'
 * overrides it, 'off' pauses. Module level and mirrored to sessionStorage, so
 * the choice survives navigating into a project and back.
 */
export type MotionPreference = 'system' | 'on' | 'off'

const KEY = 'motion-preference'

const readStored = (): MotionPreference => {
  try {
    const value = sessionStorage.getItem(KEY)
    return value === 'on' || value === 'off' ? value : 'system'
  } catch {
    return 'system'
  }
}

/** The hero background only. Nothing else reads it. */
const background = ref<MotionPreference>(
  typeof window === 'undefined' ? 'system' : readStored(),
)

watch(background, (value) => {
  try {
    if (value === 'system') sessionStorage.removeItem(KEY)
    else sessionStorage.setItem(KEY, value)
  } catch {
    /* Private mode: the in-memory value still holds for this session. */
  }
})

const reducedMotion = ref(false)
const supported = ref(false)

if (typeof window !== 'undefined') {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = query.matches
  query.addEventListener('change', (event) => {
    reducedMotion.value = event.matches
  })

  try {
    const canvas = document.createElement('canvas')
    supported.value = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    supported.value = false
  }
}

/** Sections across the site. The OS setting alone, so it never flips
 *  mid-session and takes an entrance animation away from unrevealed content. */
const motionOk = computed(() => !reducedMotion.value)

/** The hero's flock: motion, WebGL, and the visitor's own play/pause. */
const active = computed(
  () =>
    supported.value &&
    (background.value === 'on' || (background.value === 'system' && !reducedMotion.value)),
)

export function useMotion() {
  const toggle = () => {
    background.value = active.value ? 'off' : 'on'
  }

  /* Name the action and what it acts on. Under an un-overridden
     reduced-motion setting it offers to start, not to resume. */
  const label = computed(() => {
    if (active.value) return 'Pause background'
    if (background.value === 'system' && reducedMotion.value) return 'Play background'
    return 'Resume background'
  })

  return { background, reducedMotion, motionOk, supported, active, toggle, label }
}
