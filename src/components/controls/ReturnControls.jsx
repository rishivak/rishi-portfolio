import { useMemo, useState } from 'react';
import { FREQUENCIES, pct, runPipeline } from '../../lib/sample/returns';

/**
 * The transform engine, live.
 *
 * This is the one place on the site that genuinely computes. Change the
 * frequency, the window or the mode and the numbers recompute from
 * ∏(1 + rᵢ) − 1 over the sample series — the same arithmetic the platform's
 * transform functions implement, asserted in the test harness against
 * independently computed values.
 *
 * The naive additive answer sits beside the correct one deliberately. It is
 * close enough to survive a code review, which is exactly what makes that
 * class of bug worth a case study.
 */
export function ReturnControls() {
  const [frequency, setFrequency] = useState('monthly');
  const [mode, setMode] = useState('rolling');
  const [windowSize, setWindowSize] = useState(4);

  const run = useMemo(
    () => runPipeline({ frequency, window: windowSize, mode }),
    [frequency, windowSize, mode],
  );

  const peak = Math.max(...run.series.map((p) => Math.abs(p.r)), 0.0001);

  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--hair)' }}>
      <p className="meta">Synthetic data — demonstration only · the arithmetic is real</p>

      <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
        <Group label="Frequency">
          {FREQUENCIES.map((f) => (
            <Choice key={f.id} on={frequency === f.id} onClick={() => setFrequency(f.id)}>
              {f.label}
            </Choice>
          ))}
        </Group>

        <Group label="Window">
          <Choice on={mode === 'rolling'} onClick={() => setMode('rolling')}>
            Rolling
          </Choice>
          <Choice on={mode === 'expanding'} onClick={() => setMode('expanding')}>
            Expanding
          </Choice>
          {mode === 'rolling'
            ? [2, 4, 6, 12].map((n) => (
                <Choice key={n} on={windowSize === n} onClick={() => setWindowSize(n)}>
                  {n}
                </Choice>
              ))
            : null}
        </Group>
      </div>

      {/* The resulting series. Decorative only — the numbers below carry it. */}
      <ul className="mt-6 flex h-16 items-center gap-[2px]" aria-hidden="true">
        {run.series.map((p) => (
          <li key={p.period} className="flex h-full flex-1 flex-col justify-center">
            <span className="flex h-1/2 items-end">
              {p.r >= 0 ? (
                <span
                  className="w-full"
                  style={{ height: Math.max(1, (p.r / peak) * 28), background: 'var(--signal)' }}
                />
              ) : null}
            </span>
            <span className="flex h-1/2 items-start">
              {p.r < 0 ? (
                <span
                  className="w-full"
                  style={{ height: Math.max(1, (-p.r / peak) * 28), background: 'var(--bone-3)' }}
                />
              ) : null}
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid gap-5 sm:grid-cols-3" aria-live="polite">
        <Figure label="Compounded" value={pct(run.total)} tone="var(--signal)" />
        <Figure label="Summed — wrong" value={pct(run.naive)} tone="var(--bone-3)" />
        <Figure label="Divergence" value={pct(run.total - run.naive)} tone="var(--bone-2)" />
      </dl>

      <p className="mt-5 text-[0.9375rem]" style={{ color: 'var(--bone-3)' }}>
        <span className="num">∏(1 + rᵢ) − 1</span> over {run.resampled.length}{' '}
        {run.freq.label.toLowerCase()} periods. Close enough to pass review, wrong enough to matter.
      </p>
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div>
      <p className="meta mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Choice({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className="meta num border px-2.5 py-1.5 transition-colors duration-1 ease-out"
      style={{
        borderColor: on ? 'var(--signal)' : 'var(--hair-2)',
        color: on ? 'var(--signal)' : 'var(--bone-2)',
        background: on ? 'var(--signal-ghost)' : 'transparent',
      }}
    >
      {children}
    </button>
  );
}

function Figure({ label, value, tone }) {
  return (
    <div>
      <dt className="meta">{label}</dt>
      <dd className="num mt-1.5 text-h3" style={{ color: tone }}>
        {value}
      </dd>
    </div>
  );
}
