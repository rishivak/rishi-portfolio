import { motion } from 'framer-motion';
import { ONCE, rise } from '../../lib/motion';

/**
 * The monospace index + label that opens each section. It is the only
 * navigational signpost inside the content column.
 */
export function Kicker({ index, children, inverted = false }) {
  return (
    <motion.div
      variants={rise}
      initial="hidden"
      whileInView="show"
      viewport={ONCE}
      className="flex items-center gap-4"
    >
      <span
        className="meta"
        style={{ color: inverted ? 'var(--paper-ink-3)' : undefined }}
        aria-hidden="true"
      >
        {index}
      </span>
      <span
        aria-hidden="true"
        className="h-px w-8"
        style={{ background: inverted ? 'var(--paper-hair-2)' : 'var(--hair-2)' }}
      />
      <span className="meta" style={{ color: 'var(--signal)' }}>
        {children}
      </span>
    </motion.div>
  );
}
