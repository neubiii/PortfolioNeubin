import { vasuTopics, type VasuTopic } from './vasuKnowledge'

/**
 * How Vasu picks what to say. The answers themselves live in
 * `vasuKnowledge.ts` — this file only decides which one a question lands on,
 * and which questions are offered up front.
 */

export type { VasuAction, VasuTopic } from './vasuKnowledge'

export const VASU_WELCOME = [
  'Hey, I’m Vasu. I know a suspicious amount about Neubin’s work.',
  'Ask me about his experience, projects, skills, or how to reach him.',
]

/* Constructive rather than apologetic: say what is missing, then offer what is
   actually here. The starters come back with it. */
export const VASU_FALLBACK =
  'That detail isn’t in Neubin’s portfolio, so I won’t make it up. I can help with his experience, projects, skills, or how he could contribute to a team.'

/** The first impression. Four, deliberately — recruiter questions, not trivia. */
const STARTER_IDS = ['overview', 'team-value', 'sap', 'design-dev']

const byId = new Map(vasuTopics.map((topic) => [topic.id, topic]))

/** Skips an id that no longer exists rather than rendering a blank row. */
const resolve = (ids: readonly string[]): VasuTopic[] => ids.flatMap((id) => byId.get(id) ?? [])

export const vasuStarters = resolve(STARTER_IDS)

export const vasuFollowUps = (topic: VasuTopic): VasuTopic[] => resolve(topic.followUps ?? [])

/** Punctuation and casing out, so `UI/UX` and `front-end` match plain words. */
const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()

/**
 * An alias matches at the start of a word, which is what keeps `ai` out of
 * `email` while still letting `design` catch `designer` and `soft skill` catch
 * `soft skills`.
 */
const mentions = (question: string, alias: string) => question.includes(` ${alias}`)

/**
 * The stand-in for a model: the first topic with a matching alias answers, so
 * `vasuTopics` is ordered specific-first. One `find` to delete in Phase 3.
 */
export const matchTopic = (text: string): VasuTopic | undefined => {
  const question = ` ${normalise(text)}`
  return vasuTopics.find((topic) => topic.aliases.some((alias) => mentions(question, alias)))
}
