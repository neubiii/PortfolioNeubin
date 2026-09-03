/**
 * Everything the site says about its owner lives here.
 *
 * Nothing in this file is invented: values marked `TODO` are intentionally
 * empty and the UI omits their section rather than filling the gap with copy
 * that was never verified.
 */

export const profile = {
  name: 'Neubin Sebastian',
  handle: 'Neubii',
  /** Rendered as the hero headline. `emphasis` is the word the annotation marks. */
  role: 'Product Developer',
  secondRole: 'UI/UX Developer',
  email: 'neubinsebastian01@gmail.com',

  /** Supporting line under the hero headline. Rewrite in your own voice. */
  intro:
    'Product design and front-end engineering in one pair of hands, so the thing that ships is the thing that was designed.',

  /**
   * Both taken from the author's own URLs already in this repo — the project
   * links under `github.com/neubiii/…` and the post links under
   * `linkedin.com/posts/neubii_…` — not guessed from the name.
   */
  links: [
    { label: 'GitHub', href: 'https://github.com/neubiii', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/neubii/', external: true },
  ],

  /**
   * The ruled facts table beside the About copy.
   *
   * ASSUMPTION — "Based" is inferred from your machine's timezone (Europe/Berlin).
   * Correct it if that is wrong. Delete any row you cannot stand behind; the
   * table renders whatever is in this array and nothing more.
   */
  facts: [
    { term: 'Based', detail: 'Germany' },
    { term: 'Focus', detail: 'Product design · Front-end' },
    { term: 'Stack', detail: 'Vue · TypeScript · Tailwind' },
  ],

  /**
   * TODO — supply real roles. Each entry needs: period, title, org, and one line
   * of what you actually did. Left empty on purpose; the Experience section does
   * not render while this array is empty.
   */
  experience: [] as { period: string; title: string; org: string; note: string }[],
} as const

export type Profile = typeof profile
