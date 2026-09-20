# Rishi Sharma — Portfolio

[![Live site](https://img.shields.io/badge/live-rishivak.github.io-E8B04B?style=flat-square)](https://rishivak.github.io/rishi-portfolio/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-rishivak02-555?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/rishivak02/)
[![GitHub](https://img.shields.io/badge/GitHub-rishivak-555?style=flat-square&logo=github)](https://github.com/rishivak)

**Senior Backend & Full-Stack Engineer** — distributed systems, API platforms and
financial data infrastructure. Nearly seven years of server-side Java, currently at
**S&P Global Market Intelligence**.

> The layer between data and decision.

**[rishivak.github.io/rishi-portfolio](https://rishivak.github.io/rishi-portfolio/)**

---

## The site

A single continuous scroll in eight movements rather than a stack of pages:

| # | Section | What it is |
|---|---|---|
| `00` | Signal | Hero — a generated time-series field that doubles as a chart inspector under the cursor |
| `01` | Thesis | The positioning statement, set quietly |
| `02` | Trajectory | Six years as one horizontally-scrolled movement |
| `03` | Systems | Four case studies, each with a bespoke animated architecture diagram |
| `04` | Substrate | The technology ecosystem as an orbital map around a system core |
| `05` | Intelligence Layer | AI and document intelligence — the one section on a light ground |
| `06` | Provenance | Education, certifications, working details |
| `07` | Open Channel | Contact, with the address as the interface |

Navigation is the left spine rail, or `⌘K` / `Ctrl K` anywhere.

### Design notes

- **One accent.** Signal amber on near-black, budgeted to a few percent of any viewport.
- **One signature effect.** The hero series field. Everything else is hairlines and type.
- **Variable type.** Archivo across its width axis for display, Inter for reading,
  JetBrains Mono for every piece of technical metadata.
- **No 3D.** Two 2D canvases and animated SVG, not a WebGL renderer.
- **Reduced motion is a real path.** Canvases render one static frame, the custom
  cursor never mounts, and every reveal resolves instantly.
- **No invented numbers.** Metrics that are not retrievable render as a visible
  `[IMPACT METRIC]` placeholder rather than an estimate.

## Stack

React 19 · Vite · Tailwind CSS · Framer Motion · Canvas 2D · SVG

No UI kit, no component library, no template.

## Architecture

```
src/
  data/         all content — the single source of truth, no strings in components
  styles/       design tokens as CSS custom properties
  lib/          hooks: shared rAF loop, canvas plumbing, section observer, motion
  components/
    chrome/     spine, telemetry, masthead, command palette, cursor, grid
    primitives/ section, kicker, split-line reveal, tokens, magnetic button
    sections/   the eight movements, lazy-loaded below the fold
    visuals/    the hero field, the stack graph, four system diagrams
```

To change any content — a role, a project, a metric — edit `src/data/`. Nothing else.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`. The deploy path is baked in as
`base: '/rishi-portfolio/'` in `vite.config.js`; asset URLs resolve through
`src/lib/url.js` rather than being hardcoded.
