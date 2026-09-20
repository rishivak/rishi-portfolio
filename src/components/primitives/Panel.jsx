/** A hairline-bounded surface. The only container style on the site. */
export function Panel({ children, className = '', inverted = false, as: Tag = 'div' }) {
  return (
    <Tag
      className={`border ${className}`}
      style={{
        borderColor: inverted ? 'var(--paper-hair)' : 'var(--hair)',
        background: inverted ? 'transparent' : 'var(--surface)',
      }}
    >
      {children}
    </Tag>
  );
}
