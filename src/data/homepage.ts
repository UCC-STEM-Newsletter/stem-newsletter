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
  /**
   * Whether the lead region splits into a hero and a side rail.
   *
   * The two columns of a split region share one grid row, so they always end at
   * the same edge: the hero stretches to fill whatever height the rail needs.
   * That is what keeps the region level, rather than matching item counts by
   * hand. With only a story or two there is nothing to put in a rail, so the
   * lead simply spans the full width.
   */
  splitBand: boolean;
  /** Items in the "Latest" rail beside the lead. */
  latest: number;
  /**
   * Items in the "Editor's picks" chart. Zero means the block is skipped, which
   * is also what happens when too few curated picks survive de-duplication.
   */
  picks: number;
}

/**
 * Tier boundaries.
 *
 * - A (1–7): not enough to fill a rail beside the lead, so the lead runs full
 *   width and everything else sits in one grid.
 * - B (8–19): a lead beside a four-item rail, plus desk blocks for the fuller
 *   desks.
 * - C (20+): the full front page, including the picks chart.
 */
const TIER_C_FROM = 20;
const TIER_B_FROM = 8;

export const tierFor = (count: number): Tier => {
  if (count >= TIER_C_FROM) return 'C';
  if (count >= TIER_B_FROM) return 'B';
  return 'A';
};

/**
 * Plan the front page for a given archive size. Each count is a cap that the
 * page clamps to whatever is actually available.
 */
export const compositionFor = (count: number): Composition => {
  const tier = tierFor(count);

  // The band is exactly as tall as the rail, since the hero fills whatever the
  // rail needs. A two-item rail would make a squat banner of the lead, so the
  // split only starts once the rail can hold a full set.
  if (tier === 'C') {
    return { tier, splitBand: true, latest: 5, picks: 6 };
  }
  if (tier === 'B') {
    return { tier, splitBand: true, latest: 4, picks: 6 };
  }
  return { tier, splitBand: false, latest: 0, picks: 0 };
};

/**
 * Curated "Editor's picks", best first.
 *
 * Listed in rank order and interleaved across desks so that whichever ones
 * survive de-duplication still read as a varied chart. Picks already shown in
 * the lead or Latest rail are skipped, and the whole block is dropped
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
