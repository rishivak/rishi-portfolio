import { motion } from 'framer-motion';
import { intelligence } from '../../data/intelligence';
import { Section } from '../primitives/Section';
import { stageFor, sectionById } from '../../data/nav';
import { Kicker } from '../primitives/Kicker';
import { SplitLines } from '../primitives/SplitLines';
import { ONCE, rise, stagger } from '../../lib/motion';

/**
 * 05 — INTELLIGENCE LAYER.
 *
 * The only section on the light ground. After four movements of near-black the
 * change of ground does more than any effect could, and it marks this as a
 * different kind of thing.
 *
 * This section answers **how I think about AI systems** — the Foreseer build is
 * `02 Systems`' job. So there is deliberately no engineering surface here, no
 * stack list, no imagery and no case-study fields: repeating the project would
 * be the same story twice. The test suite asserts that boundary structurally,
 * so the two cannot quietly converge.
 */
export function Intelligence() {
  return (
    <Section id="intelligence" stage={stageFor('intelligence')} label="Intelligence" inverted>
      <div className="shell">
        <Kicker index={sectionById['intelligence'].index} inverted>
          {intelligence.kicker}
        </Kicker>

        <SplitLines
          as="h2"
          lines={['Documents are not data', 'until something reads them.']}
          className="mt-10 max-w-[20ch] font-display text-display axis-narrow"
        />

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-10 max-w-measure"
        >
          {intelligence.lede.map((line, i) => (
            <motion.p
              key={i}
              variants={rise}
              className="text-lead"
              style={{ color: i === 0 ? 'var(--paper-ink)' : 'var(--paper-ink-2)', marginTop: i ? '1.25rem' : 0 }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        {/* The pipeline as a principle rather than a project. */}
        <motion.ol
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-14 flex flex-wrap items-center gap-x-3 gap-y-3"
          aria-label="The pipeline, as a principle"
        >
          {intelligence.chain.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span
                className="meta border px-3 py-2"
                style={{ borderColor: 'var(--paper-hair-2)', color: 'var(--paper-ink)' }}
              >
                {step}
              </span>
              {i < intelligence.chain.length - 1 ? (
                <span aria-hidden="true" className="meta" style={{ color: 'var(--paper-ink-3)' }}>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </motion.ol>

        <motion.ol
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-14 grid gap-px sm:grid-cols-2"
          style={{ background: 'var(--paper-hair)' }}
        >
          {intelligence.patterns.map((pattern, i) => (
            <motion.li key={pattern.id} variants={rise} className="bg-paper p-8 sm:p-10">
              <p className="meta" style={{ color: 'var(--paper-ink-3)' }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-5 font-display text-h3">{pattern.title}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--paper-ink-2)' }}>
                {pattern.body}
              </p>
            </motion.li>
          ))}
        </motion.ol>

        <motion.p
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-14 max-w-measure border-t pt-8 text-lead"
          style={{ borderColor: 'var(--paper-hair-2)', color: 'var(--paper-ink)' }}
        >
          {intelligence.close}
        </motion.p>
      </div>
    </Section>
  );
}
