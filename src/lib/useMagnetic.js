import { useCallback, useEffect, useRef } from 'react';
import { useFinePointer } from './useMediaQuery';
import { useReducedMotion } from './useReducedMotion';

/**
 * Cursor-following pull on a control, capped hard at `strength` pixels so it
 * reads as responsiveness rather than as a toy.
 */
export function useMagnetic(strength = 6) {
  const ref = useRef(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = '';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) {
      reset();
      return undefined;
    }

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const clamp = (n) => Math.max(-1, Math.min(1, n));
      el.style.transform = `translate3d(${clamp(dx) * strength}px, ${clamp(dy) * strength}px, 0)`;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [enabled, strength, reset]);

  return ref;
}
