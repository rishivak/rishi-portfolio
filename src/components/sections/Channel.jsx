import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { MagneticButton } from '../primitives/MagneticButton';
import { ONCE, rise, stagger } from '../../lib/motion';
import { asset } from '../../lib/url';

const COPIED_MS = 1800;

/**
 * 07 — OPEN CHANNEL.
 *
 * No form. A form here would be theatre — it cannot be validated, it cannot be
 * delivered without a backend, and it is a worse experience than the address
 * itself. So the address is the interface, at display scale.
 */
export function Channel() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Clipboard permission refused — the mailto link beside this still works.
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <Section id="channel" label="Contact" className="pb-24">
      <div className="shell">
        <Kicker index="07">Open Channel</Kicker>

        <motion.a
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          href={`mailto:${profile.email}`}
          data-cursor="Write"
          className="mt-12 block break-all font-display text-[clamp(1.5rem,6.2vw,4.75rem)] leading-[1.02] tracking-[-0.035em] transition-colors duration-2 ease-out hover:text-signal"
          style={{ color: 'var(--bone)' }}
        >
          {profile.email}
        </motion.a>

        <motion.div
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <motion.div variants={rise}>
            <MagneticButton onClick={copy} aria-live="polite">
              {copied ? 'Copied' : 'Copy address'}
            </MagneticButton>
          </motion.div>
          <motion.div variants={rise}>
            <MagneticButton href={profile.links.linkedin.href} external variant="ghost">
              LinkedIn
            </MagneticButton>
          </motion.div>
          <motion.div variants={rise}>
            <MagneticButton href={profile.links.github.href} external variant="ghost">
              GitHub
            </MagneticButton>
          </motion.div>
          <motion.div variants={rise}>
            <MagneticButton href={asset(profile.resume)} external variant="ghost">
              Résumé — PDF
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.dl
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-20 grid gap-8 border-t border-hair pt-10 sm:grid-cols-3"
        >
          <div>
            <dt className="meta">Phone</dt>
            <dd className="mt-2">
              <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`} className="wipe" style={{ color: 'var(--bone-2)' }}>
                {profile.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="meta">Based</dt>
            <dd className="mt-2" style={{ color: 'var(--bone-2)' }}>
              {profile.location} · {profile.timezone}
            </dd>
          </div>
          <div>
            <dt className="meta">Availability</dt>
            <dd className="mt-2" style={{ color: 'var(--signal)' }}>
              {profile.availability}
            </dd>
          </div>
        </motion.dl>
      </div>
    </Section>
  );
}
