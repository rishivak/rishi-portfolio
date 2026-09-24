/**
 * The rail's drum, as pure maths.
 *
 * `00 … 07` sit on a virtual rotary drum sharing the canvas world's
 * perspective: the section being read faces you, its neighbours rotate away and
 * recede. It is driven by a continuous `sectionIndex + progressWithinSection`,
 * so it turns *through* a boundary like an odometer instead of snapping at it.
 *
 * `REACH` is load-bearing, not cosmetic. The rail spans eight sections, so an
 * uncapped distance reaches ±7 — which tilts the far rungs past 90°, flipping
 * them backface-to-camera and pushing them 240px+ into a 620px perspective. A
 * rung rotated past the viewing plane is hit-tested somewhere other than where
 * it is drawn, which is what stopped the rail from taking clicks. Capped at 2.5
 * the drum never exceeds 40° or -85px, so every rung is clickable exactly where
 * it appears — and the numbers never turn upside down, which was never the
 * intent anyway.
 *
 * Aerial perspective is carried by opacity alone. A `filter` here would be a
 * grouping property, and grouping inside a perspective context is the other
 * half of what misplaced the click region.
 */

const TILT = 16; // degrees of rotation per section of distance
const DEPTH = 34; // pixels of recession per section of distance
const REACH = 2.5; // sections of distance before a rung stops moving

/** The perspective the rail is projected through, in pixels. */
export const PERSPECTIVE = 620;

/** The furthest a rung may tilt. Must stay well clear of the 90° viewing plane. */
export const MAX_TILT = REACH * TILT;

/** The furthest a rung may recede. Must stay shallow against `PERSPECTIVE`. */
export const MAX_DEPTH = REACH * DEPTH;

export function drumAt(head, i) {
  const d = Math.max(-REACH, Math.min(REACH, head - i));
  return {
    rotate: -d * TILT,
    depth: -Math.abs(d) * DEPTH,
    opacity: Math.max(0.3, 1 - Math.abs(d) * 0.3),
    tick: Math.max(10, 24 - Math.abs(d) * 14),
  };
}
