import { useCallback, useEffect, useRef } from 'react';
import { layers, technologies } from '../../data/stack';
import { useCanvas } from '../../lib/useCanvas';
import { useFinePointer } from '../../lib/useMediaQuery';

/**
 * The technology ecosystem as an orbital map: a system core, and everything
 * else placed on a ring by the architectural layer it belongs to. Ring
 * distance means something — language innermost, delivery and tooling outermost.
 *
 * Rotation is slow and per-ring, so the map reads as a system at rest rather
 * than an animation. Hit testing reuses the positions computed for the frame,
 * so pointer tracking costs nothing extra.
 */

// Canvas fill styles cannot read CSS custom properties, so the accent is
// duplicated here as a literal. Keep in sync with --signal in tokens.css.
const SIGNAL = 'rgb(232, 176, 75)';

const RING_RADIUS = { 1: 0.19, 2: 0.33, 3: 0.46, 4: 0.585 };
const RING_SPEED = { 1: 0.012, 2: -0.008, 3: 0.006, 4: -0.0045 };

const byRing = layers.reduce((acc, layer) => {
  acc[layer.id] = layer.ring;
  return acc;
}, {});

// Group once: which technologies sit on which ring, and in what order.
const rings = technologies.reduce((acc, tech) => {
  const ring = byRing[tech.layer] ?? 4;
  (acc[ring] ||= []).push(tech);
  return acc;
}, {});

export function StackGraph({ selectedId, onSelect }) {
  const fine = useFinePointer();
  const placed = useRef([]);
  const hoverId = useRef(null);

  const draw = useCallback(
    (ctx, { w, h, t }) => {
      const cx = w / 2;
      const cy = h / 2;
      const unit = Math.min(w, h);
      placed.current = [];

      // ---- rings ---------------------------------------------------------
      for (const ring of Object.keys(RING_RADIUS)) {
        ctx.beginPath();
        ctx.arc(cx, cy, unit * RING_RADIUS[ring], 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(232,236,245,0.055)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ---- core ----------------------------------------------------------
      ctx.beginPath();
      ctx.arc(cx, cy, unit * 0.072, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(232,176,75,0.09)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,176,75,0.7)';
      ctx.stroke();
      ctx.font = '500 9px ui-monospace, "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(232,176,75,0.95)';
      ctx.fillText('SYSTEM', cx, cy - 5);
      ctx.fillText('CORE', cx, cy + 6);

      // ---- nodes ---------------------------------------------------------
      for (const [ring, items] of Object.entries(rings)) {
        const radius = unit * RING_RADIUS[ring];
        const spin = t * RING_SPEED[ring];

        items.forEach((tech, i) => {
          const angle = (i / items.length) * Math.PI * 2 + spin;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          placed.current.push({ id: tech.id, x, y, tech });

          const active = tech.id === selectedId || tech.id === hoverId.current;
          const dim = selectedId && !active;

          // Edge back to the core.
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.strokeStyle = active
            ? 'rgba(232,176,75,0.55)'
            : `rgba(232,236,245,${dim ? 0.03 : 0.06})`;
          ctx.stroke();

          const r = (active ? 5.5 : 2.6 + tech.weight * 0.9);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = active ? SIGNAL : `rgba(232,236,245,${dim ? 0.2 : 0.55})`;
          ctx.fill();

          // Labels only where they will not turn the map into soup.
          if (active || tech.weight >= 3) {
            ctx.font = '500 8.5px ui-monospace, "JetBrains Mono", monospace';
            ctx.textAlign = x < cx ? 'right' : 'left';
            ctx.fillStyle = active ? SIGNAL : `rgba(232,236,245,${dim ? 0.25 : 0.6})`;
            ctx.fillText(tech.name, x + (x < cx ? -10 : 10), y);
          }
        });
      }
    },
    [selectedId],
  );

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fine) return undefined;

    const nearest = (event) => {
      const rect = canvas.getBoundingClientRect();
      const px = event.clientX - rect.left;
      const py = event.clientY - rect.top;
      let best = null;
      let bestDist = 22;
      for (const node of placed.current) {
        const dist = Math.hypot(node.x - px, node.y - py);
        if (dist < bestDist) {
          best = node;
          bestDist = dist;
        }
      }
      return best;
    };

    const onMove = (event) => {
      const hit = nearest(event);
      hoverId.current = hit?.id ?? null;
      canvas.style.cursor = hit ? 'pointer' : '';
    };
    const onClick = (event) => {
      const hit = nearest(event);
      if (hit) onSelect(hit.id);
    };
    const onLeave = () => {
      hoverId.current = null;
    };

    canvas.addEventListener('pointermove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [fine, onSelect, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Orbital map of technologies arranged in rings around a system core, by architectural layer. The list below provides the same information."
      className="aspect-square w-full"
    />
  );
}
