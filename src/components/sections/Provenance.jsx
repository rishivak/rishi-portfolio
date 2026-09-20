import { motion } from 'framer-motion';
import { certifications, education, languages } from '../../data/provenance';
import { profile } from '../../data/profile';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { ONCE, rise, stagger } from '../../lib/motion';

function Row({ left, right, note }) {
  return (
    <motion.li variants={rise} className="grid gap-2 border-t border-hair py-7 sm:grid-cols-12 sm:gap-8">
      <p className="meta sm:col-span-2">{right}</p>
      <div className="sm:col-span-10">
        <p className="text-[1.0625rem]" style={{ color: 'var(--bone)' }}>
          {left}
        </p>
        {note ? (
          <p className="mt-1.5 text-[0.9375rem]" style={{ color: 'var(--bone-2)' }}>
            {note}
          </p>
        ) : null}
      </div>
    </motion.li>
  );
}

/**
 * 06 — PROVENANCE. The quiet section. A ledger of verifiable facts, set almost
 * without motion, immediately before the page raises its voice again.
 */
export function Provenance() {
  return (
    <Section id="provenance" label="Provenance">
      <div className="shell">
        <Kicker index="06">Provenance</Kicker>
        <motion.h2
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-8 max-w-[20ch] font-display text-h2 uppercase axis-narrow"
        >
          On the record.
        </motion.h2>

        <motion.div variants={stagger(0.06)} initial="hidden" whileInView="show" viewport={ONCE} className="mt-16">
          <p className="meta pb-4">Education</p>
          <ul className="mb-16">
            {education.map((item) => (
              <Row key={item.id} left={item.degree} right={item.year} note={item.school + (item.note ? ` — ${item.note}` : '')} />
            ))}
          </ul>

          <p className="meta pb-4">Certifications</p>
          <ul className="mb-16">
            {certifications.map((item) => (
              <Row key={item.id} left={item.name} right={item.issuer} />
            ))}
          </ul>

          <p className="meta pb-4">Working details</p>
          <ul>
            <Row left={profile.location} right="Based" note={`${profile.timezone} · ${profile.availability}`} />
            {languages.map((lang) => (
              <Row key={lang.name} left={lang.name} right="Language" note={lang.level} />
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}
