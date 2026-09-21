/**
 * 04 — SUBSTRATE. Technology organised by the engineering role it plays.
 *
 * `layer` groups a technology under one of the seven headings; `ring` places it
 * on the orbital StackGraph, innermost for language and outermost for tooling.
 * `role` is an architectural role, never an adjective, and `context` says what
 * it was actually used for — so the section can answer "why is this here"
 * rather than listing logos.
 */
export const layers = [
  { id: 'core', label: 'Core engineering', ring: 1, stage: 'engineering' },
  { id: 'api', label: 'APIs & contracts', ring: 2, stage: 'engineering' },
  { id: 'async', label: 'Distributed & asynchronous systems', ring: 2, stage: 'engineering' },
  { id: 'data', label: 'Data', ring: 3, stage: 'data' },
  { id: 'cloud', label: 'Cloud & delivery', ring: 3, stage: 'engineering' },
  { id: 'frontend', label: 'Frontend', ring: 4, stage: 'decision' },
  { id: 'quality', label: 'Quality & observability', ring: 4, stage: 'intelligence' },
];

export const technologies = [
  // ---- core --------------------------------------------------------------
  { id: 'java', name: 'Java', layer: 'core', weight: 3, role: 'Primary language, versions 8 through 21',
    context: 'Every backend system here is Java. Current work is Java 21 on a distributed data grid.', systems: ['phoenix', 'foreseer', 'plan4healthcare', 'doe'] },
  { id: 'spring', name: 'Spring Boot', layer: 'core', weight: 3, role: 'Application framework',
    context: 'Spring Boot, MVC and Security across three of the five systems here.', systems: ['foreseer', 'plan4healthcare', 'doe', 'oi-pulse'] },
  { id: 'distributed', name: 'Distributed systems', layer: 'core', weight: 3, role: 'Architecture',
    context: 'Computation dispatched to the node that owns the data, on an in-memory grid.', systems: ['phoenix'] },
  { id: 'sql-lang', name: 'SQL', layer: 'core', weight: 3, role: 'Query and procedural layer',
    context: 'Query and index optimisation driven by observability data rather than guesswork.', systems: ['foreseer', 'plan4healthcare'] },

  // ---- APIs & contracts ---------------------------------------------------
  { id: 'rest', name: 'REST API design', layer: 'api', weight: 3, role: 'Contract design',
    context: 'The user-facing Data Catalog read API was carved out as a separate user-scoped surface.', systems: ['phoenix', 'plan4healthcare', 'doe'] },
  { id: 'openapi', name: 'OpenAPI', layer: 'api', weight: 3, role: 'Specification & delivery',
    context: 'Re-architected spec delivery to a boot-time pipeline with cycle-safe $ref resolution.', systems: ['phoenix'] },
  { id: 'protobuf', name: 'Protobuf', layer: 'api', weight: 2, role: 'Binary serialisation',
    context: 'Wire format on the current platform’s data paths.', systems: ['phoenix'] },
  { id: 'domain', name: 'Domain modelling', layer: 'api', weight: 2, role: 'Type-safe contracts',
    context: 'Replacing string-typed frequency with a domain type turned runtime surprises into compile errors.', systems: ['phoenix'] },

  // ---- distributed & async ------------------------------------------------
  { id: 'grid', name: 'In-memory data grid', layer: 'async', weight: 3, role: 'Distributed cache & compute',
    context: 'Financial time-series and point-in-time data held in memory across a cluster.', systems: ['phoenix'] },
  { id: 'activemq', name: 'ActiveMQ / JMS', layer: 'async', weight: 2, role: 'Message brokering',
    context: 'Introduced to decouple document-processing services from each other’s pace.', systems: ['foreseer'] },
  { id: 'events', name: 'Event-driven architecture', layer: 'async', weight: 2, role: 'Coordination model',
    context: 'Pub–sub and asynchronous delivery as the default between services.', systems: ['foreseer', 'doe'] },
  { id: 'webmethods', name: 'webMethods', layer: 'async', weight: 2, role: 'B2B integration',
    context: 'The integration layer behind the energy-plant licensing partner network.', systems: ['doe'] },
  { id: 'undertow', name: 'Undertow', layer: 'async', weight: 2, role: 'HTTP server',
    context: 'The HTTP tier the current platform’s API server is built on.', systems: ['phoenix'] },

  // ---- data ---------------------------------------------------------------
  { id: 'sqlserver', name: 'SQL Server', layer: 'data', weight: 2, role: 'Relational store', context: 'Backing store on the current platform.', systems: ['phoenix'] },
  { id: 'mysql', name: 'MySQL', layer: 'data', weight: 2, role: 'Relational store', context: 'Application persistence, and OI Pulse’s snapshot history.', systems: ['plan4healthcare', 'oi-pulse'] },
  { id: 'oracle', name: 'Oracle', layer: 'data', weight: 1, role: 'Relational store', context: 'Enterprise persistence and PL/SQL work.', systems: [] },
  { id: 'redis', name: 'Redis', layer: 'data', weight: 2, role: 'Caching', context: 'Serves OI Pulse’s live option chain, separate from its history path.', systems: ['oi-pulse'] },
  { id: 'jdbc', name: 'JDBC / HikariCP', layer: 'data', weight: 2, role: 'Connection management', context: 'Pooling, and JDBC adapter configuration across integration environments.', systems: ['phoenix', 'doe'] },
  { id: 'solr', name: 'Solr', layer: 'data', weight: 2, role: 'Search & indexing', context: 'Made extracted financial records queryable alongside every other filing.', systems: ['foreseer'] },
  { id: 'elastic', name: 'Elasticsearch', layer: 'data', weight: 1, role: 'Search & indexing', context: 'Worked with for search and indexing.', systems: [] },

  // ---- cloud & delivery ---------------------------------------------------
  { id: 'aws', name: 'AWS', layer: 'cloud', weight: 2, role: 'Cloud services',
    context: 'S3 on the licensing platform; Secrets Manager for credential handling on the extraction estate.', systems: ['foreseer', 'doe'] },
  { id: 'docker', name: 'Docker', layer: 'cloud', weight: 3, role: 'Containerisation', context: 'Images standardising how each environment receives a build.', systems: ['foreseer', 'plan4healthcare'] },
  { id: 'k8s', name: 'Kubernetes', layer: 'cloud', weight: 2, role: 'Orchestration', context: 'Runtime for the document-processing microservice estate.', systems: ['foreseer'] },
  { id: 'azuredevops', name: 'Azure DevOps', layer: 'cloud', weight: 2, role: 'Delivery pipelines', context: 'Turned release from a coordinated manual exercise into a pipeline run.', systems: ['foreseer'] },
  { id: 'actions', name: 'GitHub Actions', layer: 'cloud', weight: 1, role: 'CI', context: 'Continuous integration workflows, including this site.', systems: [] },
  { id: 'gradle', name: 'Gradle / Maven', layer: 'cloud', weight: 2, role: 'Build tooling', context: 'Build and dependency management across Java estates.', systems: ['phoenix'] },

  // ---- frontend -----------------------------------------------------------
  { id: 'angular', name: 'Angular', layer: 'frontend', weight: 2, role: 'Application front end',
    context: 'Front-end work on the budgeting platform, paired with its backing services.', systems: ['plan4healthcare'] },
  { id: 'react', name: 'React', layer: 'frontend', weight: 2, role: 'Application front end', context: 'OI Pulse’s dashboard — and this site.', systems: ['oi-pulse'] },
  { id: 'typescript', name: 'TypeScript', layer: 'frontend', weight: 1, role: 'Typed front-end work', context: 'Front-end and tooling work alongside the Angular and React surfaces.', systems: [] },
  { id: 'vaadin', name: 'Vaadin', layer: 'frontend', weight: 1, role: 'Server-driven UI', context: 'Part of the extraction platform’s operator surface.', systems: ['foreseer'] },
  { id: 'sse', name: 'Server-sent events', layer: 'frontend', weight: 2, role: 'Push delivery', context: 'Pushes OI Pulse’s computed read to the browser without client polling.', systems: ['oi-pulse'] },

  // ---- quality & observability --------------------------------------------
  { id: 'junit', name: 'JUnit / Mockito', layer: 'quality', weight: 3, role: 'Automated testing',
    context: 'Coverage for new transform functions and, deliberately, their failure modes.', systems: ['phoenix'] },
  { id: 'bruno', name: 'Bruno', layer: 'quality', weight: 2, role: 'API regression',
    context: '18 regression collections exercising valid, boundary and rejection cases.', systems: ['phoenix'] },
  { id: 'datadog', name: 'DataDog', layer: 'quality', weight: 2, role: 'Tracing & metrics',
    context: 'Instrumented the extraction services, then used the traces to decide what to optimise.', systems: ['foreseer'] },
  { id: 'grafana', name: 'Grafana', layer: 'quality', weight: 2, role: 'Dashboards', context: 'Visualisation over the service metrics.', systems: ['foreseer'] },
];
