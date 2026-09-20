import { useCallback, useEffect, useRef, useState } from 'react';
import { useRafLoop } from './useRafLoop';
import { useReducedMotion } from './useReducedMotion';

const MAX_DPR = 2;

/**
 * Canvas plumbing shared by every visual: DPR-capped sizing, resize handling,
 * and an IntersectionObserver that stops the draw loop when offscreen.
 *
 * `draw(ctx, { w, h, t, dt })` is called per frame, or exactly once when the
 * user prefers reduced motion.
 */
export function useCanvas(draw, { paused = false } = {}) {
  const canvasRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return null;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    sizeRef.current = { w: width, h: height };
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }, []);

  const paint = useCallback(
    (dt) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { w, h } = sizeRef.current;
      if (!w || !h) return;
      timeRef.current += dt;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, { w, h, t: timeRef.current, dt });
    },
    [draw],
  );

  // Size on mount and on resize; repaint immediately so there is never a blank frame.
  useEffect(() => {
    const onResize = () => {
      if (measure()) paint(0);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure, paint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '120px',
    });
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  // Reduced motion: one static frame, then nothing.
  useEffect(() => {
    if (reduced) paint(0);
  }, [reduced, paint]);

  useRafLoop(paint, visible && !paused && !reduced);

  return canvasRef;
}
