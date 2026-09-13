/** Presentation helpers shared by pages and components. */

const dateLong = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const dateShort = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** e.g. "July 7, 2026" */
export const formatDate = (date: Date) => dateLong.format(date);

/** e.g. "Jul 7, 2026" */
export const formatDateShort = (date: Date) => dateShort.format(date);

/** Machine-readable value for `<time datetime>`. */
export const isoDate = (date: Date) => date.toISOString();

/** e.g. "6 stories" / "1 story" — handles consonant + "y" plurals. */
export const pluralize = (count: number, singular: string, plural?: string) => {
  if (count === 1) return `${count} ${singular}`;
  const word =
    plural ?? (/[^aeiou]y$/.test(singular) ? `${singular.slice(0, -1)}ies` : `${singular}s`);
  return `${count} ${word}`;
};

/** Zero-padded rank used by the "Most read" list. */
export const rank = (index: number) => String(index + 1).padStart(2, '0');
