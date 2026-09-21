import { v } from '../../engine/vec';
import { edge, node, within } from '../build';
import { chapters } from '../world';

const EN = chapters.find((c) => c.id === 'engineer').range;
const CT = chapters.find((c) => c.id === 'contact').range;

/* ── HOW I ENGINEER ───────────────────────────────────────────────────────
   The camera pulls back and the concepts appear as a constellation — but the
   nodes here are not new claims. They are the practices the visitor has
   already watched operate across four eras, named at last. */
const engineer = {
  nodes: [
    node('en.design', v(0, 22, -2200), { label: 'SYSTEM DESIGN', stage: 'engineering', size: 9, appear: within(EN, 0.02, 0.2), focus: within(EN, 0.1, 0.4) }),
    node('en.contract', v(-30, 14, -2224), { label: 'API CONTRACT', stage: 'engineering', size: 7, appear: within(EN, 0.1, 0.28) }),
    node('en.model', v(30, 14, -2224), { label: 'DATA MODEL', stage: 'data', size: 7, appear: within(EN, 0.14, 0.32) }),
    node('en.async', v(-44, 2, -2252), { label: 'ASYNC PROCESSING', stage: 'engineering', size: 6, appear: within(EN, 0.2, 0.38) }),
    node('en.dist', v(-16, -2, -2260), { label: 'DISTRIBUTED COMPUTATION', stage: 'engineering', size: 7, appear: within(EN, 0.24, 0.42) }),
    node('en.cache', v(16, -2, -2260), { label: 'CACHING · SEARCH', stage: 'data', size: 6, appear: within(EN, 0.28, 0.46) }),
    node('en.ai', v(44, 2, -2252), { label: 'AI EXTRACTION', stage: 'intelligence', size: 6, appear: within(EN, 0.32, 0.5) }),
    node('en.finance', v(-30, -16, -2292), { label: 'FINANCIAL COMPUTATION', stage: 'intelligence', size: 7, appear: within(EN, 0.4, 0.58) }),
    node('en.correct', v(0, -20, -2300), { label: 'CORRECTNESS', stage: 'intelligence', size: 8, appear: within(EN, 0.46, 0.64), focus: within(EN, 0.56, 0.84) }),
    node('en.observe', v(30, -16, -2292), { label: 'OBSERVABILITY', stage: 'decision', size: 6, appear: within(EN, 0.5, 0.68) }),
    node('en.test', v(0, -32, -2330), { label: 'TESTING', stage: 'decision', size: 7, appear: within(EN, 0.58, 0.76) }),
  ],
  edges: [
    edge('en.design', 'en.contract', { stage: 'engineering', flow: true, rate: 3, appear: within(EN, 0.08, 0.24) }),
    edge('en.design', 'en.model', { stage: 'data', flow: true, rate: 3, offset: 0.3, appear: within(EN, 0.12, 0.28) }),
    edge('en.contract', 'en.async', { stage: 'engineering', appear: within(EN, 0.2, 0.36) }),
    edge('en.contract', 'en.dist', { stage: 'engineering', appear: within(EN, 0.24, 0.4) }),
    edge('en.model', 'en.cache', { stage: 'data', appear: within(EN, 0.28, 0.44) }),
    edge('en.model', 'en.ai', { stage: 'intelligence', appear: within(EN, 0.32, 0.48) }),
    edge('en.dist', 'en.finance', { stage: 'intelligence', appear: within(EN, 0.4, 0.56) }),
    edge('en.finance', 'en.correct', { stage: 'intelligence', flow: true, rate: 4, appear: within(EN, 0.46, 0.62) }),
    edge('en.ai', 'en.correct', { stage: 'intelligence', appear: within(EN, 0.48, 0.64) }),
    edge('en.correct', 'en.observe', { stage: 'decision', appear: within(EN, 0.52, 0.68) }),
    edge('en.correct', 'en.test', { stage: 'decision', flow: true, rate: 4, appear: within(EN, 0.58, 0.74) }),
  ],
  fields: [],
};

/* ── CONTACT ──────────────────────────────────────────────────────────────
   Everything dissolves. One node in an empty space, after eight chapters of
   density, is the emphasis. */
const contact = {
  nodes: [
    node('ct.resolved', v(0, 8, -2420), {
      label: 'DECISION',
      stage: 'decision',
      size: 13,
      appear: within(CT, 0.08, 0.36),
      focus: within(CT, 0.25, 1),
    }),
  ],
  edges: [
    edge('en.test', 'ct.resolved', {
      stage: 'decision',
      flow: true,
      rate: 2,
      appear: within(CT, 0.02, 0.2),
      vanish: within(CT, 0.5, 0.78),
    }),
  ],
  fields: [],
};

export const closingScene = {
  nodes: [...engineer.nodes, ...contact.nodes],
  edges: [
    ...engineer.edges,
    ...contact.edges,
    edge('oi.dashboard', 'en.design', { stage: 'engineering', appear: within(EN, 0, 0.12) }),
  ],
  fields: [],
};
