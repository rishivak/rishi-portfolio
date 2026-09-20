/**
 * Renders an unresolved metric honestly and visibly. No number on this site is
 * invented; where one is not retrievable, this shows instead.
 */
export function Placeholder({ children }) {
  return (
    <span
      className="meta border border-dashed px-2 py-1"
      style={{ borderColor: 'var(--hair-2)', color: 'var(--bone-3)' }}
      title="Placeholder — to be replaced with a measured value"
    >
      {children}
    </span>
  );
}
