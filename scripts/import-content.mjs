#!/usr/bin/env node
/**
 * One-time content importer.
 *
 * Ports the reference publication (https://semnal.xocoweb.workers.dev) into
 * this Astro project: post Markdown, per-post frontmatter, cover images,
 * fonts, icons and static images.
 *
 * Usage:  node scripts/import-content.mjs [--force]
 *
 * Responses are cached under `.scrape-cache/` so repeat runs are offline.
 * The generated content under `src/` is committed; this script is only needed
 * when re-importing.
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://semnal.xocoweb.workers.dev';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.scrape-cache');
const FORCE = process.argv.includes('--force');

/** Desks in the order the reference publication presents them. */
const CATEGORY_ORDER = [
  'global-dispatch',
  'ai-frontier',
  'market-pulse',
  'ev-shift',
  'science-lab',
  'startup-watch',
];

const write = async (file, data) => {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
};

const cachedFetch = async (urlPath) => {
  const key = urlPath === '/' ? '__root__' : urlPath.replace(/[^a-zA-Z0-9._-]+/g, '_');
  const cacheFile = path.join(CACHE, key);
  if (!FORCE && existsSync(cacheFile)) return readFile(cacheFile);
  const res = await fetch(new URL(urlPath, ORIGIN));
  if (!res.ok) throw new Error(`${urlPath} -> HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await write(cacheFile, buf);
  return buf;
};

const text = async (urlPath) => (await cachedFetch(urlPath)).toString('utf8');

/** Very small, purpose-built HTML helpers (the reference markup is uniform). */
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const strip = (html) => decode(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

const attr = (html, name) => {
  const m = html.match(new RegExp(`${name}="([^"]*)"`));
  return m ? decode(m[1]) : '';
};

const sliceBetween = (html, start, end) => {
  const i = html.indexOf(start);
  if (i === -1) return '';
  const j = end ? html.indexOf(end, i + start.length) : -1;
  return j === -1 ? html.slice(i) : html.slice(i, j);
};

/** Convert the article body (only <p> and <h2 id> occur) to Markdown. */
const bodyToMarkdown = (bodyHtml) => {
  const out = [];
  const re = /<(p|h2)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(bodyHtml))) {
    const [, tag, , inner] = m;
    // Inline markup inside paragraphs: keep links and emphasis.
    const inline = inner
      .replace(/<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
      .replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, '**$2**')
      .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, '_$2_')
      .replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
    const value = decode(inline).replace(/\s+/g, ' ').trim();
    if (!value) continue;
    out.push(tag === 'h2' ? `## ${value}` : value, '');
  }
  return out.join('\n').trim() + '\n';
};

