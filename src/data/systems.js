import { roleById } from './experience';
import { projectById } from './projects';
import { forMovement, movements, platform, visibleContributions } from './phoenix';
import { imagery } from './images';

/**
 * The case studies — four professional systems and one built independently.
 *
 * Composed from the career and project data rather than restated, so a change
 * to a role reaches its dossier automatically and the two can never drift.
 *
 * Ordered newest-first to match the trajectory. OI Pulse sits last and is
 * explicitly marked `independent`, because "I was assigned this" and "I chose
 * to build this" are different claims and the site should not blur them.
 */

const phoenix = roleById.phoenix;
const foreseer = roleById.foreseer;
const covalience = roleById.covalience;
const innovatechs = roleById.innovatechs;
const oiPulse = projectById['oi-pulse'];

/** Phoenix's cleared contributions, grouped by movement for the disclosure. */
const phoenixContributions = movements
  .filter((m) => forMovement(m.id).length > 0)
  .map((m) => ({
    movement: m.title,
    entries: forMovement(m.id).map((c) => `${c.title} — ${c.claim}`),
  }));

export const systems = [
  {
    id: 'phoenix',
    stage: 'engineering',
    images: imagery['phoenix'],
    index: '01',
    name: platform.name,
    kind: platform.kind,
    org: phoenix.org,
    period: phoenix.period,
    role: phoenix.role,
    current: true,
    diagram: 'SpecPipeline',
    problem: phoenix.problem,
    approach: phoenix.built,
    challenge: phoenix.complexity,
    outcome: phoenix.impact,
    // All fourteen cleared contributions, grouped — the registry reaches the page.
    contributions: phoenixContributions,
    contributionCount: visibleContributions.length,
    impact: [
      { label: 'Spec response time', value: '[NOT RETRIEVABLE]' },
      { label: 'Payload size', value: '[NOT RETRIEVABLE]' },
    ],
    stack: phoenix.technology,
  },

  {
    id: 'foreseer',
    stage: 'intelligence',
    images: imagery['foreseer'],
    index: '02',
    name: 'Foreseer-AI',
    kind: foreseer.kind,
    org: foreseer.org,
    period: foreseer.period,
    role: foreseer.role,
    diagram: 'DocumentFlow',
    problem: foreseer.problem,
    approach: foreseer.built,
    challenge: foreseer.complexity,
    outcome: foreseer.impact,
    impact: [
      { label: 'Throughput change', value: '[NOT RETRIEVABLE]' },
      { label: 'Extraction accuracy', value: '[NOT RETRIEVABLE]' },
    ],
    stack: foreseer.technology,
  },

  {
    id: 'plan4healthcare',
    stage: 'data',
    images: imagery['plan4healthcare'],
    index: '03',
    name: 'Plan4HealthCare',
    kind: covalience.kind,
    org: covalience.org,
    period: covalience.period,
    role: covalience.role,
    diagram: 'QueryPath',
    problem: covalience.problem,
    approach: covalience.built,
    challenge: covalience.complexity,
    outcome: covalience.impact,
    impact: [{ label: 'Query latency', value: '[NOT RETRIEVABLE]' }],
    stack: covalience.technology,
  },

  {
    id: 'doe',
    stage: 'engineering',
    images: imagery['doe'],
    index: '04',
    name: 'DOE Licensing Network',
    kind: innovatechs.kind,
    org: innovatechs.org,
    period: innovatechs.period,
    role: innovatechs.role,
    diagram: 'EdiBridge',
    problem: innovatechs.problem,
    approach: innovatechs.built,
    challenge: innovatechs.complexity,
    outcome: innovatechs.impact,
    impact: [{ label: 'Exchange reliability', value: '[NOT RETRIEVABLE]' }],
    stack: innovatechs.technology,
  },

  {
    id: 'oi-pulse',
    stage: 'decision',
    images: imagery['oi-pulse'],
    index: '05',
    name: oiPulse.name,
    kind: oiPulse.kind,
    org: oiPulse.ownership,
    period: oiPulse.status,
    independent: true,
    diagram: 'PulseFlow',
    problem: oiPulse.problem,
    approach: oiPulse.built,
    challenge: oiPulse.complexity,
    outcome: oiPulse.impact,
    // The decisions are the substance of this one — it is the project where the
    // reasoning, rather than the assignment, is the point.
    decisions: oiPulse.decisions,
    impact: [],
    stack: oiPulse.technology,
  },
];

export const systemById = Object.fromEntries(systems.map((s) => [s.id, s]));
