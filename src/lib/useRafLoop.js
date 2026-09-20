import { useEffect } from 'react';

/**
 * One shared requestAnimationFrame loop for the whole page. Every canvas
 * subscribes to it, so N canvases still cost one rAF and one timestamp.
 */
const subscribers = new Set();
let frame = 0;
let last = 0;

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
  last = now;
  for (const fn of subscribers) fn(dt, now);
  frame = subscribers.size ? requestAnimationFrame(tick) : 0;
}

function subscribe(fn) {
  subscribers.add(fn);
  if (!frame) {
    last = 0;
    frame = requestAnimationFrame(tick);
  }
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/** `active === false` unsubscribes entirely — offscreen canvases cost nothing. */
export function useRafLoop(callback, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    return subscribe(callback);
  }, [callback, active]);
}
