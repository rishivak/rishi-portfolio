/**
 * ClariFI Phoenix — the registry of cleared contributions.
 *
 * This file is built to grow. Each entry binds itself to one of the chapter's
 * movements, so adding an entry adds a story to the journey without touching
 * the engine or the scene. To add future work, append an object here.
 *
 * `cleared` is a hard gate: nothing renders unless it is true. That is the
 * mechanism that keeps unreviewed material off a public site by default rather
 * than by memory.
 *
 * CONFIDENTIALITY. The platform is described only as a distributed financial
 * data platform built around an in-memory data grid. No cache names, class
 * names, endpoint paths, module names, topology, configuration keys or
 * security findings appear here or anywhere downstream of here. Everything
 * below is traceable to the résumé.
 */

export const platform = {
  name: 'ClariFI Phoenix',
  kind: 'Distributed financial data & analytics platform',
  org: 'S&P Global — Market Intelligence',
  period: 'Jun 2026 — Present',
  description:
    'A distributed financial data platform built around an in-memory data grid, serving financial time-series and point-in-time data. Features are owned end to end — from the HTTP API contract, through distributed computation, to regression coverage.',
  stack: ['Java 21', 'In-memory data grid', 'Undertow', 'OpenAPI', 'Protobuf', 'SQL Server', 'Gradle', 'JUnit', 'Bruno'],
};

/**
 * The seven movements of the Phoenix chapter. `weight` is the share of the
 * chapter's scroll each one gets — the transform engine and the specification
 * rebuild earn the most because they carry the most engineering.
 */
export const movements = [
  {
    id: 'approach',
    title: 'The platform',
    weight: 0.1,
    // `framing` movements set up a problem rather than claim a contribution.
    // They carry their own copy and are exempt from needing a registry entry.
    framing: true,
    body: 'A distributed financial data platform built around an in-memory data grid. Features are owned end to end — HTTP contract, distributed computation, regression coverage.',
  },
  {
    id: 'spec-before',
    title: 'Assembled on every request',
    weight: 0.13,
    framing: true,
    body: 'The API specification was built from its fragments on every single call. Resolve, validate, serialise, compress — then do all of it again for the next request. The cost was structural, not incidental.',
  },
  { id: 'spec-after', title: 'Assembled once, at boot', weight: 0.17 },
  { id: 'resolution', title: 'Recursive resolution, and the cycle', weight: 0.15 },
  { id: 'catalog', title: 'Separating the surfaces', weight: 0.12 },
  { id: 'transform', title: 'The transform engine', weight: 0.21 },
  { id: 'correctness', title: 'Behaviour at the edges', weight: 0.12 },
];

