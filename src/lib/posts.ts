import { getCollection, type CollectionEntry } from 'astro:content';
import { tagBySlug } from '../data/tags';

export type Post = CollectionEntry<'posts'>;

/** A tag paired with its display name, for rails and tag pages. */
export interface TagRef {
  slug: string;
  name: string;
}

/**
 * Every story, newest first. Publication dates collide often, so the slug is
 * the tie-breaker to keep listings stable between builds.
 */
export const allPosts = async (): Promise<Post[]> => {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => {
    const delta = b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    return delta !== 0 ? delta : a.id.localeCompare(b.id);
  });
};

export const postsByCategory = (posts: Post[], category: string) =>
  posts.filter((post) => post.data.category === category);

export const postsByTag = (posts: Post[], tag: string) =>
  posts.filter((post) => post.data.tags.includes(tag));

export const postsByAuthor = (posts: Post[], author: string) =>
  posts.filter((post) => post.data.author === author);

/**
 * The lead story: an explicitly `featured` story if one is marked, otherwise
 * simply the newest. Marking a story featured is how you pin a piece to the
 * top of the front page between publishing runs.
 */
export const leadPost = (posts: Post[]): Post | undefined =>
  posts.find((post) => post.data.featured) ?? posts[0];

/** Resolve slugs to posts, preserving the requested order. */
export const pickPosts = (posts: Post[], slugs: readonly string[]): Post[] => {
  const bySlug = new Map(posts.map((post) => [post.id, post]));
  return slugs.map((slug) => bySlug.get(slug)).filter((post): post is Post => Boolean(post));
};

/**
 * Take up to `count` stories from `posts`, skipping anything already used.
 * Returns fewer when the archive is smaller than the rail.
 */
export const takeUnused = (
  posts: Post[],
  count: number,
  exclude: ReadonlySet<string> = new Set(),
): Post[] => (count <= 0 ? [] : posts.filter((post) => !exclude.has(post.id)).slice(0, count));

const WORDS_PER_MINUTE = 200;

/**
 * Reading time in minutes, derived from the story body. Frontmatter can still
 * override it with `readMinutes` when the estimate is wrong (heavy maths, code
 * listings, an interview transcript).
 */
export const readingTime = (post: Post): number => {
  if (post.data.readMinutes) return post.data.readMinutes;

  const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

/**
 * Tags that at least one story actually carries, alphabetically by label.
 *
 * Deriving this from the archive rather than from the vocabulary means a tag
 * with no stories never appears in a rail and never links to a missing page.
 */
export const usedTags = (posts: Post[]): TagRef[] => {
  const seen = new Set<string>();
  for (const post of posts) for (const slug of post.data.tags) seen.add(slug);

  return [...seen]
    .map((slug) => tagBySlug.get(slug) ?? { slug, name: slug })
    .sort((a, b) => a.name.localeCompare(b.name));
};

/** Stories around `post` in the newest-first ordering. */
export const adjacentPosts = (posts: Post[], post: Post) => {
  const index = posts.findIndex((entry) => entry.id === post.id);
  return {
    // "Previous" steps towards newer stories, "next" towards older ones.
    previous: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
};
