/** Single entry point for programmatic navigation, so focus is always moved too. */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  // Move keyboard focus with the viewport, without adding a visible outline.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true });
}
