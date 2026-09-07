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

/**
 * three ships no types at the version Vanta is built against, and nothing in
 * this project touches its API: the namespace is imported once and handed to
 * Vanta whole, which reaches into it itself. So it is declared as the opaque
 * namespace it is used as, rather than pulling `@types/three` in to describe a
 * value that is only ever passed along.
 */
declare module 'three' {
  const THREE: Record<string, unknown>
  export default THREE
}
