import { motion } from 'framer-motion';
import { maskLine, ONCE, stagger } from '../../lib/motion';

/**
 * Masked line reveal. Each line is clipped by its own wrapper and slides up —
 * the one text animation used on this site, so it stays a signature.
 *
 * Accessibility: the visible lines are aria-hidden and the full string is
 * announced once, so a screen reader never hears fragments.
 */
export function SplitLines({ lines, as: Tag = 'h2', className = '', delay = 0 }) {
  const MotionTag = motion[Tag] ?? motion.h2;
  return (
    <MotionTag
      variants={stagger(0.08, delay)}
      initial="hidden"
      whileInView="show"
      viewport={ONCE}
      className={className}
    >
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span key={i} aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
          <motion.span variants={maskLine} className="block">
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
