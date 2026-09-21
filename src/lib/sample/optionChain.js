/**
 * A deterministic synthetic option chain, and the open-interest analysis run
 * over it. Clearly labelled as illustrative in the UI — it is not live market
 * data and does not pretend to be. The classification logic, however, is the
 * standard reading and is applied honestly.
 */

const SPOT = 24_480;
const STEP = 100;
const STRIKES = 11;

/** Small deterministic PRNG, so the chain is identical on every render. */
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Open interest clusters at round strikes and thins with distance from spot —
 * the shape a real chain has, reproduced so the table reads plausibly.
 */
function buildSide(seed, bias) {
  const rand = lcg(seed);
  const base = Math.round(SPOT / STEP) * STEP;
  return Array.from({ length: STRIKES }, (_, i) => {
    const strike = base + (i - Math.floor(STRIKES / 2)) * STEP;
    const distance = Math.abs(strike - SPOT) / (STEP * 5);
    const cluster = strike % 500 === 0 ? 1.7 : 1;
    const oi = Math.round((1 - distance * 0.62) * cluster * (900_000 + rand() * 700_000) * bias);
    const prevOi = Math.round(oi * (0.86 + rand() * 0.3));
    const ltp = Number((Math.max(2, 240 - distance * 150) * (0.7 + rand() * 0.7)).toFixed(2));
    const prevLtp = Number((ltp * (0.9 + rand() * 0.22)).toFixed(2));
    return { strike, oi: Math.max(oi, 12_000), prevOi: Math.max(prevOi, 10_000), ltp, prevLtp };
  });
}

/**
 * The standard four-quadrant reading of price against open interest. New money
 * entering (OI up) means a position is being written; OI falling means one is
 * being closed.
 */
export function classify(dOi, dLtp) {
  if (dOi > 0 && dLtp > 0) return { id: 'long-buildup', label: 'Long buildup', tone: 'up' };
  if (dOi > 0 && dLtp <= 0) return { id: 'short-buildup', label: 'Short buildup', tone: 'down' };
  if (dOi <= 0 && dLtp > 0) return { id: 'short-covering', label: 'Short covering', tone: 'up' };
  return { id: 'long-unwinding', label: 'Long unwinding', tone: 'down' };
}

export function buildChain() {
  const calls = buildSide(20260920, 1);
  const puts = buildSide(20261231, 1.08);

  const rows = calls.map((call, i) => {
    const put = puts[i];
    const callDOi = call.oi - call.prevOi;
    const putDOi = put.oi - put.prevOi;
    return {
      strike: call.strike,
      atm: Math.abs(call.strike - SPOT) < STEP / 2,
      call: { ...call, dOi: callDOi, dLtp: Number((call.ltp - call.prevLtp).toFixed(2)), signal: classify(callDOi, call.ltp - call.prevLtp) },
      put: { ...put, dOi: putDOi, dLtp: Number((put.ltp - put.prevLtp).toFixed(2)), signal: classify(putDOi, put.ltp - put.prevLtp) },
    };
  });

  const totalCallOi = rows.reduce((n, r) => n + r.call.oi, 0);
  const totalPutOi = rows.reduce((n, r) => n + r.put.oi, 0);
  const maxCall = rows.reduce((a, b) => (b.call.oi > a.call.oi ? b : a));
  const maxPut = rows.reduce((a, b) => (b.put.oi > a.put.oi ? b : a));

  return {
    spot: SPOT,
    expiry: '25 SEP 2026',
    underlying: 'NIFTY',
    rows,
    summary: {
      pcr: Number((totalPutOi / totalCallOi).toFixed(2)),
      resistance: maxCall.strike,
      support: maxPut.strike,
      totalCallOi,
      totalPutOi,
    },
  };
}

/** The unparsed payload shown at the first stage, before anything is a number. */
export function rawPayload(chain) {
  const row = chain.rows[Math.floor(chain.rows.length / 2)];
  return [
    '{',
    '  "status": "success",',
    '  "data": [',
    '    {',
    `      "strike_price": ${row.strike},`,
    '      "call_options": {',
    `        "market_data": { "ltp": ${row.call.ltp}, "oi": ${row.call.oi}, "prev_oi": ${row.call.prevOi} }`,
    '      },',
    '      "put_options": {',
    `        "market_data": { "ltp": ${row.put.ltp}, "oi": ${row.put.oi}, "prev_oi": ${row.put.prevOi} }`,
    '      }',
    '    },',
    `    … ${chain.rows.length - 1} more strikes`,
    '  ]',
    '}',
  ];
}

export const compact = (n) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : String(n);

export const signed = (n) => `${n > 0 ? '+' : ''}${compact(n)}`;
