/**
 * Internal link helper.
 *
 * GitHub Pages serves a project site from a subpath (`/stem-newsletter/`), and
 * Astro only rewrites the assets it generates itself — hand-written links such
 * as `/about/` are emitted verbatim. Everything internal therefore goes through
 * `withBase`, which makes the site portable to any `base` (including `/` for a
 * custom domain).
 *
 * `import.meta.env.BASE_URL` is `'/'` or `'/stem-newsletter/'` — Astro always
 * gives it a trailing slash.
 */
const BASE = import.meta.env.BASE_URL;

export const withBase = (to: string): string => {
  // External URLs, protocol-relative URLs and bare fragments are not ours to
  // rewrite.
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(to)) return to;

  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  return `${base}${to.startsWith('/') ? to : `/${to}`}`;
};

/** Absolute URL for a site-root path, for canonical links, feeds and JSON-LD. */
export const absoluteUrl = (to: string): string => {
  const site = import.meta.env.SITE;
  return new URL(withBase(to), site).href;
};
