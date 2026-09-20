// Shared motion vocabulary. Components import variants; they never invent easings.

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_IO = [0.65, 0, 0.35, 1];

/** Reveals fire once. Nothing on this site re-animates on scroll-back. */
export const ONCE = { once: true, amount: 0.25 };

export const rise = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.68, ease: EASE_OUT } },
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.68, ease: EASE_OUT } },
};

/** Line-by-line mask reveal: the wrapper clips, the child slides up. */
export const maskLine = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
};

export const stagger = (delay = 0.06, start = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: start } },
});
