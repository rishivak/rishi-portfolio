import { Caption, Frame, Link, Node, Pulse, ACCENT, LINE, FAINT } from './kit';

const SOURCES = [
  { y: 34, label: 'FILING' },
  { y: 78, label: 'REPORT' },
  { y: 122, label: 'DISCLOSURE' },
];

/**
 * Foreseer-AI — heterogeneous documents reduced to one representation, then a
 * queue so the downstream services stop waiting on each other.
 */
export function DocumentFlow() {
  return (
    <Frame
      viewBox="0 0 460 300"
      label="Heterogeneous financial documents enter an ETL normalisation stage that reduces them to a single XML representation, which is published to a message queue and consumed asynchronously by independent extraction services."
    >
      <Caption x={0} y={16}>
        HETEROGENEOUS SOURCES
      </Caption>

      {SOURCES.map((source, i) => (
        <g key={source.label}>
          <Node x={0} y={source.y} w={86} h={30} label={source.label} dashed />
          <Link d={`M 86 ${source.y + 15} H 118 V 93`} />
          <Pulse d={`M 86 ${source.y + 15} H 118 V 93`} dur={3.4} delay={i * 0.55} />
        </g>
      ))}

      <Node x={118} y={72} w={96} h={42} label="ETL" sub="NORMALISE" accent />
      <Caption x={118} y={130} color={FAINT}>
        ONE SHAPE, NOT MANY
      </Caption>

      <Link d="M 214 93 H 244" accent />
      <Node x={244} y={72} w={66} h={42} label="XML" accent />

      {/* The queue is the whole point: it decouples pace from pace. */}
      <Link d="M 310 93 H 336" accent />
      <g>
        <rect x={336} y={66} width={104} height={54} fill="none" stroke={ACCENT} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={346 + i * 23} y={82} width={14} height={22} fill="var(--signal-dim)" stroke={ACCENT}>
            <animate
              attributeName="opacity"
              values="0.25;1;0.25"
              dur="2.8s"
              begin={`${i * 0.34}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
        <Caption x={388} y={136} anchor="middle" color={ACCENT}>
          MESSAGE QUEUE
        </Caption>
      </g>

      <line x1="0" y1="168" x2="460" y2="168" stroke={LINE} strokeDasharray="2 5" />

      <Caption x={0} y={192} color={FAINT}>
        CONSUMERS — INDEPENDENT PACE
      </Caption>

      {[0, 1, 2].map((i) => {
        const x = 0 + i * 156;
        const path = `M 388 120 V 150 H ${x + 66} V 212`;
        return (
          <g key={i}>
            <Link d={path} dashed />
            <Pulse d={path} dur={3.6} delay={i * 0.9} r={2} />
            <Node
              x={x}
              y={212}
              w={132}
              h={38}
              label={['EXTRACT', 'CLASSIFY', 'PERSIST'][i]}
              sub={['NLP MODEL', 'STRUCTURE', 'QUERYABLE'][i]}
            />
          </g>
        );
      })}

      <Caption x={0} y={278} color={FAINT}>
        SYNCHRONOUS HAND-OFF REMOVED — THROUGHPUT SET BY CAPACITY
      </Caption>
    </Frame>
  );
}
