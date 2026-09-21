/**
 * Independent engineering — systems designed, built and operated solo.
 *
 * Shaped like a role in experience.js so the same chapter machinery renders
 * both, but held separately because the distinction matters: professional work
 * is work you were assigned, and this is work you chose.
 */
export const projects = [
  {
    id: 'oi-pulse',
    name: 'OI Pulse',
    kind: 'Options-market intelligence',
    ownership: 'Independent engineering — designed, built and operated solo',
    status: 'Built and running',
    stage: 'decision',
    silhouette: 'A contained system you can see all of at once',

    thesis:
      'Open interest tells you where the market has committed money. A broker screen shows the level; the number that matters is the change, and nobody stores the previous reading for you.',

    problem:
      'An option chain on a broker screen is a snapshot with no memory. To read a build-up you need the prior snapshot, the diff per strike, and a classification of what the change means — none of which the feed gives you.',
    built:
      'A scheduled collector authenticating against the broker API over OAuth, persisting the chain on a cadence, diffing each strike against the previous snapshot, and pushing the computed read to the browser over server-sent events.',
    complexity:
      'Rate limits and market hours make the collection schedule a design constraint rather than a configuration value. Snapshot too often and you are throttled; too rarely and the delta is too coarse to read anything from.',

    decisions: [
      {
        title: 'Persist snapshots, do not stream ticks',
        body: 'Open interest moves slowly relative to price. Storing every tick would cost more and say nothing extra, so collection runs on a schedule tuned to how fast the underlying number actually changes.',
      },
      {
        title: 'Split the read path from the history path',
        body: 'The live chain is served from Redis; history is queried from MySQL. Two access patterns with genuinely different shapes, so two stores rather than one compromise.',
      },
      {
        title: 'Push a conclusion, not a dataset',
        body: 'The diff and the classification are computed server-side and delivered over SSE. The browser receives an answer instead of polling for rows to reduce itself.',
      },
      {
        title: 'OAuth against the broker, not stored credentials',
        body: 'Token exchange and refresh handled in the collector, so the running system holds a short-lived grant rather than a password.',
      },
    ],

    impact: [
      'A running system that collects the chain, retains history, and computes open-interest change per strike.',
      'Real-time dashboard updates over SSE without client polling.',
      'Build-up classification per strike derived from the snapshot diff.',
    ],

    technology: ['Java', 'Spring Boot', 'Upstox API', 'OAuth', 'Redis', 'MySQL', 'Server-sent events', 'Scheduled collection', 'React'],

    architecture: {
      layout: 'contained',
      note: 'Two divergent paths, because the read and the history want different things.',
      nodes: [
        { id: 'upstox', label: 'UPSTOX · OAUTH', stage: 'data', tech: 'OAuth' },
        { id: 'chain', label: 'OPTION CHAIN', stage: 'data', form: 'lattice' },
        { id: 'scheduler', label: 'SCHEDULED COLLECTION', stage: 'engineering' },
        { id: 'cache', label: 'REDIS — LIVE', stage: 'engineering', branch: 'read', tech: 'Redis' },
        { id: 'store', label: 'MYSQL — HISTORY', stage: 'engineering', branch: 'history', tech: 'MySQL' },
        { id: 'delta', label: 'OI CHANGE', stage: 'intelligence' },
        { id: 'analysis', label: 'ANALYSIS', stage: 'intelligence' },
        { id: 'sse', label: 'SSE', stage: 'decision' },
        { id: 'dashboard', label: 'DASHBOARD', stage: 'decision', tech: 'React' },
      ],
      edges: [
        ['upstox', 'chain'],
        ['chain', 'scheduler'],
        ['scheduler', 'cache'],
        ['scheduler', 'store'],
        ['cache', 'delta'],
        ['store', 'delta'],
        ['delta', 'analysis'],
        ['analysis', 'sse'],
        ['sse', 'dashboard'],
      ],
    },

    // Awaiting a repo / live URL. Nothing renders until one is supplied.
    links: {},
  },
];

export const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
