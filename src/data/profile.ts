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

  /** Short positioning statement. Rewrite in your own voice — this is scaffolding. */
  intro:
    'I work across the seam between product design and front-end engineering — shaping the interface, then building it.',

  links: [
    { label: 'GitHub', href: 'https://github.com/', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/', external: true },
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
   * Capabilities. Grouped, not scored — no progress bars, no percentages,
   * because neither would mean anything.
   */
  capabilities: [
    {
      group: 'Design',
      items: [
        'Product & interaction design',
        'Information architecture',
        'Interface systems & design tokens',
        'Prototyping',
        'Usability review',
      ],
    },
    {
      group: 'Development',
      items: [
        'Vue 3 · TypeScript',
        'Tailwind CSS · design-system CSS',
        'Component architecture',
        'Accessibility & responsive engineering',
        'Design-to-code translation',
      ],
    },
    {
      group: 'Tools',
      items: ['Figma', 'Git', 'Vite', 'Motion'],
    },
  ],

  /**
   * TODO — supply real roles. Each entry needs: period, title, org, and one line
   * of what you actually did. Left empty on purpose; the Experience section does
   * not render while this array is empty.
   */
  experience: [] as { period: string; title: string; org: string; note: string }[],
} as const

export type Profile = typeof profile
