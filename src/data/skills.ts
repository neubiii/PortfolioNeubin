import type { SkillDomain, SkillItem, SkillKind, SkillLevel } from '@/types'

/**
 * SKILLSET
 *
 * The single source of truth for everything the Skillset section shows. No
 * component names a skill, a tool, a level or a domain — they all read from
 * here, so promoting something is a one-word edit on one line:
 *
 *   level: 'above-average'  →  level: 'advanced'
 *
 * Two rules hold this file together.
 *
 * One entry per thing. Where a subject was supplied under both a skills
 * heading and a tools heading — Git, Docker, GitHub Actions — it appears once,
 * as the tool it is. Nothing is listed twice under a different hat.
 *
 * Domains are a list, not a choice. A practice that genuinely lives on both
 * sides of the work carries `['ux', 'development']` rather than being split
 * into two rows that then drift apart.
 */

/** Strongest first. The display order of the whole section comes from this. */
export const LEVELS: readonly SkillLevel[] = [
  'advanced',
  'above-average',
  'working-knowledge',
  'familiar',
]

/** Written-out form, kept beside the levels so no component spells them. */
export const LEVEL_LABEL: Record<SkillLevel, string> = {
  advanced: 'Advanced',
  'above-average': 'Above average',
  'working-knowledge': 'Working knowledge',
  familiar: 'Familiar',
}

export const DOMAIN_LABEL: Record<SkillDomain, string> = {
  ux: 'UI/UX',
  development: 'Development',
}

