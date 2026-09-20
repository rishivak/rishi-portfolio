import { useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { timeline } from '../../data/timeline';
import { Section } from '../primitives/Section';
import { Kicker } from '../primitives/Kicker';
import { TechTokens } from '../primitives/TechToken';
import { ONCE, rise } from '../../lib/motion';
import { useIsMobile } from '../../lib/useMediaQuery';
import { useReducedMotion } from '../../lib/useReducedMotion';

/**
 * 02 — TRAJECTORY.
 *
 * The one pinned section on the site. Scrolling drives the timeline sideways,
 * which makes six years read as a single continuous movement rather than four
 * stacked entries. It is bounded: the pin releases after one pass, it never
 * intercepts the wheel, and the vertical stack below is the real content for
 * mobile, reduced motion and keyboard users.
 */

function Post({ post, compact = false }) {
  return (
    <article
      className={
        compact
          ? 'border-l border-hair pl-6'
          : 'flex w-[min(86vw,30rem)] shrink-0 flex-col border-l border-hair pl-8'
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

      <ul className="mt-5 grid gap-3">
        {post.contributions.map((line, i) => (
          <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed" style={{ color: 'var(--bone-2)' }}>
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-hair-2" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <TechTokens items={post.stack} className="mt-6" />
    </article>
  );
}

export function Trajectory() {
  const trackRef = useRef(null);
  const mobile = useIsMobile();
  const reduced = useReducedMotion();
  const horizontal = !mobile && !reduced;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  // Four posts, three gaps to travel.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-72%']);
  const progress = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Keyboard traversal: focusing a post pulls the pinned track to it.
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
      <Kicker index="02">Trajectory</Kicker>
      <motion.h2
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={ONCE}
        className="mt-8 max-w-[22ch] font-display text-h2 uppercase axis-narrow"
      >
        Six years, four systems, one direction.
      </motion.h2>
    </div>
  );

  if (!horizontal) {
    return (
      <Section id="trajectory" label="Trajectory">
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
    <Section id="trajectory" label="Trajectory" className="!py-0">
      <div className="pt-band">{header}</div>

      <div ref={trackRef} style={{ height: `${timeline.length * 78}vh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          <motion.ol style={{ x }} className="flex gap-16 pl-gutter will-change-transform">
            {timeline.map((post, i) => (
              <li key={post.id} tabIndex={0} onFocus={onFocusPost(i)} className="outline-none">
                <Post post={post} />
              </li>
            ))}
          </motion.ol>

          <div aria-hidden="true" className="shell mt-16">
            <div className="h-px w-full bg-hair">
              <motion.div style={{ width: progress }} className="h-px bg-signal" />
            </div>
            <p className="meta mt-3">Scroll to advance</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
