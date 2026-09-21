import { useMemo } from 'react';
import { buildChain, compact, signed } from '../../lib/sample/optionChain';
import { PROPOSALS, RECORD, VALIDATIONS } from '../../lib/sample/document';

/**
 * The two smaller live readouts. Neither is a console you operate — the scroll
 * is doing that job now — but both show real computed state rather than a
 * screenshot, which is the difference between describing a system and showing
 * one.
 */

/**
 * Extraction, including the field that fails.
 *
 * Five pass and one is rejected, because "in the fourth quarter" is not a date
 * and a guessed one would be worse than none. A readout showing six green
 * ticks would misrepresent the only genuinely hard part of the problem.
 */
export function ExtractionReadout() {
  const failing = VALIDATIONS.find((v) => !v.ok);

  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--hair)' }}>
      <p className="meta">Synthetic document — demonstration only</p>

      <ul className="mt-5 grid gap-1.5">
        {PROPOSALS.map((p) => {
          const check = VALIDATIONS.find((v) => v.field === p.field);
          return (
            <li key={p.field} className="flex items-baseline gap-3 text-[0.9375rem]">
              <span
                aria-hidden="true"
                className="num w-3 shrink-0"
                // One accent, so the accent goes to the thing that needs
                // attention: a rejected field. A pass stays quiet.
                style={{ color: check?.ok ? 'var(--bone-3)' : 'var(--signal)' }}
              >
                {check?.ok ? '·' : '✕'}
              </span>
              <span className="num min-w-0 flex-1 truncate" style={{ color: 'var(--bone-2)' }}>
                {p.field}
              </span>
              <span
                className="num shrink-0"
                style={{ color: p.value ? 'var(--bone)' : 'var(--signal)' }}
              >
                {p.value ?? 'rejected'}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[0.9375rem]" style={{ color: 'var(--bone-3)' }}>
        {RECORD.extraction.accepted} accepted, {RECORD.extraction.rejected} rejected.{' '}
        <span style={{ color: 'var(--signal)' }}>{failing?.check}</span> A null is an honest
        answer, and the document still lands.
      </p>
    </div>
  );
}

/** Open interest only means something against its own previous reading. */
export function ChainReadout() {
  const chain = useMemo(() => buildChain(), []);
  const rows = chain.rows.slice(3, 8);

  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: 'var(--hair)' }}>
      <p className="meta">Synthetic chain — demonstration only</p>

      <table className="mt-5 w-full text-right text-[0.9375rem]">
        <caption className="sr-only">
          Option chain by strike, with call and put open interest and the change against the
          previous snapshot
        </caption>
        <thead>
          <tr className="meta">
            <th scope="col" className="pb-2 text-right font-medium">Call ΔOI</th>
            <th scope="col" className="pb-2 text-center font-medium">Strike</th>
            <th scope="col" className="pb-2 text-left font-medium">Put ΔOI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.strike}>
              <td
                className="num py-1"
                style={{ color: row.call.dOi > 0 ? 'var(--signal)' : 'var(--bone-3)' }}
              >
                {signed(row.call.dOi)}
              </td>
              <td
                className="num px-4 py-1 text-center"
                style={{ color: row.atm ? 'var(--signal)' : 'var(--bone-2)' }}
              >
                {row.strike}
              </td>
              <td
                className="num py-1 text-left"
                style={{ color: row.put.dOi > 0 ? 'var(--signal)' : 'var(--bone-3)' }}
              >
                {signed(row.put.dOi)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
        {[
          ['PCR', chain.summary.pcr.toFixed(2)],
          ['Resistance', chain.summary.resistance.toLocaleString('en-IN')],
          ['Support', chain.summary.support.toLocaleString('en-IN')],
          ['Total call OI', compact(chain.summary.totalCallOi)],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="meta">{label}</dt>
            <dd className="num mt-1 text-[0.9375rem]" style={{ color: 'var(--bone)' }}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