export const skills: SkillItem[] = [
  /* ── UI/UX — practice ──────────────────────────────────────────────────── */
  { id: 'ux-design', name: 'User Experience Design', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'interaction-design', name: 'Interaction Design', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'wireframing-prototyping', name: 'Wireframing & Prototyping', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'user-flows', name: 'User Flows', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'usability-testing', name: 'Usability Testing', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'design-thinking', name: 'Design Thinking', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'storytelling', name: 'Storytelling', kind: 'skill', domains: ['ux'], level: 'advanced' },
  { id: 'ai-ux-patterns', name: 'AI UX Patterns', kind: 'skill', domains: ['ux'], level: 'advanced' },
  // Cross-domain: the same habit of working with AI shows up in the build.
  { id: 'ai-assisted-workflows', name: 'AI-assisted Design Workflows', kind: 'skill', domains: ['ux', 'development'], level: 'advanced' },
  { id: 'web-mobile-app-design', name: 'Web & Mobile App Design', kind: 'skill', domains: ['ux'], level: 'advanced' },

  { id: 'user-research', name: 'User Research', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'information-architecture', name: 'Information Architecture', kind: 'skill', domains: ['ux'], level: 'above-average' },
  // Cross-domain: drawn as a system, then shipped as tokens and components.
  { id: 'design-systems', name: 'Design Systems', kind: 'skill', domains: ['ux', 'development'], level: 'above-average' },
  { id: 'human-ai-interaction', name: 'Human–AI Interaction Design', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'information-design', name: 'Information Design', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'visual-design', name: 'Visual Design', kind: 'skill', domains: ['ux'], level: 'above-average' },
  // Cross-domain: a design decision and an implementation one in equal measure.
  { id: 'accessibility', name: 'Accessibility', kind: 'skill', domains: ['ux', 'development'], level: 'above-average' },
  { id: 'learning-experience-design', name: 'Learning Experience Design', kind: 'skill', domains: ['ux'], level: 'above-average' },

  { id: 'behavioral-analysis', name: 'Behavioral Analysis', kind: 'skill', domains: ['ux'], level: 'working-knowledge' },

  /* ── Development — practice ────────────────────────────────────────────── */
  { id: 'front-end-development', name: 'Front-end Development', kind: 'skill', domains: ['development'], level: 'advanced' },
  { id: 'html', name: 'HTML', kind: 'skill', domains: ['development'], level: 'advanced' },
  { id: 'css', name: 'CSS', kind: 'skill', domains: ['development'], level: 'advanced' },
  { id: 'javascript', name: 'JavaScript', kind: 'skill', domains: ['development'], level: 'advanced' },
  // Cross-domain: the layout decision and the media query are the same call.
  { id: 'responsive-development', name: 'Responsive Development', kind: 'skill', domains: ['development', 'ux'], level: 'advanced' },

  { id: 'typescript', name: 'TypeScript', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'vue', name: 'Vue.js', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'react', name: 'React', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'rest-api-integration', name: 'REST API Integration', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'component-architecture', name: 'Component Architecture', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'state-management', name: 'State Management', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'testing', name: 'Testing', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'jest', name: 'Jest', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'cypress', name: 'Cypress', kind: 'skill', domains: ['development'], level: 'above-average' },
  { id: 'node-express', name: 'Node.js / Express', kind: 'skill', domains: ['development'], level: 'above-average' },

  { id: 'fastapi', name: 'FastAPI', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'python', name: 'Python', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'mongodb', name: 'MongoDB', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'sqlite', name: 'SQLite', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'redis', name: 'Redis', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'websockets', name: 'WebSockets', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'microservices', name: 'Microservices', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'ai-llm-integration', name: 'AI / LLM Integration', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'ocr-integration', name: 'OCR Integration', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'neo4j', name: 'Neo4j', kind: 'skill', domains: ['development'], level: 'working-knowledge' },
  { id: 'qdrant', name: 'Qdrant', kind: 'skill', domains: ['development'], level: 'working-knowledge' },

  /* ── Design and product tools ──────────────────────────────────────────── */
  { id: 'figma', name: 'Figma', kind: 'tool', domains: ['ux'], level: 'advanced' },
  { id: 'figjam', name: 'FigJam', kind: 'tool', domains: ['ux'], level: 'advanced' },

  // Cross-domain: it exists to carry a design across into code.
  { id: 'figma-make', name: 'Figma Make', kind: 'tool', domains: ['ux', 'development'], level: 'advanced' },
  { id: 'canva', name: 'Canva', kind: 'tool', domains: ['ux'], level: 'above-average' },
  { id: 'tsc-cms', name: 'TSC CMS', kind: 'tool', domains: ['ux'], level: 'above-average' },
  { id: 'sharepoint', name: 'SharePoint', kind: 'tool', domains: ['ux'], level: 'above-average' },

  { id: 'framer', name: 'Framer', kind: 'tool', domains: ['ux'], level: 'working-knowledge' },
  { id: 'after-effects', name: 'Adobe After Effects', kind: 'tool', domains: ['ux'], level: 'working-knowledge' },
  { id: 'brightsign-author', name: 'BrightSign Author', kind: 'tool', domains: ['ux'], level: 'working-knowledge' },

  { id: 'photoshop', name: 'Adobe Photoshop', kind: 'tool', domains: ['ux'], level: 'familiar' },
  { id: 'illustrator', name: 'Adobe Illustrator', kind: 'tool', domains: ['ux'], level: 'familiar' },

  /* ── Development and AI tools ──────────────────────────────────────────── */
  { id: 'vs-code', name: 'VS Code', kind: 'tool', domains: ['development'], level: 'advanced' },

  { id: 'claude-code', name: 'Claude Code', kind: 'tool', domains: ['development'], level: 'above-average' },
  { id: 'codex', name: 'Codex', kind: 'tool', domains: ['development'], level: 'above-average' },
  { id: 'github', name: 'GitHub', kind: 'tool', domains: ['development'], level: 'above-average' },
  // Also supplied as the skill "Git / Version Control", at the same level.
  { id: 'git', name: 'Git', kind: 'tool', domains: ['development'], level: 'above-average' },
  { id: 'vite', name: 'Vite', kind: 'tool', domains: ['development'], level: 'above-average' },

  // Also supplied as a development skill, at the same level.
  { id: 'docker', name: 'Docker', kind: 'tool', domains: ['development'], level: 'working-knowledge' },
  // Also supplied as the skill "CI / GitHub Actions", at the same level.
  { id: 'github-actions', name: 'GitHub Actions', kind: 'tool', domains: ['development'], level: 'working-knowledge' },
]

/* ── Selectors ─────────────────────────────────────────────────────────────
   Small, so a component asks for what it needs rather than filtering an array
   inline and quietly encoding its own idea of the taxonomy. */

const rank = (item: SkillItem) => LEVELS.indexOf(item.level)

/** Strongest first, input order preserved inside a level. */
export const byLevel = (items: SkillItem[]): SkillItem[] =>
  [...items].sort((a, b) => rank(a) - rank(b))

export const inDomain = (domain: SkillDomain, kind?: SkillKind): SkillItem[] =>
  skills.filter((item) => item.domains.includes(domain) && (!kind || item.kind === kind))

export const ofKind = (kind: SkillKind): SkillItem[] => skills.filter((item) => item.kind === kind)

/** Items practised on both sides of the work. */
export const crossDisciplinary = (): SkillItem[] => skills.filter((item) => item.domains.length > 1)

export const findSkill = (id: string): SkillItem | undefined => skills.find((item) => item.id === id)
