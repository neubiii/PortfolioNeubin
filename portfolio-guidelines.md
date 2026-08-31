# Portfolio Build Guidelines

Use this file as persistent project guidance for Claude Code. The actual task prompt should stay short and refer back to this file.

## 1. Product goal

Build a portfolio that positions the owner as a **Product Developer / UI/UX Developer**: someone who can think through product problems, design polished user experiences, and also build them.

The portfolio should feel authored, intentional, and confident—not like a generic AI-generated portfolio template.

Phase 1 focuses on:
- Landing / home page
- Work / projects index
- UI/UX and product design projects
- UX case-study pages where enough source material exists

Development projects will be added in a later phase.

---

## 2. Source of truth

Before designing or coding:

1. Inspect the shared Figma file/page through the available Figma/MCP tooling.
2. Inspect relevant pages in the same Figma canvas. Project pages are named after their projects/case studies.
3. Inspect the current project folder for useful assets, photos, markdown files, project descriptions, screenshots, or existing instructions.
4. Treat existing Figma concepts as direction, not as pixel-perfect finished UI.
5. Improve weak low-fidelity decisions where needed while preserving the core concept.
6. Do not invent research findings, metrics, project outcomes, client details, responsibilities, or case-study facts.
7. If a project has limited case-study material, present it primarily as strong visual/product design work rather than fabricating a case study.

Prefer real project assets over placeholder imagery.

---

## 3. Technical direction

Keep the architecture small and understandable.

Preferred stack:
- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Vue Router

Optional, only when justified:
- `motion-v` for a few meaningful UI animations / transitions
- `@vueuse/core` for useful browser or interaction composables
- `lucide-vue-next` for simple interface icons if icons are needed

Avoid adding dependencies simply because they are popular.

Do not add in Phase 1 unless genuinely required:
- Pinia
- Nuxt
- GSAP
- Three.js
- large UI/component libraries
- heavy animation frameworks
- CMS/backend
- complex state architecture

Keep project content/data separated from presentation where practical so new projects can be added later without rewriting page components.

---

## 4. Visual direction

Core character:
- clean
- editorial
- structured
- product-minded
- modern
- slightly playful
- strong typography
- excellent spacing
- clear hierarchy
- intentional asymmetry where useful

Preferred palette direction:
- deep maroon / burgundy
- black / near-black
- white / warm off-white
- restrained neutral tones

Do not force every section to use all palette colors.

### Avoid generic AI-portfolio aesthetics

Do not default to:
- endless rounded cards
- pill/chip overload
- glassmorphism
- glowing gradient blobs
- purple/blue AI gradients
- every section inside a card
- excessive shadows
- floating decorative spheres
- Bento layouts just because they are trendy
- huge generic hero copy with no personality
- unnecessary badges such as “Available for work”
- generic “My Skills” progress bars
- stock illustrations
- decorative effects that compete with the projects

Rounded corners are allowed when the content or interaction benefits from them; they should not become the visual language of everything.

Use whitespace, typography, borders, scale, alignment, imagery, rhythm, and composition before decorative effects.

---

## 5. Landing page principles

The first viewport should quickly communicate:
1. who this person is,
2. the intersection of product/design/development,
3. what kind of work they create,
4. where to explore next.

Do not overload the hero.

Use the Figma concept as the starting point. Improve composition and hierarchy as needed.

Possible content structure—not mandatory:
- concise hero
- selected work
- brief profile / design + development positioning
- capability snapshot
- contact/footer

Favor visible project work over long self-description.

---

## 6. Work / UX project experience

The work page should make projects easy to scan without reducing everything to identical cards.

Explore editorial layouts such as:
- strong project rows
- varying image proportions
- controlled alternating compositions
- project index + large preview
- typographic project list with visual response
- deliberately sized featured vs secondary work

Each project preview should make it clear:
- project name
- project type / context
- role or discipline when relevant
- a useful visual
- whether a deeper case study exists

For projects without a full case study, create a high-quality visual project page/gallery only if useful.

---

## 7. Case-study principles

A case study is a product story, not a school report.

Use only sections supported by source material. Possible structure:

