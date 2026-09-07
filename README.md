# Portfolio — Neubin Sebastian

Vue 3 · TypeScript · Vite · Tailwind CSS v4 · Vue Router.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # vue-tsc
npm run build      # typecheck + production build
npm run preview
```

## Scope

Two routes: the home page and a project page per project. `WorksShowcase.vue`
on the home page (anchored at `#work`) is the one place work is browsed —
there is no separate work index. `/work` survives only as a redirect to
`/#work` so older links still land somewhere sensible.

The showcase is a tablist over one list. An entry appears under every category
in its `disciplines` array, so Expense AI — designed *and* built — is in both
UI/UX and Development while still resolving to a single page and a single URL.

Phase 1 was the five UI/UX projects. Phase 2 added the six development ones,
written from the repositories rather than from Figma. Phase 3 added Writing.

Expense AI appears twice on purpose — `ai-expense-agent` is the designed
concept and the research behind it, `expense-ai` is the thing that was built.
Two entries rather than one, because they answer different questions and a
recruiter arrives looking for one or the other.

## Where things live

```
src/
  assets/<project>/     images, one folder per project — see ASSETS.md
  components/
    layout/             header, footer, contact block, about, skillset,
                        theme toggle
    project/            WorksShowcase · CaseRail · CaseSection · WritingPreview
                        ProjectLinks
    ui/                 HeroStatement · VantaBirds · MediaFrame · GridRules
                        MotionToggle · Reveal · ArrowLink · SectionHead
                        SourceMark · GrainOverlay
  composables/          useTheme · useMotion · useScrollSpy
  data/
    projects.ts         all project content — the single source of truth
    profile.ts          name, intro, capabilities, facts, experience
    writing.ts          the LinkedIn writing index
    assets.ts           resolves image keys to bundled URLs
  pages/                HomePage · ProjectPage · NotFoundPage
  styles/
    tokens.css          colour, type scale, spacing, motion — both themes
    main.css            Tailwind theme mapping, base layer, shared classes
  types/                the content model
```

## Writing

Writing is published on LinkedIn, so the third tab is an index to it rather
than a copy of it. `src/data/writing.ts` holds five `WritingEntry` records —
title, hook, summary, topics, an optional series name and the post URL — and
that is the whole model. Deliberately not `Project`: there is no page to route
to, and forcing it into that shape would mean five empty project pages.

The tab reuses the showcase's composition exactly — the same split index, the
same hover-and-focus preview, the same sticky column. Two things differ. A row
is an external link rather than a route, so selecting a post never navigates
inside the site. And the centre panel is `WritingPreview.vue`, which is
typographic because a LinkedIn post has no screenshot: the hook is set large
and does the work a cover image does elsewhere.

The three parts of the AI UX Patterns series share a flat accent tint and a
tick row — one rule per part, the current one longer, the same signal the
case-study contents rail uses — so they read as one run without being merged
into a single article that does not exist. `seriesPosition()` counts the parts
from the data, so a fourth would number itself.

Below 75rem there is no hover to discover anything with, so each row carries
its own hook and its own `View LinkedIn post ↗` line. No engagement figures are
stored or shown anywhere.

## Adding a project

Add an entry to `src/data/projects.ts`. Three shapes, all rendered by the same
page component from the section kinds in `src/types` (`text`, `split`, `stats`,
`quote`, `steps`, `list`, `media`):

- `presentation: 'case-study'` — the narrative page with the sticky meta rail
  and scroll-spy contents.
- `presentation: 'deep-dive'` — the development shape. Same rail; the sections
  are what it does, an architecture figure, the decisions, and who built what.
  It is a label plus a different choice of sections, not a second component.
- `presentation: 'gallery'` — the visual-first page, for work with real craft
  behind it but no documented process to narrate. No rail; its calls to action
  sit under the standfirst instead.

`disciplines` is an array, so a project that genuinely belongs in two tabs
needs no duplicate entry. Index numbers are computed per category rather than
stored, since the same project holds a different position in each list.

A development entry earns a contribution section only when the work can be
attributed. Where it cannot, the section is simply absent — the page never
explains what the evidence did not show.

## Design notes

