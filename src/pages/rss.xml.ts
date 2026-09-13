import rss from '@astrojs/rss';
import { site } from '../data/site';
import { allPosts } from '../lib/posts';
import { absoluteUrl, withBase } from '../lib/url';

/**
 * `/rss.xml` — the 30 most recent stories, newest first.
 *
 * The channel and item URLs are built from the configured `site` and `base`
 * rather than from the request, so the feed is correct however it is reached.
 */
export async function GET() {
  const posts = (await allPosts()).slice(0, 30);

  return rss({
    title: site.name,
    description: site.description,
    site: absoluteUrl('/'),
    // @astrojs/rss has no `language` option; the channel element is injected
    // verbatim so the feed matches the reference markup.
    customData: `<language>${site.localeShort}</language>`,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      link: withBase(`/post/${post.id}/`),
      guid: withBase(`/post/${post.id}/`),
      pubDate: post.data.publishedAt,
      description: post.data.description,
      categories: [post.data.category],
      author: post.data.author,
    })),
  });
}
