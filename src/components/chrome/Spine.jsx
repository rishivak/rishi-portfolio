import { motion, useTransform } from 'framer-motion';
import { sections } from '../../data/nav';
import { scrollToSection } from '../../lib/scrollTo';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { PERSPECTIVE, drumAt } from '../../lib/drum';

/**
 * Left rail: the section index, always visible, always telling you where you
 * are. Primary navigation on desktop; ⌘K is the fast path.
 *
 * The numbers sit on a virtual drum sharing the canvas world's perspective —
 * the section you are reading faces you, its neighbours rotate away and recede.
 * It is driven by `head` (a continuous `sectionIndex + progressWithinSection`),
 * so the drum turns *through* a boundary like an odometer instead of snapping at
 * it. Each item carries its own stage hue, so a full read walks the rail
 * DATA → ENGINEERING → INTELLIGENCE → DECISION.
 *
 * Everything continuous here is a motion value, so the rail animates every
 * frame without re-rendering the page behind it. Under reduced motion the drum
 * flattens and the read-head still moves: position is never carried by the 3D
 * effect alone.
 */

function Rung({ section, i, head, within, on, dim, strong, flat }) {
  const transform = useTransform(head, (h) => {
    if (flat) return 'none';
    const { rotate, depth } = drumAt(h, i);
    return `rotateX(${rotate.toFixed(2)}deg) translateZ(${depth.toFixed(1)}px)`;
  });

  const opacity = useTransform(head, (h) => drumAt(h, i).opacity);
  const tick = useTransform(head, (h) => drumAt(h, i).tick);

  return (
    <motion.li
      /* The item's own stage, so the hue comes from the same cascade the
         headings and the 3D world use. */
      data-stage={section.stage}
      style={{ transform, opacity }}
    >
      <button
        type="button"
        onClick={() => scrollToSection(section.id)}
        aria-current={on ? 'true' : undefined}
        /* Stated on the button itself: the rail is inside a pointer-events-none
           landmark, and this is the one thing in it that must stay clickable. */
        className="group pointer-events-auto flex items-center gap-2.5 py-1 transition-colors duration-1 ease-out"
        style={{ color: on ? 'var(--stage-text)' : dim }}
      >
        <span className="meta tabular-nums" style={{ color: 'inherit' }}>
          {section.index}
        </span>
        <motion.span
          aria-hidden="true"
          className="h-px"
          style={{ width: tick, background: on ? 'var(--stage-text)' : dim }}
        />
        <span
          className="meta whitespace-nowrap opacity-0 transition-opacity duration-2 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{ color: strong }}
        >
          {section.label}
        </span>
      </button>

      {/* How much of this section is left — worth showing now that a single
          section can run past 1000vh. */}
      {on ? (
        <div aria-hidden="true" className="ml-[1.7rem] h-0.5 w-6 overflow-hidden" style={{ background: 'var(--hair)' }}>
          <motion.div
            className="h-full w-full origin-left"
            style={{ scaleX: within, background: 'var(--stage-text)' }}
          />
        </div>
      ) : null}
    </motion.li>
  );
}

export function Spine({ position, inverted }) {
  const reduced = useReducedMotion();
  const { id: active, head, within, global } = position;
  const dim = inverted ? 'var(--paper-ink-3)' : 'var(--bone-3)';
  const strong = inverted ? 'var(--paper-ink)' : 'var(--bone)';

  // The read-head travels a hairline; a growing bar would read as a download.
  const headTop = useTransform(global, (g) => `${(g * 100).toFixed(2)}%`);

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-svh w-rail flex-col items-start justify-center pl-5 lg:flex"
    >
      <ol
        className="pointer-events-auto flex flex-col gap-3"
        style={reduced ? undefined : { perspective: PERSPECTIVE }}
      >
        {sections.map((section, i) => (
          <Rung
            key={section.id}
            section={section}
            i={i}
            head={head}
            within={within}
            on={section.id === active}
            dim={dim}
            strong={strong}
            flat={reduced}
          />
        ))}
      </ol>

      {/* Position in the whole document, as an instrument rather than a bar. */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-5 h-24 w-px"
        style={{ background: inverted ? 'var(--paper-hair)' : 'var(--hair)' }}
      >
        <motion.div
          className="absolute left-0 h-3 w-px bg-signal"
          style={{ top: headTop, y: '-50%' }}
        />
      </div>
    </nav>
  );
}
