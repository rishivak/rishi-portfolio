export const profile = {
  name: 'Rishi Sharma',
  first: 'RISHI',
  last: 'SHARMA',

  // Résumé-accurate. Changing the band number is this one line.
  title: 'Senior Software Engineer III',
  role: 'Senior Backend & Full-Stack Engineer',
  discipline: 'Distributed Systems · Financial Data · APIs · AI Extraction',
  employer: 'S&P Global Market Intelligence',

  /**
   * Tenure wording appears in the hero, the experience section and the page
   * metadata. It lives here once so the three cannot disagree — "6+ years"
   * appears nowhere on the site, and the harness asserts that.
   */
  tenure: 'Nearly seven years',
  since: 2020,

  headline: 'I build the systems between data and decisions.',

  /** What the designation actually means, shown beneath the name. */
  expertise: ['Java', 'Distributed systems', 'Financial data', 'AI extraction'],

  // The hero cycles these. Each has to stand alone as a claim.
  statements: [
    'SYSTEMS THAT TURN DATA INTO DECISIONS',
    'DISTRIBUTED SYSTEMS FOR FINANCIAL DATA',
    'SYSTEMS THAT ANSWER, NOT JUST STORE',
  ],

  /** Positioning — the hero's three paragraphs. */
  positioning: [
    'I build backend systems that take complex data, process it reliably, and expose it through APIs, computations, and workflows that people can actually use.',
    'Nearly seven years of experience building Java systems across financial data, AI extraction, integrations, and full-stack platforms. I currently work at S&P Global Market Intelligence, where I build distributed systems for financial data and analytics.',
    'My strongest work sits at the boundary between data and software: API design, distributed computation, data transformations, asynchronous processing, and the correctness of the numbers moving through the system.',
  ],

  location: 'Jaipur, Rajasthan, India',
  timezone: 'IST · UTC+5:30',
  availability: 'Open to remote engagements',

  email: 'rishisharma1707@gmail.com',
  phone: '+91 876-435-8167',
  links: {
    linkedin: { label: 'linkedin.com/in/rishivak02', href: 'https://www.linkedin.com/in/rishivak02/' },
    github: { label: 'github.com/rishivak', href: 'https://github.com/rishivak' },
  },
  resume: 'Rishi_Sharma_Resume.pdf',

  /** The hero's primary links, in the order they should be offered. */
  primaryLinks: [
    { id: 'trajectory', label: 'Experience', to: 'trajectory' },
    { id: 'systems', label: 'Systems', to: 'systems' },
    { id: 'github', label: 'GitHub', external: 'https://github.com/rishivak' },
    { id: 'resume', label: 'Résumé', asset: 'Rishi_Sharma_Resume.pdf' },
    { id: 'channel', label: 'Contact', to: 'channel' },
  ],

  closing: 'Build something useful.',
  closingBody:
    'I am interested in engineering work involving backend systems, financial data, distributed processing, APIs, and AI-enabled data workflows.',

  // THESIS — the boundaries.
  thesis: [
    'The work is usually not where the framework is. It is in the boundaries.',
  ],
  boundaries: [
    'The boundary between an API contract and its implementation.',
    'The boundary between raw data and a trustworthy number.',
    'The boundary between one service and another.',
    'The boundary between a language model’s output and something a production system can safely accept.',
  ],
  boundaryClose: 'That is where I like to work.',
};
