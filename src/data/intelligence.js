export const intelligence = {
  kicker: 'Intelligence Layer',
  title: 'Documents are not data until something reads them.',
  lede:
    'Most of the information a financial decision rests on arrives as prose — filings, disclosures, reports. The engineering problem is not the model. It is everything around the model: getting heterogeneous sources into one shape, keeping the pipeline fed, and being able to tell whether the output is right.',

  // Delivered — traceable to shipped work.
  delivered: [
    {
      id: 'extraction',
      title: 'Document intelligence',
      body:
        'Enhanced the NLP extraction model behind a platform that turns unstructured financial documents into structured, queryable data.',
    },
    {
      id: 'etl',
      title: 'Normalisation as the real problem',
      body:
        'Owned the ETL pre-processing stage that reduces heterogeneous source documents to a single XML representation — the step that makes everything downstream possible.',
    },
    {
      id: 'pipeline',
      title: 'Keeping the model fed',
      body:
        'Decoupled the processing services with message brokering so extraction throughput is set by capacity rather than by the slowest synchronous hand-off.',
    },
    {
      id: 'transform',
      title: 'Intelligent data transformation',
      body:
        'On the current platform, a transform engine where a single declared formula fans out across requested windows — computation expressed as intent, resolved by the system.',
    },
  ],

  // Forward-looking. Explicitly marked as direction, not delivery.
  focus: {
    label: 'Current focus — direction, not delivered work',
    items: [
      'LLM-assisted extraction where the schema is discovered from the document rather than declared in advance.',
      'Correctness tooling for AI output in financial contexts: making a wrong number detectable before it reaches a decision.',
      'Automated workflows that treat a language model as one unreliable component inside a system engineered to tolerate it.',
      'Writing up the boot-time specification assembly pattern as a public technical article.',
    ],
  },
};
