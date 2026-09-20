import { motion } from 'framer-motion';
import { intelligence } from '../../data/intelligence';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { SplitLines } from '../primitives/SplitLines';
import { ONCE, rise, stagger } from '../../lib/motion';

/**
 * 05 — INTELLIGENCE LAYER.
 *
 * The only section on the light ground. Inverting the whole page here is the
 * point: after four movements of near-black, the change of ground does more
 * than any effect could, and it marks this work as a different kind of thing.
 *
 * Delivered work and forward-looking interest are kept visibly apart, so
 * nothing here can be mistaken for a claim.
 */
export function Intelligence() {
  return (
    <Section id="intelligence" label="Intelligence Layer" inverted>
      <div className="shell">
        <Kicker index="05" inverted>
          {intelligence.kicker}
        </Kicker>

        <SplitLines
          as="h2"
          lines={['Documents are not data', 'until something reads them.']}
          className="mt-10 max-w-[20ch] font-display text-display axis-narrow"
        />

        <motion.p
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-10 max-w-measure text-lead"
          style={{ color: 'var(--paper-ink-2)' }}
        >
          {intelligence.lede}
        </motion.p>

        <motion.ol
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-20 grid gap-px sm:grid-cols-2"
          style={{ background: 'var(--paper-hair)' }}
        >
          {intelligence.delivered.map((item, i) => (
            <motion.li
              key={item.id}
              variants={rise}
              className="bg-paper p-8 sm:p-10"
            >
              <p className="meta" style={{ color: 'var(--paper-ink-3)' }}>
                {String(i + 1).padStart(2, '0')} · Delivered
              </p>
              <h3 className="mt-5 font-display text-h3">{item.title}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--paper-ink-2)' }}>
                {item.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>

        {/* Direction, explicitly separated from delivery. */}
        <motion.div
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-20 border-t pt-10"
          style={{ borderColor: 'var(--paper-hair-2)' }}
        >
          <p className="meta" style={{ color: 'var(--paper-ink-3)' }}>
            {intelligence.focus.label}
          </p>
          <ul className="mt-8 grid max-w-4xl gap-5">
            {intelligence.focus.items.map((item, i) => (
              <li key={i} className="flex gap-5 text-lead">
                <span className="meta shrink-0 pt-[0.55em]" style={{ color: 'var(--paper-ink-3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ color: 'var(--paper-ink)' }}>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}
