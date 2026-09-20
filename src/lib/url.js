/**
 * Resolve a path in `public/` against the deploy base. Prevents the hardcoded
 * `/rishi-portfolio/...` hrefs that break on any other host.
 */
export function asset(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
