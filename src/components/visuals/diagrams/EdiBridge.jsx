import { Caption, Frame, Link, Node, Pulse, ACCENT, LINE, FAINT } from './kit';

/**
 * DOE licensing — two organisations that share no database and no format.
 * Correctness has to live in the transformation and the transport.
 */
export function EdiBridge() {
  return (
    <Frame
      viewBox="0 0 460 300"
      label="A government licensing platform and its commercial partners exchange documents across an organisational boundary. XML from one side is transformed to EDI for the other and carried over FTP and reverse-invoke servers, with no shared database or transaction between them."
    >
      <Caption x={0} y={18}>
        DEPARTMENT SIDE
      </Caption>
      <Caption x={460} y={18} anchor="end">
        PARTNER SIDE
      </Caption>

      {/* The boundary is the subject of the diagram. */}
      <line x1="230" y1="30" x2="230" y2="270" stroke={ACCENT} strokeDasharray="3 5" opacity="0.5" />
      <Caption x={230} y={288} anchor="middle" color={ACCENT}>
        ORGANISATIONAL BOUNDARY — NO SHARED TRANSACTION
      </Caption>

      <Node x={0} y={40} w={120} h={38} label="LICENSING" sub="SPRING BOOT" />
      <Node x={0} y={98} w={120} h={38} label="REST API" sub="SECURED" />
      <Node x={0} y={156} w={120} h={38} label="S3" sub="DOCUMENTS" />

      <Link d="M 60 78 V 98" />
      <Link d="M 60 136 V 156" />

      <Node x={0} y={214} w={120} h={38} label="XML" accent />
      <Link d="M 60 194 V 214" />

      {/* The bridge. */}
      <Link d="M 120 233 H 168" accent />
      <Node x={168} y={206} w={124} h={54} label="TRANSFORM" sub="XML → EDI" accent />
      <Pulse d="M 120 233 H 168" dur={3} />

      <Link d="M 292 233 H 340" accent />
      <Pulse d="M 292 233 H 340" dur={3} delay={0.6} />
      <Node x={340} y={214} w={120} h={38} label="EDI" accent />

      <Link d="M 400 214 V 194" />
      <Node x={340} y={156} w={120} h={38} label="FTP" sub="REVERSE-INVOKE" />
      <Link d="M 400 156 V 136" />
      <Node x={340} y={98} w={120} h={38} label="PARTNER" sub="B2B NETWORK" />

      <line x1="0" y1="188" x2="460" y2="188" stroke={LINE} strokeDasharray="2 5" opacity="0.4" />
      <Caption x={340} y={60} color={FAINT}>
        DIFFERENT FORMAT
      </Caption>
      <Caption x={340} y={72} color={FAINT}>
        DIFFERENT OWNER
      </Caption>
    </Frame>
  );
}
