# Portfolio — Neubin Sebastian

Vue 3 · TypeScript · Vite · Tailwind CSS v4 · Vue Router.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # vue-tsc
npm run build      # typecheck + production build
npm run preview
```

## Phase 1 scope

Two routes: the home page and a project page per project. `WorksShowcase.vue`
on the home page (anchored at `#work`) is the one place work is browsed —
there is no separate work index. `/work` survives only as a redirect to
`/#work` so older links still land somewhere sensible.

The showcase carries all three content types the portfolio will hold —
UI/UX, Development and Blogs — as a tablist filtering one list on each entry's
`discipline`. Development and Blogs are deliberately empty and say so in one
line; adding Phase 2's work is a data change to `src/data/projects.ts`, with no
layout change here.

## Where things live

```
src/
  assets/<project>/     images, one folder per project — see ASSETS.md
  components/
    layout/             header, footer, contact block, theme toggle
    project/            WorksShowcase · CaseRail · CaseSection
    ui/                 MediaFrame · GridRules · VantaBirds · MotionToggle
                        Reveal · ArrowLink · SectionHead · Annotation · GrainOverlay
  composables/          useTheme · useMotion · useScrollSpy
  data/
    projects.ts         all project content — the single source of truth
    profile.ts          name, intro, capabilities, facts, experience
    assets.ts           resolves image keys to bundled URLs
  pages/                HomePage · ProjectPage · NotFoundPage
  styles/
    tokens.css          colour, type scale, spacing, motion — both themes
    main.css            Tailwind theme mapping, base layer, shared classes
  types/                the content model
```

## Adding a project

Add an entry to `src/data/projects.ts`. Two shapes:

- `presentation: 'case-study'` — the narrative page with the sticky meta rail
  and scroll-spy contents. Build it from the section kinds in `src/types`:
  `text`, `split`, `stats`, `quote`, `steps`, `list`, `media`.
- `presentation: 'gallery'` — the visual-first page, for work with real craft
  behind it but no documented process to narrate.

Set `discipline: 'development'` for Phase 2 work; the Work page filter already
counts and routes it.

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

## Still needed

- **`profile.ts`** — verify `facts` (the "Based" row is inferred), fill in
  `experience` (the section stays hidden while it's empty), and set the real
  GitHub and LinkedIn URLs.
- **Prototype links.** Each project's `links` array is empty; add Figma
  prototype URLs and the rail renders the call to action.
