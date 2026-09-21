import { experience } from './experience';

/**
 * The trajectory track, derived from the career rather than duplicated.
 *
 * `experience.js` is the single source of truth and is ordered newest-first, so
 * the track reads NOW → 2020. This module only reshapes it into what the
 * Trajectory section wants, and carries the richer prose through as `detail`
 * for the card's disclosure — visible on request, not dumped into the card.
 */
export const timeline = experience.map((role) => ({
  id: role.id,
  index: role.year,
  current: Boolean(role.current),
  org: role.org,
  role: role.role,
  place: role.place,
  period: role.period,
  system: role.system,
  kind: role.kind,
  summary: role.summary,
  stack: role.technology,

  // Behind the disclosure. Four questions, asked identically of every post so
  // they can be compared rather than merely read.
  detail: [
    { label: 'Problem', body: role.problem },
    { label: 'What I built', body: role.built },
    { label: 'What made it hard', body: role.complexity },
  ],
  impact: role.impact ?? [],
}));

/** The track runs present → past; the labels say so rather than implying it. */
export const trackEnds = {
  from: 'Now',
  to: experience[experience.length - 1]?.year ?? '',
};
