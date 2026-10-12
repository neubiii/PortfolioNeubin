import { profile } from './profile'

/**
 * Everything Vasu can say in Phase 1. The answers are written from what the
 * portfolio already states — About, the project data and the skill list — so
 * nothing here claims more than the site does. Contact details come from
 * `profile`, which stays the single source.
 */

export type VasuAction = {
  label: string
  /** An internal route. Mutually exclusive with `href`. */
  to?: string
  href?: string
}

export type VasuReply = {
  text: string
  actions?: VasuAction[]
}

export type VasuStarter = {
  id: string
  label: string
  /** Lower-case fragments that route a typed question to this answer. */
  keywords: string[]
  reply: VasuReply
}

export const VASU_WELCOME = [
  'Hey, I’m Vasu. I know a suspicious amount about Neubin’s work.',
  'Ask me about his experience, projects, skills, or how to reach him.',
]

export const VASU_FALLBACK =
  'I don’t know that one yet — I’m still learning Neubin’s portfolio. Try one of these instead.'

export const vasuStarters: VasuStarter[] = [
  {
    id: 'sap',
    label: 'What did Neubin work on at SAP?',
    keywords: ['sap', 'experience', 'work on', 'worked', 'accenture', 'role', 'job'],
    reply: {
      /* The About count is the only employment fact the portfolio states; the
         case studies are projects, not role evidence, so none is cited here. */
      text:
        'The About section counts 3.5 years of professional experience across SAP and Accenture, but the portfolio doesn’t break that down role by role — so I won’t guess at it. What it does state is the kind of work he does: B2B and enterprise products, complex workflows, data-rich interfaces and AI-assisted experiences, moving between design and front-end as the problem needs. For what he owned inside SAP specifically, ask him directly — that one is his to answer.',
      actions: [
        { label: 'Read the About section', to: '/#about' },
        { label: 'Ask Neubin directly', to: '/#contact' },
      ],
    },
  },
  {
    id: 'frontend',
    label: 'Which frontend technologies does he use?',
    keywords: [
      'frontend',
      'front-end',
      'front end',
      'tech',
      'stack',
      'vue',
      'react',
      'typescript',
      'javascript',
      'develop',
      'code',
    ],
    reply: {
      text:
        'Mostly Vue and TypeScript — the stack listed on this site is Vue · TypeScript · Tailwind. He also works in React, plain HTML, CSS and JavaScript, Node.js / Express and REST APIs, with Jest and Cypress for testing. Python, FastAPI and WebSockets show up on the back-end side of a few development projects.',
      actions: [{ label: 'See the full skillset', to: '/#skillset' }],
    },
  },
  {
    id: 'ux',
    label: 'Show me a UX project',
    keywords: ['ux', 'design', 'case study', 'project', 'portfolio'],
    reply: {
      text:
        'Start with Meet-in-Room, an 8-week solo case study at SRH University Heidelberg. Nobody could tell whether a campus meeting room was free without walking to it, so he made live availability visible and bookable in a few taps. It runs the whole process: interviews, personas, information architecture, prototype, two rounds of usability testing and an A/B test on the booking entry point.',
      actions: [
        { label: 'Open Meet-in-Room', to: '/work/meet-in-room' },
        { label: 'Browse all work', to: '/#work' },
      ],
    },
  },
  {
    id: 'contact',
    label: 'How can I contact him?',
    keywords: ['contact', 'email', 'mail', 'reach', 'linkedin', 'github', 'hire', 'touch'],
    reply: {
      text: `Email is the most direct route: ${profile.email}. He is also on LinkedIn and GitHub, and the Contact section at the foot of the home page has the same details.`,
      actions: [
        { label: 'Email Neubin', href: `mailto:${profile.email}` },
        ...profile.links.map((link) => ({ label: link.label, href: link.href })),
        { label: 'Go to Contact', to: '/#contact' },
      ],
    },
  },
]
