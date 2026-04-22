import type { Innovation } from "@/lib/data";

// ─── Type Definitions ──────────────────────────────────────────────────────────

export interface NetworkIndicator {
  id: string;
  label: string;
  themeId: string;
}

export interface NetworkTheme {
  id: string;
  label: string;
  shortLabel: string;
  domainId: string;
  indicators: NetworkIndicator[];
}

export interface NetworkDomain {
  id: string;
  num: number;
  label: string;
  shortLabel: string;
  color: string;
  question: string;
  domainKey: keyof Innovation;
  themes: NetworkTheme[];
}

export interface NetworkScores {
  domains: Record<string, number>;   // 0-10
  themes: Record<string, number>;    // 0-10
  indicators: Record<string, number>; // 0-10
}

// ─── Network Hierarchy ────────────────────────────────────────────────────────

export const NETWORK_DOMAINS: NetworkDomain[] = [
  {
    id: "d1",
    num: 1,
    label: "Scaling Context",
    shortLabel: "Scaling\nContext",
    color: "#0d9488",
    question: "What is the operating environment for scaling?",
    domainKey: "domain_scaling_context",
    themes: [
      {
        id: "t1_1",
        label: "Natural Systems",
        shortLabel: "Natural\nSystems",
        domainId: "d1",
        indicators: [
          { id: "i1_1_1", label: "Climate Data", themeId: "t1_1" },
          { id: "i1_1_2", label: "Soil Quality", themeId: "t1_1" },
          { id: "i1_1_3", label: "Water Availability", themeId: "t1_1" },
        ],
      },
      {
        id: "t1_2",
        label: "Physical Infrastructure",
        shortLabel: "Physical\nInfra.",
        domainId: "d1",
        indicators: [
          { id: "i1_2_1", label: "Roads & Transport", themeId: "t1_2" },
          { id: "i1_2_2", label: "Energy Access", themeId: "t1_2" },
          { id: "i1_2_3", label: "Digital Connectivity", themeId: "t1_2" },
        ],
      },
      {
        id: "t1_3",
        label: "Farming Systems",
        shortLabel: "Farming\nSystems",
        domainId: "d1",
        indicators: [
          { id: "i1_3_1", label: "Crop Productivity", themeId: "t1_3" },
          { id: "i1_3_2", label: "Input Use", themeId: "t1_3" },
          { id: "i1_3_3", label: "Shock Exposure", themeId: "t1_3" },
        ],
      },
      {
        id: "t1_4",
        label: "Socio-Economic",
        shortLabel: "Socio-\nEconomic",
        domainId: "d1",
        indicators: [
          { id: "i1_4_1", label: "Income & Poverty", themeId: "t1_4" },
          { id: "i1_4_2", label: "Gender & Youth", themeId: "t1_4" },
          { id: "i1_4_3", label: "Education & Literacy", themeId: "t1_4" },
        ],
      },
    ],
  },
  {
    id: "d2",
    num: 2,
    label: "Sector",
    shortLabel: "Sector",
    color: "#f59e0b",
    question: "What is the state of the sector being served?",
    domainKey: "domain_sector",
    themes: [
      {
        id: "t2_1",
        label: "Sector Definition",
        shortLabel: "Sector\nDefinition",
        domainId: "d2",
        indicators: [
          { id: "i2_1_1", label: "System Classification", themeId: "t2_1" },
          { id: "i2_1_2", label: "Sub-sector Segments", themeId: "t2_1" },
        ],
      },
      {
        id: "t2_2",
        label: "Performance",
        shortLabel: "Performance",
        domainId: "d2",
        indicators: [
          { id: "i2_2_1", label: "Productivity Metrics", themeId: "t2_2" },
          { id: "i2_2_2", label: "Sustainability", themeId: "t2_2" },
          { id: "i2_2_3", label: "Resilience", themeId: "t2_2" },
        ],
      },
      {
        id: "t2_3",
        label: "Constraints",
        shortLabel: "Constraints",
        domainId: "d2",
        indicators: [
          { id: "i2_3_1", label: "Technical Barriers", themeId: "t2_3" },
          { id: "i2_3_2", label: "Market Failures", themeId: "t2_3" },
          { id: "i2_3_3", label: "Behavioral Barriers", themeId: "t2_3" },
        ],
      },
      {
        id: "t2_4",
        label: "Targets",
        shortLabel: "Targets",
        domainId: "d2",
        indicators: [
          { id: "i2_4_1", label: "Productivity Goals", themeId: "t2_4" },
          { id: "i2_4_2", label: "Inclusion Targets", themeId: "t2_4" },
        ],
      },
    ],
  },
  {
    id: "d3",
    num: 3,
    label: "Stakeholders",
    shortLabel: "Stake-\nholders",
    color: "#8b5cf6",
    question: "Who are the key actors and what do they need?",
    domainKey: "domain_stakeholders",
    themes: [
      {
        id: "t3_1",
        label: "Actor Typology",
        shortLabel: "Actor\nTypology",
        domainId: "d3",
        indicators: [
          { id: "i3_1_1", label: "Innovators & Firms", themeId: "t3_1" },
          { id: "i3_1_2", label: "Investors", themeId: "t3_1" },
          { id: "i3_1_3", label: "End-users", themeId: "t3_1" },
        ],
      },
      {
        id: "t3_2",
        label: "Needs & Preferences",
        shortLabel: "Needs &\nPrefs.",
        domainId: "d3",
        indicators: [
          { id: "i3_2_1", label: "Expressed Needs", themeId: "t3_2" },
          { id: "i3_2_2", label: "Willingness to Adopt", themeId: "t3_2" },
        ],
      },
      {
        id: "t3_3",
        label: "Capacity",
        shortLabel: "Capacity",
        domainId: "d3",
        indicators: [
          { id: "i3_3_1", label: "Technical Capacity", themeId: "t3_3" },
          { id: "i3_3_2", label: "Financial Capacity", themeId: "t3_3" },
          { id: "i3_3_3", label: "Organizational", themeId: "t3_3" },
        ],
      },
      {
        id: "t3_4",
        label: "Networks",
        shortLabel: "Networks",
        domainId: "d3",
        indicators: [
          { id: "i3_4_1", label: "Partnerships", themeId: "t3_4" },
          { id: "i3_4_2", label: "Information Flows", themeId: "t3_4" },
          { id: "i3_4_3", label: "Intermediaries", themeId: "t3_4" },
        ],
      },
    ],
  },
  {
    id: "d4",
    num: 4,
    label: "Enabling Environment",
    shortLabel: "Enabling\nEnv.",
    color: "#6366f1",
    question: "What policies and institutions enable scaling?",
    domainKey: "domain_enabling_env",
    themes: [
      {
        id: "t4_1",
        label: "Policy & Regulation",
        shortLabel: "Policy &\nRegulation",
        domainId: "d4",
        indicators: [
          { id: "i4_1_1", label: "Sector Policies", themeId: "t4_1" },
          { id: "i4_1_2", label: "Trade Rules", themeId: "t4_1" },
          { id: "i4_1_3", label: "Compliance", themeId: "t4_1" },
        ],
      },
      {
        id: "t4_2",
        label: "Institutions",
        shortLabel: "Institutions",
        domainId: "d4",
        indicators: [
          { id: "i4_2_1", label: "Governance Quality", themeId: "t4_2" },
          { id: "i4_2_2", label: "Coordination", themeId: "t4_2" },
          { id: "i4_2_3", label: "Decentralization", themeId: "t4_2" },
        ],
      },
      {
        id: "t4_3",
        label: "Public Programs",
        shortLabel: "Public\nPrograms",
        domainId: "d4",
        indicators: [
          { id: "i4_3_1", label: "Budget Allocation", themeId: "t4_3" },
          { id: "i4_3_2", label: "Extension Services", themeId: "t4_3" },
          { id: "i4_3_3", label: "Implementation", themeId: "t4_3" },
        ],
      },
      {
        id: "t4_4",
        label: "System Constraints",
        shortLabel: "System\nConstraints",
        domainId: "d4",
        indicators: [
          { id: "i4_4_1", label: "Bureaucracy", themeId: "t4_4" },
          { id: "i4_4_2", label: "Regulatory Barriers", themeId: "t4_4" },
          { id: "i4_4_3", label: "Policy Gaps", themeId: "t4_4" },
        ],
      },
    ],
  },
  {
    id: "d5",
    num: 5,
    label: "Resource & Investment",
    shortLabel: "Resource &\nInvest.",
    color: "#0ea5e9",
    question: "What financing is available for scaling?",
    domainKey: "domain_resource_investment",
    themes: [
      {
        id: "t5_1",
        label: "Financial Actors",
        shortLabel: "Financial\nActors",
        domainId: "d5",
        indicators: [
          { id: "i5_1_1", label: "Banks & DFIs", themeId: "t5_1" },
          { id: "i5_1_2", label: "Impact Investors", themeId: "t5_1" },
          { id: "i5_1_3", label: "Fintechs", themeId: "t5_1" },
        ],
      },
      {
        id: "t5_2",
        label: "Financial Instruments",
        shortLabel: "Instruments",
        domainId: "d5",
        indicators: [
          { id: "i5_2_1", label: "Credit Products", themeId: "t5_2" },
          { id: "i5_2_2", label: "Insurance", themeId: "t5_2" },
          { id: "i5_2_3", label: "Digital Finance", themeId: "t5_2" },
        ],
      },
      {
        id: "t5_3",
        label: "Capital Flows",
        shortLabel: "Capital\nFlows",
        domainId: "d5",
        indicators: [
          { id: "i5_3_1", label: "Public vs Private", themeId: "t5_3" },
          { id: "i5_3_2", label: "Investment Pipeline", themeId: "t5_3" },
          { id: "i5_3_3", label: "Disbursement", themeId: "t5_3" },
        ],
      },
      {
        id: "t5_4",
        label: "Access & Inclusion",
        shortLabel: "Access &\nInclusion",
        domainId: "d5",
        indicators: [
          { id: "i5_4_1", label: "Credit Access", themeId: "t5_4" },
          { id: "i5_4_2", label: "Gender Gaps", themeId: "t5_4" },
          { id: "i5_4_3", label: "Rural Outreach", themeId: "t5_4" },
        ],
      },
    ],
  },
  {
    id: "d6",
    num: 6,
    label: "Market Intelligence",
    shortLabel: "Market\nIntel.",
    color: "#ec4899",
    question: "What do market signals tell us about demand?",
    domainKey: "domain_market_intelligence",
    themes: [
      {
        id: "t6_1",
        label: "Demand Trends",
        shortLabel: "Demand\nTrends",
        domainId: "d6",
        indicators: [
          { id: "i6_1_1", label: "Market Size", themeId: "t6_1" },
          { id: "i6_1_2", label: "Growth Rates", themeId: "t6_1" },
          { id: "i6_1_3", label: "Consumption Patterns", themeId: "t6_1" },
        ],
      },
      {
        id: "t6_2",
        label: "Value Chains",
        shortLabel: "Value\nChains",
        domainId: "d6",
        indicators: [
          { id: "i6_2_1", label: "Actor Margins", themeId: "t6_2" },
          { id: "i6_2_2", label: "Cost Structure", themeId: "t6_2" },
          { id: "i6_2_3", label: "Governance", themeId: "t6_2" },
        ],
      },
      {
        id: "t6_3",
        label: "Prices",
        shortLabel: "Prices",
        domainId: "d6",
        indicators: [
          { id: "i6_3_1", label: "Farmgate Prices", themeId: "t6_3" },
          { id: "i6_3_2", label: "Price Volatility", themeId: "t6_3" },
          { id: "i6_3_3", label: "Input Costs", themeId: "t6_3" },
        ],
      },
      {
        id: "t6_4",
        label: "Consumer Behavior",
        shortLabel: "Consumer\nBehavior",
        domainId: "d6",
        indicators: [
          { id: "i6_4_1", label: "Preferences", themeId: "t6_4" },
          { id: "i6_4_2", label: "Willingness to Pay", themeId: "t6_4" },
          { id: "i6_4_3", label: "Segmentation", themeId: "t6_4" },
        ],
      },
    ],
  },
  {
    id: "d7",
    num: 7,
    label: "Innovation Portfolio",
    shortLabel: "Innovation\nPortfolio",
    color: "#14b8a6",
    question: "What innovations are available and at what stage?",
    domainKey: "domain_innovation_portfolio",
    themes: [
      {
        id: "t7_1",
        label: "Innovation Inventory",
        shortLabel: "Inventory",
        domainId: "d7",
        indicators: [
          { id: "i7_1_1", label: "Technologies", themeId: "t7_1" },
          { id: "i7_1_2", label: "Services", themeId: "t7_1" },
          { id: "i7_1_3", label: "Business Models", themeId: "t7_1" },
        ],
      },
      {
        id: "t7_2",
        label: "Readiness & Evidence",
        shortLabel: "Readiness &\nEvidence",
        domainId: "d7",
        indicators: [
          { id: "i7_2_1", label: "Maturity Level", themeId: "t7_2" },
          { id: "i7_2_2", label: "Impact Evidence", themeId: "t7_2" },
          { id: "i7_2_3", label: "Cost-effectiveness", themeId: "t7_2" },
        ],
      },
      {
        id: "t7_3",
        label: "Adoption & Diffusion",
        shortLabel: "Adoption &\nDiffusion",
        domainId: "d7",
        indicators: [
          { id: "i7_3_1", label: "Adoption Rates", themeId: "t7_3" },
          { id: "i7_3_2", label: "Geographic Spread", themeId: "t7_3" },
          { id: "i7_3_3", label: "Barriers", themeId: "t7_3" },
        ],
      },
      {
        id: "t7_4",
        label: "Delivery & Bundling",
        shortLabel: "Delivery &\nBundling",
        domainId: "d7",
        indicators: [
          { id: "i7_4_1", label: "Delivery Channels", themeId: "t7_4" },
          { id: "i7_4_2", label: "Bundling Potential", themeId: "t7_4" },
          { id: "i7_4_3", label: "Partnerships", themeId: "t7_4" },
        ],
      },
    ],
  },
];

