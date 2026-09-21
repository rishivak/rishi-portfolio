import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { Section } from '../primitives/Section';
import { SeriesField } from '../visuals/SeriesField';
import { EASE_OUT } from '../../lib/motion';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { scrollToSection } from '../../lib/scrollTo';
import { asset } from '../../lib/url';
import portrait from '../../assets/profile-crop.png';

/**
 * 00 — SIGNAL.
 *
 * The hierarchy is deliberate and in this order: portrait, name and
 * designation first; then expertise; then the headline and positioning; then
 * the series field behind all of it; then the cursor. The field is atmosphere,
 * not a subject — it is damped behind the type and runs at roughly half its
 * former opacity.
 */
export function Signal() {
  const reduced = useReducedMotion();

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
              'radial-gradient(115% 80% at 42% 58%, rgba(6,7,10,0.97) 0%, rgba(6,7,10,0.86) 38%, rgba(6,7,10,0.5) 70%, rgba(6,7,10,0.25) 100%)',
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

        <div className="flex flex-wrap items-end gap-x-8 gap-y-6">
        {/* Portrait leads the name, per the requested hierarchy:
            name + portrait + designation -> expertise -> field -> cursor. */}
        <motion.figure
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.14, ease: EASE_OUT }}
          className="mb-2 shrink-0"
        >
          <span className="portrait-ring block w-28 sm:w-36">
            <img src={portrait} alt="Rishi Sharma" width="552" height="488" decoding="async" />
          </span>
        </motion.figure>

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

        </div>

        {/* Expertise — what the designation actually means. */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
        >
          {profile.expertise.map((item) => (
            <li key={item} className="meta" style={{ color: 'var(--bone-2)' }}>
              {item}
            </li>
          ))}
        </motion.ul>

        {/* The headline, then the positioning. */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
          className="mt-10 max-w-[24ch] font-display text-h2 axis-narrow"
          style={{ color: 'var(--bone)' }}
        >
          {profile.headline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-8 grid max-w-measure gap-4"
        >
          {profile.positioning.map((para, i) => (
            <p key={i} className="text-body" style={{ color: i === 0 ? 'var(--bone)' : 'var(--bone-2)' }}>
              {para}
            </p>
          ))}
        </motion.div>

        {/* Primary links — the five things a visitor might actually want. */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {profile.primaryLinks.map((link) => {
            const shared =
              'meta border border-hair px-4 py-2.5 transition-colors duration-1 ease-out hover:border-signal hover:text-signal';
            if (link.to) {
              return (
                <li key={link.id}>
                  <button type="button" onClick={() => scrollToSection(link.to)} className={shared}>
                    {link.label}
                  </button>
                </li>
              );
            }
            return (
              <li key={link.id}>
                <a
                  href={link.external ?? asset(link.asset)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={shared}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </motion.ul>
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
          onClick={() => scrollToSection('trajectory')}
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
