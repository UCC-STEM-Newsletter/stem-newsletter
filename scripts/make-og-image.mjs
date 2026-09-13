#!/usr/bin/env node
/**
 * Regenerate the social share card (`public/og-image.png`).
 *
 * The card is drawn as SVG and rasterised with sharp. The brand webfonts are
 * embedded as base64 `@font-face` sources, which librsvg honours, so the
 * wordmark renders in Libre Franklin rather than a system fallback.
 *
 * Usage: node scripts/make-og-image.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/og-image.png');

const WIDTH = 1200;
const HEIGHT = 630;

/** Brand colours, mirroring the tokens in src/styles/global.css. */
const INK = '#0d1220';
const PAPER = '#f7f7f4';
const BLUE = '#1d4ed8';

const DESKS = ['Science', 'Technology', 'Engineering', 'Mathematics'];

const embed = async (relativePath) =>
  (await readFile(path.join(ROOT, 'public', relativePath))).toString('base64');

const [franklin, geist, plex] = await Promise.all([
  embed('fonts/libre-franklin/LibreFranklin-Variable-latin.woff2'),
  embed('fonts/geist/Geist-Variable-latin.woff2'),
  embed('fonts/ibm-plex-mono/IBMPlexMono-600-latin.woff2'),
]);

/** Desk pills, laid out left to right from a running offset. */
let cursor = 0;
const pills = DESKS.map((desk) => {
  const width = desk.length * 14 + 44;
  const svg = `<g transform="translate(${cursor},0)"><rect rx="7" width="${width}" height="48" fill="#ffffff12" stroke="#ffffff26"/><text x="${width / 2}" y="31" text-anchor="middle" class="pill">${desk}</text></g>`;
  cursor += width + 14;
  return svg;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      @font-face { font-family: 'Libre Franklin'; src: url(data:font/woff2;base64,${franklin}) format('woff2'); font-weight: 100 900; }
      @font-face { font-family: 'Geist'; src: url(data:font/woff2;base64,${geist}) format('woff2'); font-weight: 100 900; }
      @font-face { font-family: 'IBM Plex Mono'; src: url(data:font/woff2;base64,${plex}) format('woff2'); font-weight: 600; }
      .eyebrow { font-family: 'IBM Plex Mono'; font-weight: 600; font-size: 19px; letter-spacing: 0.22em; fill: ${PAPER}; opacity: 0.75; }
      .wordmark { font-family: 'Libre Franklin'; font-weight: 800; font-size: 154px; letter-spacing: -0.045em; fill: ${PAPER}; }
      .tagline { font-family: 'Geist'; font-weight: 400; font-size: 31px; fill: ${PAPER}; opacity: 0.82; }
      .pill { font-family: 'IBM Plex Mono'; font-weight: 600; font-size: 17px; letter-spacing: 0.14em; fill: ${PAPER}; opacity: 0.9; }
    </style>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#111a2e"/>
      <stop offset="0.55" stop-color="${INK}"/>
      <stop offset="1" stop-color="#0a0f1c"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)"/>

  <!-- Catalyst mark: a hexagon ring around a solid core. -->
  <g transform="translate(80,74)">
    <path d="M34 2 65.5 20.25v36.5L34 75 2.5 56.75v-36.5z" fill="none" stroke="${BLUE}" stroke-width="6.5" stroke-linejoin="round"/>
    <circle cx="34" cy="38.5" r="11" fill="${BLUE}"/>
  </g>

  <text x="160" y="106" class="eyebrow">STUDENT-LED STEM PUBLICATION</text>

  <text x="80" y="330" class="wordmark">Catalyst</text>
  <text x="84" y="392" class="tagline">Science, technology, engineering, and mathematics</text>

  <g transform="translate(80,486)">${pills}</g>

  <rect x="80" y="576" width="120" height="5" fill="${BLUE}"/>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);

const meta = await sharp(OUT).metadata();
const size = (await readFile(OUT)).length;
console.log(`wrote public/og-image.png — ${meta.width}×${meta.height}, ${(size / 1024).toFixed(1)} kB`);
