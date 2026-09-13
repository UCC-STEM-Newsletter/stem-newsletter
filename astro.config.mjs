// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

/**
 * Canonical origin for the site.
 *
 * This drives canonical links, Open Graph URLs, the RSS feed and the sitemap,
 * so it must be the real domain before launch. Set `SITE_URL` in the build
 * environment, or edit the fallback below.
 */
const site = process.env.SITE_URL ?? 'https://catalyst.example.com';

// https://astro.build/config
export default defineConfig({
  site,
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
