import type { APIContext } from 'astro';
import { withBase } from '../lib/url';

/** `/robots.txt` */
export async function GET(context: APIContext) {
  const origin = (context.site ?? new URL('https://example.com')).origin;

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}${withBase('/sitemap-index.xml')}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
