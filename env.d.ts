/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

/**
 * Vanta ships no types. Only the BIRDS entry is used, and only through the
 * narrow surface below — options in, an object with `destroy()` out.
 */
declare module 'vanta/dist/vanta.birds.min' {
  const BIRDS: (options: Record<string, unknown>) => { destroy: () => void }
  export default BIRDS
}