const yamlString = (value) => `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

const toIso = (raw) => new Date(raw).toISOString();

const main = async () => {
  console.log('→ fetching sitemap');
  const sitemap = await text('/sitemap-0.xml');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const slugOf = (url) => url.replace(ORIGIN, '');

  const postUrls = urls.filter((u) => /\/post\//.test(u));
  const categoryUrls = urls.filter((u) => /\/category\//.test(u));
  const authorUrls = urls.filter((u) => /\/author\//.test(u));

  console.log(`→ ${postUrls.length} posts, ${categoryUrls.length} categories, ${authorUrls.length} authors`);

  // ---- categories -------------------------------------------------------
  const categories = [];
  for (const url of categoryUrls) {
    const html = await text(slugOf(url));
    const main = sliceBetween(html, '<main', '</main>');
    const header = sliceBetween(main, 'rule-top', 'stories, newest first');
    const slug = slugOf(url).replace(/\/category\//, '').replace(/\/$/, '');
    // The accent utility (text-global, text-ai, …) lives on the chips.
    const accent = (main.match(/category-chip text-([a-z]+) /) || [])[1] || slug;
    categories.push({
      slug,
      name: strip(header.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? slug),
      description: strip(header.match(/<p class="mt-4 max-w-2xl[^"]*">([\s\S]*?)<\/p>/)?.[1] ?? ''),
      accent,
    });
  }

  // ---- authors ----------------------------------------------------------
  const authors = [];
  for (const url of authorUrls) {
    const html = await text(slugOf(url));
    const main = sliceBetween(html, '<main', '</main>');
    const slug = slugOf(url).replace(/\/author\//, '').replace(/\/$/, '');
    authors.push({
      slug,
      name: strip(main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? slug),
      role: strip(main.match(/<p class="mt-2 font-medium text-primary">([\s\S]*?)<\/p>/)?.[1] ?? ''),
      bio: strip(main.match(/<p class="mt-4 max-w-3xl[^"]*">([\s\S]*?)<\/p>/)?.[1] ?? ''),
    });
  }

  // ---- posts ------------------------------------------------------------
  const index = JSON.parse((await cachedFetch('/search-index.json')).toString('utf8')).posts;
  const byHref = new Map(index.map((p) => [p.href, p]));

  const posts = [];
  for (const url of postUrls) {
    const slug = slugOf(url);
    const html = await text(slug);
    const entry = byHref.get(slug);
    if (!entry) throw new Error(`no search-index entry for ${slug}`);
    const main = sliceBetween(html, '<main', '</main>');
    const opener = sliceBetween(main, 'class="opener"', '</header>');

    const authorSlug = (opener.match(/href="\/author\/([a-z0-9-]+)\//) || [])[1] ?? '';
    const categorySlug = (opener.match(/href="\/category\/([a-z0-9-]+)\//) || [])[1] ?? '';
    const tags = [...main.matchAll(/href="\/tag\/([a-z0-9-]+)\/"[^>]*>([^<]+)</g)].map((m) => ({
      slug: m[1],
      name: decode(m[2]).trim(),
    }));
    const figure = sliceBetween(main, '<figure', '</figure>');
    const imgTag = figure.match(/<img\b[^>]*>/)?.[0] ?? '';
    const creditTag = figure.match(/Image:\s*<a\b[^>]*>([\s\S]*?)<\/a>/);
    const coverFile = (entry.image.src.match(/([^/]+\.jpg)$/) || [])[1];
    if (!coverFile) throw new Error(`no cover for ${slug}`);

    posts.push({
      slug: slug.replace(/^\/post\//, '').replace(/\/$/, ''),
      title: entry.title,
      description: entry.excerpt,
      category: categorySlug,
      author: authorSlug,
      date: toIso(entry.date),
      dateLabel: entry.dateLabel,
      readMinutes: entry.readMinutes,
      tags,
      cover: coverFile,
      coverAlt: entry.image.alt,
      coverWidth: entry.image.width,
      coverHeight: entry.image.height,
      coverCredit: creditTag
        ? { label: strip(creditTag[1]), url: attr(creditTag[0], 'href') }
        : null,
      body: bodyToMarkdown(sliceBetween(main, '<div class="article-body"', '<div class="mt-10"')),
    });
    void imgTag;
  }

  posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));

  console.log(`→ writing ${posts.length} markdown files`);
  for (const post of posts) {
    const fm = [
      '---',
      `title: ${yamlString(post.title)}`,
      `description: ${yamlString(post.description)}`,
      `category: ${post.category}`,
      `author: ${post.author}`,
      `publishedAt: ${post.date}`,
      `readMinutes: ${post.readMinutes}`,
      `tags:`,
      ...post.tags.map((t) => `  - ${t.slug}`),
      `cover: ../../assets/covers/${post.cover}`,
      `coverAlt: ${yamlString(post.coverAlt)}`,
      ...(post.coverCredit
        ? [
            'coverCredit:',
            `  label: ${yamlString(post.coverCredit.label)}`,
            `  url: ${yamlString(post.coverCredit.url)}`,
          ]
        : []),
      '---',
      '',
      post.body,
    ].join('\n');
    await write(path.join(ROOT, 'src/content/posts', `${post.slug}.md`), fm);
  }

  // ---- cover images -----------------------------------------------------
  console.log('→ downloading cover art');
  const covers = new Set(posts.map((p) => p.cover));
  for (const file of covers) {
    const bytes = await cachedFetch(`/_astro/${file}`);
    await write(path.join(ROOT, 'src/assets/covers', file), bytes);
  }

  // ---- fonts, icons, static images --------------------------------------
  console.log('→ downloading fonts, icons and static images');
  const statics = [
    '/favicon.svg',
    '/og-image.png',
    '/icons/close.svg',
    '/icons/linkedin.svg',
    '/icons/menu.svg',
    '/icons/rss.svg',
    '/icons/x.svg',
    '/icons/youtube.svg',
    '/fonts/geist/Geist-Variable-latin.woff2',
    '/fonts/geist/Geist-Variable-latin-ext.woff2',
    '/fonts/geist/Geist-Variable-italic-latin.woff2',
    '/fonts/geist/Geist-Variable-italic-latin-ext.woff2',
    '/fonts/libre-franklin/LibreFranklin-Variable-latin.woff2',
    '/fonts/libre-franklin/LibreFranklin-Variable-latin-ext.woff2',
    '/fonts/ibm-plex-mono/IBMPlexMono-400-latin.woff2',
    '/fonts/ibm-plex-mono/IBMPlexMono-400-latin-ext.woff2',
    '/fonts/ibm-plex-mono/IBMPlexMono-600-latin.woff2',
    '/fonts/ibm-plex-mono/IBMPlexMono-600-latin-ext.woff2',
  ];
  for (const file of statics) {
    const bytes = await cachedFetch(file);
    await write(path.join(ROOT, 'public', file), bytes);
  }

  // ---- route list for the verification scripts --------------------------
  await write(
    path.join(ROOT, 'scripts/reference-routes.json'),
    `${JSON.stringify(urls.map(slugOf), null, 2)}\n`,
  );

  // ---- data modules -----------------------------------------------------
  const ts = (value, indent = 0) => JSON.stringify(value, null, 2).replace(/\n/g, '\n' + ' '.repeat(indent));

  await write(
    path.join(ROOT, 'src/data/authors.ts'),
    `export interface Author {\n  slug: string;\n  name: string;\n  role: string;\n  bio: string;\n}\n\n/** Editorial masthead. */\nexport const authors: Author[] = ${ts(authors)};\n\nexport const authorBySlug = new Map(authors.map((a) => [a.slug, a]));\n`,
  );

  await write(
    path.join(ROOT, 'src/data/categories.ts'),
    `export interface Category {\n  slug: string;\n  name: string;\n  description: string;\n  /** Theme accent token used by \`text-*\` / \`border-*\` utilities. */\n  accent: string;\n}\n\n/**\n * Desks in editorial order. This ordering drives the primary navigation, the\n * footer, the desk index and the homepage desk blocks.\n */\nexport const categories: Category[] = ${ts(
      [...categories].sort(
        (a, b) => CATEGORY_ORDER.indexOf(a.slug) - CATEGORY_ORDER.indexOf(b.slug),
      ),
    )};\n\nexport const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));\n`,
  );

  await write(
    path.join(ROOT, 'src/data/tags.ts'),
    `export interface Tag {\n  slug: string;\n  name: string;\n}\n\n/** Every tag used across the archive, ordered by slug. */\nexport const tags: Tag[] = ${ts(
      [...new Map(posts.flatMap((p) => p.tags).map((t) => [t.slug, t])).values()].sort((a, b) =>
        a.slug.localeCompare(b.slug),
      ),
    )};\n\nexport const tagBySlug = new Map(tags.map((t) => [t.slug, t]));\n`,
  );

  await access(path.join(ROOT, 'src/content/posts')).catch(() => {});
  console.log('✓ import complete');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