// ─── Score Generation ─────────────────────────────────────────────────────────

// A deterministic pseudo-random number from a string seed + index
function seededRand(seed: string, index: number): number {
  let h = 0;
  const s = seed + String(index);
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  // Map to 0..1
  return (Math.abs(h) % 10000) / 10000;
}

function clampScore(v: number): number {
  return +Math.min(10, Math.max(0, v)).toFixed(1);
}

export function generateNetworkScores(innovation: Innovation): NetworkScores {
  const seed = innovation.innovation_name;

  const domains: Record<string, number> = {
    d1: innovation.domain_scaling_context,
    d2: innovation.domain_sector,
    d3: innovation.domain_stakeholders,
    d4: innovation.domain_enabling_env,
    d5: innovation.domain_resource_investment,
    d6: innovation.domain_market_intelligence,
    d7: innovation.domain_innovation_portfolio,
  };

  const themes: Record<string, number> = {};
  const indicators: Record<string, number> = {};

  let themeIdx = 0;
  let indicatorIdx = 0;

  for (const domain of NETWORK_DOMAINS) {
    const domainScore = domains[domain.id];
    for (const theme of domain.themes) {
      // Theme score: parent domain ± 1.5, biased toward domain score
      const variance = (seededRand(seed, themeIdx) - 0.5) * 3.0;
      themes[theme.id] = clampScore(domainScore + variance);
      themeIdx++;

      for (const indicator of theme.indicators) {
        const themeScore = themes[theme.id];
        // Indicator score: parent theme ± 2.0 with more spread
        const iVariance = (seededRand(seed, indicatorIdx + 1000) - 0.5) * 4.0;
        indicators[indicator.id] = clampScore(themeScore + iVariance);
        indicatorIdx++;
      }
    }
  }

  return { domains, themes, indicators };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getArcColor(score: number): string {
  if (score >= 7) return "#10b981"; // green
  if (score >= 5) return "#f59e0b"; // amber
  return "#f43f5e";                 // red
}

// Lookup maps for efficient access
export const THEME_MAP = new Map<string, NetworkTheme>(
  NETWORK_DOMAINS.flatMap((d) => d.themes.map((t) => [t.id, t]))
);

export const DOMAIN_MAP = new Map<string, NetworkDomain>(
  NETWORK_DOMAINS.map((d) => [d.id, d])
);

export const INDICATOR_MAP = new Map<string, NetworkIndicator>(
  NETWORK_DOMAINS.flatMap((d) =>
    d.themes.flatMap((t) => t.indicators.map((i) => [i.id, i]))
  )
);
