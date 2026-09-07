import { computed, ref, watch } from 'vue'

/**
 * Whether the hero's decorative motion should run.
 *
 * Three states, not a boolean, so the OS preference and an explicit choice can
 * coexist: 'system' follows `prefers-reduced-motion`, 'on' overrides it, 'off'
 * pauses. Held at module level and mirrored to sessionStorage, so the choice
 * survives navigating into a project and back.
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

/**
 * Motion the visitor is happy with. Reduced motion is authoritative on load,
 * since `preference` starts at 'system' — motion never starts and then stops.
 */
const motionOk = computed(
  () => preference.value === 'on' || (preference.value === 'system' && !reducedMotion.value),
)

/** The same question plus WebGL — the hero's flock, and nothing else. */
const active = computed(() => supported.value && motionOk.value)

export function useMotion() {
  const toggle = () => {
    preference.value = active.value ? 'off' : 'on'
  }

  /* Name the action, not the state: under an un-overridden reduced-motion
     setting the button offers to enable motion, not to resume it. */
  const label = computed(() => {
    if (active.value) return 'Pause motion'
    if (preference.value === 'system' && reducedMotion.value) return 'Enable motion'
    return 'Resume motion'
  })

  return { preference, reducedMotion, motionOk, supported, active, toggle, label }
}
