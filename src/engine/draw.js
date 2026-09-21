import { fogged, rgba } from './palette';
import { depthAlpha } from './project';

/**
 * Canvas primitives. Everything the scene can contain is one of these five —
 * there is no mesh, no material and no light, because the design language is
 * hairlines, points and planes.
 *
 * Every function takes already-projected screen points. Nothing here knows
 * about the camera, which is what keeps the renderer swappable.
 */

/** A node: a small square in screen space, sized by depth. */
export function node(ctx, proj, { rgb, fogRgb, alpha = 1, size = 7, filled = false, active = 0 }) {
  const a = depthAlpha(proj, alpha);
  if (a <= 0.004) return;

  const s = Math.max(2.5, size * proj.scale * 26);
  const half = s / 2;
  ctx.strokeStyle = fogged(rgb, fogRgb, proj.fog, a);
  ctx.lineWidth = 1 + active * 0.6;

  if (filled) {
    ctx.fillStyle = fogged(rgb, fogRgb, proj.fog, a * 0.16);
    ctx.fillRect(proj.x - half, proj.y - half, s, s);
  }
  ctx.strokeRect(proj.x - half, proj.y - half, s, s);

  // An active node gets a centre mark rather than a glow.
  if (active > 0.01) {
    ctx.fillStyle = fogged(rgb, fogRgb, proj.fog, a * active);
    const c = Math.max(1.5, s * 0.18);
    ctx.fillRect(proj.x - c / 2, proj.y - c / 2, c, c);
  }
}

/** A point in a field — the cheapest thing the engine draws. */
export function point(ctx, proj, { rgb, fogRgb, alpha = 1, size = 1.6 }) {
  const a = depthAlpha(proj, alpha);
  if (a <= 0.004) return;
  const s = Math.max(0.7, size * proj.scale * 22);
  ctx.fillStyle = fogged(rgb, fogRgb, proj.fog, a);
  ctx.fillRect(proj.x - s / 2, proj.y - s / 2, s, s);
}

/** A connection. `progress` reveals it from `a` toward `b` as it assembles. */
export function edge(ctx, a, b, { rgb, fogRgb, alpha = 1, progress = 1, width = 1 }) {
  const fog = (a.fog + b.fog) / 2;
  const opacity = Math.min(depthAlpha(a, alpha), depthAlpha(b, alpha));
  if (opacity <= 0.004 || progress <= 0) return;

  const ex = a.x + (b.x - a.x) * progress;
  const ey = a.y + (b.y - a.y) * progress;

  ctx.strokeStyle = fogged(rgb, fogRgb, fog, opacity);
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
}

/**
 * A packet travelling an edge. This is how flow is shown — a moving mark on a
 * static line, rather than an animated dash pattern, which reads as noise at
 * depth.
 */
export function packet(ctx, a, b, k, { rgb, fogRgb, alpha = 1, size = 3 }) {
  const fog = (a.fog + b.fog) / 2;
  const opacity = Math.min(depthAlpha(a, alpha), depthAlpha(b, alpha));
  if (opacity <= 0.004) return;

  const x = a.x + (b.x - a.x) * k;
  const y = a.y + (b.y - a.y) * k;
  const s = Math.max(1.4, size * ((a.scale + b.scale) / 2) * 24);

  ctx.fillStyle = fogged(rgb, fogRgb, fog, opacity);
  ctx.beginPath();
  ctx.arc(x, y, s / 2, 0, Math.PI * 2);
  ctx.fill();
}

/** A hairline quad — boundaries, gates, planes. Corners must be in order. */
export function quad(ctx, corners, { rgb, fogRgb, alpha = 1, fill = 0 }) {
  if (corners.some((c) => !c.ok)) return;
  const fog = corners.reduce((n, c) => n + c.fog, 0) / corners.length;
  const opacity = Math.min(...corners.map((c) => depthAlpha(c, alpha)));
  if (opacity <= 0.004) return;

  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  for (let i = 1; i < corners.length; i += 1) ctx.lineTo(corners[i].x, corners[i].y);
  ctx.closePath();

  if (fill > 0) {
    ctx.fillStyle = fogged(rgb, fogRgb, fog, opacity * fill);
    ctx.fill();
  }
  ctx.strokeStyle = fogged(rgb, fogRgb, fog, opacity);
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * The floor grid. Drawn directly in screen space from projected line ends,
 * which keeps it to two loops rather than one per cell.
 */
export function gridLines(ctx, lines, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const [a, b] of lines) {
    if (!a.ok || !b.ok) continue;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
  }
  ctx.stroke();
}

/** Fills the frame with the void colour. Called once per frame. */
export function clear(ctx, w, h, palette) {
  ctx.fillStyle = palette.void;
  ctx.fillRect(0, 0, w, h);
}

export { rgba };
