// Technology ecosystem. `layer` drives the orbital ring; `weight` (1–3) drives
// node size and list order. `role` is the architectural role, not a adjective.
export const layers = [
  { id: 'language', label: 'Language', ring: 1 },
  { id: 'backend', label: 'Backend', ring: 2 },
  { id: 'distributed', label: 'Distributed & Async', ring: 2 },
  { id: 'data', label: 'Data', ring: 3 },
  { id: 'cloud', label: 'Cloud & DevOps', ring: 3 },
  { id: 'frontend', label: 'Frontend', ring: 4 },
  { id: 'quality', label: 'Testing & Observability', ring: 4 },
];

export const technologies = [
  // ---- language ----------------------------------------------------------
  { id: 'java', name: 'Java', layer: 'language', weight: 3, role: 'Primary language, versions 8 through 21',
    context: 'Every backend system on this page is Java. Current work is Java 21 on a distributed data grid.', systems: ['phoenix', 'foreseer', 'plan4healthcare', 'doe'] },
  { id: 'sql', name: 'SQL / PL-SQL', layer: 'language', weight: 3, role: 'Query and procedural layer',
    context: 'Query and index optimisation driven by observability data rather than guesswork; stored procedures and triggers behind high-traffic screens.', systems: ['foreseer', 'plan4healthcare'] },
  { id: 'typescript', name: 'TypeScript', layer: 'language', weight: 1, role: 'Typed front-end work',
    context: 'Front-end and tooling work alongside the Angular and React surfaces.', systems: [] },
  { id: 'javascript', name: 'JavaScript', layer: 'language', weight: 1, role: 'Browser runtime',
    context: 'Client-side work across the platforms’ admin and operator surfaces.', systems: ['plan4healthcare'] },

  // ---- backend -----------------------------------------------------------
  { id: 'spring', name: 'Spring Boot', layer: 'backend', weight: 3, role: 'Application framework',
    context: 'Spring Boot, MVC and Security across three of the four systems here — REST surfaces, authentication and service wiring.', systems: ['foreseer', 'plan4healthcare', 'doe'] },
  { id: 'rest', name: 'REST API design', layer: 'backend', weight: 3, role: 'Contract design',
    context: 'Designing the contract first: the user-facing Data Catalog read API was carved out as a separate user-scoped surface from the existing admin CRUD.', systems: ['phoenix', 'plan4healthcare', 'doe'] },
  { id: 'openapi', name: 'OpenAPI', layer: 'backend', weight: 3, role: 'Specification & delivery',
    context: 'Re-architected spec delivery from per-request assembly to a boot-time pipeline with recursive $ref resolution, cycle detection, gzip and ETag.', systems: ['phoenix'] },
  { id: 'microservices', name: 'Microservices', layer: 'backend', weight: 2, role: 'Decomposition style',
    context: 'A document-processing estate decoupled with message brokering, deployed through Docker and Kubernetes.', systems: ['foreseer'] },
  { id: 'hibernate', name: 'Hibernate', layer: 'backend', weight: 2, role: 'Persistence mapping',
    context: 'ORM layer behind the licensing platform’s REST services.', systems: ['doe'] },
  { id: 'undertow', name: 'Undertow', layer: 'backend', weight: 2, role: 'HTTP server',
    context: 'The HTTP tier the current platform’s API server is built on.', systems: ['phoenix'] },

  // ---- distributed -------------------------------------------------------
  { id: 'grid', name: 'In-memory data grid', layer: 'distributed', weight: 3, role: 'Distributed cache & compute',
    context: 'Financial time-series and point-in-time data held in memory across a cluster, with computation dispatched to the node that owns the data.', systems: ['phoenix'] },
  { id: 'activemq', name: 'ActiveMQ / JMS', layer: 'distributed', weight: 2, role: 'Message brokering',
    context: 'Introduced to decouple document-processing services, converting synchronous hand-offs into asynchronous delivery.', systems: ['foreseer'] },
  { id: 'eventing', name: 'Event-driven design', layer: 'distributed', weight: 2, role: 'Coordination model',
    context: 'Pub–sub and asynchronous delivery as the default coordination pattern between services.', systems: ['foreseer', 'doe'] },
  { id: 'webmethods', name: 'webMethods', layer: 'distributed', weight: 2, role: 'B2B integration',
    context: 'Integration layer establishing a partner network for energy-plant licensing, with XML-to-EDI transformation over FTP.', systems: ['doe'] },

  // ---- data --------------------------------------------------------------
  { id: 'sqlserver', name: 'SQL Server', layer: 'data', weight: 2, role: 'Relational store',
    context: 'Backing store on the current platform.', systems: ['phoenix'] },
  { id: 'mysql', name: 'MySQL', layer: 'data', weight: 2, role: 'Relational store', context: 'Application persistence across earlier systems.', systems: ['plan4healthcare'] },
  { id: 'oracle', name: 'Oracle', layer: 'data', weight: 1, role: 'Relational store', context: 'Enterprise persistence and PL/SQL work.', systems: [] },
  { id: 'protobuf', name: 'Protobuf', layer: 'data', weight: 2, role: 'Binary serialisation',
    context: 'Wire format on the current platform’s data paths.', systems: ['phoenix'] },
  { id: 'jdbc', name: 'JDBC / HikariCP', layer: 'data', weight: 2, role: 'Connection management',
    context: 'Pooling and adapter configuration, including JDBC adapters across integration environments.', systems: ['phoenix', 'doe'] },
  { id: 'redis', name: 'Redis', layer: 'data', weight: 1, role: 'Caching', context: 'Worked with as a caching layer.', systems: [] },
  { id: 'elasticsearch', name: 'ElasticSearch', layer: 'data', weight: 1, role: 'Search & indexing', context: 'Worked with for search and indexing.', systems: [] },

  // ---- cloud -------------------------------------------------------------
  { id: 'aws', name: 'AWS', layer: 'cloud', weight: 2, role: 'Cloud services',
    context: 'S3 client integration on the licensing platform; Secrets Manager for credential and token handling on the extraction estate.', systems: ['foreseer', 'doe'] },
  { id: 'docker', name: 'Docker', layer: 'cloud', weight: 3, role: 'Containerisation',
    context: 'Container images standardising how each environment receives a build.', systems: ['foreseer', 'plan4healthcare'] },
  { id: 'kubernetes', name: 'Kubernetes', layer: 'cloud', weight: 2, role: 'Orchestration',
    context: 'Runtime for the document-processing microservice estate.', systems: ['foreseer'] },
  { id: 'azuredevops', name: 'Azure DevOps', layer: 'cloud', weight: 2, role: 'Delivery pipelines',
    context: 'Built the build–test–release pipelines that turned shipping into a repeatable pipeline run.', systems: ['foreseer'] },
  { id: 'githubactions', name: 'GitHub Actions', layer: 'cloud', weight: 1, role: 'CI', context: 'Continuous integration workflows.', systems: [] },
  { id: 'gradle', name: 'Gradle / Maven', layer: 'cloud', weight: 2, role: 'Build tooling', context: 'Build and dependency management across Java estates.', systems: ['phoenix'] },

  // ---- frontend ----------------------------------------------------------
  { id: 'angular', name: 'Angular', layer: 'frontend', weight: 2, role: 'Application front end',
    context: 'Front-end work on the budgeting platform, paired with its backing services rather than handed off at the API boundary.', systems: ['plan4healthcare'] },
  { id: 'react', name: 'React', layer: 'frontend', weight: 2, role: 'Application front end',
    context: 'Component-driven interfaces — including this site.', systems: [] },

  // ---- quality -----------------------------------------------------------
  { id: 'junit', name: 'JUnit / Mockito', layer: 'quality', weight: 3, role: 'Automated testing',
    context: 'Coverage for new transform functions and, deliberately, their failure modes.', systems: ['phoenix'] },
  { id: 'bruno', name: 'Bruno', layer: 'quality', weight: 2, role: 'API regression',
    context: '18 regression collections exercising valid, boundary and rejection cases against the API surface.', systems: ['phoenix'] },
  { id: 'datadog', name: 'DataDog', layer: 'quality', weight: 2, role: 'Tracing & metrics',
    context: 'Instrumented the extraction services, then used the traces to decide what to optimise.', systems: ['foreseer'] },
  { id: 'grafana', name: 'Grafana', layer: 'quality', weight: 2, role: 'Dashboards',
    context: 'Visualisation layer over the service metrics.', systems: ['foreseer'] },
];
