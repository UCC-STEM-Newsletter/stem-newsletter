#!/usr/bin/env node
/**
 * Content integrity check.
 *
 * Validates the story collection against the site's desks and masthead: every
 * desk and author a story references must exist, covers must be on disk, and
 * the archive must not carry dead assets. Also prints an inventory so you can
 * see what the front page will actually render.
 *
 * Usage: node scripts/check-content.mjs
 */
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { categories } from '../src/data/categories.ts';
import { authors } from '../src/data/authors.ts';
import { compositionFor } from '../src/data/homepage.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = path.join(ROOT, 'src/content/posts');
const COVERS_DIR = path.join(ROOT, 'src/assets/covers');

const errors = [];
const warnings = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

/**
 * Parse the small, known frontmatter shape: scalars, `key:` + `  - item` lists,
 * and one level of nesting (coverCredit). Not a general YAML parser on purpose.
 */
const parseFrontmatter = (raw) => {
  const end = raw.indexOf('\n---', 3);
  if (!raw.startsWith('---\n') || end === -1) return null;

  const data = {};
  let list = null;

  for (const line of raw.slice(4, end).split('\n')) {
    if (!line.trim()) continue;

    if (/^\s+-\s+/.test(line)) {
      if (list) data[list].push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    if (/^\s/.test(line)) continue; // nested object values are not validated

    const match = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (!match) continue;

    const [, key, value] = match;
    if (value === '') {
      data[key] = [];
      list = key;
    } else {
      data[key] = value;
      list = null;
    }
  }
  return data;
};

const categorySlugs = new Set(categories.map((category) => category.slug));
const authorSlugs = new Set(authors.map((author) => author.slug));

const files = (await readdir(POSTS_DIR)).filter((file) => file.endsWith('.md')).sort();
const stories = [];

for (const file of files) {
  const raw = await readFile(path.join(POSTS_DIR, file), 'utf8');
  const data = parseFrontmatter(raw);

  if (!data) {
    fail(file, 'has no frontmatter block');
    continue;
  }

  for (const required of ['title', 'description', 'category', 'author', 'publishedAt', 'cover']) {
    if (!data[required]) fail(file, `is missing "${required}"`);
  }
  if (!data.coverAlt) warn(file, 'has no coverAlt — the alt text will fall back to empty');

  if (data.category && !categorySlugs.has(data.category)) {
    fail(file, `unknown desk "${data.category}" (known: ${[...categorySlugs].join(', ')})`);
  }
  if (data.author && !authorSlugs.has(data.author)) {
    fail(file, `unknown author "${data.author}" (known: ${[...authorSlugs].join(', ')})`);
  }
  if (data.publishedAt && Number.isNaN(Date.parse(data.publishedAt))) {
    fail(file, `publishedAt "${data.publishedAt}" is not a parseable date`);
  }
  if (data.description && data.description.length > 200) {
    warn(file, `description is ${data.description.length} chars — keep meta descriptions under 200`);
  }

  // Covers live beside the content and are referenced relatively.
  let coverFile = null;
  if (data.cover) {
    coverFile = path.basename(data.cover);
    const onDisk = await access(path.join(COVERS_DIR, coverFile)).then(
      () => true,
      () => false,
    );
    if (!onDisk) fail(file, `cover "${coverFile}" is not in src/assets/covers/`);
  }

  stories.push({
    file,
    slug: file.replace(/\.md$/, ''),
    category: data.category,
    author: data.author,
    featured: data.featured === 'true',
    coverFile,
  });
}

// --- cross-collection checks ----------------------------------------------
const featured = stories.filter((story) => story.featured);
if (featured.length > 1) {
  warn(
    'src/content/posts',
    `${featured.length} stories are marked featured; only the first is used as the lead`,
  );
}

const usedCovers = new Set(stories.map((story) => story.coverFile).filter(Boolean));
const coverFiles = (await readdir(COVERS_DIR)).filter((file) => file.endsWith('.jpg'));
for (const file of coverFiles) {
  if (!usedCovers.has(file)) warn('src/assets/covers', `${file} is not referenced by any story`);
}

// --- inventory -------------------------------------------------------------
const plan = compositionFor(stories.length);
const perDesk = new Map(categories.map((category) => [category.slug, []]));
for (const story of stories) perDesk.get(story.category)?.push(story);

const authorCounts = new Map();
for (const story of stories) {
  authorCounts.set(story.author, (authorCounts.get(story.author) ?? 0) + 1);
}

console.log(`\nContent: ${stories.length} stories in ${path.relative(ROOT, POSTS_DIR)}/`);
console.log(
  `Front page: tier ${plan.tier} — ${plan.splitBand ? 'lead + Latest rail' : 'full-width lead'}` +
    `${plan.picks ? `, up to ${plan.picks} picks` : ''}` +
    `, desks need ${plan.deskMinimum}+ stories\n`,
);

console.log('Desks');
for (const category of categories) {
  const inDesk = perDesk.get(category.slug) ?? [];
  const renders = inDesk.length >= plan.deskMinimum;
  const note = inDesk.length === 0 ? 'empty (shows a "no stories yet" state)' : renders ? 'section' : 'too few for a section';
  console.log(`  ${category.name.padEnd(14)} ${String(inDesk.length).padStart(2)} stories  — ${note}`);
}

console.log('\nAuthors');
for (const author of authors) {
  const count = authorCounts.get(author.slug) ?? 0;
  console.log(`  ${author.name.padEnd(16)} ${String(count).padStart(2)} stories  ${count ? '' : '— no profile page'}`);
}

// --- result ----------------------------------------------------------------
if (warnings.length) {
  console.log(`\n${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  for (const message of warnings) console.log(`  ! ${message}`);
}

if (errors.length) {
  console.log(`\n${errors.length} error${errors.length === 1 ? '' : 's'}`);
  for (const message of errors) console.log(`  ✗ ${message}`);
  process.exit(1);
}

console.log('\n✓ content is consistent');
