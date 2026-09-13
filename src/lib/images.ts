/**
 * Responsive width sets and `sizes` hints, matched to the reference design so
 * each slot downloads roughly the same bytes as the original.
 */

/** Full-bleed leads: homepage hero, desk spotlights, story openers. */
export const leadWidths = [640, 960, 1200, 1600, 1800];

/** Grid cards that occupy a third or a half of the content column. */
export const tileWidths = [360, 480, 720, 960];

/** Cards inside a horizontal rail (mobile "Popular now" carousel). */
export const railWidths = [240, 320, 480, 640];

export const leadSizes = '(min-width: 1024px) 66vw, 100vw';
export const tileSizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw';
export const halfSizes = '(min-width: 1024px) 50vw, 100vw';
export const articleSizes = '(min-width: 1280px) 1216px, calc(100vw - 3rem)';
export const railSizes = '(max-width: 1023px) 72vw, 320px';

/** Square rail thumbnails are pre-cropped, matching the reference markup. */
export const thumbSize = 240;
