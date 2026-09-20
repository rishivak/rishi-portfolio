import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { Section } from '../primitives/Section';
import { SeriesField } from '../visuals/SeriesField';
import { EASE_OUT } from '../../lib/motion';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { scrollToSection } from '../../lib/scrollTo';

const HOLD = 3800;

/**
 * 00 — SIGNAL.
 *
 * The whole section is three things: a name at the largest scale the viewport
 * allows, one rotating claim beneath it, and the series field behind both.
 * Everything else that might have gone here was cut on purpose.
 */
export function Signal() {
  const [phrase, setPhrase] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setPhrase((i) => (i + 1) % profile.statements.length), HOLD);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <Section id="signal" label="Introduction" full className="flex flex-col justify-between overflow-hidden">
      <div className="absolute inset-0 -z-10" data-cursor="read">
        <SeriesField />
        {/* Keeps the type legible wherever the field happens to be dense. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 78% at 50% 62%, rgba(6,7,10,0.92) 0%, rgba(6,7,10,0.62) 45%, rgba(6,7,10,0.2) 100%)',
          }}
        />
      </div>

      <div className="shell flex flex-1 flex-col justify-center pb-24 pt-32">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
          className="meta mb-8 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span style={{ color: 'var(--signal)' }}>{profile.role}</span>
          <span aria-hidden="true" style={{ color: 'var(--bone-3)' }}>
            /
          </span>
          <span>{profile.discipline}</span>
        </motion.p>

        <h1 className="font-display text-mega uppercase" style={{ color: 'var(--bone)' }}>
          <span className="sr-only">
            {profile.first} {profile.last}
          </span>
          {[profile.first, profile.last].map((word, i) => (
            <span key={word} aria-hidden="true" className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '108%', fontVariationSettings: '"wdth" 68, "wght" 640' }}
                animate={{ y: '0%', fontVariationSettings: '"wdth" 112, "wght" 560' }}
                transition={{ duration: 1.4, delay: 0.16 + i * 0.1, ease: EASE_OUT }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* The claim. One line, replaced rather than accumulated. */}
        <div className="relative mt-10 h-[2.6em] sm:h-[1.6em]">
          <p className="sr-only">{profile.statements[0]}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={phrase}
              aria-hidden="true"
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -14 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
              className="absolute inset-0 font-mono text-[clamp(0.8rem,1.9vw,1.15rem)] uppercase tracking-[0.2em]"
              style={{ color: 'var(--bone-2)' }}
            >
              {profile.statements[phrase]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="shell flex items-end justify-between gap-6 pb-10"
      >
        <dl className="meta grid gap-1.5">
          <div className="flex gap-3">
            <dt className="w-16" style={{ color: 'var(--bone-3)' }}>
              Based
            </dt>
            <dd style={{ color: 'var(--bone-2)' }}>{profile.timezone}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16" style={{ color: 'var(--bone-3)' }}>
              Status
            </dt>
            <dd style={{ color: 'var(--signal)' }}>{profile.availability}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => scrollToSection('thesis')}
          className="meta group flex items-center gap-3 transition-colors duration-1 ease-out hover:text-signal"
          style={{ color: 'var(--bone-3)' }}
        >
          <span>Begin</span>
          <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-hair-2">
            <motion.span
              className="absolute inset-x-0 top-0 block h-4 bg-signal"
              animate={reduced ? {} : { y: ['-100%', '260%'] }}
              transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>
      </motion.div>
    </Section>
  );
}
