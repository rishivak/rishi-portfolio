import { Caption, Frame, Link, Node, Pulse, ACCENT, LINE } from './kit';

/**
 * ClariFI Phoenix — the shape of the change. The top band is the old
 * per-request path. The bottom band is the boot-time pipeline, where a request
 * no longer touches assembly at all.
 */
export function SpecPipeline() {
  return (
    <Frame
      viewBox="0 0 460 300"
      label="Two request paths compared. Before: every request assembles and serialises the specification. After: assembly, cycle-safe reference resolution and validation happen once at startup, producing a pre-computed gzipped payload and SHA-256 ETag, so a repeat request resolves to 304 Not Modified."
    >
      {/* ---- before: cost paid on every call ------------------------------- */}
      <Caption x={0} y={20}>
        BEFORE — PER REQUEST
      </Caption>

      <Node x={0} y={40} w={66} h={34} label="REQUEST" />
      <Node x={100} y={40} w={96} h={34} label="ASSEMBLE" sub="RESOLVE $REF" />
      <Node x={230} y={40} w={96} h={34} label="SERIALISE" />
      <Node x={360} y={40} w={66} h={34} label="200" />

      <Link d="M 66 57 H 100" />
      <Link d="M 196 57 H 230" />
      <Link d="M 326 57 H 360" />
      <Pulse d="M 66 57 H 360" dur={2.8} />

      <Caption x={100} y={92} color="var(--bone-3)">
        EVERY CALL REPEATS THE WORK
      </Caption>

      <line x1="0" y1="118" x2="460" y2="118" stroke={LINE} strokeDasharray="2 5" />

      {/* ---- after: paid once, at startup ---------------------------------- */}
      <Caption x={0} y={146} color={ACCENT}>
        AFTER — ONCE, AT BOOT
      </Caption>

      <Node x={0} y={166} w={66} h={36} label="STARTUP" accent />
      <Node x={100} y={166} w={96} h={36} label="ASSEMBLE" sub="CYCLE-SAFE" accent />
      <Node x={216} y={166} w={86} h={36} label="VALIDATE" sub="FAIL FAST" dashed />
      <Node x={322} y={166} w={110} h={36} label="GZIP + ETAG" sub="SHA-256" accent />

      <Link d="M 66 184 H 100" accent />
      <Link d="M 196 184 H 216" accent />
      <Link d="M 302 184 H 322" accent />
      <Pulse d="M 66 184 H 322" dur={5} />

      {/* The pre-computed payload is what the later request meets. */}
      <Link d="M 377 202 V 240" accent dashed />

      <Caption x={0} y={234} color="var(--bone-3)">
        THEN, EVERY REQUEST
      </Caption>
      <Node x={0} y={240} w={66} h={34} label="REQUEST" />
      <Node x={344} y={240} w={66} h={34} label="304" accent />
      <Link d="M 66 257 H 344" />
      <Pulse d="M 66 257 H 344" dur={2.2} delay={0.5} />

      <Caption x={377} y={290} anchor="middle" color={ACCENT}>
        NOT MODIFIED
      </Caption>
    </Frame>
  );
}
