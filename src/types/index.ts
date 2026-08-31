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
  /**
   * The asset's true intrinsic aspect, e.g. `786/1704`. Used only to reserve
   * space before the image loads — it is dropped once the real dimensions are
   * known, so a stale value can never crop or letterbox the final image.
   */
  ratio?: string
  /**
   * How the image is presented.
   *
   * `natural`  (default) — the screenshot is the visual. Intrinsic aspect, no
   *            frame, no background, never cropped. Every case-study image.
   * `longform` — a full-page capture too tall to sit inline (evergrove/page is
   *            2882×8958). Collapsed with an explicit expand control.
   * `crop`     — a deliberately cropped tile at a ratio the component supplies.
   *            Index covers only, so the work list keeps one rhythm.
   */
  display?: 'natural' | 'longform' | 'crop'
  /**
   * `object-position` for the cropped preview stage, e.g. `'center top'`.
   * Only consulted when the image is cropped; defaults to centred. Set it on a
   * cover whose subject sits off-centre and would otherwise be trimmed.
   */
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

/**
 * A call to action on a project page. A project that has no real destination
 * carries no link — there are no placeholders waiting for a URL.
 */
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
  title: string
  /** Kicker from the case study — e.g. "AGENTIC UX · SAP FIORI FOR iOS". */
  eyebrow: string
  /** The display headline on the project page. */
  headline: string
  /** The 2–3 sentence hook surfaced in the work index. */
  hook: string
  /** Longer standfirst opening the project page. */
  summary: string
  /**
   * The categories a project appears under. An array rather than a single
   * value because the filter reads the same either way, and a piece of work
   * that genuinely belongs in two tabs should not need a duplicate entry.
   */
  disciplines: Discipline[]
  year: string
  tags: string[]
  cover: MediaItem
  meta: ProjectMeta
  /**
   * `case-study` renders the narrative page with the sticky rail.
   * `gallery`    renders the visual-first presentation, for work with real
   *              craft behind it but no documented process to narrate.
   * `deep-dive`  is the development shape: same rail, but the sections are
   *              architecture, decisions and contribution rather than
   *              research and testing. It is a label and a set of sections,
   *              not a second page component.
   */
  presentation: 'case-study' | 'gallery' | 'deep-dive'
  sections: CaseSection[]
  links: ProjectLink[]
  featured: boolean
  /** Rendered at the foot of a case study when the source material carries one. */
  scopeNote?: string
}
