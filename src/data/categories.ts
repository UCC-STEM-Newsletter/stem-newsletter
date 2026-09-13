export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Theme accent token used by `text-*` / `border-*` utilities. */
  accent: string;
}

/**
 * Desks in editorial order. This ordering drives the primary navigation, the
 * footer, the desk index and the homepage desk blocks.
 */
export const categories: Category[] = [
  {
    "slug": "global-dispatch",
    "name": "Global Dispatch",
    "description": "Policy, trade rules, and the infrastructure moving technology across borders.",
    "accent": "global"
  },
  {
    "slug": "ai-frontier",
    "name": "AI Frontier",
    "description": "Model releases, inference economics, and the systems being wired around them.",
    "accent": "ai"
  },
  {
    "slug": "market-pulse",
    "name": "Market Pulse",
    "description": "Capital flows, valuations, and the numbers behind the technology cycle.",
    "accent": "market"
  },
  {
    "slug": "ev-shift",
    "name": "EV Shift",
    "description": "Batteries, charging, and the industrial build-out behind electric transport.",
    "accent": "ev"
  },
  {
    "slug": "science-lab",
    "name": "Science Lab",
    "description": "Instruments, materials, and research edging out of the lab.",
    "accent": "science"
  },
  {
    "slug": "startup-watch",
    "name": "Startup Watch",
    "description": "Founders, funding, and the products finding their first real market.",
    "accent": "startup"
  }
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
