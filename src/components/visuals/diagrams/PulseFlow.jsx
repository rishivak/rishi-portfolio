import { Caption, Frame, Link, Node, Pulse, FAINT } from './kit';

/**
 * OI Pulse — the read path and the history path diverge on purpose, because
 * serving the live chain and querying its past want different things. That
 * divergence is the design decision the project turns on, so it is the shape
 * of the diagram rather than a footnote to it.
 */
export function PulseFlow() {
  return (
    <Frame
      viewBox="0 0 460 300"
      label="A broker API is polled over OAuth for the live option chain. A scheduler persists snapshots on a cadence, writing the live chain to an in-memory cache and its history to a relational store. The two paths rejoin to compute the change in open interest per strike, which is classified and pushed to a dashboard over server-sent events."
    >
      <Caption x={0} y={18}>
        BROKER
      </Caption>
      <Node x={0} y={34} w={104} h={34} label="UPSTOX" sub="OAUTH" />
      <Link d="M 104 51 H 148" />
      <Pulse d="M 104 51 H 148" dur={2.6} />
      <Node x={148} y={34} w={104} h={34} label="OPTION CHAIN" sub="PER STRIKE" />

      <Link d="M 200 68 V 96" />
      <Pulse d="M 200 68 V 96" dur={2.6} delay={0.4} />
      <Node x={140} y={96} w={120} h={38} label="SCHEDULED" sub="COLLECTION" accent />
      <Caption x={266} y={120} color={FAINT}>
        RATE LIMIT · MARKET HOURS
      </Caption>

      {/* The split. Two stores, because two access patterns. */}
      <Link d="M 170 134 V 156 H 88" accent />
      <Link d="M 230 134 V 156 H 320" />
      <Pulse d="M 170 134 V 156 H 88" dur={3} delay={0.2} />
      <Pulse d="M 230 134 V 156 H 320" dur={3} delay={0.9} />

      <Node x={20} y={156} w={110} h={34} label="CACHE" sub="LIVE CHAIN" accent />
      <Node x={320} y={156} w={116} h={34} label="STORE" sub="SNAPSHOT HISTORY" />
      <Caption x={20} y={206} color={FAINT}>
        READ PATH
      </Caption>
      <Caption x={436} y={206} anchor="end" color={FAINT}>
        HISTORY PATH
      </Caption>

      {/* They rejoin: a level means nothing without its previous reading. */}
      <Link d="M 75 190 V 216 H 178" />
      <Link d="M 378 190 V 216 H 282" />
      <Node x={178} y={216} w={104} h={36} label="ΔOI" sub="PER STRIKE" accent />
      <Pulse d="M 75 190 V 216 H 178" dur={2.8} delay={0.5} />
      <Pulse d="M 378 190 V 216 H 282" dur={2.8} delay={1.2} />

      <Link d="M 230 252 V 272" accent />
      <Node x={150} y={272} w={160} h={26} label="DASHBOARD — SSE" accent />
      <Caption x={320} y={290} color={FAINT}>
        A CONCLUSION, NOT A DATASET
      </Caption>
    </Frame>
  );
}
