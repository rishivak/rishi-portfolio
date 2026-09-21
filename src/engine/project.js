import { clamp, smoothstep } from './vec';

/**
 * World → screen. Called for every node, every edge endpoint and every field
 * instance, every frame, so it writes into a caller-supplied `out` and
 * allocates nothing.
 *
 * `out.ok` is false when the point is behind the near plane or beyond the far
 * plane; callers skip it rather than drawing a point that has wrapped around
 * behind the camera.
 */

export function makeProjection() {
  return { x: 0, y: 0, z: 0, scale: 1, fog: 0, ok: false };
}

/**
 * @param p        world point
 * @param cam      from cameraAt()
 * @param view     { w, h, fogNear, fogFar }
 * @param out      reused projection object
 */
export function project(p, cam, view, out) {
  const dx = p.x - cam.position.x;
  const dy = p.y - cam.position.y;
  const dz = p.z - cam.position.z;

  // Depth along the camera's forward axis.
  const z = dx * cam.forward.x + dy * cam.forward.y + dz * cam.forward.z;
  if (z <= cam.near || z > view.fogFar) {
    out.ok = false;
    return out;
  }

  const x = dx * cam.right.x + dy * cam.right.y + dz * cam.right.z;
  const y = dx * cam.up.x + dy * cam.up.y + dz * cam.up.z;

  // Focal length from vertical FOV, so the framing is resolution-independent.
  const focal = view.h / 2 / Math.tan(cam.fov / 2);
  const k = focal / z;

  // The world composes to one side of the viewport rather than dead centre,
  // so it never sits behind the content column. `view.cx` is a fraction of the
  // width; the content owns the rest.
  out.x = view.w * (view.cx ?? 0.5) + x * k;
  out.y = view.h * (view.cy ?? 0.5) - y * k;
  out.z = z;
  out.scale = k;
  // 0 at the camera, 1 fully dissolved into the fog.
  out.fog = smoothstep(view.fogNear, view.fogFar, z);
  out.ok = true;
  return out;
}

/** Cheap rejection before the full projection, for large instanced fields. */
export function inRange(p, cam, view) {
  const dz =
    (p.x - cam.position.x) * cam.forward.x +
    (p.y - cam.position.y) * cam.forward.y +
    (p.z - cam.position.z) * cam.forward.z;
  return dz > cam.near && dz <= view.fogFar;
}

/**
 * Opacity for a projected point: fades in from the fog and out again as it
 * passes the camera, so nothing ever pops in or clips out.
 */
export function depthAlpha(proj, base = 1) {
  const near = smoothstep(0, 18, proj.z); // avoid a hard edge at the near plane
  return clamp(base * (1 - proj.fog) * near);
}
