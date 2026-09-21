import { v } from '../../engine/vec';
import { chain, edge, field, node, remapZ, within } from '../build';
import { chapters } from '../world';
import { movements } from '../../data/phoenix';

const PX = chapters.find((c) => c.id === 'financial').range;

/**
 * The Phoenix chapter — the centrepiece, and the longest stretch of the
 * journey by a wide margin.
 *
 * Movement windows are derived from the weights in src/data/phoenix.js rather
 * than hardcoded, so re-weighting a movement there re-times the scene here.
 */
const bounds = (() => {
  const total = movements.reduce((n, m) => n + m.weight, 0);
  let cursor = 0;
  const out = {};
  for (const m of movements) {
    const a = cursor / total;
    cursor += m.weight;
    out[m.id] = [PX[0] + (PX[1] - PX[0]) * a, PX[0] + (PX[1] - PX[0]) * (cursor / total)];
  }
  return out;
})();

export const movementBounds = bounds;

/* ── 1 · APPROACH ─────────────────────────────────────────────────────────
   The corridor opens into a hall and the platform's spine assembles. The
   camera slows here; the pace change is what signals importance, not a
   heading. */
const approach = chain(
  [
    { id: 'client', label: 'CLIENT' },
    { id: 'api', label: 'API' },
    { id: 'compute', label: 'DATA / COMPUTE' },
    { id: 'transform', label: 'TRANSFORM' },
    { id: 'result', label: 'RESULT', stage: 'decision' },
  ],
  {
    origin: v(0, 14, -520),
    step: v(0, 0, -42),
    range: bounds.approach,
    stage: 'engineering',
    prefix: 'px.spine.',
    size: 10,
  },
);

/* ── 2 · SPECIFICATION, BEFORE ────────────────────────────────────────────
   The whole assemble → compress chain sits directly on the request path, and
   a packet runs it end to end again on every pass. The repetition is the
   argument. */
const specBefore = chain(
  [
    { id: 'assemble', label: 'ASSEMBLE' },
    { id: 'resolve', label: 'RESOLVE $REF' },
    { id: 'validate', label: 'VALIDATE' },
    { id: 'serialise', label: 'SERIALISE' },
    { id: 'compress', label: 'COMPRESS' },
  ],
  {
    origin: v(-30, 10, -700),
    step: v(15, 0, -20),
    range: bounds['spec-before'],
    stage: 'engineering',
    prefix: 'px.before.',
    size: 7,
  },
);

/* ── 3 · SPECIFICATION, AFTER ─────────────────────────────────────────────
   The same chain detaches from the request path and docks at a startup plane
   above it. The nodes physically relocate — this is one position lerp, and it
   carries the entire engineering point without a sentence of prose. */
const LIFT = v(0, 26, 0);
const specAfter = {
  nodes: [
    node('px.startup', v(-34, 40, -742), {
      label: 'APPLICATION STARTUP',
      stage: 'engineering',
      size: 11,
      appear: within(bounds['spec-after'], 0.04, 0.26),
      focus: within(bounds['spec-after'], 0.1, 0.4),
    }),
    node('px.ready', v(46, 38, -800), {
      label: 'READY',
      stage: 'intelligence',
      size: 9,
      appear: within(bounds['spec-after'], 0.34, 0.52),
    }),

    // The request path, now almost empty.
    node('px.req', v(-34, 8, -800), {
      label: 'REQUEST',
      stage: 'engineering',
      size: 8,
      appear: within(bounds['spec-after'], 0.5, 0.66),
    }),
    node('px.etag', v(4, 8, -812), {
      label: 'ETAG',
      stage: 'intelligence',
      size: 8,
      appear: within(bounds['spec-after'], 0.58, 0.74),
      focus: within(bounds['spec-after'], 0.66, 0.9),
    }),
    node('px.304', v(44, 8, -824), {
      label: '304 NOT MODIFIED',
      stage: 'decision',
      size: 10,
      appear: within(bounds['spec-after'], 0.7, 0.88),
      focus: within(bounds['spec-after'], 0.8, 1),
    }),
  ],
  edges: [
    edge('px.startup', 'px.before.assemble', {
      stage: 'engineering',
      flow: true,
      rate: 3,
      appear: within(bounds['spec-after'], 0.1, 0.3),
    }),
    edge('px.before.compress', 'px.ready', {
      stage: 'intelligence',
      appear: within(bounds['spec-after'], 0.34, 0.5),
    }),
    edge('px.req', 'px.etag', {
      stage: 'engineering',
      flow: true,
      rate: 8,
      appear: within(bounds['spec-after'], 0.54, 0.7),
    }),
    edge('px.etag', 'px.304', {
      stage: 'decision',
      flow: true,
      rate: 8,
      offset: 0.5,
      appear: within(bounds['spec-after'], 0.66, 0.82),
    }),
    // The pre-computed payload is what the later request meets.
    edge('px.ready', 'px.etag', {
      stage: 'intelligence',
      appear: within(bounds['spec-after'], 0.62, 0.8),
    }),
  ],
};

