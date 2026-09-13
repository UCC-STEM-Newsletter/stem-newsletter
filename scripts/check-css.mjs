#!/usr/bin/env node
/**
 * CSS coverage audit.
 *
 *
 * Every class that appears in the built HTML should be defined by the built
 * stylesheet (or be a known state hook toggled by JavaScript). This catches
 * utility classes that Tailwind could not see because they were assembled
 * dynamically.
 *
 * Usage: node scripts/check-css.mjs
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

/**
 * Classes with no CSS rule by design: JS hooks, structural markers and utility
 * combinations whose styling comes from sibling classes.
 */
const ALLOWED = new Set([
  // Toggled by the client scripts.
  'can-reveal',
  'is-visible',
  'is-dragging',
  'is-hidden',
  'is-detached',
  'has-open-menu',
  'has-open-search',
  'has-open-share',
  // Structural hooks that only position or group utilities.
  'compact-header-actions',
  'desktop-header-actions',
  'theme-icon',
  'settle',
  'reveal',
  'grid-cards',
  'section-rule',
  'opener',
  // Astro/third-party markers.
  'astro-route-announcer',
  'astro-code',
]);

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

const files = await walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const cssFiles = files.filter((f) => f.endsWith('.css'));

const used = new Map();
for (const file of htmlFiles) {
  const html = (await readFile(file, 'utf8')).replace(/<script[\s\S]*?<\/script>/gi, ' ');
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const cls of m[1].split(/\s+/)) {
      if (cls) used.set(cls, (used.get(cls) ?? 0) + 1);
    }
  }
}

const css = (await Promise.all(cssFiles.map((f) => readFile(f, 'utf8')))).join('\n');
// Class names are alphanumerics plus `-`/`_`, with Tailwind's escaped specials
// (e.g. `.leading-\[0\.98\]`). Anything else terminates the name.
const selectors = [...css.matchAll(/\.((?:\\.|[A-Za-z0-9_-])+)/g)].map((m) =>
  m[1].replace(/\\/g, ''),
);
const defined = new Set(selectors);

const missing = [...used.keys()]
  .filter((cls) => !defined.has(cls) && !ALLOWED.has(cls))
  .sort();

console.log(`html files: ${htmlFiles.length}, css files: ${cssFiles.length}`);
console.log(`distinct classes used: ${used.size}, defined in css: ${defined.size}`);

if (missing.length) {
  console.log(`\n${missing.length} class(es) used but not defined:`);
  for (const cls of missing) console.log(`  ${cls}  (used ${used.get(cls)}×)`);
  process.exit(1);
}

console.log('\n✓ every class used in the output has a matching CSS rule');
