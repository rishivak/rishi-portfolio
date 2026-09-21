/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Tokens live in src/styles/tokens.css; Tailwind only re-exposes them.
    extend: {
      colors: {
        void: 'var(--void)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        bone: 'var(--bone)',
        'bone-2': 'var(--bone-2)',
        'bone-3': 'var(--bone-3)',
        signal: 'var(--signal)',
        'signal-2': 'var(--signal-2)',
        'signal-dim': 'var(--signal-dim)',
        'signal-ghost': 'var(--signal-ghost)',
        // The stage spectrum. `stage` follows the nearest [data-stage].
        stage: 'var(--stage)',
        'stage-text': 'var(--stage-text)',
        'stage-w': 'var(--stage-w)',
        data: 'var(--s-data)',
        'data-text': 'var(--s-data-text)',
        eng: 'var(--s-eng)',
        intel: 'var(--s-intel)',
        decide: 'var(--s-decide)',
        'paper-ink': 'var(--paper-ink)',
        'paper-ink-2': 'var(--paper-ink-2)',
        'paper-ink-3': 'var(--paper-ink-3)',
        // Also exposed as colours so `bg-hair` works, not just `border-hair`.
        hair: 'var(--hair)',
        'hair-2': 'var(--hair-2)',
      },
      borderColor: {
        stage: 'var(--stage)',
        hair: 'var(--hair)',
        'hair-2': 'var(--hair-2)',
        'paper-hair': 'var(--paper-hair)',
        'paper-hair-2': 'var(--paper-hair-2)',
      },
      fontFamily: {
        display: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        mega: ['var(--t-mega)', { lineHeight: '0.82', letterSpacing: '-0.045em' }],
        display: ['var(--t-display)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        h2: ['var(--t-h2)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        h3: ['var(--t-h3)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
        lead: ['var(--t-lead)', { lineHeight: '1.6' }],
        body: ['var(--t-body)', { lineHeight: '1.7' }],
        meta: ['var(--t-meta)', { lineHeight: '1.2', letterSpacing: '0.14em' }],
      },
      spacing: {
        gutter: 'var(--gutter)',
        rail: 'var(--rail)',
        band: 'var(--band)',
      },
      maxWidth: {
        shell: 'var(--shell)',
        measure: 'var(--measure)',
      },
      transitionTimingFunction: {
        out: 'var(--e-out)',
        io: 'var(--e-io)',
      },
      transitionDuration: {
        1: '140ms',
        2: '320ms',
        3: '680ms',
      },
      boxShadow: {
        lift: 'var(--lift)',
      },
    },
  },
  plugins: [],
};
