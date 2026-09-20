import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { systems } from '../../data/systems';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { TechTokens } from '../primitives/TechToken';
import { Placeholder } from '../primitives/Placeholder';
import { isPlaceholder } from '../../lib/placeholder';
import { diagrams } from '../visuals/diagrams';
import { EASE_OUT, ONCE, rise, stagger } from '../../lib/motion';

function Field({ label, children }) {
  return (
    <div className="mt-8 first:mt-0">
      <p className="meta">{label}</p>
      <div className="mt-3 max-w-measure text-[0.9375rem] leading-relaxed" style={{ color: 'var(--bone-2)' }}>
        {children}
      </div>
    </div>
  );
}

function Dossier({ system }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const Diagram = diagrams[system.diagram];

  return (
    <motion.article
      variants={stagger(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={ONCE}
      className="border-t border-hair pt-12"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---- narrative --------------------------------------------------- */}
        <div className="lg:col-span-6">
          <motion.header variants={rise}>
            <p className="meta flex items-center gap-3">
              <span style={{ color: 'var(--signal)' }}>{system.index}</span>
              <span>{system.period}</span>
            </p>
            <h3 className="mt-4 font-display text-h2 uppercase axis-narrow" style={{ color: 'var(--bone)' }}>
              {system.name}
            </h3>
            <p className="mt-3 text-[0.9375rem]" style={{ color: 'var(--signal-2)' }}>
              {system.kind}
            </p>
            <p className="meta mt-2">{system.org}</p>
          </motion.header>

          <motion.div variants={rise} className="mt-10">
            <Field label="Problem">{system.problem}</Field>
            <Field label="Approach">{system.approach}</Field>
          </motion.div>

          <motion.div variants={rise} className="mt-10">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              data-cursor={open ? 'Close' : 'Open'}
              className="meta flex w-full items-center justify-between border-y border-hair py-4 transition-colors duration-1 ease-out hover:border-hair-2 hover:text-signal"
              style={{ color: 'var(--bone)' }}
            >
              <span>{open ? 'Close dossier' : 'Open dossier'}</span>
              <span aria-hidden="true" className="relative block h-2.5 w-2.5">
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span
                  className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-2 ease-out"
                  style={{ transform: open ? 'translateX(-50%) scaleY(0)' : 'translateX(-50%) scaleY(1)' }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="pb-2 pt-8">
                    <Field label="Engineering challenge">{system.challenge}</Field>

                    <Field label="Outcome">
                      <ul className="grid gap-3">
                        {system.outcome.map((line, i) => (
                          <li key={i} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-hair-2" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </Field>

                    {system.also ? (
                      <Field label="Also shipped">
                        <ul className="grid gap-3">
                          {system.also.map((line, i) => (
                            <li key={i} className="flex gap-3">
                              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-hair-2" />
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                      </Field>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* Unresolved metrics are shown, not hidden and not invented. */}
          <motion.dl variants={rise} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {system.impact.map((metric) => (
              <div key={metric.label}>
                <dt className="meta">{metric.label}</dt>
                <dd className="mt-2">
                  {isPlaceholder(metric.value) ? (
                    <Placeholder>{metric.value}</Placeholder>
                  ) : (
                    <span className="font-display text-h3" style={{ color: 'var(--signal)' }}>
                      {metric.value}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={rise}>
            <TechTokens items={system.stack} className="mt-10" />
          </motion.div>
        </div>

        {/* ---- diagram ------------------------------------------------------ */}
        <motion.div
          variants={rise}
          className="lg:col-span-6 lg:sticky lg:top-24 lg:self-start"
        >
          <div className="border border-hair bg-surface p-6 sm:p-10">
            {Diagram ? <Diagram /> : null}
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}

/**
 * 03 — SYSTEMS. Case studies, not cards. Each one is a problem, an approach
 * and a diagram of the thing itself; the depth sits behind a disclosure so the
 * section can be skimmed or read.
 */
export function Systems() {
  return (
    <Section id="systems" label="Systems">
      <div className="shell">
        <Kicker index="03">Systems</Kicker>
        <motion.h2
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-8 max-w-[24ch] font-display text-h2 uppercase axis-narrow"
        >
          Four systems, and what was hard about each.
        </motion.h2>

        <div className="mt-24 grid gap-28">
          {systems.map((system) => (
            <Dossier key={system.id} system={system} />
          ))}
        </div>
      </div>
    </Section>
  );
}
