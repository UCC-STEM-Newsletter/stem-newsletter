/**
 * Homepage composition.
 *
 * Catalyst publishes a handful of stories a month, on no schedule, so the front
 * page cannot assume a deep archive. Instead of fixed blocks that starve at low
 * volume, the composition is derived from how many stories exist: a small
 * archive gets a lead and a grid, a large one gets the full magazine treatment.
 * Nothing needs editing as the archive grows.
 */

/** How many stories exist, and therefore how much page we can fill. */
export type Tier = 'A' | 'B' | 'C';

export interface Composition {
  tier: Tier;
  /** Supporting tiles under the lead. */
  tiles: number;
  /** Items in the "Latest" rail beside the lead. */
  latest: number;
  /**
   * Items in the "Editor's picks" chart. Zero means the block is skipped, which
   * is also what happens when too few curated picks survive de-duplication.
   */
  picks: number;
  /** A desk needs at least this many stories to earn its own block. */
  deskMinimum: number;
  /** Items in the closing catch-all grid; zero means unlimited. */
  closing: number;
}

/**
 * Tier boundaries.
 *
 * - A (1–6): too few stories to split by desk. One lead plus everything else.
 * - B (7–19): enough for a lead, a rail and desk blocks for the fuller desks.
 * - C (20+): the full front page, including the picks chart.
 */
const TIER_C_FROM = 20;
const TIER_B_FROM = 7;

export const tierFor = (count: number): Tier => {
  if (count >= TIER_C_FROM) return 'C';
  if (count >= TIER_B_FROM) return 'B';
  return 'A';
};

/**
 * Plan the front page for a given archive size.
 *
 * `closing: 0` means "show everything left"; every other block is a hard cap
 * that the page clamps to whatever is actually available.
 */
export const compositionFor = (count: number): Composition => {
  const tier = tierFor(count);

  if (tier === 'C') {
    return { tier, tiles: 4, latest: 5, picks: 6, deskMinimum: 2, closing: 8 };
  }
  if (tier === 'B') {
    return { tier, tiles: 3, latest: 4, picks: 6, deskMinimum: 2, closing: 8 };
  }
  return { tier, tiles: 0, latest: 0, picks: 0, deskMinimum: 1, closing: 0 };
};

/**
 * Curated "Editor's picks", newest-interesting-first. Picks already shown in
 * the lead, tiles or Latest rail are skipped, and the block only renders when
 * at least `PICKS_MINIMUM` survive.
 */
/**
 * Curated "Editor's picks", best first.
 *
 * Listed in rank order and interleaved across desks so that whichever ones
 * survive de-duplication still read as a varied chart. Picks already shown in
 * the lead, tiles or Latest rail are skipped, and the whole block is dropped
 * when fewer than `PICKS_MINIMUM` remain — at a small archive that keeps the
 * front page free of a chart that would only repeat everything else on it.
 */
export const picks = [
  'open-model-labs-chase-inference-efficiency',
  'ocean-robots-map-hidden-heat-pockets',
  'fusion-materials-team-reports-longer-wall-life',
  'quantum-error-correction-inches-toward-practicality',
  'model-distillation-labs-race-to-shrink-frontier-models',
  'new-microscope-spots-protein-folding-in-motion',
] as const;

export const PICKS_MINIMUM = 3;

/** Stories offered in the headline ticker beneath the masthead. */
export const TICKER_LIMIT = 6;

/** Tags surfaced in the "Topics in play" rail. */
export const TOPIC_LIMIT = 12;

/** Copy for the promo panel in the top-right column. */
export const editorialBriefing = {
  eyebrow: 'From the editors',
  heading: 'One story worth your time.',
  body: 'Catalyst publishes when there is something worth saying — a single piece explained properly, rather than a feed to keep up with.',
  cta: { label: 'Read the archive', href: '/all-news/' },
} as const;
