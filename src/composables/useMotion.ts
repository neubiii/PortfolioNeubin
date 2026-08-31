import { computed, ref, watch } from 'vue'

/**
 * Whether the hero's decorative motion should run.
 *
 * Three states rather than a boolean, so the OS preference and an explicit
 * choice can coexist:
 *
 *   'system' — follow `prefers-reduced-motion` (the default)
 *   'on'     — the visitor asked for motion, overriding a reduced-motion OS setting
 *   'off'    — the visitor paused it
 *
 * Module-level refs plus `sessionStorage`: the choice survives navigating into
 * a project and back for the length of the session, and is forgotten after it.
 * Deliberately not a store — one preference does not need infrastructure.
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

const preference = ref<MotionPreference>(
  typeof window === 'undefined' ? 'system' : readStored(),
)

watch(preference, (value) => {
  try {
    if (value === 'system') sessionStorage.removeItem(KEY)
    else sessionStorage.setItem(KEY, value)
  } catch {
    /* private mode — the in-memory value still holds for this session */
  }
})

/** Reactive, so a visitor toggling the OS setting is picked up live. */
const reducedMotion = ref(false)
/** WebGL support is fixed for the session; no point re-testing it. */
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

/**
 * The single answer the hero acts on. Reduced motion is authoritative on load,
 * because `preference` starts at `'system'` — nothing ever starts and then
 * stops.
 */
const active = computed(
  () =>
    supported.value &&
    (preference.value === 'on' || (preference.value === 'system' && !reducedMotion.value)),
)

export function useMotion() {
  const toggle = () => {
    preference.value = active.value ? 'off' : 'on'
  }

  /**
   * The button names the action it performs. Under a reduced-motion OS setting
   * that has not been overridden it offers to enable motion rather than to
   * "resume" something the visitor never saw.
   */
  const label = computed(() => {
    if (active.value) return 'Pause motion'
    if (preference.value === 'system' && reducedMotion.value) return 'Enable motion'
    return 'Resume motion'
  })

  return { preference, reducedMotion, supported, active, toggle, label }
}