export const contributions = [
  {
    id: 'openapi-boot',
    movement: 'spec-after',
    cleared: true,
    title: 'Boot-time specification assembly',
    claim: 'Moved specification assembly off the request path entirely.',
    detail: [
      'The API specification was previously assembled from its fragments on every request, so the cost was paid per call.',
      'Assembly now happens once during application startup, producing a single prepared payload that every later request is served from.',
    ],
    tech: ['Java 21', 'OpenAPI', 'Gradle'],
  },
  {
    id: 'ref-resolution',
    movement: 'resolution',
    cleared: true,
    title: 'Recursive $ref resolution',
    claim: 'Reference graphs are resolved recursively, to any depth.',
    detail: [
      'Specification fragments reference each other, and those references nest arbitrarily deep.',
      'Resolution walks the graph rather than assuming a fixed shape.',
    ],
    tech: ['Java 21', 'OpenAPI'],
  },
  {
    id: 'cycle-detection',
    movement: 'resolution',
    cleared: true,
    title: 'Cycle detection',
    claim: 'A reference graph is not guaranteed acyclic, so traversal has to terminate on any input.',
    detail: [
      'Cycles are detected during traversal and the walk stops rather than recursing until the stack gives out.',
      'This is the difference between a resolver that works on the specifications you have and one that works on the specifications you will have.',
    ],
    tech: ['Java 21'],
  },
  {
    id: 'spec-validation',
    movement: 'spec-after',
    cleared: true,
    title: 'Fail-fast fragment validation',
    claim: 'An invalid fragment now fails application startup instead of surfacing at runtime.',
    detail: [
      'Every JSON and Ion specification fragment is syntax-validated during the boot-time assembly.',
      'The trade is deliberate: a slower, stricter startup in exchange for a request path that cannot fail this way.',
    ],
    tech: ['Java 21', 'OpenAPI'],
  },
  {
    id: 'gzip-etag',
    movement: 'spec-after',
    cleared: true,
    title: 'Pre-computed gzip and SHA-256 ETag',
    claim: 'The compressed payload and its validator are computed once, not per request.',
    detail: [
      'The assembled specification is gzipped at startup and fingerprinted with a SHA-256 ETag.',
      'Serving it becomes a lookup rather than a serialisation.',
    ],
    tech: ['Java 21'],
  },
  {
    id: 'not-modified',
    movement: 'spec-after',
    cleared: true,
    title: 'The 304 path',
    claim: 'A repeat request resolves to 304 Not Modified against the pre-computed ETag.',
    detail: [
      'Clients that already hold the current specification are told so, instead of being sent it again.',
      'The document is not re-serialised to answer a question about whether it changed.',
    ],
    tech: ['OpenAPI', 'Undertow'],
  },
  {
    id: 'data-catalog',
    movement: 'catalog',
    cleared: true,
    title: 'User-facing Data Catalog read API',
    claim: 'Designed and shipped a user-scoped read surface, separate from the existing admin CRUD.',
    detail: [
      'User access and administrative access are different problems with different threat models; they were sharing one surface.',
      'The duplicated handler logic behind both was consolidated onto shared abstract base handlers, so the genuine differences became explicit instead of being copied and left to drift.',
    ],
    tech: ['Java 21', 'REST API design', 'OpenAPI'],
  },
  {
    id: 'compounded-return',
    movement: 'transform',
    cleared: true,
    title: 'Geometric compounded return',
    claim: 'A rolling multi-period compounded return, dividend-aware.',
    detail: [
      'Incorporates price appreciation and intraperiod reinvested dividends, with explicit ex-dividend date classification rather than an implicit one.',
      'Returns compound geometrically. Summing them is the most common way to produce a plausible wrong number.',
    ],
    tech: ['Java 21', 'JUnit'],
  },
  {
    id: 'cumulative-return',
    movement: 'transform',
    cleared: true,
    title: 'Cumulative return',
    claim: 'Supports both rolling and expanding windows.',
    detail: [
      'A rolling window and an expanding window answer genuinely different questions, and conflating them is a silent error.',
      'The caller states which one they mean; the engine does not guess.',
    ],
    tech: ['Java 21', 'JUnit'],
  },
  {
    id: 'multi-window',
    movement: 'transform',
    cleared: true,
    title: 'Multi-window expansion',
    claim: 'One declared formula fans out into a series per requested window.',
    detail: [
      'A single transform step expands across every window the request asks for, while preserving the grouping the response layer needs.',
      'The caller expresses intent; the engine resolves how many series that becomes.',
    ],
    tech: ['Java 21'],
  },
  {
    id: 'frequency-typing',
    movement: 'correctness',
    cleared: true,
    title: 'Frequency as a domain type',
    claim: 'Replaced string-typed frequency with the domain type across the calling path, with alias support.',
    detail: [
      'The same value at two frequencies is two different answers, so frequency is not a string.',
      'A typo in a string is a runtime surprise; a wrong type is a compile error.',
    ],
    tech: ['Java 21'],
  },
  {
    id: 'date-range',
    movement: 'correctness',
    cleared: true,
    title: 'Date-range handling in period functions',
    claim: 'Corrected date-range handling in the ATR, EMA and RSI period functions.',
    detail: [
      'Period functions are only correct relative to the range they are computed over.',
      'These are the bugs that produce an answer rather than an error, which is what makes them worth finding.',
    ],
    tech: ['Java 21', 'JUnit'],
  },
  {
    id: 'idempotency',
    movement: 'correctness',
    cleared: true,
    title: 'Idempotent session close',
    claim: 'Closing an export session twice no longer errors.',
    detail: [
      'A close is a statement about desired state, not an event. Repeating it should be free.',
      'Also fixed a null-pointer failure on the basket refresh path.',
    ],
    tech: ['Java 21'],
  },
  {
    id: 'regression',
    movement: 'correctness',
    cleared: true,
    title: 'Regression coverage',
    claim: 'JUnit suites for the new transform functions and their failure modes, plus 18 Bruno API regression collections.',
    detail: [
      'The collections exercise valid, boundary and rejection cases — the failure modes are covered deliberately, not incidentally.',
    ],
    tech: ['JUnit', 'Bruno'],
  },
];

/** Only cleared entries ever reach the scene. */
export const visibleContributions = contributions.filter((c) => c.cleared);

export const forMovement = (id) => visibleContributions.filter((c) => c.movement === id);
