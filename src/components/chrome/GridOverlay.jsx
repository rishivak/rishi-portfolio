/**
 * The technical substrate the whole page sits on: a fixed 12-column hairline
 * grid plus film grain. Purely decorative, never interactive, never scrolls.
 */
export function GridOverlay({ inverted }) {
  const line = inverted ? 'rgba(18,19,15,0.07)' : 'rgba(232,236,245,0.045)';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <div className="mx-auto h-full max-w-shell px-gutter">
        <div
          className="grid h-full grid-cols-4 transition-colors duration-3 ease-out md:grid-cols-12"
          style={{ ['--line']: line }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={i > 3 ? 'hidden md:block' : ''}
              style={{ borderLeft: '1px solid var(--line)' }}
            />
          ))}
        </div>
      </div>
      <div className="grain absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
