# Rishi Sharma — Portfolio

[![Live site](https://img.shields.io/badge/live-rishivak.github.io-A9D3E8?style=flat-square)](https://rishivak.github.io/rishi-portfolio/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-rishivak02-6E9BB8?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/rishivak02/)
[![GitHub](https://img.shields.io/badge/GitHub-rishivak-4E6E85?style=flat-square&logo=github)](https://github.com/rishivak)

**Senior Software Engineer III**, S&P Global Market Intelligence.

> A scroll-driven journey through the systems I build.

**[rishivak.github.io/rishi-portfolio](https://rishivak.github.io/rishi-portfolio/)**

---

## The idea

An editorial dossier in eight numbered movements, read on a dark page — with a 3D world running
behind it as a backdrop, never as a competitor.

**The world is a backdrop. The content is the page.** Three things enforce that structurally rather
than by taste:

1. **It composes beside the text, not behind it.** The projection's screen centre sits at 72% of the
   viewport width on desktop, so the world occupies the right while the content column owns the
   left. Nothing is ever read over moving geometry.
2. **Intensity is budgeted per section** in `src/data/nav.js` — 1.0 in the hero, 0.22 over the case
   studies, 0.18 over the light section. It scales opacity, camera movement, packet flow and label
   count together.
3. **Idle is free.** Every visual is a pure function of scroll, so a stationary reader sees an
   identical frame; a dirty check skips the draw rather than repainting it sixty times a second.

### Colour means something

Four hues, one per pipeline stage, shared by the page and the world — so a heading, a border, a tech
token and a 3D node describing the same thing are the same colour. `data-stage` on any element
rebinds the generic `--stage` tokens for its subtree, so components never name a hue.

| Stage | Hue | Contrast on `#06070A` |
|---|---|---|
| `DATA` | `#4E6E85` | 3.73:1 — marks and borders only |
| `DATA` text | `#5D839F` | 5.00:1 |
| `ENGINEERING` | `#5FA8C7` | 7.59:1 |
| `INTELLIGENCE` | `#A9D3E8` | 12.63:1 |
| `DECISION` | `#E8B04B` | 10.30:1 |

Each section carries one primary stage; a case study or a diagram node may declare its own. The test
suite recomputes every ratio and fails if a sub-4.5:1 hue is used for type.

**Scroll produces exactly one number.** Camera position, look direction, field of view, fog depth,
which geometry exists, how assembled it is, and which single thing is emphasised are all pure
functions of `t`. Nothing has its own timer, observer or trigger — which is why scrubbing the
scrollbar backwards looks identical to scrolling forwards, and why the reduced-motion path can just
ask for the state at a fixed `t` and stop.

**Where the reader is, is geometry — not intersection.** One hook,
`src/lib/useScrollPosition.js`, measures every section's band and resolves a read head 40% down the
viewport against them. It returns the active section plus `within` (progress through that section)
and `global` (progress through the page), and everything else in the chrome is derived from it: the
rail, the telemetry readout, the paper-section inversion, and the world's intensity budget.

This deliberately does *not* use an `IntersectionObserver`, because intersection answers "is this
visible" and this is a "where am I" question. The two diverge badly here: `intersectionRatio` is a
fraction of the **target**, so `02 Systems` at over 1000vh can never exceed ≈ 0.09 while an 80vh
section reaches 1.0 — a ratio comparison hands the page to whichever short section happens to be in
view. Discrete thresholds make it worse, firing only on crossings, so inside a tall section the
callback effectively stops running. The resolver is pure, which is why `.smoke/position.mjs` can
check it against hand-computed layouts; the observer it replaced could not be tested headlessly at
all, and a bug that froze the rail and pinned the world at hero intensity across the whole page
survived unnoticed because of it.

The discrete part is React state and changes about eight times in a full read. `within` and `global`
are motion values, so the rail animates every frame without re-rendering the page behind it.

That invariant is protected, not merely intended. Waypoint clicks, keyboard navigation and `⌘K` all
do one thing: set scroll position. There is no second camera state anywhere. Even *focus mode* —
which moves the camera into a system for a closer look — is a pure transform composed on top:

```js
camera = focusTransform(applyBehaviour(cameraAt(t), behaviourAt(t)), target, k)
```

At `k = 0` that transform is the identity, so closing focus restores exactly the camera the scroll
position implies. The test suite asserts it returns the base object itself.

Eight movements, one page:

| # | Section | Carries | World |
|---|---|---|---|
| 00 | **Signal** | Portrait, name, designation, expertise, positioning, primary links | 1.00 |
| 01 | **Trajectory** | Four roles, **newest first**, pinned horizontal track | 0.40 |
| 02 | **Systems** | Five case studies — narrative left, the visual held right | 0.22 |
| 03 | **Thesis** | The boundaries, and five principles each anchored to a decision | 0.25 |
| 04 | **Substrate** | Technology by engineering role, on an orbital map | 0.45 |
| 05 | **Intelligence** | How I think about AI systems — the paper inversion | 0.18 |
| 06 | **Provenance** | Education, certifications, working details | 0.25 |
| 07 | **Channel** | The email address, at display scale | 0.30 |

**Experience leads.** Trajectory is `01` and the case studies follow from it: who I am → where I
have worked → what I built there → how I think → what it is made of → how I approach AI →
credentials → contact.

`02 Systems` answers *what did I build*; `05 Intelligence` answers *how do I think about AI systems*.
The boundary is enforced structurally — Intelligence renders no case-study fields and imports no
case-study data — so the two cannot converge as the copy evolves.

Each case study is **two columns**: the narrative on the left — identity, the problem, what I worked
on, the dossier disclosure, the engineering surface — and the visual on the right, held in place by
`sticky` for the length of the prose. Only the frame's *contents* change as you read; the columns
never swap sides and nothing travels across the screen. The one animated property is opacity, and
the suite asserts it.

The right column's frames run **architecture → image 1 → … → image N**. Architecture is frame 0
deliberately: the diagram explains the system, the screenshots only show its surface — and it means
OI Pulse, which has no screenshots yet, still fills its column. `ImageSequence` is data-driven for
any count — nothing to show renders nothing at all, a single frame renders statically with no
indicators, and N advances from the dossier's own scroll progress with arrow-key control and a live
region announcing `Architecture` or `Image N of M`. Below `lg`, and under reduced motion, the two
columns stack and the visual degrades to a plain captioned list.

The dossier title is `text-h3` and its body `0.875rem` — stepped down from the section heading so a
column of detail reads as a document rather than a poster.

**Experience reads newest first.** The trajectory track runs `Now ————— 2020`, and the direction is
labelled rather than implied. Array order in `src/data/experience.js` is the display order
everywhere, so it is one edit rather than four.

Keyboard: `⌘K` jump · `A` architecture mode · `?` shortcuts.

## No 3D library

The renderer is ~700 lines of hand-written engine: perspective camera on a Catmull-Rom spline,
depth-sorted points, lines and planes, fog and scale falloff, DOM-overlay labels so text stays real
and screen-readable.

Three.js would have shipped ~650KB to draw hairlines and points, and its text would have needed the
same DOM overlay anyway. The scene is pure data behind a renderer interface, so a WebGL backend
could be dropped in later without touching a chapter.

Camera behaviour varies with the region — travel, lateral traverse, following a payload, comparing
two stacked architectures, orbiting a contained system, pulling back — and every behaviour's
amplitude is multiplied by the section's intensity budget, so a text-dense section gets an almost
stationary camera.

Because every visual is a pure function of `t`, a stationary reader sees an identical frame; a dirty
check skips the draw entirely rather than redrawing it sixty times a second.

Peak cost, measured in the harness: **77 draw calls** at 1920×1080 (38 on mobile), averaging 19.
Image payload is **3.20 MB across 11 files** and is printed by the suite so the cost stays visible;
every image is lazy, async-decoded and carries intrinsic dimensions, but the files themselves still
want recompressing.

## ⚠ Do not deploy until the screenshots are cropped

This repository ships **11 unsanitised project screenshots**, published by explicit decision after I
raised a confidentiality objection. Two of them matter most:

- `foreseer.png` / `foreseer2.png` — the Foreseer **QA environment** with a live
  `@spglobal.com` session visible, internal `KeyInst`/`Keydoc`/`Keyfile` identifiers, and a named
  issuer's filing open.
- `clarifi1/2/3/4.png` — the ClariFI desktop application including the internal build string
  `5.6.1RC23` and the licensed Compustat/IBES data dictionary.

There is **no CSS mask layer**, deliberately: a mask leaves the original pixels in the network
response, which is not redaction. **`docs/REDACTION.md`** holds the exact crop rectangles and the
SHA-256 of every unsanitised original. Apply the crops, save over the originals, and the asset gate
stops warning. Until then `npm run lint && node .smoke/assets.mjs` prints
`ASSETS NOT SANITISED — do not deploy`.

## Honesty rules

- **No invented metrics.** Every number is from the résumé, computed live from labelled synthetic
  input, or absent.
- **Synthetic data says so**, on every surface that shows any.
- **Confidential work stays confidential.** `src/data/phoenix.js` gates every entry behind
  `cleared: true`; S&P systems are described only as patterns and as Rishi's own contributions.
- **The extraction readout shows a field failing validation**, because partial success is how
  extraction behaves and six green ticks would misrepresent the hard part.
- **The transform engine actually computes** ∏(1 + rᵢ) − 1, and shows the naive additive answer
  beside it diverging — close enough to pass review, which is what makes that bug worth a chapter.

## Architecture

```
src/
  engine/       the renderer — no dependencies, swappable
    vec.js        vec3 + Catmull-Rom spline
    camera.js     chase camera; scroll t → position, basis, fov
    project.js    world → screen, allocation-free
    draw.js       five primitives: node, point, edge, packet, quad
    behaviour.js  camera behaviour per region, scaled by the intensity budget
    resolve.js    t → which geometry exists, and how assembled
    palette.js    resolves CSS custom properties to literals for canvas
    render.js     one frame
  scene/
    world.js      the world's regions; camera depth derives from them
    build.js      scene DSL — throws on duplicate ids and dangling edges
    layouts.js    four silhouettes: scatter · stack · conveyor · contained
    chapters/     career · phoenix · closing
  data/
    nav.js        the 8-section registry + the per-section intensity budget
    experience.js four posts, newest first — prose, technology, architecture
    timeline.js   the trajectory track, derived from experience.js
    systems.js    five case studies, composed from experience + projects
    projects.js   independent engineering
    phoenix.js    the cleared-contribution registry — built to grow
    profile.js stack.js intelligence.js provenance.js thinking.js
  lib/
    sample/       synthetic generators, and the real return arithmetic
  components/
    stage/        the world: canvas, DOM labels, scrim
    sections/     the eight movements
    primitives/   Section · Kicker · Panel · TechToken · MagneticButton · SplitLines · Placeholder
    controls/     the live readouts and the transform engine
    chrome/       grid, masthead, spine, telemetry, cursor, palette
```

**Adding Phoenix work:** append an entry to `src/data/phoenix.js` with `cleared: true` and a
`movement`. It appears in the journey. Nothing else changes.

**Adding a role or project:** add it to `experience.js` or `projects.js`. The trajectory track and
the case studies both derive from those files, so it appears in both.

## What the test suite guards

Beyond lint and rendering, the harness in `.smoke/` asserts the things that are easy to regress:
every employer, period, role title, project name, declared technology and engineering principle
actually reaches the page; experience is ordered newest-first everywhere; the camera is
deterministic in `t`; no camera jump at any behaviour boundary; a structural fingerprint per
environment, so four eras cannot become four identical graphs; the intensity budget stays ≤ 0.45
after the hero **and is actually reachable by the tracker**; the scroll resolver returns the right
section at 20-odd positions in a deliberately lopsided layout, including 600vh deep inside a 1100vh
section; a boundary crossed slowly flips once rather than oscillating; every section in the registry
is reachable by scrolling; the rail marks exactly one rung and every rung carries its registry stage;
fewer than 12% of projected nodes fall inside the content column; and the world's palette resolves to
greys with amber as the only chromatic accent.

## The rail

`00 … 07` sit on a virtual drum sharing the canvas world's perspective: the section you are reading
faces you, its neighbours rotate away on the X axis and recede. It is driven by a continuous
`sectionIndex + within`, so the drum turns *through* a boundary like an odometer rather than snapping
at it, and each rung carries its own stage hue — so a full read walks the rail
`DATA → ENGINEERING → INTELLIGENCE → DECISION` using the four hues already in the spectrum. A
read-head travels a hairline for position in the document, and a short fill under the active number
shows how much of the current section is left, which matters now that one section runs past 1000vh.

Under reduced motion the drum flattens to no transform while the read-head and the fill keep working:
position is never carried by the 3D effect alone. Below `lg` the rail is hidden, so the masthead
carries a progress hairline and the section index and label instead.

## Accessibility

Reduced motion is a real path, not a downgrade: the render loop never starts, the scene repaints on
scroll only, and Framer is handled by `MotionConfig reducedMotion="user"`. Labels are real DOM text.
Every chapter is a landmark with a heading; arrows jump between them; the transform controls are
real buttons with `aria-pressed` and an `aria-live` result.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173/rishi-portfolio/
npm run build
npm run lint
```

Deploys to GitHub Pages from `main` via `.github/workflows/deploy.yml`.
