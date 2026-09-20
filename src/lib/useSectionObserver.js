import { useEffect, useState } from 'react';

/**
 * Tracks which registered section owns the viewport. Single observer for the
 * whole page; feeds the spine rail, the telemetry readout and chrome inversion.
 */
export function useSectionObserver(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const ratios = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        let best = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1] },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [ids]);

  return active;
}
