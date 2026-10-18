import { vasuTopics, type VasuTopic } from './vasuKnowledge'



export type { VasuAction, VasuTopic } from './vasuKnowledge'

export const VASU_WELCOME = [
  'Hey, I’m Vasu. I know a suspicious amount about Neubin’s work.',
  'Ask me about his experience, projects, skills, or how to reach him.',
]


export const VASU_OFFLINE =
  'I’m having trouble answering that one right now. You can still ask me about Neubin’s experience, projects, skills or contact details.'

/** The first impression. Four, deliberately — recruiter questions, not trivia. */
const STARTER_IDS = ['overview', 'team-value', 'sap', 'design-dev']

const byId = new Map(vasuTopics.map((topic) => [topic.id, topic]))

/** Skips an id that no longer exists rather than rendering a blank row. */
const resolve = (ids: readonly string[]): VasuTopic[] => ids.flatMap((id) => byId.get(id) ?? [])

export const vasuStarters = resolve(STARTER_IDS)

export const vasuFollowUps = (topic: VasuTopic): VasuTopic[] => resolve(topic.followUps ?? [])


const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]+/g, ' ').trim()


const mentions = (question: string, alias: string) => question.includes(` ${alias}`)


export const matchTopic = (text: string): VasuTopic | undefined => {
  const question = ` ${normalise(text)}`
  return vasuTopics.find((topic) => topic.aliases.some((alias) => mentions(question, alias)))
}
