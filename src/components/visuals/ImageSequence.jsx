import { useCallback, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useIsMobile } from '../../lib/useMediaQuery';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * A case study's visual, as a fixed frame whose contents advance with scroll.
 *
 * The frame itself never moves. It lives in the dossier's right column, holds
 * position for the length of the left column, and only the thing *inside* it
 * cross-fades. Nothing here animates position, order or column — the one
 * animated property is opacity.
 *
 * Frame 0 is the architecture diagram, and the screenshots follow it. The
 * diagram explains the system; the screenshots only show its surface, so it
 * earns first place and more dwell time. There is no hard-coded count: the
 * frame list is built from what the data supplies.
 *
 *   no diagram, no images  → renders nothing at all
 *   one frame              → shown statically, no indicators, no live region
 *   N frames               → scroll-advanced, with indicators and announcements
 *
 * Progress comes from the parent dossier via `trackRef` rather than from a
 * scroll track of its own, so the frame is driven by the text beside it and the
 * site keeps one scroll position driving everything.
 *
 * Under reduced motion and on mobile it degrades to a plain captioned list
 * rather than a frozen pane, because a sticky scroll-driven frame that cannot
 * advance is worse than no frame.
 */
export function ImageSequence({ diagram: Diagram, images, label, trackRef }) {
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const shots = images ?? [];
  // Architecture first, imagery after. Order is the contract, not a detail.
  const frames = Diagram ? [{ kind: 'diagram', key: 'architecture' }, ...shots] : shots;
  const total = frames.length;

  const stacked = mobile || reduced || total <= 1;

  // The dossier's own progress picks the frame. No timers, no second scroll track.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (stacked || total < 2) return;
    const next = Math.min(total - 1, Math.max(0, Math.floor(p * total)));
    setIndex((cur) => (cur === next ? cur : next));
  });

  const onKeyDown = useCallback(
    (event) => {
      const map = {
        ArrowRight: index + 1,
        ArrowDown: index + 1,
        ArrowLeft: index - 1,
        ArrowUp: index - 1,
        Home: 0,
        End: total - 1,
      };
      if (!(event.key in map)) return;
      event.preventDefault();
      setIndex(Math.max(0, Math.min(total - 1, map[event.key])));
    },
    [index, total],
  );

  // Nothing supplied at all: render nothing.
  if (!total) return null;

  const captionOf = (frame, i) =>
    frame.kind === 'diagram' ? 'Architecture' : `Image ${i} of ${shots.length} — ${frame.alt}`;

  const groupLabel = `${label} — architecture and ${
    shots.length === 1 ? 'one screenshot' : `${shots.length} screenshots`
  }`;

  const architecture = (
    <div className="flex h-full w-full items-center justify-center bg-surface p-6 sm:p-10">
      {Diagram ? <Diagram /> : null}
    </div>
  );

  // ---- stacked: mobile, reduced motion, or a single frame -----------------
  if (stacked) {
    return (
      <div className="grid gap-6">
        {Diagram ? (
          <figure>
            <figcaption className="meta mb-3">Architecture</figcaption>
            <div className="border border-hair bg-surface p-6 sm:p-10">
              <Diagram />
            </div>
          </figure>
        ) : null}

        {shots.length ? (
          <figure aria-label={`${label} — screenshots`}>
            <figcaption className="meta mb-3">
              {shots.length === 1 ? 'Screenshot' : `Screenshots · ${shots.length}`}
            </figcaption>
            <ol className="grid gap-6">
              {shots.map((img, i) => (
                <li key={img.src}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.w}
                    height={img.h}
                    loading="lazy"
                    decoding="async"
                    className="w-full border border-hair"
                  />
                  <p className="meta mt-2">
                    {shots.length > 1 ? `Image ${i + 1} of ${shots.length} · ` : ''}
                    {img.alt}
                  </p>
                </li>
              ))}
            </ol>
          </figure>
        ) : null}
      </div>
    );
  }

  // ---- scroll-advanced -----------------------------------------------------
  // One fixed aspect for every frame, taken from the first screenshot, so the
  // frame's box is identical whichever frame is showing and the column cannot
  // reflow as the contents change.
  const ratio = shots.length ? `${shots[0].w} / ${shots[0].h}` : '16 / 10';

  return (
    <div>
      <div
        role="group"
        aria-label={groupLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative block w-full overflow-hidden border border-hair"
        style={{ aspectRatio: ratio }}
      >
        {frames.map((frame, i) => (
          <motion.div
            key={frame.kind === 'diagram' ? frame.key : frame.src}
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.32 }}
            className="absolute inset-0 h-full w-full"
            // Only the visible frame is exposed to assistive tech; the rest
            // would otherwise be announced as a pile of unrelated figures.
            aria-hidden={i !== index}
          >
            {frame.kind === 'diagram' ? (
              architecture
            ) : (
              <img
                src={frame.src}
                alt={frame.alt}
                width={frame.w}
                height={frame.h}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-top"
              />
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="meta" aria-live="polite">
          {captionOf(frames[index], index)}
        </p>

        <ol className="flex shrink-0 gap-2" aria-label="Choose a frame">
          {frames.map((frame, i) => (
            <li key={frame.kind === 'diagram' ? frame.key : frame.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? 'true' : undefined}
                aria-label={frame.kind === 'diagram' ? 'Architecture' : `Image ${i} of ${shots.length}`}
                className="block h-1.5 w-7 transition-colors duration-1 ease-out"
                style={{ background: i === index ? 'var(--stage)' : 'var(--hair-2)' }}
              />
            </li>
          ))}
        </ol>
      </div>

      <p className="meta mt-2">Scroll, or use the arrow keys</p>
    </div>
  );
}
