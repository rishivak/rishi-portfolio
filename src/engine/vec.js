/**
 * Minimal 3-vector maths and a Catmull-Rom spline.
 *
 * Deliberately not a library. The scene needs exactly these operations, and a
 * hand-written 250-line engine ships ~8KB where three.js ships ~650KB — for
 * monochrome wireframe architecture, the dependency would buy nothing.
 *
 * Functions that run once or twice a frame allocate freely. Functions in the
 * per-node hot path write into a caller-supplied `out` so the draw loop makes
 * no garbage.
 */

export const v = (x = 0, y = 0, z = 0) => ({ x, y, z });

export const add = (a, b) => v(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a, b) => v(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a, k) => v(a.x * k, a.y * k, a.z * k);
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

export const cross = (a, b) =>
  v(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

export const len = (a) => Math.hypot(a.x, a.y, a.z);

export function norm(a) {
  const l = len(a);
  return l < 1e-9 ? v(0, 0, 1) : v(a.x / l, a.y / l, a.z / l);
}

export const lerp = (a, b, k) => a + (b - a) * k;

export const lerpV = (a, b, k) => v(lerp(a.x, b.x, k), lerp(a.y, b.y, k), lerp(a.z, b.z, k));

export const clamp = (n, lo = 0, hi = 1) => (n < lo ? lo : n > hi ? hi : n);

/** Smooth 0→1 ramp. The only easing the engine uses. */
export function smoothstep(edge0, edge1, n) {
  if (edge1 === edge0) return n < edge0 ? 0 : 1;
  const k = clamp((n - edge0) / (edge1 - edge0));
  return k * k * (3 - 2 * k);
}

/**
 * Catmull-Rom through p1→p2, using p0 and p3 as tangent context. Chosen over a
 * Bezier because the control points *are* the path — the camera passes through
 * every keyframe, which is what makes the scene layout and the camera path
 * describable in the same coordinates.
 */
export function catmull(p0, p1, p2, p3, k) {
  const k2 = k * k;
  const k3 = k2 * k;
  const axis = (a, b, c, d) =>
    0.5 * (2 * b + (-a + c) * k + (2 * a - 5 * b + 4 * c - d) * k2 + (-a + 3 * b - 3 * c + d) * k3);
  return v(
    axis(p0.x, p1.x, p2.x, p3.x),
    axis(p0.y, p1.y, p2.y, p3.y),
    axis(p0.z, p1.z, p2.z, p3.z),
  );
}

/**
 * Position along a whole keyframe path for u in [0,1]. Endpoints are duplicated
 * so the curve actually reaches the first and last keyframe rather than
 * treating them as tangent-only context.
 */
export function splineAt(points, u) {
  const n = points.length;
  if (n === 0) return v();
  if (n === 1) return points[0];
  if (n === 2) return lerpV(points[0], points[1], clamp(u));

  const span = clamp(u) * (n - 1);
  const i = Math.min(Math.floor(span), n - 2);
  const k = span - i;
  const at = (j) => points[clamp(j, 0, n - 1)];
  return catmull(at(i - 1), at(i), at(i + 1), at(i + 2), k);
}
