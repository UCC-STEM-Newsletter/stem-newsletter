/**
 * Publication-wide configuration for Catalyst.
 *
 * Catalyst is a student-led STEM publication: science, technology, engineering
 * and mathematics. It publishes when there is something worth saying rather
 * than on a fixed schedule, so nothing here assumes a daily cadence.
 *
 * NOTE: the social links and contact address below are placeholders — swap them
 * for the real accounts before launch.
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
  social: {
    linkedin: 'https://example.com',
    x: 'https://example.com',
    youtube: 'https://example.com',
  },
  editorialEmail: 'editorial@example.com',
} as const;

export const footerColumns = [
  {
    heading: 'Publication',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Write for us', href: '/contact/' },
      { label: 'Newsletter', href: '/#newsletter' },
      { label: 'Privacy', href: '/privacy/' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'All stories', href: '/all-news/' },
      { label: 'Authors', href: '/authors/' },
      { label: 'RSS', href: '/rss.xml' },
      { label: 'Robots', href: '/robots.txt' },
      { label: 'Sitemap', href: '/sitemap-index.xml' },
    ],
  },
] as const;

export const newsletter = {
  heading: 'STEM reporting, straight to your inbox.',
  body: 'Student-written stories on science, technology, engineering, and mathematics — sent when there is something worth reading, not on a schedule.',
  note: 'Free. No fixed cadence, no partner sends. Unsubscribe in a click.',
} as const;

export const deskIndex = {
  heading: 'The desk index',
  blurb: 'Every desk, its story count, and the piece it is leading with right now.',
} as const;

/**
 * Stories per archive page. Nine keeps the three-column grid on whole rows and
 * means pagination only appears once the archive is worth paging.
 */
export const ARCHIVE_PAGE_SIZE = 9;