- Context / problem
- My role
- Constraints
- Important decisions
- Process evidence
- Key screens / interaction design
- Result / learning

Do not force “Design Thinking” stages onto every project.

Avoid fake storytelling such as:
“First, I empathized with users. Then I ideated...”

Show decisions and evidence instead.

Let screenshots, prototypes, diagrams, and comparisons carry significant weight.

Keep written content concise enough that hiring managers can scan the page.

---

## 8. Motion and interaction

Motion should make the portfolio feel crafted, not animated for its own sake.

Good uses:
- navigation feedback
- project preview transitions
- subtle image reveals
- restrained text entrances
- hover states that expose useful information
- link/arrow movement
- image crop or scale changes
- route/page transitions
- cursor-responsive detail only when it improves exploration

Avoid:
- animating every element on scroll
- excessive parallax
- constant floating movement
- slow entrance animations
- large cursor gimmicks that hurt usability
- animation blocking navigation
- motion that reduces readability

Keep most micro-interactions quick and subtle.

Respect `prefers-reduced-motion`.

Build all hover interactions with equivalent keyboard/focus behavior where applicable.

---

## 9. Accessibility

Treat accessibility as part of the visual quality.

Minimum expectations:
- semantic HTML
- keyboard navigation
- visible focus states
- accessible link/button labels
- sufficient text/background contrast
- useful alt text for meaningful images
- decorative images ignored by assistive technology
- no information conveyed by color alone
- responsive type and layouts
- reduced-motion support
- adequate target sizes
- logical heading hierarchy

Validate the maroon/black/white palette before committing to text/background pairings.

---

## 10. Responsive behavior

Design desktop deliberately but do not treat mobile as a compressed desktop layout.

Test at least:
- mobile
- tablet / narrow laptop
- desktop
- wide desktop

On smaller screens:
- simplify compositions
- maintain reading order
- avoid horizontal overflow
- keep project imagery useful
- preserve spacing hierarchy

---

## 11. Code quality

Write the kind of code a product developer would be comfortable maintaining.

Prefer:
- small reusable components
- clear naming
- typed project data
- straightforward Vue Composition API
- CSS/Tailwind tokens for recurring design values
- simple folder structure
- meaningful semantic markup

Avoid:
- premature abstractions
- giant universal components
- unnecessary watchers
- duplicated project markup
- magic numbers scattered everywhere
- animation logic mixed throughout unrelated components
- excessive comments explaining obvious code

Create reusable primitives only after repetition is visible.

---

## 12. Suggested project structure

Keep this flexible rather than forcing it:

```text
src/
  assets/
  components/
    layout/
    navigation/
    project/
    ui/
  data/
    projects.ts
  pages/
    HomePage.vue
    WorkPage.vue
    ProjectPage.vue
  router/
  styles/
  types/
```

If individual case studies require genuinely different compositions, allow dedicated page/components rather than forcing every project into one rigid template.

---

## 13. Working method for Claude Code

For each major implementation pass:

1. Read this file and any other relevant `.md` instructions.
2. Inspect the existing codebase before changing architecture.
3. Inspect relevant Figma frames/pages and available assets.
4. Briefly state what you found and what you intend to implement.
5. Implement a coherent slice.
6. Run the project/build/type checks.
7. Fix errors you introduced.
8. Review responsive behavior and accessibility.
9. Report changed files and any assumptions.

Do not rewrite unrelated working code.

Do not silently invent missing portfolio content.

When a design decision is uncertain, make the smallest sensible assumption and keep it easy to change.

---

## 14. Phase 1 definition of done

Phase 1 is complete when:

- Home/landing page is polished and responsive.
- Work page presents the available UX/product-design projects clearly.
- Relevant Figma project pages have been analyzed.
- Projects with enough material have usable case-study experiences.
- Projects without enough case-study material are represented honestly and visually.
- Navigation between home, work, and project pages works.
- Real assets are used wherever available.
- Core interaction states are implemented.
- Animations are subtle and reduced-motion aware.
- The maroon/black/white visual direction meets contrast requirements.
- Build/type checks succeed.
- Structure is ready for development projects to be added in Phase 2.

Do **not** start the development-project phase unless explicitly requested.
