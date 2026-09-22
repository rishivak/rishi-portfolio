import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValue } from 'framer-motion';
import { useRafLoop } from './useRafLoop';

/**
 * Where the reader is, resolved from geometry.
 *
 * This replaces an IntersectionObserver that could not do the job. Intersection
 * answers "is this visible"; this is a "where am I" question, and the two come
 * apart badly on a page like this one:
 *
 *   - `intersectionRatio` is a fraction of the *target*, so a section taller
 *     than the viewport can never exceed viewportH / sectionH. Systems is over
 *     1000vh, so it caps near 0.10 while an 80vh section reaches 1.0 — the short
 *     section wins while the tall one fills the screen.
 *   - Discrete thresholds only fire on crossings, so inside a section whose
 *     ratio never passes 0.15 the callback effectively never runs again.
 *
 * So: measure the bands, put a read head 40% down the viewport — where
 * attention actually sits — and ask which band contains it. O(sections), exact,
 * and completely independent of how tall anything is.
 */

const HEAD = 0.4; // the reading line, as a fraction of viewport height
const HYST = 0.08; // a section must win by this much of the viewport to take over

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Pure resolver, exported so it can be tested against hand-computed layouts
 * without a DOM. `bands` must be in document order, which the registry is.
 */
export function resolvePosition(bands, view, prevId = null) {
  const { scrollY = 0, viewportH = 0, docH = 0 } = view ?? {};
  const global = clamp(scrollY / Math.max(1, docH - viewportH));

  // Unmeasured sections (lazy chunks not yet mounted) have no band yet.
  const usable = bands.filter((b) => b.height > 0);
  if (!usable.length) {
    const first = bands[0];
    return { id: first?.id ?? null, index: first?.index ?? null, i: 0, within: 0, global };
  }

  const head = scrollY + viewportH * HEAD;

  // Document order means the last band the head has reached is the one it is in,
  // and a head past the final band still belongs to it.
  let hit = usable[0];
  for (const band of usable) if (head >= band.top) hit = band;

  // Hysteresis: hold the current section until the head clears its edge by a
  // margin, so a boundary scrolled slowly does not flicker between two items.
  if (prevId && hit.id !== prevId) {
    const prev = usable.find((b) => b.id === prevId);
    const pad = viewportH * HYST;
    if (prev && head >= prev.top - pad && head < prev.top + prev.height + pad) hit = prev;
  }

  return {
    id: hit.id,
    index: hit.index,
    i: bands.findIndex((b) => b.id === hit.id),
    within: clamp((head - hit.top) / Math.max(1, hit.height)),
    global,
  };
}

/**
 * The discrete part — which section owns the viewport — is React state, and
 * changes about eight times in a full read. The continuous parts are motion
 * values, so the rail can animate every frame without re-rendering the page.
 */
export function useScrollPosition(sections) {
  const [active, setActive] = useState(() => ({
    id: sections[0].id,
    index: sections[0].index,
    i: 0,
  }));

  const within = useMotionValue(0);
  const global = useMotionValue(0);
  // `i + within` — the drum's continuous position, so it rotates between
  // sections rather than snapping at the boundary.
  const head = useMotionValue(0);

  const bands = useRef([]);
  const current = useRef(active.id);

  const measure = useCallback(() => {
    bands.current = sections.map((s) => {
      const el = typeof document === 'undefined' ? null : document.getElementById(s.id);
      return {
        id: s.id,
        index: s.index,
        top: el ? el.offsetTop : 0,
        height: el ? el.offsetHeight : 0,
      };
    });
  }, [sections]);

  // Re-measure whenever the document's height changes: the lazy sections
  // mounting, a dossier disclosure opening, fonts landing, a resize. Measuring
  // once on mount is exactly what broke the previous implementation.
  useEffect(() => {
    measure();
    if (typeof window === 'undefined') return undefined;

    let ro;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(measure);
      ro.observe(document.body);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const read = useCallback(() => {
    const next = resolvePosition(
      bands.current,
      {
        scrollY: window.scrollY,
        viewportH: window.innerHeight,
        docH: document.documentElement.scrollHeight,
      },
      current.current,
    );
    if (!next.id) return;

    // Motion values are cheap to set and skip React entirely.
    within.set(next.within);
    global.set(next.global);
    head.set(next.i + next.within);

    // Only the discrete change costs a render.
    if (next.id !== current.current) {
      current.current = next.id;
      setActive({ id: next.id, index: next.index, i: next.i });
    }
  }, [global, head, within]);

  useRafLoop(read);

  return useMemo(() => ({ ...active, within, global, head }), [active, global, head, within]);
}
