/**
 * The career, newest first.
 *
 * Array order is the display order everywhere — the trajectory track, the
 * palette, the case studies. A visitor should meet the current role before the
 * first one, because that is the question they actually arrived with.
 *
 * Each role carries the prose (problem / built / complexity / impact), the
 * technologies, and an abstract `architecture` that the scene builder places
 * into the world. The architecture is the content, not an illustration of it:
 * it is what a visitor reads when the labels are too far away to matter.
 *
 * `silhouette` names the visual logic of the environment. The four are
 * deliberately different shapes so the eras stay distinguishable with every
 * label hidden.
 */
export const experience = [
  {
    id: 'phoenix',
    summary:
      'Owning features end to end on a distributed financial data platform — API contract, distributed computation, and the numerical correctness of the transforms.',
    year: '2026',
    org: 'S&P Global — Market Intelligence',
    role: 'Senior Software Engineer III (Full-Stack)',
    period: 'Jun 2026 — Present',
    place: 'India',
    current: true,
    system: 'ClariFI Phoenix — distributed financial data & analytics platform',
    kind: 'Financial data & distributed systems',
    stage: 'engineering',
    silhouette: 'A multi-level hall that branches and re-converges',

    problem:
      'A distributed financial data platform built around an in-memory data grid. The API specification was assembled from its fragments on every single request, so the cost was paid per call — and a malformed fragment surfaced as a runtime error downstream rather than as a failure anyone could act on.',
    built:
      'Re-architected specification delivery into a boot-time pipeline with recursive $ref resolution, cycle detection and fail-fast validation. Designed and shipped the user-facing Data Catalog read API. Authored the platform’s compounded and cumulative return transforms, multi-window expansion, and the correctness work behind them.',
    complexity:
      'Reference graphs are not guaranteed acyclic, so resolution must terminate on any input. And numerical correctness in finance is not a tolerance question — there is one right answer per convention, the conventions differ, and the caller has to be able to say which they mean without reading the implementation.',
    impact: [
      'An invalid fragment now fails startup instead of surfacing at runtime.',
      'Repeat specification requests resolve to a 304 against a pre-computed ETag.',
      'Assembly cost moved from per-request to once-per-process.',
      'New transform functions covered by JUnit suites and 18 Bruno regression collections.',
    ],

    technology: ['Java 21', 'In-memory data grid', 'Undertow', 'OpenAPI', 'Protobuf', 'SQL Server', 'Gradle', 'JUnit', 'Bruno'],

    // Phoenix's world is hand-authored across seven movements rather than
    // generated from this, but the detail panel still needs the shape of the
    // platform in one place.
    architecture: {
      // No `layout`: the Phoenix world is hand-authored across seven movements
      // in src/scene/chapters/phoenix.js. This describes the platform for the
      // detail panel only.
      note: 'A request, a specification, and a transform engine.',
      nodes: [
        { id: 'client', label: 'CLIENT', stage: 'data' },
        { id: 'api', label: 'API', stage: 'engineering', tech: 'Undertow' },
        { id: 'spec', label: 'SPECIFICATION — BUILT AT BOOT', stage: 'engineering', tech: 'OpenAPI' },
        { id: 'etag', label: 'GZIP + SHA-256 ETAG', stage: 'intelligence' },
        { id: 'grid', label: 'IN-MEMORY DATA GRID', stage: 'engineering' },
        { id: 'transform', label: 'TRANSFORM ENGINE', stage: 'intelligence' },
        { id: 'windows', label: 'MULTI-WINDOW EXPANSION', stage: 'intelligence' },
        { id: 'validate', label: 'VALIDATION', stage: 'intelligence' },
        { id: 'result', label: 'RESULT', stage: 'decision', tech: 'Protobuf' },
      ],
      edges: [
        ['client', 'api'],
        ['api', 'spec'],
        ['spec', 'etag'],
        ['etag', 'client'],
        ['api', 'grid'],
        ['grid', 'transform'],
        ['transform', 'windows'],
        ['windows', 'validate'],
        ['validate', 'result'],
      ],
    },
  },

  {
    id: 'foreseer',
    summary:
      'Turning unstructured financial documents into queryable records, and decoupling the extraction estate so throughput stopped being set by its slowest hand-off.',
    year: '2024',
    org: 'S&P Global — Market Intelligence',
    role: 'Senior Software Engineer III (Full-Stack)',
    period: 'Sept 2024 — Jun 2026',
    place: 'India',
    system: 'Foreseer-AI — AI/NLP extraction from unstructured financial documents',
    kind: 'Document intelligence',
    stage: 'intelligence',
    silhouette: 'A conveyor where the payload changes form at every gate',

    problem:
      'Most of what a financial decision rests on is written, not tabulated. Unstructured documents had to become queryable data, and the services doing it were handing work to each other synchronously — so the slowest stage set the pace for everything behind it.',
    built:
      'Enhanced the NLP extraction model, and owned the ETL pre-processing stage that normalises heterogeneous source documents into a single XML representation for real-time downstream consumption. Introduced ActiveMQ brokering to decouple the processing services, moved credential handling to AWS Secrets Manager, and built the Azure DevOps delivery pipelines for the microservice estate.',
    complexity:
      'The model was never the hard part. Normalisation before it and validation after it are what made the output usable, and finding the real bottleneck meant instrumenting first and optimising second rather than tuning what looked expensive.',
    impact: [
      'Synchronous hand-offs converted to asynchronous delivery.',
      'One normalised representation made heterogeneous sources consumable in real time downstream.',
      'DataDog and Grafana traces turned into targeted SQL indexing — tuning what was actually slow.',
      'Shipping became a repeatable pipeline run rather than a coordinated manual exercise.',
    ],

    technology: ['Java', 'Spring Boot', 'Microservices', 'ActiveMQ', 'LLM extraction', 'Solr', 'Vaadin', 'SQL tuning', 'DataDog', 'Grafana', 'AWS Secrets Manager', 'Docker', 'Kubernetes', 'Azure DevOps'],

    architecture: {
      layout: 'conveyor',
      note: 'A document, changing form.',
      nodes: [
        { id: 'document', label: 'DOCUMENT', stage: 'data', form: 'prose' },
        { id: 'ingest', label: 'INGESTION', stage: 'data' },
        { id: 'normalise', label: 'NORMALISATION', stage: 'data', form: 'rows', tech: 'XML' },
        { id: 'broker', label: 'ACTIVEMQ', stage: 'engineering', aside: true, tech: 'ActiveMQ' },
        { id: 'parse', label: 'PARSING', stage: 'engineering', form: 'fragments' },
        { id: 'extract', label: 'LLM EXTRACTION', stage: 'intelligence', form: 'fields' },
        { id: 'validate', label: 'VALIDATION', stage: 'intelligence' },
        { id: 'rejected', label: 'REJECTED', stage: 'decision', dead: true },
        { id: 'structured', label: 'STRUCTURED', stage: 'decision', form: 'record' },
        { id: 'index', label: 'INDEX', stage: 'decision', tech: 'Solr' },
        { id: 'observe', label: 'DATADOG · GRAFANA', stage: 'engineering', aside: true, below: true },
        { id: 'tuning', label: 'SQL INDEXING', stage: 'engineering', aside: true, below: true },
      ],
      edges: [
        ['document', 'ingest'],
        ['ingest', 'normalise'],
        ['normalise', 'broker'],
        ['broker', 'parse'],
        ['parse', 'extract'],
        ['extract', 'validate'],
        ['validate', 'structured'],
        ['validate', 'rejected'],
        ['structured', 'index'],
        ['observe', 'tuning'],
        ['tuning', 'index'],
      ],
    },
  },

  {
    id: 'covalience',
    summary:
      'Full-stack delivery on a real-time budgeting platform, with the read path behind its busiest screens made cheaper rather than better-resourced.',
    year: '2023',
    org: 'Covalience',
    role: 'Sr. Application Engineer II (Full-Stack)',
    period: 'Jan 2023 — Aug 2024',
    place: 'Chandigarh, India',
    system: 'Plan4HealthCare — government healthcare budgeting platform',
    kind: 'Full-stack product',
    stage: 'engineering',
    silhouette: 'A complete application stack, tier on tier',

    problem:
      'Government medical hospitals needed to estimate and track budgets in real time, and the highest-traffic screens rested on the heaviest queries — on infrastructure a public-sector deployment cannot simply scale out of.',
    built:
      'Server-side Java and J2EE features behind Spring REST APIs, contributing to the architecture of critical features. Optimised the queries, stored procedures and triggers behind the busiest screens, and built the CI/CD pipelines and Docker containers that standardised delivery to each environment.',
    complexity:
      'Real-time tracking means the read path cannot be allowed to degrade as data accumulates, and the fix had to come from the query layer rather than from hardware. Front-end work stayed paired with its backing services rather than handed off at the API boundary.',
    impact: [
      'The read path behind the highest-traffic screens got cheaper rather than better-resourced.',
      'Environment delivery became standardised and repeatable.',
      'Full-stack ownership from the Angular screen through to the stored procedure.',
    ],

    technology: ['Java', 'J2EE', 'Spring Boot', 'Spring MVC', 'Angular', 'SQL', 'Docker', 'CI/CD'],

    architecture: {
      layout: 'stack',
      note: 'One product, five tiers, owned end to end.',
      nodes: [
        { id: 'user', label: 'USER', stage: 'data', tier: 0 },
        { id: 'angular', label: 'ANGULAR', stage: 'data', tier: 1, tech: 'Angular' },
        { id: 'rest', label: 'SPRING REST', stage: 'engineering', tier: 2, tech: 'Spring MVC' },
        { id: 'logic', label: 'BUSINESS LOGIC', stage: 'engineering', tier: 3 },
        { id: 'sql', label: 'SQL', stage: 'intelligence', tier: 4 },
        { id: 'proc', label: 'STORED PROCEDURES', stage: 'intelligence', tier: 5 },
        { id: 'index', label: 'QUERY OPTIMISATION', stage: 'intelligence', tier: 5 },
        { id: 'ci', label: 'CI / CD', stage: 'decision', tier: 3, lane: true, tech: 'Docker' },
        { id: 'deploy', label: 'DEPLOYMENT', stage: 'decision', tier: 5, lane: true },
      ],
      edges: [
        ['user', 'angular'],
        ['angular', 'rest'],
        ['rest', 'logic'],
        ['logic', 'sql'],
        ['sql', 'proc'],
        ['sql', 'index'],
        ['ci', 'deploy'],
      ],
    },
  },

  {
    id: 'innovatechs',
    summary:
      'Building the B2B integration network for energy-plant licensing, where correctness had to come from the transformation and the transport themselves.',
    year: '2020',
    org: 'Innovatechs Technology Solutions',
    role: 'Software Engineer (Java)',
    period: 'Jan 2020 — Jan 2023',
    place: 'Hyderabad, India',
    system: 'Department of Energy, Abu Dhabi — government licensing platform',
    kind: 'Integration',
    stage: 'engineering',
    silhouette: 'Scattered systems across an organisational boundary',

    problem:
      'Energy-plant licensing required a government body and its commercial partners to exchange documents reliably across an organisational boundary — where the two sides agree on neither a format nor a database, and there is no shared transaction to fall back on.',
    built:
      'webMethods integrations in Java and J2EE establishing the B2B network, RESTful APIs with Hibernate and Spring Boot secured with Spring Security and integrated with the Amazon S3 client, and XML-to-EDI document transformation carried over FTP and reverse-invoke servers. Configured JDBC adapters and pub–sub patch migration between environments.',
    complexity:
      'Cross-boundary exchange has no shared transaction and no rollback. Correctness has to come from the transformation and the transport themselves, because there is nothing else to appeal to when a partner rejects a document.',
    impact: [
      'A working B2B licensing network between the department and its partners.',
      'Partner data exchange bridged across two incompatible document formats.',
      'Environment promotion turned into a configured migration rather than a manual one.',
    ],

    technology: ['Java', 'J2EE', 'Spring Boot', 'Spring Security', 'Hibernate', 'webMethods', 'AWS S3', 'EDI', 'XML', 'FTP', 'JDBC'],

    architecture: {
      layout: 'scatter',
      note: 'Systems talking across a boundary they do not share.',
      nodes: [
        { id: 'partner', label: 'EXTERNAL PARTNER', stage: 'data', side: 'far' },
        { id: 'edi', label: 'EDI / XML', stage: 'data', side: 'far' },
        { id: 'ftp', label: 'FTP · REVERSE-INVOKE', stage: 'engineering', side: 'boundary' },
        { id: 'integration', label: 'INTEGRATION LAYER', stage: 'engineering', side: 'near', tech: 'webMethods' },
        { id: 'transform', label: 'XML → EDI', stage: 'engineering', side: 'near' },
        { id: 'services', label: 'JAVA SERVICES', stage: 'engineering', side: 'near', tech: 'Spring Boot' },
        { id: 'pubsub', label: 'PUB / SUB', stage: 'engineering', side: 'near' },
        { id: 's3', label: 'AWS S3', stage: 'decision', side: 'near' },
      ],
      edges: [
        ['partner', 'edi'],
        ['edi', 'ftp'],
        ['ftp', 'integration'],
        ['integration', 'transform'],
        ['transform', 'services'],
        ['services', 's3'],
        ['integration', 'pubsub'],
        ['pubsub', 'services'],
      ],
    },
  },
];

export const roleById = Object.fromEntries(experience.map((r) => [r.id, r]));

export const education = [
  { id: 'btech', degree: 'B.Tech — Electronics & Communication Engineering', school: 'B.K. Birla Institute of Engineering & Technology, Pilani', year: '2016' },
  { id: 'mba', degree: 'MBA — Finance', school: 'Jaipur National University', year: '2021', note: 'Domain grounding for financial-data work.' },
];

export const certifications = [
  { id: 'apim', name: 'Certified API Management Associate', issuer: 'Software AG' },
  { id: 'wmio', name: 'Certified webMethods.io Integration Associate', issuer: 'Software AG' },
];