// Relocate the "before" chain upward as the "after" movement begins.
for (const n of specBefore.nodes) {
  n.move = within(bounds['spec-after'], 0.06, 0.34);
  n.moveTo = v(n.p.x, n.p.y + LIFT.y, n.p.z - 32);
}

/* ── 4 · RECURSIVE RESOLUTION ─────────────────────────────────────────────
   A $ref tree unfolds in depth and the camera follows one chain inward. Then
   a reference points back at an ancestor, the loop closes visibly, and
   traversal stops. Recursive resolution and cycle detection, shown. */
const R4 = bounds.resolution;
const resolution = {
  nodes: [
    node('px.spec.root', v(-6, 20, -880), { label: 'SPEC', stage: 'engineering', size: 9, appear: within(R4, 0.02, 0.2) }),
    node('px.spec.c1', v(-24, 14, -906), { label: 'COMPONENT', stage: 'engineering', size: 7, appear: within(R4, 0.14, 0.32) }),
    node('px.spec.c2', v(-8, 8, -932), { label: '$REF', stage: 'engineering', size: 6, appear: within(R4, 0.26, 0.44) }),
    node('px.spec.c3', v(10, 2, -958), { label: 'COMPONENT', stage: 'engineering', size: 6, appear: within(R4, 0.38, 0.56) }),
    node('px.spec.c4', v(24, -4, -984), { label: '$REF', stage: 'engineering', size: 6, appear: within(R4, 0.5, 0.68) }),
    // The reference that closes the loop.
    node('px.spec.cycle', v(-2, 6, -940), {
      label: 'CYCLE — HALT',
      stage: 'decision',
      size: 9,
      appear: within(R4, 0.72, 0.9),
      focus: within(R4, 0.78, 1),
    }),
  ],
  edges: [
    edge('px.spec.root', 'px.spec.c1', { stage: 'engineering', flow: true, rate: 5, appear: within(R4, 0.1, 0.26) }),
    edge('px.spec.c1', 'px.spec.c2', { stage: 'engineering', flow: true, rate: 5, offset: 0.2, appear: within(R4, 0.22, 0.38) }),
    edge('px.spec.c2', 'px.spec.c3', { stage: 'engineering', flow: true, rate: 5, offset: 0.4, appear: within(R4, 0.34, 0.5) }),
    edge('px.spec.c3', 'px.spec.c4', { stage: 'engineering', flow: true, rate: 5, offset: 0.6, appear: within(R4, 0.46, 0.62) }),
    // Back-edge to an ancestor — the cycle itself.
    edge('px.spec.c4', 'px.spec.c2', { stage: 'decision', appear: within(R4, 0.62, 0.78) }),
    edge('px.spec.c4', 'px.spec.cycle', { stage: 'decision', appear: within(R4, 0.74, 0.88) }),
  ],
};

