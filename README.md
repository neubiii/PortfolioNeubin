# Neubin Sebastian - Portfolio

Personal portfolio of **Neubin Sebastian**, a UI/UX designer and front-end developer working across B2B and enterprise products.

This portfolio brings together product design case studies, front-end development projects, and writing. It is designed and developed as a custom Vue application rather than using a portfolio template.

## Live site

https://neubinsebastian.vercel.app/


## What’s inside

The portfolio is organised into three areas:

- **UI/UX** - product design, user research, interaction design, prototyping, usability testing, and design systems
- **Development** - front-end and application-development projects with technical deep dives
- **Writing** - articles and notes around UX, AI UX, and product design

The site also includes dedicated case-study routes, responsive layouts, light/dark themes, keyboard support, and reduced-motion behaviour.

## Tech stack

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- Vue Router
- Motion for Vue
- Vanta.js
- Three.js
- Lucide Icons

## Vasu, the portfolio assistant

`api/chat.ts` is a single Vercel function. It answers from the portfolio facts in
`src/data/vasuKnowledge.ts` — the one source of truth — via Groq's
OpenAI-compatible endpoint. It needs one environment variable:

    GROQ_API_KEY=...

Copy `.env.example` to `.env.local` for local work, and set the same variable in
the Vercel project settings for deployments. It is read server-side only and is
never exposed to the browser.

`npm run dev` serves the site but not the function, so Vasu falls back to its
local grounded answers there. To run the function locally:

    npx vercel dev

which picks `GROQ_API_KEY` up from `.env.local`. If Groq is unreachable, rate
limited or unconfigured, the assistant keeps answering from the same knowledge
in the browser.

## Project structure

api/               # Vercel server functions
src/
├── assets/        # Portfolio imagery and project assets
├── components/    # Layout, UI and project components
├── composables/   # Reusable Vue interaction/state logic
├── data/          # Portfolio content and project data
├── pages/         # Route-level pages
├── router/        # Vue Router configuration
├── styles/        # Global styles and design tokens
└── types/         # Shared TypeScript types

## Deployment

The site is deployed with Vercel.

## Author

Neubin Sebastian
UI/UX Engineer
