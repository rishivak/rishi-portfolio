import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { MotionConfig, useScroll } from 'framer-motion';
import { invertedSections, sections } from './data/nav';
import { useSectionObserver } from './lib/useSectionObserver';
import { SkipLink } from './components/chrome/SkipLink';
import { GridOverlay } from './components/chrome/GridOverlay';
import { Masthead } from './components/chrome/Masthead';
import { Spine } from './components/chrome/Spine';
import { Telemetry } from './components/chrome/Telemetry';
import { Cursor } from './components/chrome/Cursor';
import { Stage } from './components/stage/Stage';
import { Signal } from './components/sections/Signal';

// Only the hero and the world ship in the initial chunk.
const Thesis = lazy(() => import('./components/sections/Thesis').then((m) => ({ default: m.Thesis })));
const Trajectory = lazy(() => import('./components/sections/Trajectory').then((m) => ({ default: m.Trajectory })));
const Systems = lazy(() => import('./components/sections/Systems').then((m) => ({ default: m.Systems })));
const Substrate = lazy(() => import('./components/sections/Substrate').then((m) => ({ default: m.Substrate })));
const Intelligence = lazy(() => import('./components/sections/Intelligence').then((m) => ({ default: m.Intelligence })));
const Provenance = lazy(() => import('./components/sections/Provenance').then((m) => ({ default: m.Provenance })));
const Channel = lazy(() => import('./components/sections/Channel').then((m) => ({ default: m.Channel })));
const Footer = lazy(() => import('./components/sections/Footer').then((m) => ({ default: m.Footer })));

const CommandPalette = lazy(() =>
  import('./components/chrome/CommandPalette').then((m) => ({ default: m.CommandPalette })),
);
const KeymapSheet = lazy(() =>
  import('./components/chrome/KeymapSheet').then((m) => ({ default: m.KeymapSheet })),
);
const ArchitectureMode = lazy(() =>
  import('./components/chrome/ArchitectureMode').then((m) => ({ default: m.ArchitectureMode })),
);

const sectionIds = sections.map((s) => s.id);

const isTyping = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [keymap, setKeymap] = useState(false);
  const [architecture, setArchitecture] = useState(false);
  const [progress, setProgress] = useState(0);

  const active = useSectionObserver(sectionIds);
  const { scrollYProgress } = useScroll();

  useEffect(() => scrollYProgress.on('change', setProgress), [scrollYProgress]);

  // One boolean the whole chrome reads, so nothing disappears into the paper
  // section — and the world's scrim knows to cover itself there.
  const inverted = invertedSections.includes(active);

  const toggleArchitecture = useCallback(() => setArchitecture((v) => !v), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    const onKey = (event) => {
      const k = event.key.toLowerCase();
      if (k === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;

      if (event.key === '?') {
        event.preventDefault();
        setKeymap((v) => !v);
      } else if (k === 'a') {
        event.preventDefault();
        toggleArchitecture();
      } else if (event.key === 'Escape') {
        setArchitecture(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleArchitecture]);

  const hint = useMemo(
    () => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K'),
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <SkipLink />

      {/* The world sits at z-0, beneath everything, composed to the right of
          the content column. */}
      <Stage activeSection={active} inverted={inverted} />

      <GridOverlay inverted={inverted} />
      <Masthead onOpenPalette={() => setPaletteOpen(true)} inverted={inverted} hint={hint} />
      <Spine active={active} progress={progress} inverted={inverted} />
      <Telemetry active={active} progress={progress} inverted={inverted} />
      <Cursor />

      <main id="main" className="relative z-10 lg:pl-rail">
        <Signal />
        <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
          {/* Experience leads; the case studies follow from it. */}
          <Trajectory />
          <Systems />
          <Thesis />
          <Substrate />
          <Intelligence />
          <Provenance />
          <Channel />
          <Footer />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {paletteOpen ? (
          <CommandPalette
            open={paletteOpen}
            onClose={closePalette}
            onToggleArchitecture={toggleArchitecture}
          />
        ) : null}
        {keymap ? <KeymapSheet open={keymap} onClose={() => setKeymap(false)} /> : null}
        {architecture ? <ArchitectureMode on={architecture} /> : null}
      </Suspense>
    </MotionConfig>
  );
}
