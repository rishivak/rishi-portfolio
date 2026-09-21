import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';

const KEYS = [
  ['⌘K / Ctrl K', 'Search and jump anywhere'],
  ['A', 'Architecture mode — outline the site’s own components'],
  ['← →', 'Jump between chapters'],
  ['PgUp / PgDn', 'Move through the journey'],
  ['?', 'This sheet'],
  ['Esc', 'Close'],
];

/**
 * Makes the other two easter eggs discoverable without advertising them on the
 * page. A curious visitor presses `?`; nobody else ever has to know.
 */
export function KeymapSheet({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onKeyDown={(event) => event.key === 'Escape' && onClose()}
        >
          <button
            type="button"
            aria-label="Close shortcuts"
            onClick={onClose}
            className="absolute inset-0 cursor-default"
            style={{ background: 'rgba(10,11,13,0.84)' }}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="relative w-full max-w-md border border-hair bg-surface p-6 shadow-lift"
          >
            <p className="meta">Keyboard</p>
            <dl className="mt-5 grid gap-3">
              {KEYS.map(([key, what]) => (
                <div key={key} className="flex items-baseline justify-between gap-6">
                  <dt className="num shrink-0 text-[12px]" style={{ color: 'var(--signal)' }}>
                    {key}
                  </dt>
                  <dd className="text-right text-[0.9375rem]" style={{ color: 'var(--bone-2)' }}>
                    {what}
                  </dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="meta mt-7 w-full border border-hair py-2.5 transition-colors duration-1 ease-out hover:border-hair-2"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
