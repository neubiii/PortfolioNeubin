import { findProject } from './projects'
import { profile } from './profile'

/**
 * WHAT VASU KNOWS
 *
 * One topic per question a recruiter actually asks. Every claim below is
 * traceable to Neubin's CV, the project data in `projects.ts`, the skill list
 * or `profile`. Nothing is inferred beyond what those state.
 *
 * Two lines are worth holding on to while editing:
 *
 *   SAP and Accenture are employment. The AI Expense Agent is his master's
 *   project. Those facts never swap places.
 *
 *   React is where the professional frontend years are. Vue and TypeScript are
 *   current work. Saying it the other way round would overclaim.
 *
 * Primitives — email, links, project titles and routes — are read from the
 * existing data rather than retyped. The prose is curated; the facts are not
 * duplicated.
 *
 * Phase 3 note: this array is the whole context. Serialising `title` + `answer`
 * is all a model would need.
 */

export type VasuAction = {
  label: string
  /** An internal route. Mutually exclusive with `href`. */
  to?: string
  href?: string
}

export type VasuTopic = {
  id: string
  /** Also the question text when the topic is offered as a suggestion. */
  title: string
  /** Lower-case words and phrases that route a typed question here. */
  aliases: string[]
  answer: string
  actions?: VasuAction[]
  /** Ids of two or three topics worth asking next. */
  followUps?: string[]
}

/** Title and route from the project data, so neither is retyped here. */
const work = (slug: string): VasuAction => ({
  label: `Open ${findProject(slug)?.title ?? 'the case study'}`,
  to: `/work/${slug}`,
})

/**
 * Order is the matcher: the first topic with a matching alias answers. Specific
 * employers and named subjects come first, broad topics last, so `background`
 * never outranks `accenture`.
 */
