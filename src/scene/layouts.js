import { v } from '../engine/vec';
import { edge, field, node, within } from './build';

/**
 * Four layouts, four silhouettes.
 *
 * The requirement is that hiding every label should still leave the four eras
 * distinguishable. Four node graphs in four colours would fail that, so each
 * layout has its own construction logic — how nodes are distributed, how long
 * the edges are, how much vertical extent it uses, and whether the payload
 * changes shape as it travels.
 *
 * Each takes a role's abstract `architecture` and returns scene geometry.
 */

/** Presence window for the i-th of n items, spread across the chapter. */
const step = (range, i, n, head = 0.5) => {
  const share = n > 1 ? i / (n - 1) : 0;
  return within(range, share * head, share * head + 0.22);
};

/**
 * SCATTER — Innovatechs, 2020.
 *
 * Islands on either side of an organisational boundary, connected by the only
 * genuinely long edges on the site. Wide, sparse and interrupted: the shape of
 * systems that have to talk to each other without sharing anything.
 */
export function scatter(arch, { id, origin, range, span = 300 }) {
  const far = arch.nodes.filter((n) => n.side === 'far');
  const boundary = arch.nodes.filter((n) => n.side === 'boundary');
  const near = arch.nodes.filter((n) => n.side === 'near');
  const nodes = [];
  const place = new Map();

  far.forEach((n, i) => {
    const p = v(origin.x - 52 + i * 14, origin.y + 14 - i * 9, origin.z - 40 - i * 46);
    place.set(n.id, p);
  });
  boundary.forEach((n, i) => {
    const p = v(origin.x - 2, origin.y + 2 + i * 6, origin.z - span * 0.42);
    place.set(n.id, p);
  });
  near.forEach((n, i) => {
    // Deliberately irregular — an integration estate is not a pipeline.
    const offsets = [
      [18, 10], [44, -4], [26, -18], [56, 16], [38, 2],
    ];
    const [ox, oy] = offsets[i % offsets.length];
    place.set(n.id, v(origin.x + ox, origin.y + oy, origin.z - span * 0.55 - i * 34));
  });

  arch.nodes.forEach((n, i) => {
    nodes.push(
      node(`${id}.${n.id}`, place.get(n.id), {
        label: n.label,
        stage: n.stage,
        size: n.side === 'boundary' ? 5 : 8,
        appear: step(range, i, arch.nodes.length),
        focus: within(range, 0.1 + (i / arch.nodes.length) * 0.7, 0.34 + (i / arch.nodes.length) * 0.7),
      }),
    );
  });

  return {
    nodes,
    edges: arch.edges.map(([a, b], i) =>
      edge(`${id}.${a}`, `${id}.${b}`, {
        flow: true,
        rate: 4,
        offset: i * 0.13,
        appear: step(range, i, arch.edges.length, 0.55),
      }),
    ),
    // The boundary itself: a vertical fence of points, crossed but never owned.
    fields: [
      field(`${id}.boundary`, v(origin.x - 2, origin.y - 22, origin.z - span * 0.42), {
        shape: 'grid',
        stage: 'engineering',
        cols: 1,
        rows: 16,
        gap: v(0, 4.4, 0),
        dim: 0.5,
        appear: within(range, 0.06, 0.3),
      }),
    ],
  };
}

/**
 * STACK — Covalience, 2023.
 *
 * One narrow column of tiers, top to bottom, with a delivery lane alongside.
 * Tall and regular where the previous era was wide and irregular: the shape of
 * a single product rather than a network of systems.
 */
export function stack(arch, { id, origin, range, span = 300 }) {
  const tiers = Math.max(...arch.nodes.map((n) => n.tier ?? 0)) || 1;
  const nodes = arch.nodes.map((n, i) => {
    const tier = n.tier ?? 0;
    const k = tier / tiers;
    // Lane items sit beside the column, not in it.
    const x = origin.x + (n.lane ? 34 : 0) + (n.tier === 5 && !n.lane ? (n.id === 'index' ? 22 : -22) : 0);
    return node(`${id}.${n.id}`, v(x, origin.y + 32 - tier * 11, origin.z - 30 - k * span * 0.8), {
      label: n.label,
      stage: n.stage,
      size: n.lane ? 6 : 9,
      appear: step(range, i, arch.nodes.length, 0.6),
      focus: within(range, 0.08 + k * 0.7, 0.3 + k * 0.7),
    });
  });

  return {
    nodes,
    edges: arch.edges.map(([a, b], i) =>
      edge(`${id}.${a}`, `${id}.${b}`, {
        flow: true,
        rate: 5,
        offset: i * 0.15,
        appear: step(range, i, arch.edges.length, 0.6),
      }),
    ),
    fields: [],
  };
}

/**
 * CONVEYOR — Foreseer-AI, 2024.
 *
 * One unbroken run, level with the camera, where the payload physically
 * changes form at each gate: prose becomes rows, rows become fragments,
 * fragments become fields, fields become a record. The form change is the
 * signature of this era, and it is what makes the chapter legible with the
 * labels off.
 */
