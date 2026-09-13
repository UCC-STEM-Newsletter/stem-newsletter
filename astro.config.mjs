// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://semnal.xocoweb.workers.dev',
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
