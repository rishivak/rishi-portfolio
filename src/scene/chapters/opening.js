import { v } from '../../engine/vec';
import { chain, edge, field, node, within } from '../build';
import { chapters } from '../world';

const BOOT = chapters[0].range;
const DATA = chapters[1].range;
const ENG = chapters[2].range;

/**
 * BOOT — one node, alone, before anything runs.
 *
 * The first frame is deliberately almost empty. A visitor arriving on a
 * portfolio expects to be sold to; being shown a single unlit node instead is
 * the cheapest way to signal that this is something else.
 */
const boot = {
  nodes: [
    node('boot.data', v(0, 4, -150), {
      label: 'DATA',
      stage: 'data',
      size: 11,
      appear: [0, 0.006],
      focus: within(BOOT, 0.1, 1),
    }),
  ],
  edges: [],
};

/**
 * DATA — three genuinely different structures, not three cards.
 *
 * A document is a stack of lines with fields lifting out of it. An option
 * chain is a lattice of strike rows. A time series is a run of observations
 * along an axis. They have different shapes because they *are* different
 * shapes, and that is most of the point of this chapter.
 */
const data = {
  nodes: [
    node('data.doc', v(-26, 12, -212), {
      label: 'DOCUMENT',
      stage: 'data',
      size: 8,
      appear: within(DATA, 0.08, 0.3),
      focus: within(DATA, 0.15, 0.45),
    }),
    node('data.chain', v(0, -2, -236), {
      label: 'OPTION CHAIN',
      stage: 'data',
      size: 8,
      appear: within(DATA, 0.16, 0.38),
      focus: within(DATA, 0.25, 0.55),
    }),
    node('data.series', v(26, 9, -212), {
      label: 'TIME SERIES',
      stage: 'data',
      size: 8,
      appear: within(DATA, 0.24, 0.46),
      focus: within(DATA, 0.35, 0.65),
    }),

    // Where the three become one addressable thing.
    node('data.converge', v(0, 6, -300), {
      label: 'NORMALISED',
      stage: 'data',
      size: 10,
      appear: within(DATA, 0.62, 0.86),
      focus: within(DATA, 0.78, 1),
    }),
  ],

  edges: [
    edge('boot.data', 'data.doc', { stage: 'data', appear: within(DATA, 0.02, 0.2) }),
    edge('boot.data', 'data.chain', { stage: 'data', appear: within(DATA, 0.1, 0.28) }),
    edge('boot.data', 'data.series', { stage: 'data', appear: within(DATA, 0.18, 0.36) }),
    edge('data.doc', 'data.converge', { stage: 'data', flow: true, rate: 4, appear: within(DATA, 0.6, 0.8) }),
    edge('data.chain', 'data.converge', { stage: 'data', flow: true, rate: 4, offset: 0.33, appear: within(DATA, 0.64, 0.84) }),
    edge('data.series', 'data.converge', { stage: 'data', flow: true, rate: 4, offset: 0.66, appear: within(DATA, 0.68, 0.88) }),
  ],

  fields: [
    // Document: text lines, one column, tightly stacked.
    field('data.doc.lines', v(-26, 12, -212), {
      shape: 'rows',
      stage: 'data',
      cols: 1,
      rows: 11,
      gap: v(0, -1.5, 0),
      width: 13,
      appear: within(DATA, 0.1, 0.34),
    }),
    // Option chain: a lattice — strikes down, call/put across.
    field('data.chain.grid', v(0, -2, -236), {
      shape: 'grid',
      stage: 'data',
      cols: 6,
      rows: 9,
      gap: v(3.4, -1.7, 0),
      appear: within(DATA, 0.18, 0.42),
    }),
    // Series: observations along one axis, with varying height.
    field('data.series.obs', v(26, 9, -212), {
      shape: 'series',
      stage: 'data',
      cols: 22,
      rows: 1,
      gap: v(1.5, 0, 0),
      amplitude: 6,
      appear: within(DATA, 0.26, 0.5),
    }),
  ],
};

/**
 * ENGINEERING — the machinery. The API plane is a boundary you pass through,
 * not a box you look at, so it is a quad rather than a node.
 */
const enginePipeline = chain(
  [
    { id: 'api', label: 'API' },
    { id: 'process', label: 'PROCESSING' },
    { id: 'events', label: 'EVENTS' },
    { id: 'store', label: 'STORAGE' },
    { id: 'index', label: 'SEARCH INDEX' },
  ],
  {
    origin: v(0, 8, -400),
    step: v(0, -1.2, -34),
    range: ENG,
    stage: 'engineering',
    prefix: 'eng.',
    size: 9,
  },
);

const engineering = {
  nodes: [
    ...enginePipeline.nodes,
    // Cache sits beside the path — it is consulted, not passed through.
    node('eng.cache', v(-22, 12, -468), {
      label: 'CACHE',
      stage: 'engineering',
      size: 7,
      appear: within(ENG, 0.45, 0.68),
    }),
  ],
  edges: [
    ...enginePipeline.edges,
    edge('data.converge', 'eng.api', { stage: 'engineering', flow: true, rate: 4, appear: within(ENG, 0, 0.18) }),
    edge('eng.process', 'eng.cache', { stage: 'engineering', appear: within(ENG, 0.5, 0.7) }),
    edge('eng.cache', 'eng.process', { stage: 'engineering', flow: true, rate: 7, appear: within(ENG, 0.56, 0.76) }),
  ],
  fields: [],
};

export const openingScene = {
  nodes: [...boot.nodes, ...data.nodes, ...engineering.nodes],
  edges: [...boot.edges, ...data.edges, ...engineering.edges],
  fields: [...data.fields, ...engineering.fields],
};
