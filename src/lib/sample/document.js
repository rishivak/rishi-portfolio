/**
 * A synthetic filing extract and the states it passes through. Written to
 * resemble the shape of real disclosure prose without being any real company's
 * text — the console labels it as illustrative.
 *
 * The one thing here that is not cosmetic: a field fails validation. Partial
 * success is how extraction actually behaves, and a console that shows seven
 * green ticks would be lying about the hard part.
 */

/** The source paragraph, pre-split so spans can be highlighted by index. */
export const TOKENS = [
  { t: 'For the quarter ended ' },
  { t: '30 June 2026', span: 'period' },
  { t: ', the Group reported total revenue of ' },
  { t: '£412.7 million', span: 'revenue' },
  { t: ', an increase of ' },
  { t: '8.4%', span: 'growth' },
  { t: ' on the comparable prior period. Operating margin was ' },
  { t: '21.3%', span: 'margin' },
  { t: '. The Board has declared an interim dividend of ' },
  { t: '14.5 pence', span: 'dividend' },
  { t: ' per ordinary share, payable ' },
  { t: 'in the fourth quarter', span: 'payDate' },
  { t: ' to shareholders on the register at the close of business on the record date.' },
];

export const SPANS = ['period', 'revenue', 'growth', 'margin', 'dividend', 'payDate'];

/** What the model proposes, before anything has been checked. */
export const PROPOSALS = [
  { field: 'periodEnd', span: 'period', value: '2026-06-30', type: 'date', confidence: 0.99 },
  { field: 'revenue', span: 'revenue', value: '412700000', type: 'decimal', unit: 'GBP', confidence: 0.97 },
  { field: 'revenueGrowth', span: 'growth', value: '0.084', type: 'decimal', confidence: 0.94 },
  { field: 'operatingMargin', span: 'margin', value: '0.213', type: 'decimal', confidence: 0.96 },
  { field: 'dividendPerShare', span: 'dividend', value: '0.145', type: 'decimal', unit: 'GBP', confidence: 0.91 },
  { field: 'dividendPayDate', span: 'payDate', value: null, type: 'date', confidence: 0.38 },
];

/**
 * Validation. Each proposal is checked for type, range and internal
 * consistency; `dividendPayDate` fails because "in the fourth quarter" is not
 * resolvable to a date, and a guessed date would be worse than none.
 */
export const VALIDATIONS = [
  { field: 'periodEnd', ok: true, check: 'ISO-8601 date, within reporting horizon' },
  { field: 'revenue', ok: true, check: 'Positive decimal, currency resolved from context' },
  { field: 'revenueGrowth', ok: true, check: 'Within plausible range, consistent with prior period' },
  { field: 'operatingMargin', ok: true, check: 'Ratio in [0,1], consistent with revenue' },
  { field: 'dividendPerShare', ok: true, check: 'Positive decimal, unit normalised pence → GBP' },
  { field: 'dividendPayDate', ok: false, check: 'Not resolvable to a calendar date — rejected, not inferred' },
];

/** The record that survives. The rejected field is recorded as rejected. */
export const RECORD = {
  documentId: 'SYN-2026Q2-0001',
  periodEnd: '2026-06-30',
  revenue: { value: 412700000, currency: 'GBP' },
  revenueGrowth: 0.084,
  operatingMargin: 0.213,
  dividendPerShare: { value: 0.145, currency: 'GBP' },
  dividendPayDate: null,
  extraction: { fields: 6, accepted: 5, rejected: 1 },
};

export const INDEX_DOC = [
  { key: 'id', value: 'SYN-2026Q2-0001' },
  { key: 'period_end_dt', value: '2026-06-30T00:00:00Z' },
  { key: 'revenue_d', value: '4.127E8' },
  { key: 'revenue_growth_d', value: '0.084' },
  { key: 'operating_margin_d', value: '0.213' },
  { key: 'dividend_per_share_d', value: '0.145' },
  { key: 'incomplete_fields_ss', value: '["dividendPayDate"]' },
];

/** Which artefact each console step should render. */
export const STEP_VIEW = {
  document: 'prose',
  ingest: 'normalised',
  parse: 'spans',
  extract: 'proposals',
  validate: 'validations',
  structured: 'record',
  index: 'index',
};

export const NORMALISED = [
  '<document id="SYN-2026Q2-0001" source="pdf">',
  '  <section type="results" seq="1">',
  '    <p>For the quarter ended 30 June 2026, the Group reported total',
  '       revenue of £412.7 million, an increase of 8.4% on the …</p>',
  '  </section>',
  '</document>',
];
