import { clamp, smoothstep } from './vec';

/**
 * The whole architecture's state is a pure function of scroll.
 *
 * Every scene item declares `appear: [t0, t1]` and optionally `vanish:
 * [t2, t3]`. From one `t` this yields each item's presence (0..1) and whether
 * it is worth drawing at all. Nothing in the scene has its own timer, its own
 * observer, or its own trigger — which is why scrubbing the scrollbar
 * backwards looks identical to scrolling forwards, and why the reduced-motion
 * path can simply ask for the state at a fixed `t`.
 */

/** Presence of a single item at `t`: 0 absent, 1 fully assembled. */
export function presenceAt(item, t) {
  const [a0, a1] = item.appear ?? [0, 0];
  let n = a1 > a0 ? smoothstep(a0, a1, t) : t >= a0 ? 1 : 0;
  if (item.vanish) {
    const [v0, v1] = item.vanish;
    n *= 1 - (v1 > v0 ? smoothstep(v0, v1, t) : t >= v0 ? 1 : 0);
  }
  return clamp(n);
}

/**
 * Emphasis: 1 while `t` is inside the item's `focus` window, falling away
 * outside it. This is how the scene keeps exactly one thing important at a
 * time without anything being hidden.
 */
export function focusAt(item, t) {
  if (!item.focus) return 0;
  const [f0, f1] = item.focus;
  const pad = 0.012;
  return clamp(smoothstep(f0 - pad, f0, t) * (1 - smoothstep(f1, f1 + pad, t)));
}

/**
 * Some nodes move between two positions as the story advances — the
 * specification chain relocating from the request path to the startup plane is
 * the whole point of that movement, and it is a position lerp, not a cut.
 */
export function positionAt(item, t) {
  if (!item.moveTo || !item.move) return item.p;
  const k = smoothstep(item.move[0], item.move[1], t);
  if (k <= 0) return item.p;
  if (k >= 1) return item.moveTo;
  return {
    x: item.p.x + (item.moveTo.x - item.p.x) * k,
    y: item.p.y + (item.moveTo.y - item.p.y) * k,
    z: item.p.z + (item.moveTo.z - item.p.z) * k,
  };
}

const MIN_PRESENCE = 0.004;

/**
 * Resolve an entire scene for one `t`.
 *
 * Returns live nodes with their current position, presence and focus, plus the
 * edges whose endpoints both exist. Items below the presence threshold are
 * dropped here rather than in the draw loop, so culling happens once.
 */
export function resolveScene(scene, t) {
  const nodes = [];
  const byId = new Map();

  for (const item of scene.nodes) {
    const presence = presenceAt(item, t);
    if (presence <= MIN_PRESENCE) continue;
    const live = {
      ref: item,
      id: item.id,
      p: positionAt(item, t),
      presence,
      focus: focusAt(item, t),
      stage: item.stage,
      label: item.label,
      kind: item.kind ?? 'node',
      size: item.size ?? 7,
    };
    nodes.push(live);
    byId.set(item.id, live);
  }

  const edges = [];
  for (const item of scene.edges ?? []) {
    const from = byId.get(item.from);
    const to = byId.get(item.to);
    if (!from || !to) continue;
    const presence = presenceAt(item, t);
    if (presence <= MIN_PRESENCE) continue;
    edges.push({
      ref: item,
      from,
      to,
      presence,
      focus: focusAt(item, t),
      stage: item.stage ?? from.stage,
      // Packets only run on edges explicitly marked as carrying flow.
      flow: item.flow ? flowPhase(item, t) : null,
    });
  }

  const fields = [];
  for (const item of scene.fields ?? []) {
    const presence = presenceAt(item, t);
    if (presence <= MIN_PRESENCE) continue;
    fields.push({ ref: item, p: positionAt(item, t), presence, focus: focusAt(item, t), stage: item.stage });
  }

  return { nodes, edges, fields, byId };
}

/**
 * Where a packet sits on its edge. Driven by scroll rather than by wall-clock
 * time, so the flow reverses when the visitor scrolls back — the system runs
 * in whichever direction they move, which makes the causality legible.
 */
function flowPhase(item, t) {
  const rate = item.rate ?? 6;
  const offset = item.offset ?? 0;
  return ((t * rate + offset) % 1 + 1) % 1;
}

/** Total node count, for the HUD readout. Real number, not decoration. */
export const sceneSize = (scene) => (scene.nodes?.length ?? 0) + (scene.fields?.length ?? 0);
