#!/usr/bin/env node
/**
 * Structural parity check.
 *
 * Compares the element/class *shape* of every built page against the reference
 * scrape: same elements, in the same order, with the same utility classes
 * (attribute order is ignored). Catches layout drift such as a missing wrapper,
 * a stray element or a lost active-state class.
 *
 * Usage: node scripts/compare-structure.mjs [--limit N]
 */
import {
  loadRoutes,
  readReference,
  readBuilt,
  limitFromArgv,
  requireCache,
} from './lib/reference.mjs';

/** Elements that carry no layout signal, or are inlined as a single marker. */
const VOID_OR_IGNORED = new Set([
  'source',
  'br',
  'hr',
  'path',
  'circle',
  'rect',
  'use',
  'svg',
  'text',
  'g',
  'defs',
]);

const normalizeClasses = (value) => value.split(/\s+/).filter(Boolean).sort().join(' ');

/** Ordered tag + sorted class list, with text and inline SVG removed. */
const shapeOf = (html) => {
  const body = (html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '<svg/>');

  const nodes = [];
  for (const match of body.matchAll(/<([a-zA-Z0-9]+)([^>]*)>/g)) {
    const tag = match[1];

    if (tag === 'img') {
      const cls = (match[2].match(/class="([^"]*)"/) || [, ''])[1];
      const sizes = (match[2].match(/sizes="([^"]*)"/) || [, ''])[1];
      nodes.push(`img[${normalizeClasses(cls)}|${sizes}]`);
      continue;
    }
    if (VOID_OR_IGNORED.has(tag)) continue;

    const cls = (match[2].match(/class="([^"]*)"/) || [, ''])[1].trim();
    nodes.push(cls ? `${tag}.${normalizeClasses(cls)}` : tag);
  }
  return nodes;
};

await requireCache();
const routes = await loadRoutes();
const limit = limitFromArgv(routes);

let failures = 0;
let checked = 0;

for (const route of routes.slice(0, limit)) {
  const reference = await readReference(route);
  if (!reference) continue;

  const built = await readBuilt(route);
  if (!built) {
    console.log(`FAIL  ${route} — not built`);
    failures += 1;
    continue;
  }

  checked += 1;
  const expected = shapeOf(reference);
  const actual = shapeOf(built);

  let i = 0;
  while (i < expected.length && i < actual.length && expected[i] === actual[i]) i += 1;

  if (expected.length === actual.length && i === expected.length) continue;

  failures += 1;
  console.log(`DIFF  ${route}  (reference ${expected.length} nodes, built ${actual.length})`);
  for (let k = i; k < Math.min(i + 4, Math.max(expected.length, actual.length)); k += 1) {
    console.log(`        @${k} reference: ${expected[k] ?? '—'}`);
    console.log(`        @${k} built:     ${actual[k] ?? '—'}`);
  }
}

if (checked === 0) {
  console.error('\nNo routes compared — is the reference cache populated?');
  process.exit(1);
}

console.log(`\n${checked - failures}/${checked} routes match the reference structure exactly`);
process.exit(failures ? 1 : 0);
