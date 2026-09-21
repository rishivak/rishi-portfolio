import { chapterAt, chapterProgress } from '../scene/world';
import { clamp, smoothstep } from './vec';

/**
 * Camera behaviours.
 *
 * Each behaviour is a pure function of `t` returning offsets applied on top of
 * the spline result, so `cameraAt` stays untouched and the single-state model
 * holds: the same `t` always produces the same camera.
 *
 * The point is that different kinds of understanding want different kinds of
 * movement. Travelling a career is forward motion; reading an architecture is
 * lateral; understanding a subsystem is a dive; a self-contained project is
 * something you walk around.
 *
 * Offsets are in camera-local space — x right, y up, z forward — and are
 * blended in and out at chapter edges so no boundary produces a jump.
 */

const ZERO = { x: 0, y: 0, z: 0, fov: 0, look: { x: 0, y: 0 } };

const BEHAVIOURS = {
  /** Forward travel. The default, and the whole of the career spine. */
  travel: () => ZERO,

  /**
   * Lateral strafe. The camera slides across an architecture rather than
   * through it, which is how you read a row of services rather than a pipe.
   */
  traverse: (k) => ({
    x: Math.sin(k * Math.PI * 2) * 16,
    y: 0,
    z: 0,
    fov: 0,
    look: { x: -Math.sin(k * Math.PI * 2) * 0.35, y: 0 },
  }),

  /** Push into a subsystem: closer, narrower, slightly lowered. */
  dive: (k) => {
    const into = Math.sin(k * Math.PI);
    return { x: 0, y: -6 * into, z: 26 * into, fov: -0.18 * into, look: ZERO.look };
  },

  /**
   * Locked to the payload. Almost no offset — the artifact is the subject and
   * the architecture should stream past it.
   */
  follow: (k) => ({
    x: Math.sin(k * Math.PI) * 4,
    y: 2 * Math.sin(k * Math.PI * 1.5),
    z: 0,
    fov: 0,
    look: ZERO.look,
  }),

  /**
   * Hold between two stacked architectures so both stay in frame — used where
   * a before and an after are the argument.
   */
  compare: (k) => ({
    x: Math.sin(k * Math.PI * 3) * 11,
    y: 6 * Math.sin(k * Math.PI),
    z: 0,
    fov: 0.06 * Math.sin(k * Math.PI),
    look: { x: 0, y: -0.12 * Math.sin(k * Math.PI) },
  }),

  /** Arc around a contained system — the only object you see all of. */
  orbit: (k) => {
    const a = k * Math.PI * 1.1 - Math.PI * 0.55;
    return {
      x: Math.sin(a) * 30,
      y: 4 * Math.cos(a),
      z: (1 - Math.cos(a)) * -18,
      fov: 0,
      look: { x: -Math.sin(a) * 0.55, y: 0 },
    };
  },

  /** Retreat and widen, revealing the constellation rather than a detail. */
  pullback: (k) => ({
    x: 0,
    y: 8 * k,
    z: -34 * smoothstep(0, 1, k),
    fov: 0.12 * k,
    look: { x: 0, y: -0.1 * k },
  }),

  /** Everything recedes. The world stops asserting. */
  dissolve: (k) => ({ x: 0, y: 2 * k, z: -12 * k, fov: -0.05 * k, look: ZERO.look }),
};

/** Fades a behaviour in and out at its chapter edges so nothing jumps. */
const EDGE = 0.12;

/**
 * @param t          scroll progress
 * @param intensity  the readability budget, 0..1. Camera movement scales with
 *                   it, so a text-dense section gets an almost stationary
 *                   camera while the hero keeps its full sweep. No zoom, no
 *                   rotation, no rapid transition survives a low budget.
 */
export function behaviourAt(t, intensity = 1) {
  const chapter = chapterAt(t);
  const fn = BEHAVIOURS[chapter.behaviour] ?? BEHAVIOURS.travel;
  const k = chapterProgress(t);

  // Zero at both boundaries, full in the middle — this is what guarantees
  // continuity across a behaviour change.
  const blend = smoothstep(0, EDGE, k) * (1 - smoothstep(1 - EDGE, 1, k)) * clamp(intensity);
  const raw = fn(k);

  return {
    x: raw.x * blend,
    y: raw.y * blend,
    z: raw.z * blend,
    fov: raw.fov * blend,
    look: { x: (raw.look?.x ?? 0) * blend, y: (raw.look?.y ?? 0) * blend },
  };
}

/** Applies a behaviour's local-space offsets to a camera basis. */
export function applyBehaviour(cam, offset) {
  if (!offset || (!offset.x && !offset.y && !offset.z && !offset.fov)) return cam;

  const position = {
    x: cam.position.x + cam.right.x * offset.x + cam.up.x * offset.y + cam.forward.x * offset.z,
    y: cam.position.y + cam.right.y * offset.x + cam.up.y * offset.y + cam.forward.y * offset.z,
    z: cam.position.z + cam.right.z * offset.x + cam.up.z * offset.y + cam.forward.z * offset.z,
  };

  // Look offsets rotate the forward axis toward right/up, keeping the basis
  // orthonormal without rebuilding it from a target point.
  const lx = offset.look?.x ?? 0;
  const ly = offset.look?.y ?? 0;
  const forward = lx || ly
    ? normalise({
        x: cam.forward.x + cam.right.x * lx + cam.up.x * ly,
        y: cam.forward.y + cam.right.y * lx + cam.up.y * ly,
        z: cam.forward.z + cam.right.z * lx + cam.up.z * ly,
      })
    : cam.forward;

  return { ...cam, position, forward, fov: clamp(cam.fov + offset.fov, 0.5, 1.8) };
}

function normalise(a) {
  const l = Math.hypot(a.x, a.y, a.z);
  return l < 1e-9 ? a : { x: a.x / l, y: a.y / l, z: a.z / l };
}
