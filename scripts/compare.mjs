#!/usr/bin/env node
/**
 * Text parity check.
 *
 * Compares the normalised visible text of every built page against the
 * reference scrape. Catches missing stories, wrong ordering, bad
 * pluralisation, misplaced elements and broken copy.
 *
 * Usage: node scripts/compare.mjs [--limit N]
 */
import {
  loadRoutes,
  readReference,
  readBuilt,
  limitFromArgv,
  requireCache,
} from './lib/reference.mjs';

/** Strip scripts/styles/SVG, then collapse the body to plain text. */
const visibleText = (html) => {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const body = stripped.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? stripped;
  return body
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

await requireCache();
const routes = await loadRoutes();
const limit = limitFromArgv(routes);

let failures = 0;
let checked = 0;

for (const route of routes.slice(0, limit)) {
  const reference = await readReference(route);
  if (!reference) {
    console.log(`skip  ${route} (not cached)`);
    continue;
  }

  const built = await readBuilt(route);
  if (!built) {
    console.log(`FAIL  ${route} — not built`);
    failures += 1;
    continue;
  }

  checked += 1;
  const expected = visibleText(reference);
  const actual = visibleText(built);

  if (expected === actual) {
    console.log(`ok    ${route}`);
    continue;
  }

  failures += 1;
  let i = 0;
  while (i < expected.length && expected[i] === actual[i]) i += 1;
  console.log(`DIFF  ${route}`);
  console.log(`        at ${i}: expected …${expected.slice(Math.max(0, i - 60), i + 90)}`);
  console.log(`                 actual   …${actual.slice(Math.max(0, i - 60), i + 90)}`);
}

if (checked === 0) {
  console.error('\nNo routes compared — is the reference cache populated?');
  process.exit(1);
}

console.log(`\n${checked - failures}/${checked} routes match the reference text exactly`);
process.exit(failures ? 1 : 0);
