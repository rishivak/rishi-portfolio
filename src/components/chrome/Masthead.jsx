import { motion, useTransform } from 'framer-motion';
import { profile } from '../../data/profile';
import { sectionById } from '../../data/nav';
import { asset } from '../../lib/url';
import { scrollToSection } from '../../lib/scrollTo';

const dimOf = (inverted) => (inverted ? 'var(--paper-ink-3)' : 'var(--bone-3)');

/**
 * Identity top-left, the two things a visitor actually wants top-right.
 * Section navigation lives in the spine and the palette, not here.
 *
 * Below `lg` the spine rail is hidden, so the masthead carries the orientation
 * instead: a progress hairline and the current section's index and label. The
 * hairline is decorative — the same position is stated as text beside it.
 */
export function Masthead({ onOpenPalette, inverted, hint, position }) {
  const ink = inverted ? 'var(--paper-ink)' : 'var(--bone)';
  const line = inverted ? 'var(--paper-hair)' : 'var(--hair)';
  const section = sectionById[position.id];
  const width = useTransform(position.global, (g) => `${(g * 100).toFixed(2)}%`);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[95]">
      <div aria-hidden="true" className="h-0.5 w-full lg:hidden" style={{ background: line }}>
        <motion.div className="h-full bg-signal" style={{ width }} />
      </div>

      <div className="mx-auto flex max-w-shell items-center justify-between px-gutter py-5">
        <button
          type="button"
          onClick={() => scrollToSection('signal')}
          className="pointer-events-auto flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span
            className="flex h-7 w-7 items-center justify-center border font-mono text-[11px] font-semibold transition-colors duration-1 ease-out hover:border-signal hover:text-signal"
            style={{ borderColor: line, color: ink }}
            aria-hidden="true"
          >
            R
          </span>
          <span className="meta hidden sm:inline" style={{ color: inverted ? 'var(--paper-ink-2)' : 'var(--bone-2)' }}>
            {profile.last}
          </span>
        </button>

        {/* Where you are, for the screens with no rail. */}
        <p className="meta flex items-baseline gap-2 tabular-nums lg:hidden" style={{ color: dimOf(inverted) }}>
          <span>{section?.index}</span>
          <span style={{ color: ink }}>{section?.label.toUpperCase()}</span>
        </p>

        <div className="pointer-events-auto flex items-center gap-2">
          <a
            href={asset(profile.resume)}
            target="_blank"
            rel="noreferrer noopener"
            className="meta border px-3 py-2 transition-colors duration-1 ease-out hover:border-signal hover:text-signal"
            style={{ borderColor: line, color: ink }}
          >
            Résumé
          </a>
          <button
            type="button"
            onClick={onOpenPalette}
            className="meta flex items-center gap-2.5 border px-3 py-2 transition-colors duration-1 ease-out hover:border-signal hover:text-signal"
            style={{ borderColor: line, color: ink }}
            aria-keyshortcuts="Meta+K Control+K"
          >
            <span>Navigate</span>
            <kbd
              className="font-mono text-[10px] font-medium not-italic"
              style={{ color: inverted ? 'var(--paper-ink-3)' : 'var(--bone-3)' }}
            >
              {hint}
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
