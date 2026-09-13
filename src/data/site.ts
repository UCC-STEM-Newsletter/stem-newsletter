/**
 * Publication-wide configuration: masthead copy, navigation, footer columns
 * and the social/feed links.
 */

export const site = {
  name: 'Semnal',
  title: 'Semnal - Technology, startups, AI, markets, EVs, and science',
  tagline: 'Technology, markets, and science in motion',
  description:
    'A modern editorial news theme for technology, startups, AI, business, electric mobility, science, and markets.',
  publisher: 'Example Editorial Team',
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
      { label: 'Advertise', href: '/contact/' },
      { label: 'Newsletter', href: '/#newsletter' },
      { label: 'Privacy', href: '/privacy/' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'All News', href: '/all-news/' },
      { label: 'Authors', href: '/authors/' },
      { label: 'RSS', href: '/rss.xml' },
      { label: 'Robots', href: '/robots.txt' },
      { label: 'Sitemap', href: '/sitemap-index.xml' },
    ],
  },
] as const;

export const newsletter = {
  heading: 'A smarter daily read on technology and capital.',
  body: 'One concise editorial briefing on AI, startups, markets, EVs, science, and the global technology shifts underneath them.',
  note: 'Free. One email a day, no partner sends. Unsubscribe in a click.',
} as const;

export const deskIndex = {
  heading: 'The desk index',
  blurb: 'Every desk, its story count, and the piece it is leading with right now.',
} as const;

/** Number of stories per archive page. */
export const ARCHIVE_PAGE_SIZE = 12;
