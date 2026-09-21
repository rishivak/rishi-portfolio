import { v } from '../../engine/vec';
import { edge, node, within } from '../build';
import { chapters, waypoints } from '../world';
import { roleById } from '../../data/experience';
import { projectById } from '../../data/projects';
import { conveyor, contained, scatter, stack } from '../layouts';

/**
 * The career, laid into the world.
 *
 * Each post is built from its own `architecture` in src/data/experience.js
 * through the layout that matches its silhouette, so adding a role is a data
 * change plus one line here — and the era stays visually distinct because the
 * layout, not the label, is what distinguishes it.
 */
const chapterFor = (id) => chapters.find((c) => c.id === id);

/* ── BOOT ─────────────────────────────────────────────────────────────────
   The whole career is visible before the camera moves. Four markers receding
   down the corridor, each one a place you are about to travel to — the map
   and the employment history in the same object. */
const bootMarkers = {
  nodes: waypoints.map((w, i) =>
    node(`wp.${w.id}`, v(i % 2 === 0 ? -16 - i * 5 : 16 + i * 5, 10 - i * 2, -120 - i * 78), {
      label: `${w.year} · ${w.code}`,
      stage: ['data', 'engineering', 'intelligence', 'decision'][i],
      size: 9,
      appear: [0.004 + i * 0.006, 0.02 + i * 0.008],
      // They fade as you reach the career proper — their job was the preview.
      vanish: [0.055 + i * 0.05, 0.085 + i * 0.05],
      focus: [0.01, 0.055],
    }),
  ),
  edges: waypoints.slice(1).map((w, i) =>
    edge(`wp.${waypoints[i].id}`, `wp.${w.id}`, {
      stage: 'engineering',
      appear: [0.012 + i * 0.006, 0.03 + i * 0.008],
      vanish: [0.055 + i * 0.05, 0.085 + i * 0.05],
    }),
  ),
  fields: [],
};

/* ── THE FOUR POSTS ───────────────────────────────────────────────────────
   Phoenix is not here: it keeps its own bespoke seven-movement scene, which
   is the one environment complex enough to be worth hand-authoring. */
const origin = scatter(roleById.innovatechs.architecture, {
  id: 'ori',
  origin: v(0, 8, -70),
  range: chapterFor('origin').range,
  span: 290,
});

const product = stack(roleById.covalience.architecture, {
  id: 'pro',
  origin: v(0, 6, -360),
  range: chapterFor('product').range,
  span: 290,
});

const intelligence = conveyor(roleById.foreseer.architecture, {
  id: 'fs',
  origin: v(0, 9, -650),
  range: chapterFor('intelligence').range,
  span: 430,
});

const lab = contained(projectById['oi-pulse'].architecture, {
  id: 'oi',
  origin: v(0, 8, -1900),
  range: chapterFor('lab').range,
  span: 250,
});

/* Hand-offs, so the world stays one connected system rather than four sets. */
const seams = [
  edge('wp.origin', 'ori.partner', { stage: 'data', appear: within(chapterFor('origin').range, 0, 0.12) }),
  edge('ori.s3', 'pro.user', { stage: 'engineering', appear: within(chapterFor('product').range, 0, 0.12) }),
  edge('pro.sql', 'fs.document', { stage: 'data', appear: within(chapterFor('intelligence').range, 0, 0.12) }),
  edge('fs.index', 'px.spine.client', { stage: 'engineering', appear: within(chapterFor('financial').range, 0, 0.1) }),
  edge('px.ok.compute', 'oi.upstox', { stage: 'decision', appear: within(chapterFor('lab').range, 0, 0.12) }),
];

export const careerScene = {
  nodes: [...bootMarkers.nodes, ...origin.nodes, ...product.nodes, ...intelligence.nodes, ...lab.nodes],
  edges: [
    ...bootMarkers.edges,
    ...origin.edges,
    ...product.edges,
    ...intelligence.edges,
    ...lab.edges,
    ...seams,
  ],
  fields: [...origin.fields, ...product.fields, ...intelligence.fields, ...lab.fields],
};
