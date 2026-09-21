/**
 * The section registry. Drives the spine rail, the command palette, the scroll
 * observer, the 3D world's readability budget and each section's stage colour —
 * add a section here and all five pick it up.
 *
 * `intensity` is the readability budget: how much of the viewport the 3D world
 * may claim while this section is being read. It scales the world's opacity, its
 * camera movement, its packet flow and its label count together. The hero gets
 * the full treatment because it is the first impression and there is nothing to
 * read yet; everything after it recedes, and the densest reading on the site —
 * the case studies — gets the quietest backdrop.
 *
 * `stage` is the section's *primary* stage. Descendants may declare their own
 * where they genuinely belong elsewhere: each case study inside Systems carries
 * its own, and a DECISION node inside an ENGINEERING diagram carries its own.
 *
 * Order is deliberate: who I am → where I have worked → what I built there →
 * how I think → what it is made of → how I approach AI → credentials → contact.
 * Professional experience leads; the case studies follow from it.
 */
export const sections = [
  { id: 'signal', index: '00', label: 'Signal', title: 'Signal', stage: 'decision', intensity: 1.0 },
  { id: 'trajectory', index: '01', label: 'Trajectory', title: 'Trajectory', stage: 'data', intensity: 0.4 },
  { id: 'systems', index: '02', label: 'Systems', title: 'Systems', stage: 'engineering', intensity: 0.22 },
  { id: 'thesis', index: '03', label: 'Thesis', title: 'Thesis', stage: 'intelligence', intensity: 0.25 },
  // Substrate runs its own canvas; the world behind it stays modest but present.
  { id: 'substrate', index: '04', label: 'Substrate', title: 'Substrate', stage: 'engineering', intensity: 0.45 },
  // The light ground — the world all but disappears here.
  { id: 'intelligence', index: '05', label: 'Intelligence', title: 'Intelligence', stage: 'intelligence', intensity: 0.18 },
  { id: 'provenance', index: '06', label: 'Provenance', title: 'Provenance', stage: 'data', intensity: 0.25 },
  { id: 'channel', index: '07', label: 'Channel', title: 'Channel', stage: 'decision', intensity: 0.3 },
];

export const invertedSections = ['intelligence'];

export const sectionById = Object.fromEntries(sections.map((s) => [s.id, s]));

export const intensityFor = (id) => sectionById[id]?.intensity ?? 0.25;
export const stageFor = (id) => sectionById[id]?.stage ?? 'engineering';
