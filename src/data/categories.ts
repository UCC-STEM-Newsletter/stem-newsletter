/**
 * The four STEM desks, in the order they appear in the navigation, the footer
 * and the homepage.
 *
 * A desk only gets a homepage block once it has at least two stories, and an
 * empty desk renders an explicit "no stories yet" state rather than a bare
 * grid, so adding one later needs no layout work.
 */
export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Theme accent token used by the `text-*` utilities. */
  accent: string;
}

export const categories: Category[] = [
  {
    slug: 'science',
    name: 'Science',
    description:
      'Research across biology, chemistry, physics, and the planet.',
    accent: 'science',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description:
      'Computing, artificial intelligence, and the systems we build.',
    accent: 'technology',
  },
  {
    slug: 'engineering',
    name: 'Engineering',
    description: 'Hardware, robotics, materials, energy, and the built world.',
    accent: 'engineering',
  },
  {
    slug: 'mathematics',
    name: 'Mathematics',
    description: 'Pure and applied maths, statistics, modelling, and data.',
    accent: 'mathematics',
  },
];

export const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
