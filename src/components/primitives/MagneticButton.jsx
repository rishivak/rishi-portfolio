import { useMagnetic } from '../../lib/useMagnetic';

/**
 * Primary control. Renders as <a> or <button> depending on whether it navigates,
 * so the semantics are never faked.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  external = false,
  variant = 'solid',
  className = '',
  ...rest
}) {
  const ref = useMagnetic(6);
  const Tag = href ? 'a' : 'button';

  const base =
    'group relative inline-flex items-center gap-3 px-6 py-3.5 meta transition-colors duration-1 ease-out will-change-transform';
  const skin =
    variant === 'solid'
      ? 'bg-signal text-void hover:bg-signal-2'
      : 'border border-hair text-bone hover:border-hair-2 hover:text-signal';

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      type={href ? undefined : 'button'}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : null)}
      className={`${base} ${skin} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
