/**
 * A canvas 2D context cannot resolve CSS custom properties — assigning
 * `ctx.strokeStyle = 'var(--signal)'` silently does nothing, which is a colour
 * bug nobody notices until the whole scene is the wrong shade. So the palette
 * is read out of the stylesheet once at startup and cached as literals.
 * tokens.css stays the single source of truth; the engine just resolves it.
 *
 * The world shares the site's stage spectrum: four hues, one per pipeline
 * stage, so a 3D node and a heading describing the same thing are the same
 * colour. Readability is protected by the intensity budget, the off-centre
 * composition and the scrim — not by draining the colour out of the world.
 */

const TOKENS = {
  void: '--void',
  fog: '--fog',
  grid: '--grid',
  ink: '--bone',
  ink2: '--bone-2',
  ink3: '--bone-3',
  data: '--s-data',
  eng: '--s-eng',
  intel: '--s-intel',
  decide: '--s-decide',
  accent: '--signal',
};

// Used before the document exists (SSR, tests) and as a safety net if a token
// is renamed. Kept in sync with src/styles/tokens.css.
const FALLBACK = {
  void: '#06070a',
  fog: '#07080b',
  grid: 'rgba(232,236,245,0.045)',
  ink: '#e9ecf2',
  ink2: '#9ba3b2',
  ink3: '#5c6472',
  data: '#4e6e85',
  eng: '#5fa8c7',
  intel: '#a9d3e8',
  decide: '#e8b04b',
  accent: '#e8b04b',
};

let cache = null;

/** Both paths must produce the same shape, or the renderer crashes on the
 *  fallback — which is exactly where it is hardest to notice. */
const shape = (colours) => ({
  ...colours,
  rgb: Object.fromEntries(Object.entries(colours).map(([k, c]) => [k, toRgb(c)])),
});

export function readPalette() {
  if (cache) return cache;

  const canRead =
    typeof document !== 'undefined' &&
    document.documentElement &&
    typeof getComputedStyle === 'function';

  if (!canRead) return shape(FALLBACK);

  const style = getComputedStyle(document.documentElement);
  const resolved = {};
  for (const [key, token] of Object.entries(TOKENS)) {
    const value = style.getPropertyValue(token)?.trim();
    resolved[key] = value || FALLBACK[key];
  }
  cache = shape(resolved);
  return cache;
}

/** Re-read on theme change or in tests. */
export const resetPalette = () => {
  cache = null;
};

/** `#RRGGBB` or `rgb()/rgba()` → `[r,g,b]`, so alpha can be applied per draw. */
export function toRgb(colour) {
  const hex = colour.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const short = colour.match(/^#([0-9a-f]{3})$/i);
  if (short) {
    const [r, g, b] = short[1].split('');
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }
  const fn = colour.match(/rgba?\(([^)]+)\)/i);
  if (fn) {
    const parts = fn[1].split(/[,/\s]+/).filter(Boolean).map(Number);
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  return [231, 234, 239];
}

export const rgba = (rgb, alpha) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;

/** Blend a colour toward the fog colour by `k`, for distance falloff. */
export function fogged(rgb, fogRgb, k, alpha) {
  const m = (i) => Math.round(rgb[i] + (fogRgb[i] - rgb[i]) * k);
  return `rgba(${m(0)},${m(1)},${m(2)},${alpha.toFixed(3)})`;
}

export const STAGE_KEY = {
  data: 'data',
  engineering: 'eng',
  intelligence: 'intel',
  decision: 'decide',
};
