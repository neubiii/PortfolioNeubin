/** Everything the site says about its owner. */

export const profile = {
  name: 'Neubin Sebastian',
  handle: 'Neubii',
  role: 'Product Developer',
  secondRole: 'UI/UX Developer',
  email: 'neubinsebastian0@gmail.com',

  intro:
    'I work mainly across B2B and enterprise products - complex workflows, data-rich interfaces and AI-assisted experiences and I\u2019m comfortable switching mindsets between designer and developer when the problem needs both.',

  links: [
    { label: 'GitHub', href: 'https://github.com/neubiii', external: true },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/neubii/', external: true },
  ],

  facts: [
    { term: 'Based', detail: 'Germany' },
    { term: 'Focus', detail: 'Product design · Front-end' },
    { term: 'Stack', detail: 'Vue · TypeScript · Tailwind' },
  ],

  /** Empty on purpose — the Experience section does not render while it is. */
  experience: [] as { period: string; title: string; org: string; note: string }[],
} as const

export type Profile = typeof profile