/* ── 5 · DATA CATALOG ─────────────────────────────────────────────────────
   Two surfaces separate in space, then their duplicated handler logic merges
   into one shared base beneath both. */
const R5 = bounds.catalog;
const catalog = {
  nodes: [
    node('px.cat.sources', v(-20, 22, -1010), { label: 'DATA SOURCES', stage: 'engineering', size: 8, appear: within(R5, 0.04, 0.24) }),
    node('px.cat.queries', v(20, 22, -1010), { label: 'DATA QUERIES', stage: 'engineering', size: 8, appear: within(R5, 0.1, 0.3) }),
    node('px.cat.admin', v(-28, 10, -1046), { label: 'ADMIN — CRUD', stage: 'engineering', size: 8, appear: within(R5, 0.22, 0.42) }),
    node('px.cat.user', v(28, 10, -1046), { label: 'USER — READ', stage: 'intelligence', size: 8, appear: within(R5, 0.3, 0.5), focus: within(R5, 0.4, 0.7) }),
    node('px.cat.base', v(0, -4, -1080), {
      label: 'SHARED BASE HANDLERS',
      stage: 'intelligence',
      size: 10,
      appear: within(R5, 0.56, 0.8),
      focus: within(R5, 0.7, 1),
    }),
  ],
  edges: [
    edge('px.cat.sources', 'px.cat.admin', { stage: 'engineering', appear: within(R5, 0.18, 0.36) }),
    edge('px.cat.queries', 'px.cat.user', { stage: 'intelligence', appear: within(R5, 0.26, 0.44) }),
    edge('px.cat.sources', 'px.cat.user', { stage: 'intelligence', appear: within(R5, 0.34, 0.5) }),
    edge('px.cat.queries', 'px.cat.admin', { stage: 'engineering', appear: within(R5, 0.38, 0.54) }),
    edge('px.cat.admin', 'px.cat.base', { stage: 'intelligence', flow: true, rate: 4, appear: within(R5, 0.58, 0.76) }),
    edge('px.cat.user', 'px.cat.base', { stage: 'intelligence', flow: true, rate: 4, offset: 0.5, appear: within(R5, 0.62, 0.8) }),
  ],
};

/* ── 6 · TRANSFORM ENGINE ─────────────────────────────────────────────────
   The pipeline, then the fan-out. One transform node branches into three
   windows that run in parallel and re-converge into one response. */
const R6 = bounds.transform;
const transformChain = chain(
  [
    { id: 'returns', label: 'RETURNS', stage: 'data' },
    { id: 'frequency', label: 'FREQUENCY', stage: 'data' },
    { id: 'alignment', label: 'ALIGNMENT' },
    { id: 'window', label: 'WINDOW' },
    { id: 'compound', label: 'COMPOUND', stage: 'intelligence' },
  ],
  {
    origin: v(-40, 6, -1110),
    step: v(19, 2, -22),
    range: [R6[0], R6[0] + (R6[1] - R6[0]) * 0.55],
    stage: 'engineering',
    prefix: 'px.tx.',
    size: 8,
  },
);

const WINDOWS = [
  { id: '20d', label: '20D', y: 20 },
  { id: '60d', label: '60D', y: 4 },
  { id: '120d', label: '120D', y: -12 },
];

