/**
 * Five principles. Each one carries an `anchor` — a specific decision from the
 * work on this site that demonstrates it. The anchor is the whole point: it is
 * what separates an engineering principle from a motivational quote.
 */
export const principles = [
  {
    id: 'clarity',
    n: '01',
    title: 'Build for clarity.',
    body: 'When two things behave differently, their differences should be visible in the design rather than hidden inside duplicated code. Shared abstractions should remove duplication without removing meaning.',
    anchor: 'Two near-identical admin and user handlers were consolidated onto shared abstract base handlers — the difference between them became explicit instead of being duplicated twice and drifting.',
  },
  {
    id: 'trust',
    n: '02',
    title: 'Make data trustworthy.',
    body: 'A financial system should not quietly return a plausible number when the inputs or specification are invalid. Validation should happen as early as possible, and numerical behaviour should be explicit.',
    anchor: 'Specification fragments are now validated at boot. An invalid fragment stops the application from starting rather than surfacing as a runtime error three layers downstream.',
  },
  {
    id: 'automate',
    n: '03',
    title: 'Move repetitive work into the system.',
    body: 'Manual deployment steps, repeated checks, and synchronous hand-offs are all signals that a process belongs in software.',
    anchor: 'Release for a microservice estate went from a coordinated manual exercise to an Azure DevOps pipeline run, with 18 Bruno regression collections covering the API surface that used to be checked by hand.',
  },
  {
    id: 'change',
    n: '04',
    title: 'Design for change.',
    body: 'Types, contracts, validation, and tests should make incorrect future changes difficult to introduce. The best failure is often the one caught by the compiler or test suite rather than production.',
    anchor: 'Replacing string-typed frequency with a domain type across the calling path turned a class of runtime surprise into a compile error, so the next change to it fails at build time.',
  },
  {
    id: 'ai',
    n: '05',
    title: 'AI has to earn its place.',
    body: 'A model is only one component. Documents still need normalisation before extraction, outputs need validation afterwards, and the system needs to know when not to trust the answer.',
    anchor: 'In document extraction the model was never the hard part. Normalisation before it and validation after it are what made the output usable — a field that cannot be verified is rejected rather than guessed.',
  },
];
