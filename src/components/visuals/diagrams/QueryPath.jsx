import { Caption, Frame, Link, Node, Pulse, ACCENT, LINE, FAINT } from './kit';

/**
 * Plan4HealthCare — a real-time read path, and the layer that decides whether
 * it stays real-time as the data grows.
 */
export function QueryPath() {
  return (
    <Frame
      viewBox="0 0 460 300"
      label="A budgeting screen requests data through a Spring REST API. The request reaches the query layer, where optimised queries, stored procedures and indexes determine whether the read stays fast as data accumulates."
    >
      <Caption x={0} y={18}>
        HIGHEST-TRAFFIC SCREEN
      </Caption>

      <Node x={0} y={36} w={120} h={38} label="BUDGET VIEW" sub="ANGULAR" />
      <Link d="M 120 55 H 168" />
      <Pulse d="M 120 55 H 168" dur={2.4} />
      <Node x={168} y={36} w={120} h={38} label="REST API" sub="SPRING" />
      <Link d="M 228 74 V 112" />
      <Pulse d="M 228 74 V 112" dur={2.4} delay={0.5} />

      {/* The bracket everything below belongs to. */}
      <rect x={72} y={112} width={316} height={116} fill="none" stroke={ACCENT} strokeDasharray="3 3" />
      <Caption x={80} y={128} color={ACCENT}>
        WHERE THE TIME ACTUALLY WENT
      </Caption>

      <Node x={90} y={142} w={98} h={36} label="QUERY" sub="REWRITTEN" accent />
      <Node x={202} y={142} w={98} h={36} label="PROCEDURE" sub="STORED" accent />
      <Node x={314} y={142} w={62} h={36} label="TRIGGER" accent />

      <Link d="M 188 160 H 202" accent />
      <Link d="M 300 160 H 314" accent />

      <Link d="M 139 178 V 200" />
      <Node x={90} y={200} w={98} h={20} label="INDEX" />

      <Link d="M 228 228 V 252" />
      <Pulse d="M 228 228 V 252" dur={2.4} delay={1} />

      <Node x={148} y={252} w={160} h={36} label="ROWS" sub="IN REAL TIME" />

      <line x1="0" y1="96" x2="460" y2="96" stroke={LINE} strokeDasharray="2 5" />
      <Caption x={0} y={288} color={FAINT}>
        NO EXTRA HARDWARE AVAILABLE — THE READ PATH HAD TO GET CHEAPER
      </Caption>
    </Frame>
  );
}
