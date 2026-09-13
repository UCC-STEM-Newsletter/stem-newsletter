import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Editorial stories. Bodies are Markdown; `## ` headings become the article
 * table of contents.
 */
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
      author: z.string(),
      publishedAt: z.coerce.date(),
      /** Optional override; otherwise derived from the body word count. */
      readMinutes: z.number().int().positive().optional(),
      cover: image(),
      coverAlt: z.string(),
      coverCredit: z
        .object({
          label: z.string(),
          url: z.url(),
        })
        .optional(),
      /** Set on stories that should lead a desk on the homepage. */
      featured: z.boolean().default(false),
    }),
});

export const collections = { posts };
