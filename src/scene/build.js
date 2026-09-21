import { v } from '../engine/vec';

/**
 * Helpers for declaring scenes. Chapters are data, not code, and these exist
 * so that reading a chapter file tells you the shape of the space rather than
 * the mechanics of building it.
 */

/** Map a chapter-local 0..1 window onto the global scroll timeline. */
export function within(range, a, b = a) {
  const [t0, t1] = range;
  const span = t1 - t0;
  return [t0 + span * a, t0 + span * b];
}

export const node = (id, p, opts = {}) => ({ id, p, kind: 'node', ...opts });

export const edge = (from, to, opts = {}) => ({ from, to, ...opts });

/**
 * A linear pipeline — by far the most common shape here, since most of what
 * Rishi builds is a sequence of transformations.
 *
 * Each step appears in order across the supplied window, so the chain assembles
 * left to right as the camera approaches it.
 */
export function chain(steps, { origin, step: delta, range, stage, flow = true, prefix = '', size = 7 }) {
  const nodes = [];
  const edges = [];
  const n = steps.length;

  steps.forEach((s, i) => {
    const spec = typeof s === 'string' ? { id: s, label: s } : s;
    const id = `${prefix}${spec.id}`;
    const share = n > 1 ? i / (n - 1) : 0;

    nodes.push(
      node(id, v(origin.x + delta.x * i, origin.y + delta.y * i, origin.z + delta.z * i), {
        label: spec.label ?? spec.id,
        stage: spec.stage ?? stage,
        size: spec.size ?? size,
        appear: within(range, share * 0.55, share * 0.55 + 0.2),
        ...spec.opts,
      }),
    );

    if (i > 0) {
      const prev = `${prefix}${typeof steps[i - 1] === 'string' ? steps[i - 1] : steps[i - 1].id}`;
      edges.push(
        edge(prev, id, {
          stage: spec.stage ?? stage,
          flow,
          rate: 5,
          offset: i * 0.17,
          appear: within(range, share * 0.55 - 0.05, share * 0.55 + 0.16),
        }),
      );
    }
  });

  return { nodes, edges };
}

/**
 * An instanced cluster — a grid of rows and columns used for data structures
 * (document lines, strike rows, observations). Drawn as points, so a field of
 * 200 instances costs 200 rect fills rather than 200 draw calls.
 */
export function field(id, p, opts = {}) {
  return {
    id,
    p,
    kind: 'field',
    shape: 'grid',
    cols: 8,
    rows: 6,
    gap: v(4, 3, 0),
    jitter: 0,
    ...opts,
  };
}

/**
 * Shift and scale a scene part's depth into a different world region.
 *
 * Used where a chapter's geometry was authored against one z range and the
 * chapter map later moved — remapping is verifiable, whereas hand-editing
 * forty coordinates is how a node ends up stranded behind the camera.
 */
export function remapZ(part, fromRange, toRange) {
  const [f0, f1] = fromRange;
  const [t0, t1] = toRange;
  const scale = (t1 - t0) / (f1 - f0);
  const at = (z) => t0 + (z - f0) * scale;
  const move = (p) => (p ? { x: p.x, y: p.y, z: at(p.z) } : p);

  return {
    nodes: (part.nodes ?? []).map((n) => ({ ...n, p: move(n.p), moveTo: move(n.moveTo) })),
    edges: part.edges ?? [],
    fields: (part.fields ?? []).map((f) => ({ ...f, p: move(f.p) })),
  };
}

/** Merge chapter scenes into the single world scene the engine resolves. */
export function mergeScenes(parts) {
  const scene = { nodes: [], edges: [], fields: [] };
  for (const part of parts) {
    if (part.nodes) scene.nodes.push(...part.nodes);
    if (part.edges) scene.edges.push(...part.edges);
    if (part.fields) scene.fields.push(...part.fields);
  }

  // A duplicate id would silently shadow an earlier node in the resolver's
  // lookup map and quietly break every edge pointing at it.
  const seen = new Set();
  for (const n of scene.nodes) {
    if (seen.has(n.id)) throw new Error(`Duplicate scene node id: ${n.id}`);
    seen.add(n.id);
  }
  for (const e of scene.edges) {
    if (!seen.has(e.from)) throw new Error(`Edge references missing node: ${e.from}`);
    if (!seen.has(e.to)) throw new Error(`Edge references missing node: ${e.to}`);
  }

  return scene;
}
