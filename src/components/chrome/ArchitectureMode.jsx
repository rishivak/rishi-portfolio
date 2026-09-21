import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Easter egg, and an argument.
 *
 * Architecture mode draws the site's own component boundaries over itself,
 * labelled with what each one is. The brief asked for a portfolio that is
 * evidence of engineering thinking; this is that taken literally — the page
 * will show you how it is assembled if you ask it to.
 *
 * It reads real DOM nodes carrying `data-arch-label` rather than a maintained
 * diagram, so it cannot drift out of sync with the actual structure.
 */
export function ArchitectureMode({ on, stats }) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    if (!on) return undefined;

    const measure = () => {
      setNodes(
        [...document.querySelectorAll('[data-arch-label]')].map((el) => {
          const r = el.getBoundingClientRect();
          return {
            label: el.getAttribute('data-arch-label'),
            kind: el.getAttribute('data-arch-kind') ?? 'component',
            top: r.top + window.scrollY,
            left: r.left + window.scrollX,
            width: r.width,
            height: r.height,
          };
        }),
      );
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, [on]);

  if (!on) return null;

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[120]">
      {nodes.map((node, i) => (
        <div
          key={`${node.label}-${i}`}
          className="absolute"
          style={{
            top: node.top,
            left: node.left,
            width: node.width,
            height: node.height,
            outline: '1px dashed var(--signal)',
            outlineOffset: '-1px',
            background: 'rgba(169,211,232,0.03)',
          }}
        >
          <span
            className="meta absolute left-0 top-0 -translate-y-full whitespace-nowrap px-1.5 py-0.5"
            style={{ background: 'var(--signal)', color: 'var(--void)' }}
          >
            {node.kind} · {node.label}
          </span>
        </div>
      ))}

      {/* The site reporting on itself: its own component tree, and the live
          state of the renderer it is drawn by. */}
      <div
        className="meta fixed bottom-4 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-1 border px-4 py-2"
        style={{ borderColor: 'var(--signal)', background: 'var(--void)', color: 'var(--signal)' }}
      >
        <span>APP → STAGE → ENGINE → SCENE → DATA → UI</span>
        <span className="num">{nodes.length} components</span>
        <span className="num">
          {stats?.nodes ?? 0}/{stats?.total ?? 0} nodes drawn
        </span>
        <span className="num">t {(stats?.t ?? 0).toFixed(3)}</span>
        <span>A to exit</span>
      </div>
    </div>,
    document.body,
  );
}
