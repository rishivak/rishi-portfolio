import { useMediaQuery } from './useMediaQuery';

/**
 * Reduced motion is a first-class rendering path: canvases draw one static
 * frame, smooth scroll is off, the custom cursor never mounts.
 */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
