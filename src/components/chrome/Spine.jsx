import { sections } from '../../data/nav';
import { scrollToSection } from '../../lib/scrollTo';

/**
 * Left rail: the section index, always visible, always telling you where you
 * are. This is the primary navigation on desktop; ⌘K is the fast path.
 */
export function Spine({ active, progress, inverted }) {
  const dim = inverted ? 'var(--paper-ink-3)' : 'var(--bone-3)';
  const strong = inverted ? 'var(--paper-ink)' : 'var(--bone)';

  return (
    <nav
      aria-label="Sections"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-svh w-rail flex-col items-start justify-center pl-5 lg:flex"
    >
      <ol className="pointer-events-auto flex flex-col gap-3">
        {sections.map((section) => {
          const on = section.id === active;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => scrollToSection(section.id)}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-2.5 py-1 transition-colors duration-1 ease-out"
                style={{ color: on ? 'var(--signal)' : dim }}
              >
                <span className="meta tabular-nums" style={{ color: 'inherit' }}>
                  {section.index}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px transition-all duration-2 ease-out"
                  style={{
                    width: on ? 24 : 10,
                    background: on ? 'var(--signal)' : dim,
                  }}
                />
                <span
                  className="meta whitespace-nowrap opacity-0 transition-opacity duration-2 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
                  style={{ color: strong }}
                >
                  {section.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Scroll progress, as a hairline rather than a bar. */}
      <div
        aria-hidden="true"
        className="absolute bottom-10 left-5 h-24 w-px"
        style={{ background: inverted ? 'var(--paper-hair)' : 'var(--hair)' }}
      >
        <div
          className="w-px bg-signal transition-[height] duration-1 ease-out"
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </nav>
  );
}
