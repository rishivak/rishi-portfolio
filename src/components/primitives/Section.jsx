import { forwardRef } from 'react';

/**
 * Every movement of the narrative is a Section: a landmark, an id the registry
 * knows, and the shared vertical rhythm. Nothing else sets section padding.
 */
export const Section = forwardRef(function Section(
  { id, label, children, className = '', full = false, inverted = false, stage },
  ref,
) {
  return (
    <section
      id={id}
      ref={ref}
      aria-label={label}
      data-inverted={inverted || undefined}
      /* The section's primary stage. Descendants may declare their own where
         they genuinely belong elsewhere; the cascade handles the rest. */
      data-stage={stage}
      className={[
        'relative isolate',
        full ? 'min-h-svh' : 'py-band',
        inverted ? 'bg-paper text-paper-ink' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
});
