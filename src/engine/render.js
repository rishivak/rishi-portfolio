import { cameraAt, bankAt, fovAt } from './camera';
import { applyBehaviour, behaviourAt } from './behaviour';
import { makeProjection, project } from './project';
import { resolveScene } from './resolve';
import { STAGE_KEY, fogged, readPalette } from './palette';
import { clear, edge as drawEdge, gridLines, node as drawNode, packet, point } from './draw';
import { v } from './vec';

/**
 * One frame.
 *
 * Everything here is a pure function of `t` — the camera, which geometry
 * exists, how assembled it is, and which single thing is currently emphasised.
 * That is what makes scrubbing the scrollbar backwards look identical to
 * scrolling forwards, and it is why the reduced-motion path can simply render
 * this once at a fixed `t` and stop.
 *
 * The scratch objects below are module-level on purpose: the draw loop runs
 * sixty times a second and must not allocate.
 */

const projA = makeProjection();
const projB = makeProjection();
const gridA = makeProjection();
const gridB = makeProjection();

// Reused across frames so projecting N nodes costs no garbage.
const pool = [];
const fromPool = (i) => (pool[i] ??= makeProjection());

const GRID_HALF = 5;
const GRID_STEP = 46;
const GRID_RUN = 900;

export function renderFrame(ctx, options) {
  const {
    scene, path, fovs, t, w, h, fog, labelSink, quality = 1,
    // The readability budget. Scales everything the world does: how bright it
    // is, how far the camera moves, how many labels it is allowed to show.
    intensity = 1,
    // Where the world composes horizontally, as a fraction of the width. The
    // content column owns the remainder.
    cx = 0.5,
  } = options;
  const palette = readPalette();

  // Camera composition: spline → chapter behaviour, both pure functions of
  // their inputs. The whole camera is therefore a pure function of
  // (t, intensity), which is why scrubbing backwards looks identical to
  // scrolling forwards and why a stationary reader sees an identical frame.
  const cam = applyBehaviour(
    cameraAt(path, t, { fov: fovAt(fovs, t), roll: bankAt(path, t) * intensity }),
    behaviourAt(t, intensity),
  );
  const view = { w, h, cx, fogNear: fog.near, fogFar: fog.far };

  clear(ctx, w, h, palette);
  drawFloor(ctx, cam, view, palette, intensity);

  const live = resolveScene(scene, t);
  const labels = [];
  let calls = 0;

  // ---- project every live node once, into the pool ------------------------
  const drawn = [];
  live.nodes.forEach((n, i) => {
    const p = fromPool(i);
    project(n.p, cam, view, p);
    if (!p.ok) return;
    n.proj = p;
    drawn.push(n);
  });

  // Painter's algorithm: far to near, so nearer geometry overlaps correctly.
  drawn.sort((a, b) => b.proj.z - a.proj.z);

  // ---- edges beneath nodes ------------------------------------------------
  for (const e of live.edges) {
    const a = e.from.proj;
    const b = e.to.proj;
    if (!a || !b || !a.ok || !b.ok) continue;

    const rgb = palette.rgb[STAGE_KEY[e.stage] ?? 'eng'];
    const alpha = (0.34 + e.focus * 0.4) * intensity;
    drawEdge(ctx, a, b, { rgb, fogRgb: palette.rgb.fog, alpha: alpha * e.presence, progress: e.presence });
    calls += 1;

    // Packets are the most eye-catching thing the world does, so they are the
    // first casualty of a low budget.
    if (e.flow !== null && e.presence > 0.7 && quality > 0.5 && intensity > 0.45) {
      packet(ctx, a, b, e.flow, { rgb, fogRgb: palette.rgb.fog, alpha: 0.9 * e.presence * intensity });
      calls += 1;
    }
  }

  // ---- fields -------------------------------------------------------------
  for (const f of live.fields) {
    calls += drawField(ctx, f, cam, view, palette, quality, intensity);
  }

  // ---- nodes, and the labels that belong to them --------------------------
  for (const n of drawn) {
    const rgb = palette.rgb[STAGE_KEY[n.stage] ?? 'eng'];
    drawNode(ctx, n.proj, {
      rgb,
      fogRgb: palette.rgb.fog,
      alpha: (0.5 + n.focus * 0.5) * n.presence * intensity,
      size: n.size,
      filled: n.focus > 0.2,
      active: n.focus,
    });
    calls += 1;

    // Only labels worth reading: assembled, near enough, and in frame.
    if (
      n.label &&
      n.presence > 0.55 &&
      n.proj.fog < 0.72 &&
      n.proj.x > -80 &&
      n.proj.x < w + 80 &&
      n.proj.y > -40 &&
      n.proj.y < h + 40
    ) {
      labels.push({
        id: n.id,
        text: n.label,
        x: n.proj.x,
        y: n.proj.y,
        size: n.size * n.proj.scale * 26,
        focus: n.focus,
        stage: n.stage,
        alpha: (1 - n.proj.fog) * n.presence,
        depth: n.proj.z,
      });
    }
  }

  // Nearest first, capped — a screen full of competing labels reads as noise.
  labels.sort((a, b) => b.focus - a.focus || a.depth - b.depth);
  const cap = Math.round((quality > 0.6 ? 14 : 8) * intensity);
  labelSink?.(labels.slice(0, Math.max(0, cap)));

  return { calls, nodes: drawn.length, total: live.nodes.length };
}

