/**
 * 05 — INTELLIGENCE.
 *
 * This section answers **how I think about AI-enabled systems**, not what I
 * built. The Foreseer case study in `02 Systems` covers the build — document
 * preprocessing, XML normalisation, extraction, ActiveMQ decoupling, secrets,
 * delivery, observability. Repeating it here would be the same story twice.
 *
 * So this file deliberately contains no case-study fields: no engineering
 * surface, no stack list, no imagery. The harness asserts that boundary
 * structurally, so a future copy edit cannot quietly collapse the two.
 */
export const intelligence = {
  kicker: 'Intelligence',
  title: 'Documents are not data until something reads them.',
  lede: [
    'A large part of financial information arrives as filings, reports, disclosures, and other unstructured documents.',
    'My experience in document intelligence has been less about treating the model as magic and more about building the system around it.',
  ],

  /** The pipeline as a principle, not as a project. */
  chain: ['normalise', 'extract', 'validate', 'reject or accept', 'persist', 'observe'],

  /** Patterns, phrased as engineering positions rather than deliverables. */
  patterns: [
    {
      id: 'component',
      title: 'The model is one component',
      body: 'An LLM is a dependency with a failure mode, not an authority. It belongs inside a system designed to tolerate it being wrong.',
    },
    {
      id: 'validation',
      title: 'Validation is the product',
      body: 'Getting a model to produce an answer is the easy half. Knowing whether the answer should be trusted is the part that decides whether anything downstream is safe.',
    },
    {
      id: 'detectable',
      title: 'Wrong output must be detectable',
      body: 'A confidently wrong figure is worse than a rejection. Type checks, range checks and internal consistency give the system grounds to refuse.',
    },
    {
      id: 'quality',
      title: 'Data quality precedes intelligence',
      body: 'Heterogeneous inputs have to reach one shape before anything can read them reliably. Most of the leverage is upstream of the model.',
    },
    {
      id: 'observe',
      title: 'Observe it in production',
      body: 'Extraction quality drifts as sources change. Without instrumentation you learn about it from a user rather than from a dashboard.',
    },
  ],

  close:
    'The interesting engineering problem is not simply getting a model to produce an answer. It is knowing whether the answer should be trusted.',
};