export const vasuTopics: VasuTopic[] = [
  {
    id: 'sap',
    title: 'What did he work on at SAP?',
    aliases: ['sap', 'showroom', 'discover showroom', 'walldorf'],
    answer:
      'At SAP in Walldorf he worked on the Discover SAP Showroom, first as a working student and then as a UI/UX designer, turning complex SAP technology into story-led demo experiences. That work included 10+ high-fidelity Figma prototypes and a showroom design system of 20+ reusable components, built from business requirements he translated into flows and wireframes with product managers. The research was his too: 20+ interviews with global managers feeding personas and journey maps, usability tests with 5–10 participants that cut post-launch rework by around 90%, and one-day design thinking workshops with 10–15 people.',
    followUps: ['ux', 'design-dev', 'accenture'],
  },
  {
    id: 'accenture',
    title: 'What did he do at Accenture?',
    aliases: ['accenture', 'myconcerto', 'bengaluru', 'bangalore'],
    answer:
      'Accenture is where his implementation foundation comes from: two and a half years in Bengaluru as a frontend developer on MyConcerto, turning dense business-development content into client-facing web experiences. He built 100+ responsive templates with Figma, HTML, CSS, JavaScript and React, worked with UX, backend and QA on delivery and bug fixing, ran knowledge-transfer sessions for new joiners, and presented finished work in client demos. That is where he learned to read a design and build it accurately, at volume and on a delivery schedule.',
    followUps: ['frontend', 'sap', 'projects'],
  },
  {
    id: 'ai',
    title: 'Tell me about his AI work',
    aliases: [
      'ai',
      'human in the loop',
      'human centered',
      'agent',
      'agentic',
      'llm',
      'expense',
      'explainab',
      'transparen',
    ],
    answer:
      'He treats AI as a product problem, not just an API call. The AI Expense Agent — his master’s project, not SAP work — flags an expense by citing the exact policy rule behind the decision and stops to ask when its confidence drops, so the person submitting stays accountable for the submission. Expense AI is his own build of the same idea in React and FastAPI. What runs through both is transparency and user control: show the reasoning, keep the uncertain cases reviewable, never decide quietly.',
    actions: [work('ai-expense-agent'), work('expense-ai')],
    followUps: ['ux', 'projects', 'sap'],
  },
  {
    id: 'working-style',
    title: 'How does he work?',
    aliases: [
      'soft skill',
      'working style',
      'work style',
      'how does he work',
      'collaborat',
      'communicat',
      'process',
      'iterat',
      'workshop',
      'mentor',
      'personality',
    ],
    answer:
      'Two habits show up everywhere in his work. He works iteratively: Meet-in-Room went through two rounds of usability testing and an A/B test before he called it finished, and the AI Expense Agent changed shape because of what the interviews said rather than what the brief asked for. And he works across functions — product managers and stakeholders at SAP, UX, backend and QA at Accenture, design thinking workshops with 10–15 participants, knowledge-transfer sessions for new joiners, client demos. He is good at explaining a decision to people who do not share his vocabulary.',
    followUps: ['team-value', 'ux', 'projects'],
  },
  {
    id: 'team-value',
    title: 'How could Neubin add value to my team?',
    aliases: [
      'asset',
      'value',
      'team',
      'hire',
      'hiring',
      'recruit',
      'why should',
      'good fit',
      'fit',
      'contribute',
      'useful to',
      'strengths for',
    ],
    answer:
      'His biggest strength is that design and implementation are the same job to him. At SAP he turned business requirements into flows, wireframes and prototypes, interviewed 20+ global managers and tested with real participants; at Accenture he shipped 100+ responsive templates alongside UX, backend and QA. That means he is useful in a design review and in a frontend stand-up, and a decision made in one survives into the other.\n\nHe also builds things to be reused: a 20+ component design system at SAP, and his own typed Vue component library now. If your product has complex workflows or data-heavy screens, that is familiar ground — both of his roles were enterprise B2B.',
    followUps: ['design-dev', 'frontend', 'projects'],
  },
  {
    id: 'design-dev',
    title: 'How does his design + frontend background help?',
    aliases: [
      'design and development',
      'design and frontend',
      'design and code',
      'design and dev',
      'design development',
      'design + development',
      'design + frontend',
      'design + dev',
      'designer or',
      'developer or designer',
      'ux background',
      'design background',
      'frontend background',
      'development background',
      'both design',
      'bridge',
      'mixed background',
      'mix of',
      'hybrid',
      'crossover',
      'combination',
      'two sides',
    ],
    answer:
      'He is a UI/UX engineer, trained and working professionally on both sides. The frontend came first — two and a half years at Accenture writing HTML, CSS, JavaScript and React — and the UX is formal: a master’s specialising in UX design and usability engineering, then the showroom design work at SAP.\n\nIn practice his design work accounts for what implementation actually costs, and his frontend work keeps the interaction detail that usually gets lost at handover. He switches depending on where the problem is, which is why this portfolio is a Vue 3 application he designed and built himself.',
    followUps: ['team-value', 'frontend', 'ux'],
  },
  {
    id: 'frontend',
    title: 'How strong is he in frontend development?',
    aliases: [
      'frontend',
      'front end',
      'developer',
      'development',
      'engineer',
      'react',
      'vue',
      'javascript',
      'typescript',
      'html',
      'css',
      'tailwind',
      'node',
      'stack',
      'tech stack',
      'coding',
      'implement',
    ],
    answer:
      'His professional foundation is the classic one: HTML, CSS, JavaScript and React, two and a half years of it at Accenture across 100+ responsive templates. That is real production mileage.\n\nHe has kept building on it — TypeScript, Vue 3, component-driven work with Vite, Storybook and Vitest. neubii UI, his own typed Vue 3 component library with design tokens and automated tests, is the clearest example, and this portfolio is Vue 3 and TypeScript written from scratch. His UX experience gives that frontend work stronger product and usability context: he knows what an interface has to do for the person using it, not only how to assemble it.',
    actions: [{ label: 'See the full skillset', to: '/#skillset' }],
    followUps: ['projects', 'design-dev', 'skills'],
  },
  {
    id: 'ux',
    title: 'What UX experience does he have?',
    aliases: [
      'ux',
      'ui ux',
      'user interface',
      'user experience',
      'usability',
      'research',
      'interview',
      'wireframe',
      'prototyp',
      'persona',
      'journey',
      'information architecture',
      'interaction',
      'accessib',
      'figma',
      'design',
      'designer',
      'case study',
    ],
    answer:
      'His UX side is formally trained and professionally practised: a master’s in Applied Computer Science specialising in UX design and usability engineering, plus the showroom design work at SAP. In practice that is user interviews, personas and journey maps, user flows, wireframes, high-fidelity Figma prototypes, design systems, moderated usability testing and design thinking facilitation.\n\nMeet-in-Room is the clearest single example — an eight-week case study that runs interviews through personas, information architecture, prototype, two rounds of usability testing and an A/B test on the booking entry point.',
    actions: [work('meet-in-room'), work('ai-expense-agent')],
    followUps: ['sap', 'design-dev', 'working-style'],
  },
  {
    id: 'skills',
    title: 'What are his strongest technical skills?',
    aliases: [
      'skill',
      'technical',
      'technolog',
      'strongest',
      'strength',
      'tool',
      'proficien',
      'expertise',
      'good at',
    ],
    answer:
      'Strongest in the frontend core — HTML, CSS and JavaScript — with React from professional work, and Vue 3 with TypeScript from his current projects. Around that: Tailwind, Vite, Node and Express, REST APIs, Git and GitHub Actions, and testing with Jest, Vitest and Cypress.\n\nOn the design side it is Figma, backed by design systems, prototyping and usability testing as the actual practice. He also works with AI coding tools — Claude Code, Codex, Figma AI — as part of his normal workflow.',
    actions: [{ label: 'See the full skillset', to: '/#skillset' }],
    followUps: ['frontend', 'projects', 'ux'],
  },
  {
    id: 'projects',
    title: 'What kinds of projects has he built?',
    aliases: [
      'project',
      'built',
      'build',
      'portfolio',
      'show me',
      'example',
      'neubii',
      'neubii ui',
      'component library',
      'library',
      'side project',
    ],
    answer:
      'On the UX side, the two worth reading are AI Expense Agent — agentic UX for SAP Fiori for iOS, from his master’s — and Meet-in-Room, which runs a full research-to-testing process end to end.\n\nOn the development side: Expense AI is a human-in-the-loop build in React and FastAPI, Live Market Dashboard is a team project of eight FastAPI services where he built the real-time gateway, the anomaly and watchlist flows and the stock relationship graph, and Event Scheduler is the testing-heavy one with Jest, Cypress and CI. He is also building neubii UI, his own typed Vue 3 component library with design tokens, Storybook docs and Vitest coverage.',
    actions: [work('ai-expense-agent'), work('meet-in-room'), { label: 'Browse all work', to: '/#work' }],
    followUps: ['frontend', 'ai', 'ux'],
  },
  {
    id: 'education',
    title: 'What is his education?',
    aliases: [
      'education',
      'degree',
      'studi',
      'study',
      'university',
      'master',
      'msc',
      'bachelor',
      'btech',
      'academic',
      'qualification',
      'certification',
      'certified',
    ],
    answer:
      'Two parts. A B.Tech in electronics and communication engineering from Vimal Jyothi Engineering College in Kerala, finished in 2021 — the engineering grounding. Then an M.Sc. in Applied Computer Science at SRH Hochschule Heidelberg from 2024 to 2026, specialising in UX design and usability engineering, which is where the research and usability side became formal training.\n\nAlongside those: SAP Certified Associate in Design Thinking, and the Google UX Design Specialization.',
    followUps: ['overview', 'ux', 'motivation'],
  },
  {
    id: 'roles',
    title: 'What kind of roles is he looking for?',
    aliases: [
      'role',
      'position',
      'job',
      'opportunit',
      'open to',
      'availab',
      'looking for',
      'apply',
      'relocat',
      'visa',
      'based',
      'location',
      'where is he',
    ],
    answer:
      'Frontend and product-facing work where design decisions and implementation sit close together — frontend developer, UI/UX engineer, or product-minded frontend work on B2B and enterprise products. That is the ground he is strongest on: complex workflows and data-heavy interfaces, which is what both SAP and Accenture were.\n\nHe is based in Mannheim, Germany, works in English, and is at A2 German heading for B1. For anything specific — notice, start date, the shape of the role — he is the right person to ask.',
    actions: [{ label: 'Go to Contact', to: '/#contact' }],
    followUps: ['team-value', 'motivation', 'contact'],
  },
  {
    id: 'motivation',
    title: 'What motivates him professionally?',
    aliases: [
      'motivat',
      'want',
      'wants',
      'goal',
      'aspir',
      'ambition',
      'career',
      'drives',
      'next step',
      'grow',
      'growth',
      'why frontend',
      'why ux',
      'future',
    ],
    answer:
      'He moved into UX because he wanted to understand why an interface should work a certain way, not only how to build it — the master’s specialisation and the SAP research work came out of that. He is heading back toward frontend now because he wants to build the things he designs.\n\nHe is taking the UX with him: research and usability thinking applied during implementation rather than handed over at the mockup. neubii UI is a good example — a component library is design-system thinking and frontend engineering in one piece of work.',
    followUps: ['design-dev', 'frontend', 'roles'],
  },
  {
    id: 'contact',
    title: 'How can I contact him?',
    aliases: ['contact', 'email', 'mail', 'reach', 'linkedin', 'github', 'touch', 'connect'],
    answer: `Email is the most direct route: ${profile.email}. He is also on LinkedIn and GitHub, and the Contact section at the foot of the home page has the same details.`,
    actions: [
      { label: 'Email Neubin', href: `mailto:${profile.email}` },
      ...profile.links.map((link) => ({ label: link.label, href: link.href })),
      { label: 'Go to Contact', to: '/#contact' },
    ],
    followUps: ['overview', 'team-value', 'roles'],
  },
  {
    id: 'overview',
    title: 'Tell me about Neubin',
    aliases: [
      'tell me about neubin',
      'about neubin',
      'who is neubin',
      'who is he',
      'tell me about him',
      'about him',
      'himself',
      'background',
      'profile',
      'introduce',
      'summary',
      'overview',
      'story',
      'his experience',
      'work experience',
    ],
    answer:
      'Neubin started on the engineering side — a B.Tech in electronics and communication, then two and a half years at Accenture building responsive web interfaces in HTML, CSS, JavaScript and React.\n\nHe went into a master’s in Applied Computer Science specialising in UX design and usability engineering because he wanted to understand why an interface should work a certain way, not only how to build it. That took him to SAP, where he spent a year and a half designing the Discover SAP Showroom — prototypes, a design system, interviews with global managers, usability tests.\n\nToday he does both: he can run the research, design the thing, and build it. For a product team that means fewer decisions lost between the design file and the browser.',
    followUps: ['team-value', 'frontend', 'projects'],
  },
]