/** The floor. Two loops of projected line ends, not a cell-by-cell grid. */
function drawFloor(ctx, cam, view, palette, intensity) {
  const lines = [];
  const baseZ = Math.round((cam.position.z - GRID_RUN * 0.6) / GRID_STEP) * GRID_STEP;
  const y = -26;

  for (let i = -GRID_HALF; i <= GRID_HALF; i += 1) {
    const x = i * GRID_STEP;
    project(v(x, y, baseZ), cam, view, gridA);
    project(v(x, y, baseZ + GRID_RUN), cam, view, gridB);
    if (gridA.ok && gridB.ok) lines.push([{ ...gridA }, { ...gridB }]);
  }
  for (let j = 0; j <= GRID_RUN / GRID_STEP; j += 1) {
    const z = baseZ + j * GRID_STEP;
    project(v(-GRID_HALF * GRID_STEP, y, z), cam, view, gridA);
    project(v(GRID_HALF * GRID_STEP, y, z), cam, view, gridB);
    if (gridA.ok && gridB.ok) lines.push([{ ...gridA }, { ...gridB }]);
  }

  // The floor is the quietest thing in the scene and fades out first.
  gridLines(ctx, lines, fogged(palette.rgb.grid, palette.rgb.fog, 0, 0.55 * intensity));
}

/**
 * Instanced clusters — document lines, strike lattices, observation series.
 * These carry most of the visual density at a fraction of the cost of nodes,
 * because each instance is one rect fill with no label and no sorting.
 */
function drawField(ctx, f, cam, view, palette, quality, intensity) {
  const spec = f.ref;
  const rgb = palette.rgb[STAGE_KEY[spec.stage] ?? 'data'];
  const stride = quality > 0.6 ? 1 : 2;
  const alpha = (spec.dim ?? 1) * 0.72 * f.presence * intensity;
  let calls = 0;

  for (let r = 0; r < spec.rows; r += stride) {
    for (let c = 0; c < spec.cols; c += stride) {
      let x = f.p.x + c * spec.gap.x;
      let y = f.p.y + r * spec.gap.y;
      const z = f.p.z + c * spec.gap.z;

      if (spec.shape === 'rows') {
        // A text line: a short run drawn as one wide mark.
        x = f.p.x;
        y = f.p.y + r * spec.gap.y;
      } else if (spec.shape === 'series') {
        // Deterministic pseudo-series, so the shape is stable across frames.
        const phase = c * 0.7;
        y = f.p.y + Math.sin(phase) * (spec.amplitude ?? 5) * 0.5 + Math.sin(phase * 2.3) * 1.4;
      }

      project(v(x, y, z), cam, view, projA);
      if (!projA.ok) continue;

      if (spec.shape === 'rows') {
        const width = (spec.width ?? 10) * (0.55 + ((r * 37) % 9) / 16);
        project(v(x + width, y, z), cam, view, projB);
        if (!projB.ok) continue;
        drawEdge(ctx, projA, projB, { rgb, fogRgb: palette.rgb.fog, alpha, progress: f.presence });
      } else {
        point(ctx, projA, { rgb, fogRgb: palette.rgb.fog, alpha, size: 1.8 });
      }
      calls += 1;
    }
  }
  return calls;
}
