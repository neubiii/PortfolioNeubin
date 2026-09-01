import type { WritingEntry } from '@/types'

/**
 * WRITING
 *
 * The writing lives on LinkedIn. This file is an index to it, not a copy: each
 * entry carries the title, hook, summary and topics the author supplied, and
 * the link to the original post. Nothing is transcribed from the posts, and no
 * engagement figures are stored or shown.
 *
 * Order is editorial rather than chronological — the general argument opens,
 * the three-part series runs together in sequence, and the research reflection
 * closes.
 */

/** Shared by the three parts, so the run reads as one body of work. */
export const AI_UX_PATTERNS = 'AI UX Patterns Series'

export const writing: WritingEntry[] = [
  {
    id: 'designing-ux-for-ai',
    title: 'Designing UX for AI',
    hook: 'When AI starts making decisions, usability is only half the problem. Trust becomes part of the interface.',
    summary:
      'A reflection on designing AI experiences around transparency, human control and understandable reasoning. It explores the tension between automation and oversight, why users resist black-box decisions, and how context, tone and multimodal interaction affect trust.',
    topics: ['AI UX', 'Human–AI Interaction', 'Explainable AI', 'Trust'],
    source: 'LinkedIn',
    href: 'https://www.linkedin.com/posts/neubii_uxdesign-aiux-humanaiinteraction-activity-7435764522113622017-xE0i',
  },
  {
    id: 'ai-ux-patterns-1',
    title: 'AI UX Patterns — Part 1',
    series: AI_UX_PATTERNS,
    hook: 'Patterns are starting points, not templates.',
    summary:
      'The first part of my AI UX Patterns series, bringing together recurring interaction concepts found across AI-powered products. The series focuses on what each pattern does, its UX impact, where it can be useful, and how it might appear in a simple interface.',
    topics: ['AI UX', 'Design Patterns', 'Product Design', 'Interaction Design'],
    source: 'LinkedIn',
    href: 'https://www.linkedin.com/posts/neubii_aiuxpatterns-neubinsebastian-activity-7491923287954894848-RsRc',
  },
  {
    id: 'ai-ux-patterns-2',
    title: 'AI UX Patterns — Part 2',
    series: AI_UX_PATTERNS,
    hook: 'The same AI pattern can work very differently depending on who it is designed for.',
    summary:
      'Part 2 continues the series with another set of common patterns in AI-powered products. The focus is on understanding the underlying UX concept rather than copying a fixed implementation, because users, business needs, technical constraints and product scope change how a pattern should be designed.',
    topics: ['AI UX', 'Design Patterns', 'Product Design', 'UX Strategy'],
    source: 'LinkedIn',
    href: 'https://www.linkedin.com/posts/neubii_aiuxpatternspart2-activity-7493975678091014144-z5Jo',
  },
  {
    id: 'ai-ux-patterns-3',
    title: 'AI UX Patterns — Part 3',
    series: AI_UX_PATTERNS,
    hook: 'As AI becomes more capable, users still need to know when they are in control.',
    summary:
      'Five AI UX concepts centered around user trust and agent control. This part looks at interaction ideas that help people feel secure, informed and in control while working with increasingly autonomous AI systems.',
    topics: ['AI UX', 'User Trust', 'Agent Control', 'Human–AI Interaction'],
    source: 'LinkedIn',
    href: 'https://www.linkedin.com/posts/neubii_aiuxpatternsseriespart3-activity-7497699416200482816-FtEl',
  },
  {
    id: 'researching-mentalhealthai',
    title: 'Researching MentalHealthAI',
    hook: 'Before designing an AI companion, I wanted to understand what people actually do when emotions peak.',
    summary:
      'A research reflection from my MentalHealthAI project exploring emotional behaviour and expectations around AI-based support. The work combined quantitative and qualitative research and informed problem statements, behavioural personas, UX goals and success measures.',
    topics: ['User Research', 'Mental Health Tech', 'AI UX', 'Product Design'],
    source: 'LinkedIn',
    href: 'https://www.linkedin.com/posts/neubii_uxdesign-userresearch-mentalhealthtech-activity-7398043308272308225-6aYt',
  },
]

export const findWriting = (id: string): WritingEntry | undefined =>
  writing.find((entry) => entry.id === id)

/**
 * Where an entry sits inside its series, counted from the list rather than
 * stored — a fourth part would number itself.
 */
export const seriesPosition = (
  entry: WritingEntry,
): { index: number; total: number } | undefined => {
  if (!entry.series) return undefined
  const parts = writing.filter((item) => item.series === entry.series)
  return { index: parts.indexOf(entry) + 1, total: parts.length }
}
