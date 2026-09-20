import { useEffect, useRef, useState } from 'react';
import { useFinePointer } from '../../lib/useMediaQuery';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * Custom cursor. Desktop fine-pointer only, and never under reduced motion —
 * on touch the native behaviour is simply left alone.
 *
 * Three states, each earning its existence:
 *   default  — a small dot
 *   linked   — expands and shows the element's own data-cursor label
 *   read     — renders nothing; the hero canvas draws its own inspector line
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const dotRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [label, setLabel] = useState(null);
  const [mode, setMode] = useState('default');
  const [awake, setAwake] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add('has-custom-cursor');

    let frame = 0;
    const render = () => {
      // Trail: the ring lags the pointer slightly, which is what reads as weight.
      pos.current.x += (target.current.x - pos.current.x) * 0.22;
      pos.current.y += (target.current.y - pos.current.y) * 0.22;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    const onMove = (event) => {
      target.current = { x: event.clientX, y: event.clientY };
      if (!awake) setAwake(true);

      const hit = event.target instanceof Element ? event.target.closest('[data-cursor], a, button') : null;
      if (!hit) {
        setMode('default');
        setLabel(null);
        return;
      }
      const declared = hit.getAttribute('data-cursor');
      if (declared === 'read') {
        setMode('read');
        setLabel(null);
      } else {
        setMode('linked');
        setLabel(declared);
      }
    };

    const onLeave = () => setAwake(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled, awake]);

  if (!enabled) return null;

  const size = mode === 'linked' ? 64 : 8;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[190] flex items-center justify-center will-change-transform"
      style={{ opacity: awake ? 1 : 0, transition: 'opacity 200ms linear' }}
    >
      {mode === 'read' ? null : (
        <span
          className="flex items-center justify-center rounded-full border transition-[width,height,background-color] duration-200 ease-out"
          style={{
            width: size,
            height: size,
            borderColor: mode === 'linked' ? 'var(--signal)' : 'transparent',
            background: mode === 'linked' ? 'var(--signal-dim)' : 'var(--signal)',
          }}
        >
          {label ? (
            <span className="meta whitespace-nowrap" style={{ color: 'var(--signal)' }}>
              {label}
            </span>
          ) : null}
        </span>
      )}
    </div>
  );
}
