// The section registry. Drives the spine rail, the command palette and the
// scroll observer — add a section here and all three pick it up.
export const sections = [
  { id: 'signal', index: '00', label: 'Signal', title: 'Signal' },
  { id: 'thesis', index: '01', label: 'Thesis', title: 'Thesis' },
  { id: 'trajectory', index: '02', label: 'Trajectory', title: 'Trajectory' },
  { id: 'systems', index: '03', label: 'Systems', title: 'Systems' },
  { id: 'substrate', index: '04', label: 'Substrate', title: 'Substrate' },
  { id: 'intelligence', index: '05', label: 'Intelligence', title: 'Intelligence Layer' },
  { id: 'provenance', index: '06', label: 'Provenance', title: 'Provenance' },
  { id: 'channel', index: '07', label: 'Channel', title: 'Open Channel' },
];

// Sections rendered on the light ground — chrome inverts over these.
export const invertedSections = ['intelligence'];
