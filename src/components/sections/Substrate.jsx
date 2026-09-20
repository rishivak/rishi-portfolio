import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { layers, technologies } from '../../data/stack';
import { systems } from '../../data/systems';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { StackGraph } from '../visuals/StackGraph';
import { ONCE, rise } from '../../lib/motion';
import { useIsMobile } from '../../lib/useMediaQuery';

const systemName = (id) => systems.find((s) => s.id === id)?.name ?? id;

function Detail({ tech }) {
  if (!tech) {
    return (
      <div className="border-l border-hair pl-6">
        <p className="meta">No selection</p>
        <p className="mt-4 max-w-measure text-[0.9375rem]" style={{ color: 'var(--bone-2)' }}>
          Choose a technology to see what it was actually used for, in which systems, and the
          architectural role it played.
        </p>
      </div>
    );
  }

  return (
    <div className="border-l border-signal pl-6">
      <p className="meta" style={{ color: 'var(--signal)' }}>
        {layers.find((l) => l.id === tech.layer)?.label}
      </p>
      <h3 className="mt-3 font-display text-h3" style={{ color: 'var(--bone)' }}>
        {tech.name}
      </h3>
      <p className="meta mt-2">{tech.role}</p>
      <p className="mt-5 max-w-measure text-[0.9375rem] leading-relaxed" style={{ color: 'var(--bone-2)' }}>
        {tech.context}
      </p>
      {tech.systems.length ? (
        <p className="meta mt-6">
          <span style={{ color: 'var(--bone-3)' }}>Systems — </span>
          <span style={{ color: 'var(--bone-2)' }}>{tech.systems.map(systemName).join(' · ')}</span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * 04 — SUBSTRATE.
 *
 * Desktop gets the orbital map; the list beside it is the real control surface,
 * so the same information is reachable by keyboard and on touch. Mobile drops
 * the canvas entirely rather than shrinking it into illegibility.
 */
export function Substrate() {
  const [selected, setSelected] = useState(null);
  const mobile = useIsMobile();
  const onSelect = useCallback((id) => setSelected((cur) => (cur === id ? null : id)), []);

  const tech = useMemo(() => technologies.find((t) => t.id === selected) ?? null, [selected]);

  const grouped = useMemo(
    () => layers.map((layer) => ({ layer, items: technologies.filter((t) => t.layer === layer.id) })),
    [],
  );

  return (
    <Section id="substrate" label="Substrate">
      <div className="shell">
        <Kicker index="04">Substrate</Kicker>
        <motion.h2
          variants={rise}
          initial="hidden"
          whileInView="show"
          viewport={ONCE}
          className="mt-8 max-w-[24ch] font-display text-h2 uppercase axis-narrow"
        >
          What the systems are made of.
        </motion.h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-12 lg:gap-12">
          {!mobile ? (
            <div className="lg:col-span-6">
              <StackGraph selectedId={selected} onSelect={onSelect} />
            </div>
          ) : null}

          <div className={mobile ? 'lg:col-span-12' : 'lg:col-span-6 lg:pt-12'}>
            <Detail tech={tech} />

            <div className="mt-12 grid gap-8">
              {grouped.map(({ layer, items }) => (
                <div key={layer.id}>
                  <p className="meta pb-3">{layer.label}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {items.map((item) => {
                      const on = item.id === selected;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => onSelect(item.id)}
                            aria-pressed={on}
                            className="meta border px-2.5 py-1.5 transition-colors duration-1 ease-out"
                            style={{
                              borderColor: on ? 'var(--signal)' : 'var(--hair)',
                              color: on ? 'var(--signal)' : 'var(--bone-2)',
                              background: on ? 'var(--signal-ghost)' : 'transparent',
                            }}
                          >
                            {item.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
