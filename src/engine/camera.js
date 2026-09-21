import { cross, norm, splineAt, sub, v, lerp, clamp, smoothstep } from './vec';

/**
 * A chase camera bound to a spline through the world.
 *
 * Scroll produces exactly one number, `t`. Everything the viewer sees is
 * derived from it — position, look direction, field of view, fog depth. That
 * is what makes the experience one coherent state rather than a pile of
 * independently triggered animations.
 *
 * The camera trails the payload rather than sitting inside it. Pure first
 * person is disorienting over a long scroll and, more importantly, it hides
 * the artifact being transformed — which is the thing worth watching.
 */

const UP = v(0, 1, 0);
const LOOK_AHEAD = 0.014; // how far along the spline the camera aims
const NEAR = 1.2;

/**
 * @param path  camera keyframes, world space
 * @param t     scroll progress, 0..1
 * @param fov   vertical field of view in radians
 */
export function cameraAt(path, t, { fov = 1.05, lookAhead = LOOK_AHEAD, roll = 0 } = {}) {
  const u = clamp(t);
  const position = splineAt(path, u);
  const target = splineAt(path, Math.min(1, u + lookAhead));

  // At u = 1 the look-ahead clamps onto the position itself, so fall back to
  // the world's travel direction rather than producing a zero-length basis.
  const aim = sub(target, position);
  const forward = norm(Math.hypot(aim.x, aim.y, aim.z) < 1e-6 ? v(0, 0, -1) : aim);

  // Right-handed basis: right = forward × up, then re-derive up so the three
  // stay orthonormal even when the path pitches. Taking the cross product in
  // the other order mirrors the entire scene horizontally.
  let right = cross(forward, UP);
  if (Math.hypot(right.x, right.y, right.z) < 1e-6) right = v(1, 0, 0);
  right = norm(right);
  const up = norm(cross(right, forward));

  // Bank slightly into lateral movement so direction changes read as intent.
  const banked = roll
    ? {
        x: right.x * Math.cos(roll) + up.x * Math.sin(roll),
        y: right.y * Math.cos(roll) + up.y * Math.sin(roll),
        z: right.z * Math.cos(roll) + up.z * Math.sin(roll),
      }
    : right;

  return { position, forward, right: banked, up: norm(cross(banked, forward)), fov, near: NEAR };
}

/** Lateral velocity along the path, used to derive the bank angle. */
export function bankAt(path, t, strength = 0.22) {
  const step = 0.006;
  const a = splineAt(path, clamp(t - step));
  const b = splineAt(path, clamp(t + step));
  return clamp((b.x - a.x) * strength * 0.05, -0.16, 0.16);
}

/**
 * Field of view widens in open halls and narrows in corridors, which changes
 * the apparent speed without changing the scroll rate — the cheapest way to
 * make a chapter feel slower and more important.
 */
export function fovAt(envelopes, t, base = 1.05) {
  let fov = base;
  for (const e of envelopes) {
    const into = smoothstep(e.range[0], e.range[0] + 0.03, t);
    const out = 1 - smoothstep(e.range[1] - 0.03, e.range[1], t);
    fov = lerp(fov, e.fov, into * out);
  }
  return fov;
}
