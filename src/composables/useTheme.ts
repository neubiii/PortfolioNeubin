import { ref, watchEffect } from 'vue'

export type Theme = 'light' | 'dark'

const read = (): Theme => {
  if (typeof document === 'undefined') return 'light'
  return (document.documentElement.dataset.theme as Theme) ?? 'light'
}

// Module-level so every mount of the toggle shares one source of truth.
const theme = ref<Theme>(read())

watchEffect(() => {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme.value
  try {
    localStorage.setItem('theme', theme.value)
  } catch {
    /* Private mode: the in-memory value still works for this session. */
  }
})

export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggle }
}
