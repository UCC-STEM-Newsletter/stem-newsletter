/**
 * Publication-wide configuration for Catalyst.
 *
 * Catalyst is a student-led STEM publication: science, technology, engineering
 * and mathematics. It publishes when there is something worth saying rather
 * than on a fixed schedule, so nothing here assumes a daily cadence.
 *
 * NOTE: the contact address below is a placeholder — swap it for the real one
 * before launch.
 */

export const site = {
  name: 'Catalyst',
  title: 'Catalyst — Science, technology, engineering, and mathematics',
  tagline: 'Science, technology, engineering, and mathematics',
  description:
    'Catalyst is a student-led STEM publication: reporting on science, technology, engineering, and mathematics from the people doing the work.',
  publisher: 'Catalyst',
  locale: 'en_US',
  localeShort: 'en-us',
  editorialEmail: 'editorial@example.com',
} as const;

export const footerColumns = [
  {
    heading: 'Publication',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Contribute', href: '/contribute/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'All stories', href: '/all-news/' },
      { label: 'Contributors', href: '/authors/' },
    ],
  },
] as const;

/**
 * The single call to action across the site.
 *
 * Catalyst has no newsletter, so the thing we actually want from a reader is a
 * story lead: a project, a paper, or a question worth writing up.
 */
export const contribute = {
  eyebrow: 'Get involved',
  heading: 'Built something worth writing about?',
  body: 'Catalyst is written by students. If you have a project, a paper, or a question you cannot stop thinking about, tell us about it — we will help you turn it into a story.',
  cta: { label: 'Share a project', href: '/contribute/' },
  /** Shorter label for the masthead, where horizontal space is tight. */
  shortLabel: 'Share a project',
} as const;

/**
 * Stories per archive page. Nine keeps the three-column grid on whole rows and
 * means pagination only appears once the archive is worth paging.
 */
export const ARCHIVE_PAGE_SIZE = 9;
