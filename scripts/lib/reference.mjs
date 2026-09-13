/**
 * Shared helpers for the reference-comparison scripts.
 *
 * Both `compare.mjs` (text) and `compare-structure.mjs` (markup shape) walk the
 * same route list, reading the reference page from the local scrape cache and
 * the produced page from `dist/`. Nothing here touches the network.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CACHE = path.join(ROOT, '.scrape-cache');
export const DIST = path.join(ROOT, 'dist');

/** Cache filenames flatten the route path, so `/a/b/` -> `_a_b_`. */
export const cacheKey = (route) => (route === '/' ? '__root__' : route.replace(/[^a-zA-Z0-9._-]+/g, '_'));

/** Built static routes map to `<dist>/<route>index.html`. */
export const distPath = (route) =>
  path.join(DIST, route === '/' ? 'index.html' : `${route.replace(/^\//, '')}index.html`);

/**
 * Preflight: stop when the reference scrape is missing.
 *
 * `.scrape-cache/` is git-ignored, so a fresh clone must import it before the
 * comparisons can mean anything. Reporting a green run over zero routes would
 * be worse than not running at all, so this exits with instructions instead.
 */
export const requireCache = async () => {
  const cached = await readdir(CACHE).catch(() => []);
  if (cached.length === 0) {
    console.error(
      `\nNo reference pages cached in ${path.relative(ROOT, CACHE)}/.\n` +
        'Run `npm run import:content` first — it needs network access.\n',
    );
    process.exit(1);
  }
  return cached.length;
};

/** Every route the reference publication publishes. */
export const loadRoutes = async () =>
  JSON.parse(await readFile(path.join(ROOT, 'scripts/reference-routes.json'), 'utf8'));

/** Reference HTML, or null when the route was never cached. */
export const readReference = (route) =>
  readFile(path.join(CACHE, cacheKey(route)), 'utf8').catch(() => null);

/** Built HTML, or null when the route was not produced. */
export const readBuilt = (route) => readFile(distPath(route), 'utf8').catch(() => null);

/** `--limit N` support so a run can be narrowed while iterating. */
export const limitFromArgv = (routes) => {
  const index = process.argv.indexOf('--limit');
  return index === -1 ? routes.length : Number(process.argv[index + 1]);
};
