import { v } from '../engine/vec';

/**
 * The world is a career.
 *
 * −Z is time. Each professional post is a region you fly through, and the
 * structures get denser and more specialised as the journey advances, because
 * the systems genuinely did. Nothing here claims increasing impact or scale —
 * only increasing specialisation, which the architectures support on their own.
 *
 * DATA → ENGINEERING → INTELLIGENCE → DECISION survives as the *grammar* rather
 * than the itinerary: every node still carries a `stage`, so the colour ramp
 * keeps explaining what each part of each system does.
 */

/** Employer per post. Mirrors src/data/experience.js; asserted in the harness. */
const ORGS = {
  innovatechs: 'Innovatechs',
  covalience: 'Covalience',
  foreseer: 'S&P Global',
  phoenix: 'S&P Global',
};

export const chapters = [
  {
    id: 'boot',
    label: 'System boot',
    range: [0.0, 0.06],
    z: [0, -70],
    behaviour: 'travel',
  },
  {
    id: 'origin',
    label: 'Origin',
    role: 'innovatechs',
    year: '2020',
    range: [0.06, 0.19],
    z: [-70, -360],
    stage: 'engineering',
    behaviour: 'traverse',
  },
  {
    id: 'product',
    label: 'Product',
    role: 'covalience',
    year: '2023',
    range: [0.19, 0.31],
    z: [-360, -650],
    stage: 'engineering',
    behaviour: 'traverse',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    role: 'foreseer',
    year: '2024',
    range: [0.31, 0.5],
    z: [-650, -1120],
    stage: 'intelligence',
    behaviour: 'follow',
  },
  {
    id: 'financial',
    label: 'Financial systems',
    role: 'phoenix',
    year: '2026',
    range: [0.5, 0.76],
    z: [-1120, -1900],
    stage: 'engineering',
    behaviour: 'compare',
  },
  {
    id: 'lab',
    label: 'Project lab',
    project: 'oi-pulse',
    range: [0.76, 0.87],
    z: [-1900, -2180],
    stage: 'decision',
    behaviour: 'orbit',
  },
  {
    id: 'engineer',
    label: 'How I engineer',
    range: [0.87, 0.94],
    z: [-2180, -2350],
    behaviour: 'pullback',
  },
  {
    id: 'contact',
    label: 'Contact',
    range: [0.94, 1.0],
    z: [-2350, -2480],
    stage: 'decision',
    behaviour: 'dissolve',
  },
];

/**
 * The four career waypoints, in order. Drives the boot manifest, the world
 * markers and the coordinate rail.
 *
 * `org` is carried here rather than looked up at each call site, so every
 * surface that shows the career shows the same four names.
 */
export const waypoints = chapters
  .filter((c) => c.role)
  .map((c, i) => ({
    ...c,
    code: `SYSTEM ${String(i + 1).padStart(2, '0')}`,
    org: ORGS[c.role],
  }));

/** Depth the chapter map says the journey has reached at `t`. */
export function zAt(t) {
  const n = Math.min(1, Math.max(0, t));
  for (const c of chapters) {
    if (n >= c.range[0] && n <= c.range[1]) {
      const k = (n - c.range[0]) / (c.range[1] - c.range[0]);
      return c.z[0] + (c.z[1] - c.z[0]) * k;
    }
  }
  return chapters[chapters.length - 1].z[1];
}

/**
 * How far behind the story point the camera sits. Without this the camera
 * arrives on top of each chapter's geometry and culls it against the near
 * plane; trailing puts the subject comfortably in frame.
 */
const TRAIL = 90;

/**
 * Only lateral and vertical lanes are authored by hand — depth comes from the
 * chapter map, so the camera cannot drift out of the region whose content it is
 * meant to be framing.
 *
 * The lanes rise through Phoenix because that environment is a multi-level hall
 * rather than a corridor, and the height is what makes it read as a bigger space.
 */
const LANES = [
  { x: 0, y: 6 }, // boot
  { x: 0, y: 6 },
  { x: -14, y: 8 }, // origin — wide lateral sweep across scattered islands
  { x: 14, y: 7 },
  { x: -10, y: 9 },
  { x: 2, y: 16 }, // product — rising past a stacked column
  { x: -4, y: 24 },
  { x: 0, y: 10 }, // intelligence — settles level to follow the document
  { x: 0, y: 9 },
  { x: -6, y: 12 },
  { x: 8, y: 20 }, // financial — the hall opens, camera lifts
  { x: -6, y: 30 },
  { x: 10, y: 24 },
  { x: -8, y: 14 },
  { x: 6, y: 11 },
  { x: -18, y: 12 }, // lab — swings wide to orbit a contained system
  { x: 16, y: 10 },
  { x: -4, y: 14 }, // engineer — pulls back
  { x: 0, y: 8 }, // contact
  { x: 0, y: 6 },
];

export const cameraPath = LANES.map((lane, i) =>
  v(lane.x, lane.y, zAt(i / (LANES.length - 1)) + TRAIL),
);

/**
 * Field of view per chapter. Widening in halls and narrowing in corridors
 * changes apparent speed without changing the scroll rate — the cheapest way to
 * make one environment feel larger than another.
 */
export const fovEnvelopes = [
  { range: [0.06, 0.19], fov: 1.24 }, // origin — wide, to hold scattered islands
  { range: [0.19, 0.31], fov: 0.92 }, // product — tight on a narrow stack
  { range: [0.31, 0.5], fov: 1.0 }, // intelligence — level with the conveyor
  { range: [0.5, 0.76], fov: 1.2 }, // financial — the hall
  { range: [0.76, 0.87], fov: 1.06 }, // lab — contained
  { range: [0.87, 0.94], fov: 1.34 }, // engineer — pull back
  { range: [0.94, 1.0], fov: 0.86 }, // contact — closes in
];

export const FOG = { near: 260, far: 820 };
export const FOG_MOBILE = { near: 170, far: 520 };

export function chapterAt(t) {
  for (const c of chapters) {
    if (t >= c.range[0] && t < c.range[1]) return c;
  }
  return chapters[chapters.length - 1];
}

/** Progress within the current chapter, 0..1. */
export function chapterProgress(t) {
  const c = chapterAt(t);
  const [a, b] = c.range;
  return b > a ? Math.min(1, Math.max(0, (t - a) / (b - a))) : 0;
}

/** Scroll position for a chapter's start. Navigation only ever sets scroll. */
export const tForChapter = (id) => chapters.find((c) => c.id === id)?.range[0] ?? 0;

/**
 * Total scrollable height, as a multiple of the viewport.
 *
 * Each chapter's DOM section is `share × SCROLL_VH` tall and pins a full-height
 * panel inside it, so every share must exceed 100vh or that panel never sticks.
 * The shortest chapters are boot and contact at 6%, which sets the floor:
 * 0.06 × 2000 = 120vh. Section heights stay exactly proportional to the ranges
 * above, because scroll position is what keeps the copy and the camera in step.
 */
export const SCROLL_VH = 2000;

export const chapterVh = (chapter) => (chapter.range[1] - chapter.range[0]) * SCROLL_VH;
