import type { APIContext } from 'astro';

/** `/robots.txt` */
export async function GET(context: APIContext) {
  const origin = (context.site ?? new URL('https://semnal.xocoweb.workers.dev')).origin;

  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
