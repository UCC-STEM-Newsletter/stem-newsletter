// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Deployment target: GitHub Pages, project site.
 *
 * The repository is `UCC-STEM-Newsletter/stem-newsletter`, so Pages serves it
 * from a subpath rather than the domain root. `base` makes Astro emit every
 * generated asset and route under that prefix, and `src/lib/url.ts` prefixes
 * the hand-written links to match.
 *
 * Both values are overridable so the same build can go to a custom domain
 * (set BASE_PATH=/ and SITE_URL=https://example.com).
 */
const site = process.env.SITE_URL ?? 'https://ucc-stem-newsletter.github.io';
const base = process.env.BASE_PATH ?? '/stem-newsletter';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: {
    // Emit `post/my-story/index.html` so every route resolves with a trailing
    // slash, matching the canonical URLs and the in-page link style.
    format: 'directory',
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
