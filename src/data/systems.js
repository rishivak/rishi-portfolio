// Four case studies. `impact` entries wrapped in [BRACKETS] render as visible
// placeholders — no metric is invented. Replace them in this file only.
export const systems = [
  {
    id: 'phoenix',
    index: '01',
    name: 'ClariFI Phoenix',
    kind: 'Distributed financial data & analytics platform',
    org: 'S&P Global — Market Intelligence',
    period: '2026 — Present',
    diagram: 'SpecPipeline',
    problem:
      'The API specification was assembled from its fragments on every single request. Cost was paid per call, and a malformed fragment surfaced as a runtime error somewhere downstream rather than as a failure anyone could act on.',
    approach:
      'Move the whole assembly to application boot. Resolve $ref graphs recursively with cycle detection, validate the syntax of every JSON and Ion fragment, then pre-compute a gzipped payload and a SHA-256 ETag once.',
    challenge:
      'Specification fragments reference each other in graphs that are not guaranteed acyclic. Resolution had to terminate on any input, and validation had to be strict enough that an invalid fragment stops startup — trading a slower boot for a request path that cannot fail this way.',
    outcome: [
      'An invalid fragment now fails application startup instead of surfacing at runtime.',
      'Repeat spec requests resolve to a 304 against the pre-computed ETag rather than re-serialising the document.',
      'Assembly cost moved from per-request to once-per-process.',
    ],
    impact: [
      { label: 'Spec response time', value: '[IMPACT METRIC]' },
      { label: 'Payload size', value: '[IMPACT METRIC]' },
    ],
    also: [
      'Designed and shipped the user-facing Data Catalog read API, separating user-scoped access from the pre-existing admin CRUD surface and consolidating duplicated handler logic onto shared abstract base handlers.',
      'Authored a rolling multi-period geometric compounded return incorporating price appreciation and intraperiod reinvested dividends with explicit ex-dividend date classification, and a cumulative return supporting rolling and expanding windows.',
      'Implemented multi-window expansion so one formula fans out into a series per requested window while preserving the grouping the response layer needs.',
      'Replaced string-typed frequency with the domain type across the linked-basket path, fixed a null-pointer failure in basket refresh, corrected date-range handling in the ATR, EMA and RSI period functions, and made session close idempotent.',
      'Backed every change with JUnit suites for the new transform functions and their failure modes, plus 18 Bruno API regression collections covering valid, boundary and rejection cases.',
    ],
    stack: ['Java 21', 'In-memory data grid', 'Undertow', 'OpenAPI', 'Protobuf', 'SQL Server', 'Gradle', 'JUnit', 'Bruno'],
  },
  {
    id: 'foreseer',
    index: '02',
    name: 'Foreseer-AI',
    kind: 'AI / NLP extraction from unstructured financial documents',
    org: 'S&P Global — Market Intelligence',
    period: '2024 — 2026',
    diagram: 'DocumentFlow',
    problem:
      'Financial disclosure arrives as documents, not as data. Source formats are heterogeneous, and the extraction services that consumed them were handing work to each other synchronously — so the slowest stage set the pace for everything behind it.',
    approach:
      'Normalise every source document into a single XML representation in an ETL pre-processing stage, then decouple the downstream services with ActiveMQ so each stage consumes at its own rate.',
    challenge:
      'Extraction quality and throughput pull in opposite directions. Improving the NLP model mattered only if the pipeline around it could keep the model fed — which meant the bottleneck had to be found with evidence rather than intuition.',
    outcome: [
      'Synchronous hand-offs between document-processing microservices became asynchronous delivery.',
      'A single normalised XML representation made heterogeneous sources consumable in real time downstream.',
      'DataDog and Grafana instrumentation turned into targeted SQL indexing and query refactoring — tuning the queries that were actually slow.',
      'Credential and token handling moved to AWS Secrets Manager; Azure DevOps pipelines made release a repeatable pipeline run.',
    ],
    impact: [
      { label: 'Throughput change', value: '[IMPACT METRIC]' },
      { label: 'Extraction accuracy', value: '[IMPACT METRIC]' },
    ],
    stack: ['Java', 'Spring Boot', 'Microservices', 'ActiveMQ', 'AWS Secrets Manager', 'Azure DevOps', 'Docker', 'Kubernetes', 'DataDog', 'Grafana'],
  },
  {
    id: 'plan4healthcare',
    index: '03',
    name: 'Plan4HealthCare',
    kind: 'Government healthcare budgeting platform',
    org: 'Covalience',
    period: '2023 — 2024',
    diagram: 'QueryPath',
    problem:
      'Government medical hospitals needed to estimate and track budgets in real time. The screens carrying the most traffic were the ones resting on the heaviest queries.',
    approach:
      'Deliver the server-side Java and J2EE features behind Spring REST APIs, then go after the query layer directly — queries, stored procedures and triggers behind the highest-traffic screens.',
    challenge:
      'Real-time budget tracking means the read path cannot be allowed to degrade as data accumulates, on infrastructure that a public-sector deployment does not let you simply scale out of.',
    outcome: [
      'Contributed to the architecture of critical platform features.',
      'Optimised the queries, stored procedures and triggers behind the highest-traffic screens.',
      'Standardised delivery to each environment with CI/CD pipelines and Docker containers.',
      'Paired Angular front-end work with its backing services rather than handing off at the API boundary.',
    ],
    impact: [{ label: 'Query latency', value: '[IMPACT METRIC]' }],
    stack: ['Java', 'J2EE', 'Spring Boot', 'Spring MVC', 'Angular', 'SQL', 'Docker', 'CI/CD'],
  },
  {
    id: 'doe',
    index: '04',
    name: 'DOE Licensing Network',
    kind: 'B2B integration for energy-plant licensing',
    org: 'Department of Energy, Abu Dhabi — via Innovatechs',
    period: '2020 — 2023',
    diagram: 'EdiBridge',
    problem:
      'Energy-plant licensing required a government body and its commercial partners to exchange documents reliably across organisational boundaries — where the two sides do not agree on a format and cannot share a database.',
    approach:
      'Establish a B2B network with webMethods integrations written in Java and J2EE, and bridge the format gap with XML-to-EDI transformation carried over FTP and reverse-invoke servers.',
    challenge:
      'Cross-boundary exchange has no shared transaction. Correctness has to come from the transformation and the transport, not from a rollback.',
    outcome: [
      'Built the webMethods integrations underpinning the licensing B2B network, with system performance as the explicit target.',
      'Built RESTful APIs with Java, Hibernate and Spring Boot, secured with Spring Security and integrated with the Amazon S3 client.',
      'Developed and mapped XML-to-EDI transformation for partner data exchange.',
      'Configured JDBC adapters and pub–sub patch migration between environments.',
    ],
    impact: [{ label: 'Exchange reliability', value: '[IMPACT METRIC]' }],
    stack: ['Java', 'J2EE', 'Spring Boot', 'Spring Security', 'Hibernate', 'webMethods', 'AWS S3', 'EDI', 'FTP'],
  },
];
