import { useEffect, useState } from 'react';
import { sections } from '../../data/nav';

const IST = 'Asia/Kolkata';

const clock = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: IST,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

/**
 * Bottom-right readout. Every value here is real and locally derived — his
 * actual local time, the actual viewport, the actual scroll position. Nothing
 * on this panel is decorative fake telemetry.
 */
export function Telemetry({ active, progress, inverted }) {
  const [time, setTime] = useState(clock);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const id = setInterval(() => setTime(clock()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const section = sections.find((s) => s.id === active);
  const dim = inverted ? 'var(--paper-ink-3)' : 'var(--bone-3)';

  const rows = [
    ['IST', time],
    ['VIEW', `${viewport.w}×${viewport.h}`],
    ['POS', `${String(Math.round(progress * 100)).padStart(3, '0')}%`],
    ['SEC', section ? `${section.index} ${section.label.toUpperCase()}` : '—'],
  ];

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 right-gutter z-[90] hidden select-none flex-col items-end gap-1 xl:flex"
    >
      {rows.map(([key, value]) => (
        <div key={key} className="meta flex items-baseline gap-2.5 tabular-nums" style={{ color: dim }}>
          <span>{key}</span>
          <span style={{ color: inverted ? 'var(--paper-ink-2)' : 'var(--bone-2)' }}>{value}</span>
        </div>
      ))}
    </aside>
  );
}
