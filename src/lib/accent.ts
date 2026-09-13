/**
 * Desk accents.
 *
 * The class strings are written out in full rather than interpolated so the
 * Tailwind scanner can see them; `accentClass` is only a lookup.
 */
const accentClasses: Record<string, string> = {
  global: 'text-global',
  ai: 'text-ai',
  market: 'text-market',
  ev: 'text-ev',
  science: 'text-science',
  startup: 'text-startup',
};

export const accentClass = (accent: string | undefined): string =>
  (accent && accentClasses[accent]) || 'text-primary';
