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

Home, Work index, and project pages for the UI/UX work. The development and
writing sections are stubbed in the Work filter with an honest empty state —
adding them in Phase 2 is a data change, not a component change.

## Where things live

```
src/
  assets/<project>/     images, one folder per project — see ASSETS.md
  components/
    layout/             header, footer, contact block, theme toggle
    project/            ProjectRow · CaseRail · CaseSection
    ui/                 MediaFrame · Reveal · ArrowLink · SectionHead · Annotation · GrainOverlay
  composables/          useTheme · useScrollSpy
  data/
    projects.ts         all project content — the single source of truth
    profile.ts          name, intro, capabilities, facts, experience
    assets.ts           resolves image keys to bundled URLs
  pages/                HomePage · WorkPage · ProjectPage · NotFoundPage
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

**Motion** — one authored moment (the maroon annotation drawing under "build"
in the hero), plus functional transitions: hover and focus states, route
changes, one entrance per section on first scroll. Everything respects
`prefers-reduced-motion`.

## Accessibility

Semantic landmarks, a skip link, visible focus on every interactive element,
keyboard parity for every hover behaviour, no information carried by colour
alone, and alt text on meaningful images with decorative ones hidden from
assistive technology.

## Still needed

- **Images.** Every asset is a placeholder — see `ASSETS.md` for the Figma
  node → filename manifest.
- **`profile.ts`** — verify `facts` (the "Based" row is inferred), fill in
  `experience` (the section stays hidden while it's empty), and set the real
  GitHub and LinkedIn URLs.
- **Prototype links.** Each project's `links` array is empty; add Figma
  prototype URLs and the rail renders the call to action.
