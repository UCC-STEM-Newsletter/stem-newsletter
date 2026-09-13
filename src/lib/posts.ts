import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

/**
 * Every story, newest first. Publication dates collide often in the sample
 * data, so the slug is the tie-breaker to keep listings stable between builds.
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

/** Resolve a list of slugs to posts, preserving the requested order. */
export const pickPosts = (posts: Post[], slugs: readonly string[], limit?: number): Post[] => {
  const bySlug = new Map(posts.map((post) => [post.id, post]));
  const picked = slugs.map((slug) => bySlug.get(slug)).filter((post): post is Post => Boolean(post));
  return typeof limit === 'number' ? picked.slice(0, limit) : picked;
};

/**
 * Fill a rail to `count` items from `posts`, skipping anything already used so
 * a curated list that outruns the archive still renders a full block.
 */
export const fillPosts = (
  posts: Post[],
  picked: Post[],
  count: number,
  exclude: ReadonlySet<string> = new Set(),
): Post[] => {
  const used = new Set([...picked.map((post) => post.id), ...exclude]);
  const filler = posts.filter((post) => !used.has(post.id));
  return [...picked, ...filler].slice(0, count);
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
