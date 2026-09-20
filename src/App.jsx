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
import { CommandPalette } from './components/chrome/CommandPalette';
import { Signal } from './components/sections/Signal';

// The hero ships in the initial chunk; everything below the fold is split out.
const Thesis = lazy(() => import('./components/sections/Thesis').then((m) => ({ default: m.Thesis })));
const Trajectory = lazy(() => import('./components/sections/Trajectory').then((m) => ({ default: m.Trajectory })));
const Systems = lazy(() => import('./components/sections/Systems').then((m) => ({ default: m.Systems })));
const Substrate = lazy(() => import('./components/sections/Substrate').then((m) => ({ default: m.Substrate })));
const Intelligence = lazy(() => import('./components/sections/Intelligence').then((m) => ({ default: m.Intelligence })));
const Provenance = lazy(() => import('./components/sections/Provenance').then((m) => ({ default: m.Provenance })));
const Channel = lazy(() => import('./components/sections/Channel').then((m) => ({ default: m.Channel })));
const Footer = lazy(() => import('./components/sections/Footer').then((m) => ({ default: m.Footer })));

const sectionIds = sections.map((s) => s.id);

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const active = useSectionObserver(sectionIds);
  const { scrollYProgress } = useScroll();

  useEffect(() => scrollYProgress.on('change', setProgress), [scrollYProgress]);

  // ⌘K / Ctrl-K anywhere, except while typing.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The chrome inverts over the light section so it never disappears into it.
  const inverted = invertedSections.includes(active);

  const hint = useMemo(
    () => (typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K'),
    [],
  );

  const closePalette = useCallback(() => setPaletteOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <SkipLink />
      <GridOverlay inverted={inverted} />
      <Masthead onOpenPalette={() => setPaletteOpen(true)} inverted={inverted} hint={hint} />
      <Spine active={active} progress={progress} inverted={inverted} />
      <Telemetry active={active} progress={progress} inverted={inverted} />
      <Cursor />
      <CommandPalette open={paletteOpen} onClose={closePalette} />

      <main id="main" className="relative lg:pl-rail">
        <Signal />
        <Suspense fallback={<div className="min-h-svh" aria-hidden="true" />}>
          <Thesis />
          <Trajectory />
          <Systems />
          <Substrate />
          <Intelligence />
          <Provenance />
          <Channel />
          <Footer />
        </Suspense>
      </main>
    </MotionConfig>
  );
}
