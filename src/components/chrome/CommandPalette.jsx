import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sections } from '../../data/nav';
import { systems } from '../../data/systems';
import { profile } from '../../data/profile';
import { scrollToSection } from '../../lib/scrollTo';
import { asset } from '../../lib/url';
import { EASE_OUT } from '../../lib/motion';

function buildCommands(close) {
  const go = (id) => () => {
    close();
    // Let the overlay unmount before the viewport moves, so focus lands cleanly.
    requestAnimationFrame(() => scrollToSection(id));
  };

  return [
    ...sections.map((s) => ({
      id: `section:${s.id}`,
      group: 'Sections',
      label: s.title,
      hint: s.index,
      run: go(s.id),
    })),
    ...systems.map((s) => ({
      id: `system:${s.id}`,
      group: 'Systems',
      label: s.name,
      hint: s.period,
      run: go('systems'),
    })),
    {
      id: 'action:email',
      group: 'Contact',
      label: `Email — ${profile.email}`,
      hint: 'Mail',
      run: () => {
        close();
        window.location.href = `mailto:${profile.email}`;
      },
    },
    {
      id: 'action:linkedin',
      group: 'Contact',
      label: 'LinkedIn',
      hint: 'External',
      run: () => {
        close();
        window.open(profile.links.linkedin.href, '_blank', 'noopener');
      },
    },
    {
      id: 'action:github',
      group: 'Contact',
      label: 'GitHub',
      hint: 'External',
      run: () => {
        close();
        window.open(profile.links.github.href, '_blank', 'noopener');
      },
    },
    {
      id: 'action:resume',
      group: 'Contact',
      label: 'Download résumé (PDF)',
      hint: 'File',
      run: () => {
        close();
        window.open(asset(profile.resume), '_blank', 'noopener');
      },
    },
  ];
}

/**
 * ⌘K / Ctrl-K navigation. Keyboard-first by construction: arrow keys move,
 * Enter runs, Escape closes, and focus returns to whatever opened it.
 */
export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  const commands = useMemo(() => buildCommands(onClose), [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q));
  }, [commands, query]);

  // Reset during render when the dialog opens, rather than in an effect — this
  // is the state-derived-from-props case React documents, and it avoids the
  // extra committed frame a setState-in-effect would cost.
  const [wasOpen, setWasOpen] = useState(false);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery('');
      setCursor(0);
    }
  }

  const onQueryChange = (event) => {
    setQuery(event.target.value);
    setCursor(0);
  };

  // Take focus on open, hand it back to whatever opened the dialog on close.
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      inputRef.current?.focus();
      return undefined;
    }
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    return undefined;
  }, [open]);

  // Keep the active row in view during arrow-key traversal.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  // Keep Tab inside the dialog while it is modal.
  const trap = (event) => {
    const focusable = dialogRef.current?.querySelectorAll(
      'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const onKeyDown = (event) => {
    if (event.key === 'Tab') {
      trap(event);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      results[cursor]?.run();
    }
  };

  let lastGroup = null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="absolute inset-0 cursor-default backdrop-blur-[2px]"
            style={{ background: 'rgba(6, 7, 10, 0.82)' }}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigate"
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="relative w-full max-w-xl border border-hair bg-surface shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-hair px-4">
              <span className="meta" style={{ color: 'var(--signal)' }} aria-hidden="true">
                &gt;
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={onQueryChange}
                placeholder="Jump to a section, system or contact"
                aria-label="Filter destinations"
                autoComplete="off"
                spellCheck="false"
                className="w-full bg-transparent py-4 font-mono text-[13px] text-bone outline-none placeholder:text-bone-3"
              />
              <kbd className="meta hidden sm:block">Esc</kbd>
            </div>

            <ul ref={listRef} className="max-h-[52vh] overflow-y-auto py-2" role="listbox" aria-label="Destinations">
              {results.length === 0 ? (
                <li className="meta px-4 py-6 text-center">No match</li>
              ) : (
                results.map((command, i) => {
                  const header = command.group !== lastGroup ? command.group : null;
                  lastGroup = command.group;
                  const active = i === cursor;
                  return (
                    <li key={command.id}>
                      {header ? (
                        <p className="meta px-4 pb-1.5 pt-3" aria-hidden="true">
                          {header}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        data-active={active}
                        onMouseMove={() => setCursor(i)}
                        onClick={command.run}
                        className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition-colors duration-1 ease-out"
                        style={{
                          background: active ? 'var(--signal-ghost)' : 'transparent',
                          color: active ? 'var(--signal)' : 'var(--bone-2)',
                        }}
                      >
                        <span className="truncate text-[13.5px]">{command.label}</span>
                        <span className="meta shrink-0">{command.hint}</span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
