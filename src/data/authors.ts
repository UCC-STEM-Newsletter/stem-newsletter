/**
 * The masthead.
 *
 * Only authors listed here get a profile page, and only if they have at least
 * one published story — so adding a writer is a one-line change and an author
 * never shows an empty page. A story's `author:` field refers to a `slug` here;
 * the content check flags unknown authors.
 */
export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

export const authors: Author[] = [
  {
    slug: 'rafael-stone',
    name: 'Rafael Stone',
    role: 'Science Editor',
    bio: 'Rafael writes about research, the environment, and the instruments that turn a hypothesis into a measurement.',
  },
  {
    slug: 'theo-grant',
    name: 'Theo Grant',
    role: 'Technology Editor',
    bio: 'Theo covers computing and artificial intelligence, with an eye on what these systems actually cost to run and maintain.',
  },
  {
    slug: 'ines-haddad',
    name: 'Ines Haddad',
    role: 'Mathematics Editor',
    bio: 'Ines writes about pure and applied mathematics, and about the places where a proof changes what a model is allowed to claim.',
  },
];

export const authorBySlug = new Map(authors.map((author) => [author.slug, author]));
