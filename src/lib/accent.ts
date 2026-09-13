/**
 * Desk accents.
 *
 * The class strings are written out in full rather than interpolated so the
 * Tailwind scanner can see them; `accentClass` is only a lookup.
 */
const accentClasses: Record<string, string> = {
  science: 'text-science',
  technology: 'text-technology',
  engineering: 'text-engineering',
  mathematics: 'text-mathematics',
};

export const accentClass = (accent: string | undefined): string =>
  (accent && accentClasses[accent]) || 'text-primary';
