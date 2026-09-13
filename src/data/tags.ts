/**
 * Controlled tag vocabulary.
 *
 * Tags are deliberately a short, curated list rather than free-form: at a
 * handful of stories a month, an open vocabulary fragments into dozens of
 * one-story tags. Add a term here before using it in a story — the content
 * check (`npm run check:content`) flags tags that are not in this list.
 *
 * Tags with no stories simply produce no tag page and never appear in the
 * homepage topic rail, so it is safe to keep terms here ahead of first use.
 */
export interface Tag {
  slug: string;
  name: string;
}

export const tags: Tag[] = [
  { slug: 'artificial-intelligence', name: 'Artificial Intelligence' },
  { slug: 'biotech', name: 'Biotech' },
  { slug: 'climate', name: 'Climate' },
  { slug: 'computing', name: 'Computing' },
  { slug: 'data', name: 'Data' },
  { slug: 'energy', name: 'Energy' },
  { slug: 'hardware', name: 'Hardware' },
  { slug: 'imaging', name: 'Imaging' },
  { slug: 'materials', name: 'Materials' },
  { slug: 'quantum', name: 'Quantum' },
  { slug: 'research', name: 'Research' },
  { slug: 'robotics', name: 'Robotics' },
];

export const tagBySlug = new Map(tags.map((tag) => [tag.slug, tag]));
