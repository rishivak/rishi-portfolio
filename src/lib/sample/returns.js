/**
 * Real compounding arithmetic over a synthetic series.
 *
 * The Return Engine console presents this as actual computation, so it has to
 * be actually correct. Returns compound geometrically — the product of growth
 * factors, minus one — never additively:
 *
 *     compounded = ∏(1 + rᵢ) − 1
 *
 * The input series below is illustrative and clearly labelled as such in the
 * UI. The mathematics applied to it is not illustrative.
 */

/** 24 months of decimal period returns. Synthetic, fixed, not market data. */
export const MONTHLY = [
  { period: '2024-01', r: 0.0212 },
  { period: '2024-02', r: 0.0134 },
  { period: '2024-03', r: -0.0087 },
  { period: '2024-04', r: 0.0301 },
  { period: '2024-05', r: 0.0045 },
  { period: '2024-06', r: -0.0192 },
  { period: '2024-07', r: 0.0256 },
  { period: '2024-08', r: 0.0118 },
  { period: '2024-09', r: -0.0043 },
  { period: '2024-10', r: 0.0167 },
  { period: '2024-11', r: 0.0289 },
  { period: '2024-12', r: -0.0121 },
  { period: '2025-01', r: 0.0198 },
  { period: '2025-02', r: -0.0234 },
  { period: '2025-03', r: 0.0176 },
  { period: '2025-04', r: 0.0092 },
  { period: '2025-05', r: 0.0243 },
  { period: '2025-06', r: -0.0065 },
  { period: '2025-07', r: 0.0131 },
  { period: '2025-08', r: 0.0207 },
  { period: '2025-09', r: -0.0148 },
  { period: '2025-10', r: 0.0184 },
  { period: '2025-11', r: 0.0059 },
  { period: '2025-12', r: 0.0226 },
];

/** ∏(1 + rᵢ) − 1 over the supplied returns. */
export function compound(returns) {
  let factor = 1;
  for (const r of returns) factor *= 1 + r;
  return factor - 1;
}

/** The naive-but-wrong alternative, shown alongside to make the point. */
export function additive(returns) {
  return returns.reduce((sum, r) => sum + r, 0);
}

export const FREQUENCIES = [
  { id: 'monthly', label: 'Monthly', span: 1 },
  { id: 'quarterly', label: 'Quarterly', span: 3 },
  { id: 'annual', label: 'Annual', span: 12 },
];

/**
 * Resample to a coarser frequency by compounding within each bucket. A trailing
 * partial bucket is dropped rather than reported as a full period — a
 * two-month "quarter" is not a quarter.
 */
export function resample(series, span) {
  if (span <= 1) return series.map((p) => ({ period: p.period, r: p.r, from: [p.period] }));
  const out = [];
  for (let i = 0; i + span <= series.length; i += span) {
    const bucket = series.slice(i, i + span);
    out.push({
      period: `${bucket[0].period} → ${bucket[bucket.length - 1].period}`,
      r: compound(bucket.map((p) => p.r)),
      from: bucket.map((p) => p.period),
    });
  }
  return out;
}

/** Trailing window of fixed size. Emits nothing until the window is full. */
export function rolling(series, window) {
  const out = [];
  for (let i = window - 1; i < series.length; i += 1) {
    out.push({
      period: series[i].period,
      r: compound(series.slice(i - window + 1, i + 1).map((p) => p.r)),
    });
  }
  return out;
}

/** Window anchored at the start and growing — a different question entirely. */
export function expanding(series) {
  const out = [];
  let factor = 1;
  for (const p of series) {
    factor *= 1 + p.r;
    out.push({ period: p.period, r: factor - 1 });
  }
  return out;
}

/**
 * The full pipeline the console steps through. Returns the intermediate state
 * at every stage so the panel can render any one of them.
 */
export function runPipeline({ frequency = 'monthly', window = 4, mode = 'rolling' } = {}) {
  const freq = FREQUENCIES.find((f) => f.id === frequency) ?? FREQUENCIES[0];
  const resampled = resample(MONTHLY, freq.span);
  // A window longer than the series would emit nothing; clamp instead.
  const effectiveWindow = Math.max(1, Math.min(window, resampled.length));
  const series = mode === 'expanding' ? expanding(resampled) : rolling(resampled, effectiveWindow);

  return {
    freq,
    mode,
    window: effectiveWindow,
    raw: MONTHLY,
    resampled,
    series,
    total: compound(resampled.map((p) => p.r)),
    naive: additive(resampled.map((p) => p.r)),
  };
}

export const pct = (n, dp = 2) => `${n >= 0 ? '+' : ''}${(n * 100).toFixed(dp)}%`;
