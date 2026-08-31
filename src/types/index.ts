/**
 * Content model for the portfolio.
 *
 * The section kinds below were derived from the case studies that actually
 * exist in the Figma file — a two-up contrast, a stat trio, a pull quote, a
 * numbered sequence — rather than invented up front. Adding Phase 2's
 * development projects should be a data change, not a component change.
 */

export type Discipline = 'ux' | 'development' | 'writing'

export interface MediaItem {
  /** Asset key, e.g. `meet-in-room/user-flow`. Resolved by `@/data/assets`. */
  src: string
  /** Empty string marks the image decorative; it is then hidden from AT. */
  alt: string
  ratio?: string
  fit?: 'cover' | 'contain'
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

/** A trio of figures. Every value here is taken verbatim from the case study. */
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

/** Sections that carry a heading are the ones the contents rail lists. */
export type TitledSection = Extract<CaseSection, { title?: string }>

export interface Project {
  slug: string
  index: string
  title: string
  /** Kicker from the case study — e.g. "AGENTIC UX · SAP FIORI FOR iOS". */
  eyebrow: string
  /** The display headline on the project page. */
  headline: string
  /** The 2–3 sentence hook surfaced in the work index. */
  hook: string
  /** Longer standfirst opening the project page. */
  summary: string
  discipline: Discipline
  year: string
  tags: string[]
  cover: MediaItem
  meta: ProjectMeta
  /**
   * `case-study` renders the narrative page with the sticky rail.
   * `gallery`    renders the visual-first presentation, for work with real
   *              craft behind it but no documented process to narrate.
   */
  presentation: 'case-study' | 'gallery'
  sections: CaseSection[]
  links: ProjectLink[]
  featured: boolean
  /** Rendered at the foot of a case study when the source material carries one. */
  scopeNote?: string
}
