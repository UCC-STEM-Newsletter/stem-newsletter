import type { APIContext } from 'astro';
import { categories } from '../data/categories';
import { authorBySlug } from '../data/authors';
import { allPosts, readingTime } from '../lib/posts';
import { formatDateShort } from '../lib/format';
import { withBase } from '../lib/url';

/**
 * `/search-index.json` — the client-side search corpus. Shipped as a static
 * endpoint so both the header dialog and the search page can rank results
 * without a server.
 */
export async function GET(_context: APIContext) {
  const posts = await allPosts();
  const categoryNames = new Map(categories.map((entry) => [entry.slug, entry.name]));

  const payload = {
    posts: posts.map((post) => ({
      title: post.data.title,
      excerpt: post.data.description,
      category: categoryNames.get(post.data.category) ?? post.data.category,
      author: authorBySlug.get(post.data.author)?.name ?? post.data.author,
      date: post.data.publishedAt.toISOString(),
      dateLabel: formatDateShort(post.data.publishedAt),
      readMinutes: readingTime(post),
      href: withBase(`/post/${post.id}/`),
      image: {
        src: post.data.cover.src,
        width: post.data.cover.width,
        height: post.data.cover.height,
        alt: post.data.coverAlt,
      },
    })),
  };

  return new Response(JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
