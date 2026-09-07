/**
 * Content model for the portfolio. Adding a project should be a data change,
 * not a component change.
 */

export type Discipline = 'ux' | 'development' | 'writing'

export interface MediaItem {
  /** Asset key, e.g. `meet-in-room/user-flow`. Resolved by `@/data/assets`. */
  src: string
  /** Empty string marks the image decorative; it is then hidden from AT. */
  alt: string
  /**
   * True intrinsic aspect, e.g. `786/1704`. Reserves space before load and is
   * dropped once the real dimensions are known, so a stale value here can
   * never crop or letterbox the image.
   */
  ratio?: string
  /**
   * `natural`  (default) — intrinsic aspect, no frame, never cropped.
   * `longform` — a full-page capture too tall to sit inline (evergrove/page is
   *              2882×8958). Collapsed with an explicit expand control.
   * `crop`     — a cropped tile at a ratio the component supplies, so the work
   *              index keeps one rhythm.
   */
  display?: 'natural' | 'longform' | 'crop'
  /** `object-position` for the cropped preview, e.g. `'center top'`. Set it on
   *  a cover whose subject sits off-centre and would otherwise be trimmed. */
  previewPosition?: string
  caption?: string
}

export interface ProjectMeta {
  role?: string
  platform?: string
  timeline?: string
  method?: string
  output?: string
  context?: string
}

/** A call to action on a project page. A project with no real destination
 *  carries no link. */
export interface ProjectLink {
  label: string
  href: string
  kind: 'prototype' | 'repo' | 'live' | 'writeup'
}

export interface TextSection {
  kind: 'text'
  id: string
  title: string
  marker?: string
  lede?: string
  body: string[]
}

export interface MediaSection {
  kind: 'media'
  id: string
  title?: string
  marker?: string
  layout: 'full' | 'pair' | 'trio' | 'grid'
  items: MediaItem[]
}

/** Two framings side by side — "the ask" against "the real problem". */
export interface SplitSection {
  kind: 'split'
  id: string
  title: string
  marker?: string
  columns: { label: string; heading: string; body: string }[]
}

export interface StatSection {
  kind: 'stats'
  id: string
  title?: string
  marker?: string
  items: { value: string; label: string; note: string }[]
  footnote?: string
}

export interface QuoteSection {
  kind: 'quote'
  id: string
  text: string
  attribution: string
}

/** An ordered sequence — a pipeline, a set of numbered decisions. */
export interface StepsSection {
  kind: 'steps'
  id: string
  title?: string
  marker?: string
  lede?: string
  items: { label: string; heading: string; body: string }[]
}

/** Term/detail rows rendered as a ruled table. */
export interface ListSection {
  kind: 'list'
  id: string
  title: string
  marker?: string
  items: { term: string; detail: string }[]
}

export type CaseSection =
  | TextSection
  | MediaSection
  | SplitSection
  | StatSection
  | QuoteSection
  | StepsSection
  | ListSection

/**
 * A piece of writing published elsewhere. Deliberately not a `Project`: there
 * is no page to route to, so modelling it as one would mean empty project
 * pages. Its only destination is the original post.
 */
export interface WritingEntry {
  /** Selection key for the preview. Not a route — writing has none. */
  id: string
  title: string
  /** Set when the piece belongs to a run; parts then share a treatment. */
  series?: string
  hook: string
  summary: string
  topics: string[]
  source: string
  /** The original post. Always external, always a new tab. */
  href: string
}

/** Sections that carry a heading are the ones the contents rail lists. */
export type TitledSection = Extract<CaseSection, { title?: string }>

export interface Project {
  slug: string
  title: string
  eyebrow: string
  headline: string
  hook: string
  summary: string
  /** An array, not a single value: work that genuinely belongs in two tabs
   *  should not need a duplicate entry. */
  disciplines: Discipline[]
  year: string
  tags: string[]
  cover: MediaItem
  meta: ProjectMeta
  /**
   * `case-study` — the narrative page with the sticky rail.
   * `gallery`    — visual-first, for work with no documented process.
   * `deep-dive`  — the same rail over architecture and decisions rather than
   *                research and testing. A label and a set of sections, not a
   *                second page component.
   */
  presentation: 'case-study' | 'gallery' | 'deep-dive'
  sections: CaseSection[]
  links: ProjectLink[]
  featured: boolean
  scopeNote?: string
}

/* ── Skillset ─────────────────────────────────────────────────────────── */

/** Self-assessed depth, ordered strongest to lightest. Display order and
 *  labels come from `LEVELS` in `@/data/skills`. */
export type SkillLevel = 'advanced' | 'above-average' | 'working-knowledge' | 'familiar'

/** Which side of the practice an item belongs to. Both is allowed. */
export type SkillDomain = 'ux' | 'development'

/**
 * `skill` is a capability, language, framework or practice — something done.
 * `tool` is a named application that is operated. The line matters because the
 * two are worth presenting differently, and it is drawn here rather than being
 * inferred from a name later.
 */
export type SkillKind = 'skill' | 'tool'

export interface SkillItem {
  /** Stable slug. Used as a key, and later as an anchor for interactions. */
  id: string
  name: string
  kind: SkillKind
  /**
   * One entry per item, never two. Something practised on both sides of the
   * work carries both domains rather than appearing twice.
   */
  domains: SkillDomain[]
  level: SkillLevel
}
