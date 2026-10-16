import type { SkillItem, SkillKind, SkillLevel } from '@/types'

/**
 * The single source of truth for the Skillset section: no component names a
 * skill, a tool, a level or a domain.
 *
 * Two rules. One entry per thing — anything that could be filed as both a
 * skill and a tool (Git, Docker, GitHub Actions) appears once, as the tool it
 * is. And domains are a list, so a practice living on both sides of the work
 * carries both rather than being split into rows that drift apart.
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
  { id: 'ai-assisted-workflows', name: 'AI-assisted Design Workflows', kind: 'skill', domains: ['ux', 'development'], level: 'advanced' },
  { id: 'web-mobile-app-design', name: 'Web & Mobile App Design', kind: 'skill', domains: ['ux'], level: 'advanced' },

  { id: 'user-research', name: 'User Research', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'information-architecture', name: 'Information Architecture', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'design-systems', name: 'Design Systems', kind: 'skill', domains: ['ux', 'development'], level: 'above-average' },
  { id: 'human-ai-interaction', name: 'Human–AI Interaction Design', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'information-design', name: 'Information Design', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'visual-design', name: 'Visual Design', kind: 'skill', domains: ['ux'], level: 'above-average' },
  { id: 'accessibility', name: 'Accessibility', kind: 'skill', domains: ['ux', 'development'], level: 'above-average' },
  { id: 'learning-experience-design', name: 'Learning Experience Design', kind: 'skill', domains: ['ux'], level: 'above-average' },

  { id: 'behavioral-analysis', name: 'Behavioral Analysis', kind: 'skill', domains: ['ux'], level: 'working-knowledge' },

  /* ── Development — practice ────────────────────────────────────────────── */
  { id: 'front-end-development', name: 'Front-end Development', kind: 'skill', domains: ['development'], level: 'advanced' },
  { id: 'html', name: 'HTML', kind: 'skill', domains: ['development'], level: 'advanced' },
  { id: 'css', name: 'CSS', kind: 'skill', domains: ['development'], level: 'advanced' },
  { id: 'javascript', name: 'JavaScript', kind: 'skill', domains: ['development'], level: 'advanced' },
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
  { id: 'git', name: 'Git', kind: 'tool', domains: ['development'], level: 'above-average' },
  { id: 'vite', name: 'Vite', kind: 'tool', domains: ['development'], level: 'above-average' },

  { id: 'docker', name: 'Docker', kind: 'tool', domains: ['development'], level: 'working-knowledge' },
  { id: 'github-actions', name: 'GitHub Actions', kind: 'tool', domains: ['development'], level: 'working-knowledge' },
]

/* ── Selectors ───────────────────────────────────────────────────────────
   So a component asks for what it needs rather than filtering inline. */

const rank = (item: SkillItem) => LEVELS.indexOf(item.level)

/** Strongest first, input order preserved inside a level. */
export const byLevel = (items: SkillItem[]): SkillItem[] =>
  [...items].sort((a, b) => rank(a) - rank(b))

export const ofKind = (kind: SkillKind): SkillItem[] => skills.filter((item) => item.kind === kind)

/** Items practised on both sides of the work. */