**Palette** — warm off-white paper, near-black ink, deep maroon accent. Both
themes are token-driven in `tokens.css`; every text/background pairing clears
WCAG AA (contrast ratios are recorded in that file's header).

**Type** — Fraunces for display (its `WONK` axis is what supplies the playful
edge), Instrument Sans for UI, IBM Plex Mono for metadata, indices and figures.
Loaded from Google Fonts in `index.html`.

**Structure over decoration** — hairline rules, an explicit 12-column grid, and
scale do the work. No cards as page structure, no shadows, no gradients, no
glass. The one ambient treatment is the paper grain in `GrainOverlay.vue`.

**Motion** — the hero carries a Vanta BIRDS flock (`VantaBirds.vue`), plus the
maroon annotation that draws under "build". Both are skipped entirely under
`prefers-reduced-motion`, and `three` is a lazy chunk so a visitor who never
sees the animation never downloads it. Everything else is functional: hover and
focus states, route changes, one entrance per section on first scroll.

The flock can be paused. Vanta exposes no pause API, so `VantaBirds` cancels
the animation frame it keeps on the instance and calls back into
`animationLoop()` to resume — the birds hold their positions rather than
scattering a fresh set into frame, and the canvas is never rebuilt. The choice
lives in `useMotion` (a module ref plus `sessionStorage`) so it survives
navigating into a project and back. `prefers-reduced-motion` is authoritative
on load; the control then reads "Enable motion" as an explicit opt-in.

A ResizeObserver owns the flock's lifecycle. Vanta measures its container once
and BIRDS' `onResize()` is an empty method, so an effect constructed while the
routed hero is still mid-transition gets clamped to `minWidth`/`minHeight` and
never recovers. Observing the element instead means the first mount, a route
return and a window resize all take the same path.

**Hero theming** — the hero is its own surface in both themes, driven by the
`--c-hero-*` tokens plus `--vanta-*` for the flock, all in `tokens.css`. The
canvas runs with `backgroundAlpha: 0`, so CSS owns the ground and the theme
swap is instant; the birds are rebuilt on a theme change because BIRDS bakes
its colours into geometry at construction.

**Images** — `MediaFrame` has three modes, set per item in `projects.ts`:
`natural` (default; intrinsic aspect, borderless, never cropped — every
case-study screenshot), `longform` (a full-page capture, clipped with an expand
control rather than an inner scroller), and `crop` (the work index only, where
one shared aspect keeps the list's rhythm). `ratio` in the data only reserves
space before load and is released once the browser knows the real dimensions,
so a stale value can never distort a swapped-in image.

**Layout ruler** — `GridRules.vue` is a `.shell`, so its rules land on the real
content boundary and on quarter divisions of the same measure every other block
uses. Four cells above 48rem, two below.

## Accessibility

Semantic landmarks, a skip link, visible focus on every interactive element,
keyboard parity for every hover behaviour, no information carried by colour
alone, and alt text on meaningful images with decorative ones hidden from
assistive technology.

## Calls to action

`ProjectLinks.vue` renders a project's `links` array — used by the rail on a
case study or deep dive, and under the standfirst on a gallery page. Nothing is
hardcoded per project.

UI/UX entries carry `View Figma prototype`, development entries carry
`View GitHub repository`, and a project with no real destination carries no
link at all. There are no placeholders waiting for a URL.

The three prototype links point at the entry frame of that page's own flow in
Figma. EverGrove and the rate-conversion landing page have no prototype wiring
— no starting point, no frame-to-frame navigation — so neither has a link.

## Development covers and figures

No screenshots exist for most of the development work, so each one leads with a
generated editorial cover instead — dark ground, a short hook, a structural
motif drawn from what the system actually is, and the stack set in mono. They
are SVGs in `src/assets/<project>/cover.svg`, at 16:10 so they fill the index
preview stage exactly. No fake interfaces, no stock imagery.

Four projects also carry an architecture figure at
`src/assets/<project>/architecture.svg`. Every node, port, protocol and rule ID
in them is quoted from the repository — the compose file, the service sources,
the CI workflow — not sketched from memory.

## Still needed

- **`profile.ts`** — verify `facts` (the "Based" row is inferred), fill in
  `experience` (the section stays hidden while it's empty), and set the real
  GitHub and LinkedIn URLs.
- **Figma sharing** — the three prototype links only open for people who can
  view the file. Set link sharing on `xbNlhyfWuoGdGYpjusY0eD` to "anyone with
  the link" before sending the portfolio out.
