import { useCallback, useEffect, useRef, useState } from 'react';
import { renderFrame } from '../../engine/render';
import { resetPalette } from '../../engine/palette';
import { scene } from '../../scene';
import { FOG, FOG_MOBILE, cameraPath, fovEnvelopes } from '../../scene/world';
import { intensityFor } from '../../data/nav';
import { useRafLoop } from '../../lib/useRafLoop';
import { useIsMobile } from '../../lib/useMediaQuery';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * The 3D world, as a backdrop.
 *
 * Three things keep it subordinate to the page:
 *
 * 1. **It composes beside the content, not behind it.** The projection's screen
 *    centre sits at 72% of the width on desktop, so the world occupies the
 *    right of the frame while the content column owns the left. Nothing is ever
 *    read over moving geometry — a structural fix rather than a dimming trick,
 *    so the world stays fully visible instead of being washed out.
 * 2. **Intensity is budgeted per section.** `src/data/nav.js` declares how much
 *    of the viewport the world may claim while each section is read; it scales
 *    opacity, camera movement, packet flow and label count together, and is
 *    eased so a section boundary is a fade rather than a switch.
 * 3. **Idle is genuinely free.** Every visual is a pure function of `t`, so a
 *    stationary reader sees an identical frame. The dirty check below stops
 *    redrawing it sixty times a second to prove it.
 */
const MAX_DPR = 2;
const MAX_DPR_MOBILE = 1.5;

/** Where the world's centre sits, as a fraction of viewport width. */
const CENTRE_DESKTOP = 0.72;
const CENTRE_NARROW = 0.5;

export function Stage({ activeSection, inverted }) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const intensityRef = useRef(0);
  const lastRef = useRef({ t: -1, i: -1, w: 0, h: 0 });
  const [labels, setLabels] = useState([]);
  const labelsRef = useRef([]);

  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const quality = mobile ? 0.5 : 1;
  const fog = mobile ? FOG_MOBILE : FOG;
  const cx = mobile ? CENTRE_NARROW : CENTRE_DESKTOP;

  // Mobile halves the budget again: there is no room to put the world beside
  // the text, so it goes quieter still rather than sitting under it.
  const wanted = intensityFor(activeSection) * (mobile ? 0.5 : 1);

  const sinkLabels = useCallback((next) => {
    const prev = labelsRef.current;
    let same = prev.length === next.length;
    if (same) {
      for (let i = 0; i < next.length; i += 1) {
        if (prev[i].id !== next[i].id || Math.abs(prev[i].x - next[i].x) > 0.5) {
          same = false;
          break;
        }
      }
    }
    if (same) return;
    labelsRef.current = next;
    setLabels(next);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? MAX_DPR_MOBILE : MAX_DPR);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    sizeRef.current = { w, h };
    canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    lastRef.current.t = -1; // force one repaint after a resize
    return true;
  }, [mobile]);

  const paint = useCallback(
    (dt = 0.016, force = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { w, h } = sizeRef.current;
      if (!w || !h) return;

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      // Ease toward the section's budget so a boundary is a fade, not a jump.
      const rate = 1 - Math.exp(-Math.max(dt, 0.001) * 3.5);
      const eased = intensityRef.current + (wanted - intensityRef.current) * rate;
      intensityRef.current = Math.abs(eased - wanted) < 0.002 ? wanted : eased;

      // Nothing changed, so nothing needs drawing.
      const last = lastRef.current;
      if (
        !force &&
        Math.abs(last.t - t) < 0.00002 &&
        Math.abs(last.i - intensityRef.current) < 0.002 &&
        last.w === w &&
        last.h === h
      ) {
        return;
      }
      lastRef.current = { t, i: intensityRef.current, w, h };

      renderFrame(canvas.getContext('2d'), {
        scene,
        path: cameraPath,
        fovs: fovEnvelopes,
        t,
        w,
        h,
        fog,
        cx,
        quality,
        intensity: intensityRef.current,
        labelSink: sinkLabels,
      });
    },
    [fog, cx, quality, wanted, sinkLabels],
  );

  useEffect(() => {
    const onResize = () => {
      resetPalette();
      if (resize()) paint(0, true);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resize, paint]);

  // Reduced motion: one frame per scroll event, no loop, no easing.
  useEffect(() => {
    if (!reduced) return undefined;
    intensityRef.current = wanted;
    const onScroll = () => paint(1, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    paint(1, true);
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced, paint, wanted]);

  useRafLoop(paint, !reduced);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-arch-label="Stage"
      data-arch-kind="canvas"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      <ul className="absolute inset-0 m-0 hidden list-none p-0 lg:block">
        {labels.map((label) => (
          <li
            key={label.id}
            className="meta absolute whitespace-nowrap"
            style={{
              transform: `translate3d(${label.x + label.size * 0.6 + 8}px, ${label.y - 6}px, 0)`,
              color: 'var(--bone-3)',
              opacity: Math.min(0.8, label.alpha),
            }}
          >
            {label.text}
          </li>
        ))}
      </ul>

      {/* The scrim over the content column. Strong enough that text contrast
          never depends on where the geometry happens to be. Over the paper
          section the world is covered almost entirely. */}
      <div
        className="absolute inset-0 transition-opacity duration-3 ease-out"
        style={{
          background: inverted
            ? 'var(--paper)'
            : 'linear-gradient(90deg, rgba(6,7,10,0.97) 0%, rgba(6,7,10,0.93) 36%, rgba(6,7,10,0.6) 62%, rgba(6,7,10,0.3) 100%)',
          opacity: inverted ? 0.93 : 1,
        }}
      />
    </div>
  );
}
