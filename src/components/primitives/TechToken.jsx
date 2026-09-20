/** A technology name as technical metadata, not as a coloured badge. */
export function TechToken({ children, inverted = false }) {
  return (
    <span
      className="meta border px-2.5 py-1"
      style={{
        borderColor: inverted ? 'var(--paper-hair)' : 'var(--hair)',
        color: inverted ? 'var(--paper-ink-2)' : 'var(--bone-2)',
      }}
    >
      {children}
    </span>
  );
}

export function TechTokens({ items, inverted = false, className = '' }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <TechToken inverted={inverted}>{item}</TechToken>
        </li>
      ))}
    </ul>
  );
}
