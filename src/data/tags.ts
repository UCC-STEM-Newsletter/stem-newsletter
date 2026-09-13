export interface Tag {
  slug: string;
  name: string;
}

/** Every tag used across the archive, ordered by slug. */
export const tags: Tag[] = [
  {
    "slug": "agents",
    "name": "Agents"
  },
  {
    "slug": "ai-infrastructure",
    "name": "AI Infrastructure"
  },
  {
    "slug": "ai-startups",
    "name": "AI Startups"
  },
  {
    "slug": "asia",
    "name": "Asia"
  },
  {
    "slug": "automation",
    "name": "Automation"
  },
  {
    "slug": "automotive-software",
    "name": "Automotive Software"
  },
  {
    "slug": "batteries",
    "name": "Batteries"
  },
  {
    "slug": "biotech",
    "name": "Biotech"
  },
  {
    "slug": "charging",
    "name": "Charging"
  },
  {
    "slug": "chiplets",
    "name": "Chiplets"
  },
  {
    "slug": "cities",
    "name": "Cities"
  },
  {
    "slug": "climate",
    "name": "Climate"
  },
  {
    "slug": "climate-tech",
    "name": "Climate Tech"
  },
  {
    "slug": "cloud",
    "name": "Cloud"
  },
  {
    "slug": "commercial-evs",
    "name": "Commercial EVs"
  },
  {
    "slug": "commodities",
    "name": "Commodities"
  },
  {
    "slug": "compliance",
    "name": "Compliance"
  },
  {
    "slug": "computing",
    "name": "Computing"
  },
  {
    "slug": "connectivity",
    "name": "Connectivity"
  },
  {
    "slug": "cybersecurity",
    "name": "Cybersecurity"
  },
  {
    "slug": "data",
    "name": "Data"
  },
  {
    "slug": "data-centers",
    "name": "Data Centers"
  },
  {
    "slug": "defense-tech",
    "name": "Defense Tech"
  },
  {
    "slug": "design",
    "name": "Design"
  },
  {
    "slug": "drug-discovery",
    "name": "Drug Discovery"
  },
  {
    "slug": "dual-use",
    "name": "Dual Use"
  },
  {
    "slug": "earnings",
    "name": "Earnings"
  },
  {
    "slug": "energy",
    "name": "Energy"
  },
  {
    "slug": "energy-storage",
    "name": "Energy Storage"
  },
  {
    "slug": "enterprise",
    "name": "Enterprise"
  },
  {
    "slug": "europe",
    "name": "Europe"
  },
  {
    "slug": "evs",
    "name": "EVs"
  },
  {
    "slug": "finance",
    "name": "Finance"
  },
  {
    "slug": "fintech",
    "name": "Fintech"
  },
  {
    "slug": "fleets",
    "name": "Fleets"
  },
  {
    "slug": "fusion",
    "name": "Fusion"
  },
  {
    "slug": "governance",
    "name": "Governance"
  },
  {
    "slug": "grid",
    "name": "Grid"
  },
  {
    "slug": "hardware",
    "name": "Hardware"
  },
  {
    "slug": "health",
    "name": "Health"
  },
  {
    "slug": "imaging",
    "name": "Imaging"
  },
  {
    "slug": "incubators",
    "name": "Incubators"
  },
  {
    "slug": "inference",
    "name": "Inference"
  },
  {
    "slug": "infrastructure",
    "name": "Infrastructure"
  },
  {
    "slug": "logistics",
    "name": "Logistics"
  },
  {
    "slug": "manufacturing",
    "name": "Manufacturing"
  },
  {
    "slug": "materials",
    "name": "Materials"
  },
  {
    "slug": "model-quality",
    "name": "Model Quality"
  },
  {
    "slug": "ocean-tech",
    "name": "Ocean Tech"
  },
  {
    "slug": "open-models",
    "name": "Open Models"
  },
  {
    "slug": "payments",
    "name": "Payments"
  },
  {
    "slug": "policy",
    "name": "Policy"
  },
  {
    "slug": "publishing",
    "name": "Publishing"
  },
  {
    "slug": "quantum",
    "name": "Quantum"
  },
  {
    "slug": "rates",
    "name": "Rates"
  },
  {
    "slug": "research",
    "name": "Research"
  },
  {
    "slug": "robotics",
    "name": "Robotics"
  },
  {
    "slug": "saas",
    "name": "SaaS"
  },
  {
    "slug": "search",
    "name": "Search"
  },
  {
    "slug": "security",
    "name": "Security"
  },
  {
    "slug": "semiconductors",
    "name": "Semiconductors"
  },
  {
    "slug": "sensors",
    "name": "Sensors"
  },
  {
    "slug": "space",
    "name": "Space"
  },
  {
    "slug": "startups",
    "name": "Startups"
  },
  {
    "slug": "trade",
    "name": "Trade"
  },
  {
    "slug": "trust",
    "name": "Trust"
  },
  {
    "slug": "venture-capital",
    "name": "Venture Capital"
  }
];

export const tagBySlug = new Map(tags.map((t) => [t.slug, t]));
