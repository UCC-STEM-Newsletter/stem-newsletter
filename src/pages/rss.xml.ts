import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { allPosts } from '../lib/posts';

/** `/rss.xml` — the 30 most recent stories, newest first. */
export async function GET(context: APIContext) {
  const posts = (await allPosts()).slice(0, 30);

  return rss({
    title: site.name,
    description: site.description,
    site: context.site ?? 'https://example.com',
    // @astrojs/rss has no `language` option; the channel element is injected
    // verbatim so the feed matches the reference markup.
    customData: `<language>${site.localeShort}</language>`,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      link: `/post/${post.id}/`,
      guid: `/post/${post.id}/`,
      pubDate: post.data.publishedAt,
      description: post.data.description,
      categories: [post.data.category],
      author: post.data.author,
    })),
  });
}
