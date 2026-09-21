import { motion } from 'framer-motion';
import { profile } from '../../data/profile';
import { principles } from '../../data/thinking';
import { Section } from '../primitives/Section';
import { stageFor, sectionById } from '../../data/nav';
import { Kicker } from '../primitives/Kicker';
import { SplitLines } from '../primitives/SplitLines';
import { ONCE, rise, stagger } from '../../lib/motion';

/**
 * 01 — THESIS. The first moment of silence: one column, wide margins, no
 * cards, no icons, and — now that the portrait leads the hero — no image
 * either. After the hero the page deliberately stops shouting.
 *
 * It closes with five beliefs, each attached to a decision that cost something.
 * They sit here rather than in a section of their own because who someone is
 * and how they build are the same claim, and a principle with no cost attached
 * is only a preference.
 */
export function Thesis() {
  return (
    <Section id="thesis" stage={stageFor('thesis')} label="Thesis">
      <div className="shell">
        <Kicker index={sectionById['thesis'].index}>Thesis</Kicker>

        <SplitLines
          as="h2"
          lines={['The work is usually not', 'where the framework is.']}
          className="mt-10 max-w-[20ch] font-display text-display uppercase axis-narrow"
        />

        <motion.div
          variants={stagger(0.1, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-10"
        >
          <motion.p variants={rise} className="text-lead" style={{ color: 'var(--bone)' }}>
            It is in the boundaries.
          </motion.p>

          <motion.ul variants={rise} className="mt-8 grid max-w-measure gap-3">
            {profile.boundaries.map((line) => (
              <li key={line} className="flex gap-4 text-lead" style={{ color: 'var(--bone-2)' }}>
                <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0" style={{ background: 'var(--stage)' }} />
                <span>{line}</span>
              </li>
            ))}
          </motion.ul>

          <motion.p variants={rise} className="mt-8 text-lead" style={{ color: 'var(--stage-text)' }}>
            {profile.boundaryClose}
          </motion.p>
        </motion.div>

        {/* Five beliefs, each anchored to a real decision. Compact on purpose:
            the anchor is the evidence, the belief is just its label. */}
        <motion.ol
          variants={stagger(0.06, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-20 border-t border-hair"
        >
          {principles.map((p) => (
            <motion.li
              key={p.id}
              variants={rise}
              className="grid gap-x-10 gap-y-2 border-b border-hair py-6 md:grid-cols-12"
            >
              <p className="meta md:col-span-1">{p.n}</p>
              <p className="md:col-span-4" style={{ color: 'var(--bone)' }}>
                {p.title}
              </p>
              <p
                className="max-w-measure text-[0.9375rem] leading-relaxed md:col-span-7"
                style={{ color: 'var(--bone-2)' }}
              >
                {p.anchor}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </Section>
  );
}
