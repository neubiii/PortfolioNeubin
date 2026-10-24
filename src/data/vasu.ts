import { vasuTopics, type VasuTopic } from './vasuKnowledge'



export type { VasuAction, VasuTopic } from './vasuKnowledge'

export const VASU_WELCOME = [
  'Welcome to Neubin’s portfolio.',
  'I’m Vasu, your guide to Neubin’s work.',
  'Ask me about his experience, projects, skills, or how he works.',
]


export const VASU_OFFLINE =
  'I’m having trouble answering that one right now. You can still ask me about Neubin’s experience, projects, skills or contact details.'

/** Two, deliberately: suggestions beside the input, not a menu to pick from. */
const STARTER_IDS = ['overview', 'team-value']

const byId = new Map(vasuTopics.map((topic) => [topic.id, topic]))

/** Skips an id that no longer exists rather than rendering a blank row. */
const resolve = (ids: readonly string[]): VasuTopic[] => ids.flatMap((id) => byId.get(id) ?? [])

export const vasuStarters = resolve(STARTER_IDS)

export const vasuFollowUps = (topic: VasuTopic): VasuTopic[] => resolve(topic.followUps ?? [])


const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()


const mentions = (question: string, alias: string) => question.includes(` ${alias}`)

/**
 * What the question matched in one topic: every alias that hit, and how many of
 * those were distinctive rather than one of the topic's own `generic` words.
 */
const score = (question: string, topic: VasuTopic) => {
  const matched = topic.aliases.filter((alias) => mentions(question, alias))
  const generic = topic.generic ?? []
  return {
    total: matched.length,
    distinctive: matched.filter((alias) => !generic.includes(alias)).length,
  }
}

/**
 * The offline half of Vasu, used only when `/api/chat` gives nothing back. It
 * decides one thing: is this question clearly asking for a topic I hold? The
 * best-matching topic wins, and it has to be carried by at least one
 * distinctive alias — `sap`, `accenture`, `frontend`, `ux`, `ai`, `contact` do
 * that on a single hit, while a topic's own generic words add weight but never
 * carry it alone. So "has he managed an engineering team" finds only 'team' in
 * team-value and 'engineer' in frontend, and answers nothing.
 *
 * `undefined` leaves the panel on VASU_OFFLINE, which is honest, where a
 * loosely matched topic would have answered a different question. Offline
 * coverage is worth less here than not misleading a recruiter.
 */
export const matchTopic = (text: string): VasuTopic | undefined => {
  const question = ` ${normalise(text)}`

  /* Most aliases matched wins, first topic on a tie — the same rule the server
     selector uses, so both halves of Vasu read a question the same way. */
  let best: VasuTopic | undefined
  let most = 0

  for (const topic of vasuTopics) {
    const { total, distinctive } = score(question, topic)
    if (distinctive > 0 && total > most) {
      best = topic
      most = total
    }
  }

  return best
}
