/**
 * Homepage composition.
 *
 * The front page is curated rather than purely chronological: a lead story and
 * three supporting rails across the top, then a stack of desk sections. Lists
 * here are slug references into the `posts` collection; each helper falls back
 * to the newest stories when a slug is missing so the page never renders empty.
 */

/** Desks that get their own homepage block, and how they are laid out. */
export type DeskLayout = 'spotlight' | 'grid-3' | 'grid-4';

export interface DeskSection {
  category: string;
  layout: DeskLayout;
  /** Heading blurb overrides the category description when set. */
  blurb?: string;
}

export const home = {
  /** Lead story in the top-left slot. */
  lead: 'lab-grown-sensors-monitor-river-pollution',

  /** Two-up rail beneath the lead. */
  secondary: [
    'yields-pressure-late-stage-startup-valuations',
    'satellite-operators-race-to-close-polar-coverage-gaps',
    'chiplet-startups-pitch-cooler-ai-racks',
    'fleet-depots-become-the-next-grid-frontier',
  ],

  /** The "Latest" rail in the top-right column. */
  latest: [
    'chip-rules-put-new-pressure-on-asia-supply-chains',
    'cities-test-public-data-trusts-for-smart-services',
    'fusion-materials-team-reports-longer-wall-life',
    'synthetic-data-vendors-face-the-audit-moment',
    'founder-led-chip-shops-return-to-specialist-silicon',
  ],

  /** Ranked list under "Most read". */
  mostRead: [
    'undersea-cables-redraw-the-cloud-map',
    'open-model-labs-chase-inference-efficiency',
    'climate-accounting-startup-turns-invoices-into-audit-trails',
    'ai-agents-move-from-demos-to-back-office-work',
    'cloud-spending-reset-reaches-the-boardroom',
    'charging-networks-shift-to-uptime-guarantees',
  ],

  /** Desk blocks further down the page, in display order. */
  desks: [
    { category: 'global-dispatch', layout: 'spotlight' },
    { category: 'ai-frontier', layout: 'grid-3' },
    { category: 'market-pulse', layout: 'grid-3' },
    { category: 'ev-shift', layout: 'grid-4' },
    { category: 'science-lab', layout: 'spotlight' },
    { category: 'startup-watch', layout: 'grid-3' },
  ] satisfies DeskSection[],

  /** How many stories the closing "More from the newsroom" grid shows. */
  moreLimit: 8,

  /** Tags surfaced in the "Topics in play" rail. */
  topicLimit: 14,

  /** Headline ticker across the top of every page. */
  ticker: [
    'lab-grown-sensors-monitor-river-pollution',
    'undersea-cables-redraw-the-cloud-map',
    'open-model-labs-chase-inference-efficiency',
    'climate-accounting-startup-turns-invoices-into-audit-trails',
    'ai-agents-move-from-demos-to-back-office-work',
    'cloud-spending-reset-reaches-the-boardroom',
  ],
} as const;

/** Copy for the homepage promo panel. */
export const editorialBriefing = {
  eyebrow: 'Editorial intelligence',
  heading: 'One focused read before the market opens.',
  body: 'The desk picks a single story each morning and explains what actually changed, in about four minutes.',
  cta: { label: 'Join the briefing', href: '/#newsletter' },
} as const;

/** How many stories each layout slot can hold. */
export const deskCapacity: Record<DeskLayout, number> = {
  spotlight: 5,
  'grid-3': 6,
  'grid-4': 4,
};