export function conveyor(arch, { id, origin, range, span = 440 }) {
  const main = arch.nodes.filter((n) => !n.aside);
  const aside = arch.nodes.filter((n) => n.aside);
  const place = new Map();

  main.forEach((n, i) => {
    const k = i / Math.max(1, main.length - 1);
    place.set(n.id, v(origin.x - 30 + k * 62, origin.y + (n.dead ? -18 : 0), origin.z - 40 - k * span));
  });
  aside.forEach((n, i) => {
    const k = 0.25 + i * 0.22;
    place.set(n.id, v(origin.x + (n.below ? -44 : 30), origin.y + (n.below ? -26 : 24), origin.z - 40 - k * span));
  });

  const nodes = arch.nodes.map((n, i) => {
    const k = main.indexOf(n) >= 0 ? main.indexOf(n) / Math.max(1, main.length - 1) : 0.4;
    return node(`${id}.${n.id}`, place.get(n.id), {
      label: n.label,
      stage: n.stage,
      size: n.aside ? 6 : 9,
      appear: step(range, i, arch.nodes.length, 0.6),
      focus: within(range, 0.05 + k * 0.72, 0.26 + k * 0.72),
    });
  });

  // The payload, in each of its forms, sitting at the gate that produced it.
  const FORMS = {
    prose: { shape: 'rows', cols: 1, rows: 12, gap: v(0, -1.3, 0), width: 15, stage: 'data' },
    rows: { shape: 'rows', cols: 1, rows: 7, gap: v(0, -2, 0), width: 11, stage: 'data' },
    fragments: { shape: 'grid', cols: 5, rows: 4, gap: v(3, -2.4, 0), stage: 'engineering' },
    fields: { shape: 'rows', cols: 1, rows: 6, gap: v(0, -2.4, 0), width: 8, stage: 'intelligence' },
    record: { shape: 'grid', cols: 2, rows: 3, gap: v(5, -3.4, 0), stage: 'decision' },
  };

  const fields = arch.nodes
    .filter((n) => n.form && FORMS[n.form])
    .map((n, i) => {
      const p = place.get(n.id);
      return field(`${id}.${n.id}.form`, v(p.x - 4, p.y + 12, p.z - 6), {
        ...FORMS[n.form],
        appear: within(range, 0.08 + i * 0.16, 0.3 + i * 0.16),
      });
    });

  return {
    nodes,
    edges: arch.edges.map(([a, b], i) =>
      edge(`${id}.${a}`, `${id}.${b}`, {
        flow: true,
        rate: 6,
        offset: i * 0.11,
        appear: step(range, i, arch.edges.length, 0.62),
      }),
    ),
    fields,
  };
}

/**
 * CONTAINED — OI Pulse.
 *
 * Compact and bounded, the only object on the site you can see all of at once,
 * with the read path and the history path visibly diverging because that
 * divergence is the design decision the project turns on.
 */
export function contained(arch, { id, origin, range, span = 210 }) {
  const place = new Map();
  const spine = arch.nodes.filter((n) => !n.branch);
  const branches = arch.nodes.filter((n) => n.branch);

  spine.forEach((n, i) => {
    const k = i / Math.max(1, spine.length - 1);
    place.set(n.id, v(origin.x - 14 + Math.sin(k * Math.PI) * 10, origin.y + 12 - k * 20, origin.z - 30 - k * span));
  });
  branches.forEach((n) => {
    const up = n.branch === 'read';
    place.set(n.id, v(origin.x + (up ? 30 : -30), origin.y + (up ? 16 : -12), origin.z - 30 - span * 0.42));
  });

  const nodes = arch.nodes.map((n, i) =>
    node(`${id}.${n.id}`, place.get(n.id), {
      label: n.label,
      stage: n.stage,
      size: 8,
      appear: step(range, i, arch.nodes.length, 0.55),
      focus: within(range, 0.06 + (i / arch.nodes.length) * 0.72, 0.3 + (i / arch.nodes.length) * 0.72),
    }),
  );

  return {
    nodes,
    edges: arch.edges.map(([a, b], i) =>
      edge(`${id}.${a}`, `${id}.${b}`, {
        flow: true,
        rate: 6,
        offset: i * 0.12,
        appear: step(range, i, arch.edges.length, 0.6),
      }),
    ),
    // The chain itself, as a lattice of strikes.
    fields: [
      field(`${id}.lattice`, v(origin.x - 2, origin.y + 18, origin.z - span * 0.26), {
        shape: 'grid',
        stage: 'data',
        cols: 6,
        rows: 10,
        gap: v(3, -2.2, 0),
        appear: within(range, 0.1, 0.34),
      }),
    ],
  };
}

export const LAYOUTS = { scatter, stack, conveyor, contained };
