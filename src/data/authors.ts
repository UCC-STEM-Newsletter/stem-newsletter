export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

/** Editorial masthead. */
export const authors: Author[] = [
  {
    "slug": "amira-cole",
    "name": "Amira Cole",
    "role": "Startups Editor",
    "bio": "Amira covers startup strategy, founder operations, and the changing mechanics of venture-backed company building."
  },
  {
    "slug": "elena-park",
    "name": "Elena Park",
    "role": "Mobility Editor",
    "bio": "Elena follows electric mobility, charging infrastructure, fleet operations, and the industrial shift around transport."
  },
  {
    "slug": "mara-ionescu",
    "name": "Mara Ionescu",
    "role": "Global Technology Editor",
    "bio": "Mara reports on global technology policy, infrastructure, connectivity, and the institutions shaping digital markets."
  },
  {
    "slug": "nadia-chen",
    "name": "Nadia Chen",
    "role": "Markets Analyst",
    "bio": "Nadia tracks markets, capital flows, cloud spending, semiconductors, and the financial signals behind technology cycles."
  },
  {
    "slug": "rafael-stone",
    "name": "Rafael Stone",
    "role": "Science Reporter",
    "bio": "Rafael writes about science, research infrastructure, climate systems, quantum computing, and emerging lab-to-market signals."
  },
  {
    "slug": "theo-grant",
    "name": "Theo Grant",
    "role": "AI Correspondent",
    "bio": "Theo covers AI systems, model economics, enterprise adoption, and the infrastructure choices behind applied machine intelligence."
  }
];

export const authorBySlug = new Map(authors.map((a) => [a.slug, a]));