const transform = {
  nodes: [
    ...transformChain.nodes,
    ...WINDOWS.map((w, i) =>
      node(`px.tx.${w.id}`, v(30, w.y, -1232 - i * 6), {
        label: w.label,
        stage: 'intelligence',
        size: 7,
        appear: within(R6, 0.58 + i * 0.05, 0.74 + i * 0.05),
      }),
    ),
    node('px.tx.response', v(66, 4, -1276), {
      label: 'RESPONSE',
      stage: 'decision',
      size: 10,
      appear: within(R6, 0.82, 0.96),
      focus: within(R6, 0.88, 1),
    }),
  ],
  edges: [
    ...transformChain.edges,
    ...WINDOWS.map((w, i) =>
      edge('px.tx.compound', `px.tx.${w.id}`, {
        stage: 'intelligence',
        flow: true,
        rate: 5,
        offset: i * 0.33,
        appear: within(R6, 0.56 + i * 0.05, 0.72 + i * 0.05),
      }),
    ),
    ...WINDOWS.map((w, i) =>
      edge(`px.tx.${w.id}`, 'px.tx.response', {
        stage: 'decision',
        flow: true,
        rate: 5,
        offset: i * 0.33,
        appear: within(R6, 0.8 + i * 0.03, 0.94),
      }),
    ),
  ],
  fields: [
    // The incoming series, as observations.
    field('px.tx.series', v(-40, 6, -1110), {
      shape: 'series',
      stage: 'data',
      cols: 24,
      rows: 1,
      gap: v(1.4, 0, 0),
      amplitude: 7,
      appear: within(R6, 0.02, 0.2),
    }),
    // One output series per window, so the fan-out is visibly three series.
    ...WINDOWS.map((w, i) =>
      field(`px.tx.out.${w.id}`, v(40, w.y, -1244 - i * 6), {
        shape: 'series',
        stage: 'intelligence',
        cols: 16,
        rows: 1,
        gap: v(1.2, 0, 0),
        amplitude: 4 - i,
        appear: within(R6, 0.66 + i * 0.04, 0.82 + i * 0.04),
      }),
    ),
  ],
};

/* ── 7 · CORRECTNESS ──────────────────────────────────────────────────────
   Clinical. Valid inputs continue; invalid ones are rejected and travel no
   further. The rejected branch is a dead end on purpose. */
const R7 = bounds.correctness;
const correctness = {
  nodes: [
    node('px.ok.input', v(-24, 8, -1310), { label: 'INPUT', stage: 'data', size: 8, appear: within(R7, 0.04, 0.24) }),
    node('px.ok.validate', v(4, 8, -1340), {
      label: 'VALIDATE',
      stage: 'engineering',
      size: 10,
      appear: within(R7, 0.18, 0.4),
      focus: within(R7, 0.3, 0.7),
    }),
    node('px.ok.compute', v(34, 18, -1372), { label: 'COMPUTE', stage: 'intelligence', size: 8, appear: within(R7, 0.42, 0.62) }),
    node('px.ok.reject', v(34, -6, -1372), { label: 'REJECT', stage: 'decision', size: 8, appear: within(R7, 0.5, 0.7), focus: within(R7, 0.62, 0.9) }),
  ],
  edges: [
    edge('px.ok.input', 'px.ok.validate', { stage: 'engineering', flow: true, rate: 6, appear: within(R7, 0.1, 0.3) }),
    edge('px.ok.validate', 'px.ok.compute', { stage: 'intelligence', flow: true, rate: 6, appear: within(R7, 0.42, 0.6) }),
    edge('px.ok.validate', 'px.ok.reject', { stage: 'decision', appear: within(R7, 0.5, 0.68) }),
  ],
};

const authored = {
  nodes: [
    ...approach.nodes,
    ...specBefore.nodes,
    ...specAfter.nodes,
    ...resolution.nodes,
    ...catalog.nodes,
    ...transform.nodes,
    ...correctness.nodes,
  ],
  edges: [
    ...approach.edges,
    ...specBefore.edges,
    ...specAfter.edges,
    ...resolution.edges,
    ...catalog.edges,
    ...transform.edges,
    ...correctness.edges,
    // The request path enters the specification chain from the platform spine.
    edge('px.spine.api', 'px.before.assemble', {
      stage: 'engineering',
      flow: true,
      rate: 6,
      appear: within(bounds['spec-before'], 0.05, 0.25),
      vanish: within(bounds['spec-after'], 0.06, 0.3),
    }),
  ],
  fields: [...transform.fields],
};

/**
 * Authored against the old −520 … −1372 corridor; the career map now gives
 * Phoenix −1120 … −1900. Remapped rather than re-typed.
 */
export const phoenixScene = remapZ(authored, [-520, -1372], [-1120, -1900]);
