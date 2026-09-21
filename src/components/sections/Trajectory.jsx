import { useCallback, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { timeline, trackEnds } from '../../data/timeline';
import { Section } from '../primitives/Section';
import { stageFor, sectionById } from '../../data/nav';
import { Kicker } from '../primitives/Kicker';
import { TechTokens } from '../primitives/TechToken';
import { EASE_OUT, ONCE, rise } from '../../lib/motion';
import { useIsMobile } from '../../lib/useMediaQuery';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * 01 — TRAJECTORY.
 *
 * The career, newest first. The track runs present → past, which is the order
 * a visitor actually wants: what is he doing now, and how did he get here.
 * The direction is labelled rather than implied.
 *
 * The one pinned section on the site, and bounded: it releases after a single
 * pass, never intercepts the wheel, and falls back to a vertical stack on
 * mobile and under reduced motion — which is the real content for those users.
 *
 * Each card leads with a one-line summary. The problem, what was built and what
 * was hard sit behind a disclosure, so four roles of depth do not become four
 * walls of text.
 */

function Post({ post, compact = false }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article
      className={
        compact
          ? 'border-l border-hair pl-6'
          : 'flex w-[min(88vw,32rem)] shrink-0 flex-col border-l border-hair pl-8'
      }
    >
      <header>
        <p className="flex items-baseline gap-3">
          <span
            className="font-display text-[clamp(2.75rem,5vw,4.5rem)] leading-none axis-narrow"
            style={{ color: post.current ? 'var(--signal)' : 'var(--bone-3)' }}
          >
            {post.index}
          </span>
          {post.current ? (
            <span className="meta" style={{ color: 'var(--signal)' }}>
              Present
            </span>
          ) : null}
        </p>

        <h3 className="mt-5 font-display text-h3" style={{ color: 'var(--bone)' }}>
          {post.role}
        </h3>
        <p className="meta mt-2" style={{ color: 'var(--bone-2)' }}>
          {post.org}
        </p>
        <p className="meta mt-1">
          {post.period} · {post.place}
        </p>
      </header>

      <p className="mt-6 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--signal-2)' }}>
        {post.system}
      </p>

      <p className="mt-3 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--bone-2)' }}>
        {post.summary}
      </p>

      {/* Depth on request. The same three questions for every post. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        data-cursor={open ? 'Close' : 'Open'}
        className="meta mt-6 flex w-full items-center justify-between border-y border-hair py-3 transition-colors duration-1 ease-out hover:border-hair-2 hover:text-signal"
        style={{ color: 'var(--bone)' }}
      >
        <span>{open ? 'Less' : 'The work'}</span>
        <span aria-hidden="true" className="relative block h-2.5 w-2.5">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-2 ease-out"
            style={{ transform: open ? 'translateX(-50%) scaleY(0)' : 'translateX(-50%) scaleY(1)' }}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              {post.detail.map((field) => (
                <div key={field.label} className="mt-5 first:mt-0">
                  <p className="meta">{field.label}</p>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--bone-2)' }}>
                    {field.body}
                  </p>
                </div>
              ))}

              {post.impact.length ? (
                <div className="mt-5">
                  <p className="meta">Outcome</p>
                  <ul className="mt-2 grid gap-2.5">
                    {post.impact.map((line, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[0.9375rem] leading-relaxed"
                        style={{ color: 'var(--bone-2)' }}
                      >
                        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-hair-2" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <TechTokens items={post.stack} className="mt-6" />
    </article>
  );
}

export function Trajectory() {
  const trackRef = useRef(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const horizontal = !mobile && !reduced;

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const onFocusPost = useCallback(
    (i) => () => {
      const el = trackRef.current;
      if (!el || !horizontal) return;
      const span = el.offsetHeight - window.innerHeight;
      const ratio = timeline.length > 1 ? i / (timeline.length - 1) : 0;
      window.scrollTo({ top: el.offsetTop + span * ratio, behavior: 'auto' });
    },
    [horizontal],
  );

  const header = (
    <div className="shell">
      <Kicker index={sectionById['trajectory'].index}>Trajectory</Kicker>
      <motion.h2
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={ONCE}
        className="mt-8 max-w-[22ch] font-display text-h2 uppercase axis-narrow"
      >
        Where I am now, and how I got here.
      </motion.h2>
      <motion.p
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={ONCE}
        className="meta mt-6"
      >
        {trackEnds.from} <span aria-hidden="true">—————</span> {trackEnds.to}
      </motion.p>
    </div>
  );

  if (!horizontal) {
    return (
      <Section id="trajectory" stage={stageFor('trajectory')} label="Trajectory">
        {header}
        <div className="shell mt-16 grid gap-16">
          {timeline.map((post) => (
            <Post key={post.id} post={post} compact />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section id="trajectory" stage={stageFor('trajectory')} label="Trajectory" className="!py-0">
      <div className="pt-band">{header}</div>

      <div ref={trackRef} style={{ height: `${timeline.length * 84}vh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <motion.ol style={{ x }} className="flex gap-16 pl-gutter will-change-transform">
            {timeline.map((post, i) => (
              <li key={post.id} tabIndex={0} onFocus={onFocusPost(i)} className="outline-none">
                <Post post={post} />
              </li>
            ))}
          </motion.ol>

          <div aria-hidden="true" className="shell mt-12">
            <div className="h-px w-full bg-hair">
              <motion.div style={{ width: progress }} className="h-px bg-signal" />
            </div>
            <p className="meta mt-3">Scroll to travel back</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
