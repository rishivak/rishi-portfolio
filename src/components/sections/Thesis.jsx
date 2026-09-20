import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { SplitLines } from '../primitives/SplitLines';
import { ONCE, rise, stagger } from '../../lib/motion';
import portrait from '../../assets/profile.png';

/**
 * 01 — THESIS. The first moment of silence: one column, wide margins, no
 * cards, no icons. After the hero the page deliberately stops shouting.
 */
export function Thesis() {
  return (
    <Section id="thesis" label="Thesis">
      <div className="shell">
        <Kicker index="01">Thesis</Kicker>

        <SplitLines
          as="h2"
          lines={['Between the data', 'and the decision', 'there is a system.']}
          className="mt-10 max-w-[18ch] font-display text-display uppercase axis-narrow"
        />

        <motion.div
          variants={stagger(0.12, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-16 grid gap-12 md:grid-cols-12"
        >
          <motion.figure variants={rise} className="md:col-span-3">
            <img
              src={portrait}
              alt="Rishi Sharma"
              width="320"
              height="320"
              loading="lazy"
              decoding="async"
              className="w-32 border border-hair object-cover grayscale md:w-full"
            />
            <figcaption className="meta mt-4 leading-relaxed">
              {profile.location}
              <br />
              {profile.timezone}
            </figcaption>
          </motion.figure>

          <div className="md:col-span-8 md:col-start-5">
            {profile.thesis.map((paragraph, i) => (
              <motion.p
                key={i}
                variants={rise}
                className="max-w-measure text-lead"
                style={{
                  color: i === 0 ? 'var(--bone)' : 'var(--bone-2)',
                  marginTop: i === 0 ? 0 : '1.75rem',
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
