/** A value the résumé could not supply is written as [LIKE THIS] in src/data. */
export const isPlaceholder = (value) => typeof value === 'string' && /^\[.*\]$/.test(value.trim());
