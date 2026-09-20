import { useCallback, useEffect, useRef } from 'react';
import { useCanvas } from '../../lib/useCanvas';
import { useFinePointer } from '../../lib/useMediaQuery';

/**
 * The hero's signature visual: a field of generated financial time series
 * drifting left-to-right behind the type.
 *
 * Two ideas make it worth the pixels.
 *   1. Coherence. A slow global pulse pulls every series toward one shared
 *      curve and releases it again — the field breathes between noise and
 *      agreement, which is what a market actually looks like.
 *   2. Inspection. On a fine pointer the canvas becomes a chart inspector:
 *      a hairline at the cursor, a dot where each series crosses it, and a
 *      readout of the sampled value. The cursor stops being decoration and
 *      starts being an instrument.
 *
 * Cost is deliberately bounded: sums of sines, no allocation per frame, one
 * shared rAF loop, and no rendering at all while offscreen.
 */

const COUNT_DESKTOP = 22;
const COUNT_MOBILE = 11;
const SAMPLES = 132;
const DRIFT = 0.055;

// A series is three harmonics with fixed phases — deterministic, infinite in x,
// and cheap enough to evaluate thousands of times a frame.
function buildSeries(count) {
  const series = [];
  for (let i = 0; i < count; i += 1) {
    const seed = (i * 9301 + 49297) % 233280;
    const r = (n) => ((seed * (n + 7)) % 1000) / 1000;
    series.push({
      lane: (i + 0.5) / count,
      amp: 0.03 + r(1) * 0.075,
      h: [
        { f: 1.1 + r(2) * 1.6, p: r(3) * Math.PI * 2, a: 1 },
        { f: 2.7 + r(4) * 3.1, p: r(5) * Math.PI * 2, a: 0.42 },
        { f: 6.3 + r(6) * 5.4, p: r(7) * Math.PI * 2, a: 0.16 },
      ],
      speed: 0.7 + r(8) * 0.6,
      weight: r(9) > 0.86 ? 1.2 : 0.7,
    });
  }
  return series;
}

const evaluate = (s, x) =>
  s.h[0].a * Math.sin(s.h[0].f * x + s.h[0].p) +
  s.h[1].a * Math.sin(s.h[1].f * x + s.h[1].p) +
  s.h[2].a * Math.sin(s.h[2].f * x + s.h[2].p);

// The shared curve every series is periodically drawn toward.
const consensus = (x) => 0.62 * Math.sin(1.35 * x + 0.4) + 0.3 * Math.sin(3.1 * x + 1.9);

export function SeriesField({ count }) {
  const fine = useFinePointer();
  const resolved = count ?? (typeof window !== 'undefined' && window.innerWidth < 768 ? COUNT_MOBILE : COUNT_DESKTOP);
  const seriesRef = useRef(buildSeries(resolved));
  const pointer = useRef({ x: -1, active: false });

  useEffect(() => {
    seriesRef.current = buildSeries(resolved);
  }, [resolved]);

  const draw = useCallback(
    (ctx, { w, h, t }) => {
      const series = seriesRef.current;
      // Mostly zero, with occasional smooth peaks — agreement is the exception.
      const align = Math.max(0, Math.sin(t * 0.085)) ** 7;
      const mx = pointer.current.active ? pointer.current.x : -1;
      const hits = [];

      for (let i = 0; i < series.length; i += 1) {
        const s = series[i];
        const baseY = h * (0.12 + s.lane * 0.76);
        ctx.beginPath();

        for (let j = 0; j <= SAMPLES; j += 1) {
          const px = (j / SAMPLES) * w;
          const phase = (px / w) * 6.2 + t * DRIFT * s.speed;
          const own = evaluate(s, phase);
          const value = own + (consensus(phase) - own) * align;
          const py = baseY + value * s.amp * h;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);

          if (mx >= 0 && hits.length <= i && px >= mx) {
            hits.push({ y: py, value });
          }
        }

        // Coherent moments brighten the whole field — the only time it asserts itself.
        ctx.strokeStyle = `rgba(232, 176, 75, ${(0.07 + align * 0.16) * (s.weight > 1 ? 1.8 : 1)})`;
        ctx.lineWidth = s.weight;
        ctx.stroke();
      }

      if (mx < 0) return;

      // ---- inspector -------------------------------------------------------
      ctx.strokeStyle = 'rgba(232, 236, 245, 0.16)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx + 0.5, 0);
      ctx.lineTo(mx + 0.5, h);
      ctx.stroke();

      ctx.fillStyle = 'rgba(232, 176, 75, 0.85)';
      for (const hit of hits) {
        ctx.beginPath();
        ctx.arc(mx, hit.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Read out the series nearest the pointer's own lane.
      const nearest = hits[Math.floor(hits.length / 2)];
      if (nearest) {
        const text = (100 + nearest.value * 42).toFixed(2);
        ctx.font = '500 10px ui-monospace, "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        const flip = mx > w - 96;
        ctx.textAlign = flip ? 'right' : 'left';
        ctx.fillStyle = 'rgba(232, 176, 75, 0.9)';
        ctx.fillText(text, mx + (flip ? -10 : 10), nearest.y);
      }
    },
    [],
  );

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    if (!fine) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - rect.left, active: true };
    };
    const onLeave = () => {
      pointer.current = { x: -1, active: false };
    };

    const host = canvas.parentElement ?? canvas;
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
    };
  }, [fine, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Ambient visualisation of generated financial time series drifting across the viewport."
      className="absolute inset-0 h-full w-full"
    />
  );
}
