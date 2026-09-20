/**
 * Shared vocabulary for the four system diagrams. Every diagram is plain SVG
 * on a 1px hairline grammar — no libraries, no images, and small enough that
 * four of them cost less than one screenshot.
 *
 * Motion is CSS-only, so the global prefers-reduced-motion rule freezes every
 * diagram into a readable static schematic for free.
 */

export const INK = 'var(--bone)';
export const DIM = 'var(--bone-2)';
export const FAINT = 'var(--bone-3)';
export const LINE = 'rgba(232,236,245,0.18)';
export const ACCENT = 'var(--signal)';

export function Frame({ children, label, viewBox = '0 0 460 300' }) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-label={label}
      className="h-auto w-full select-none"
      style={{ fontFamily: 'var(--f-mono)' }}
    >
      {children}
    </svg>
  );
}

export function Node({ x, y, w = 96, h = 34, label, sub, accent = false, dashed = false }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? 'var(--signal-ghost)' : 'transparent'}
        stroke={accent ? ACCENT : LINE}
        strokeDasharray={dashed ? '3 3' : undefined}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 3 : h / 2 + 1)}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8.5"
        letterSpacing="0.09em"
        fill={accent ? ACCENT : INK}
      >
        {label}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 9} textAnchor="middle" fontSize="7" letterSpacing="0.08em" fill={FAINT}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

export function Link({ d, accent = false, dashed = false }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? ACCENT : LINE}
      strokeWidth="1"
      strokeDasharray={dashed ? '3 4' : undefined}
    />
  );
}

/** A dot travelling a path — the single moving element any diagram is allowed. */
export function Pulse({ d, dur = 3, delay = 0, r = 2.4, color = ACCENT }) {
  return (
    <circle r={r} fill={color}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.12;0.85;1"
        dur={`${dur}s`}
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

export function Caption({ x, y, children, anchor = 'start', color = FAINT }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize="7" letterSpacing="0.14em" fill={color}>
      {children}
    </text>
  );
}

export function Tick({ x1, y1, x2, y2 }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth="1" />;
}
