// Nigeria Demand Intelligence Data
// Extracted from consolidated analysis of 7 data sources, 513 households, 34 policies, 57 programs

export const DIMENSION_SCORES = [
  { axis: "Geography & Priority", value: 7.3, fullMark: 10 },
  { axis: "Demand Signals", value: 7.2, fullMark: 10 },
  { axis: "Innovation Supply", value: 5.0, fullMark: 10 },
  { axis: "Demand Gaps (inv.)", value: 3.7, fullMark: 10 },
  { axis: "Investment Feasibility", value: 5.6, fullMark: 10 },
];

export const KEY_STATS = {
  signalsExtracted: 247,
  gapsIdentified: 136,
  strategicIntersections: 6,
  dataSourcesAnalyzed: 7,
  consolidatedSignals: 38,
  consolidatedGaps: 34,
  compositeScore: 5.8,
};

export interface DemandSignal {
  id: string;
  title: string;
  strength: number;
  domain: string;
  cluster: string;
  description: string;
  sourceCount: number;
  evidence: string;
}

export interface DemandGap {
  id: string;
  title: string;
  severity: number;
  gapType: string;
  cluster: string;
  description: string;
  blockingEffect: string;
  affectedPopulation: string;
}

export interface Intersection {
  id: string;
  title: string;
  demandSummary: string;
  narrative: string;
  implication: string;
  flagship?: boolean;
}

export interface TracingExample {
  label: string;
  chain: { step: string; value: string }[];
}

export interface DataSource {
  name: string;
  shortName: string;
  signals: number;
  gaps: number;
  description: string;
}

export const TOP_SIGNALS: DemandSignal[] = [
  {
    id: "NDS-007",
    title: "Women's economic empowerment backed by over $1.7B in dedicated programming",
    strength: 8.5,
    domain: "Stakeholders",
    cluster: "Gender Equality & Women's Empowerment",
    description: "World Bank women-focused programs (NFWP-SU $500M, AGILE $1.2B) provide massive funding. 24 of 57 programs target women.",
    sourceCount: 5,
    evidence: "$1.7B in dedicated programming, 24 of 57 programs target women, 71% of stakeholders warn about widening inequality",
  },
  {
    id: "NDS-005",
    title: "Nutrition, health, and food security is the most policy-covered impact area",
    strength: 7.7,
    domain: "Sector",
    cluster: "Nutrition, Health & Food Security",
    description: "20 of 36 policies (55.6%) target nutrition/health/food security. 61% of stakeholders prioritize it.",
    sourceCount: 5,
    evidence: "20 of 36 policies (55.6%), 61% stakeholder priority, ANRiN $232M, IMPACT $650M, 13 CGIAR nutrition innovations",
  },
  {
    id: "NDS-012",
    title: "Agricultural value chain investment without post-harvest loss infrastructure",
    strength: 7.4,
    domain: "Sector",
    cluster: "Value Chain & Market Development",
    description: "Multiple programs invest in value chains (SAPZ $538M, VCN $158M) but post-harvest losses at 30-40% have almost no programming.",
    sourceCount: 6,
    evidence: "SAPZ $538M, VCN $158M, 30-40% post-harvest loss, only 5 CGIAR post-harvest innovations",
  },
  {
    id: "NDS-001",
    title: "Strong farmer demand for solar-powered irrigation in Northern Nigeria",
    strength: 7.1,
    domain: "Sector",
    cluster: "Solar Irrigation & Water Management",
    description: "579 farmers in Kebbi, Kano, and Kaduna demonstrate strong willingness to adopt solar-powered irrigation systems.",
    sourceCount: 7,
    evidence: "579 HH survey, clear preferences for pump capacity and payment terms, DARES $750M + SPIN $500M investments",
  },
  {
    id: "NDS-008",
    title: "Financial resource constraints are the dominant barrier to innovation scaling",
    strength: 7.1,
    domain: "Enabling Environment",
    cluster: "Financial Inclusion & Agricultural Finance",
    description: "82% of stakeholders cite financial resources as the top internal barrier. Only 2 of 57 programs address agricultural finance.",
    sourceCount: 6,
    evidence: "82% stakeholder barrier, 89% demand financial mechanisms, only 2/57 programs, 29/36 policies lack budgets",
  },
  {
    id: "NDS-011",
    title: "Partnership demand-gap paradox: 93% demand but 36% report coordination failures",
    strength: 6.9,
    domain: "Stakeholders",
    cluster: "Stakeholder Partnerships & Coordination",
    description: "Partnerships are the most demanded resource (93%) yet 36% report coordination failures. World Bank dominates.",
    sourceCount: 5,
    evidence: "93% demand partnerships, 79% enabling condition, 36% coordination barrier, 7 PPP programs",
  },
  {
    id: "NDS-003",
    title: "Climate adaptation is the highest-priority demand signal across all stakeholder groups",
    strength: 6.8,
    domain: "Sector",
    cluster: "Climate Adaptation & Resilience",
    description: "86% of stakeholders prioritize climate adaptation. 81.3% of farmers experience climate water stress.",
    sourceCount: 5,
    evidence: "86% stakeholder priority, 81.3% water stress, ACReSAL $700M, NCCP 2021-2030",
  },
  {
    id: "NDS-004",
    title: "National poverty reduction target with massive institutional investment",
    strength: 6.7,
    domain: "Sector",
    cluster: "Poverty Reduction & Livelihoods",
    description: "Goal to lift 100M people out of poverty with dedicated programs and social safety nets.",
    sourceCount: 5,
    evidence: "100M poverty reduction target, NASSP program, multiple safety net interventions",
  },
  {
    id: "NDS-019",
    title: "Dominant World Bank engagement ($5B+) validates demand for agricultural transformation",
    strength: 6.7,
    domain: "Resource & Investment",
    cluster: "Financial Inclusion & Agricultural Finance",
    description: "World Bank is the dominant funder with $5B+ across 10+ programs, validating agricultural transformation demand.",
    sourceCount: 4,
    evidence: "World Bank $5B+, 10+ programs, 22 mentions in program inventory",
  },
  {
    id: "NDS-029",
    title: "14 programs spanning all 5 CGIAR impact areas indicate systems-thinking approach",
    strength: 6.7,
    domain: "Enabling Environment",
    cluster: "Stakeholder Partnerships & Coordination",
    description: "14 programs cover all 5 CGIAR impact areas, suggesting demand for integrated rather than siloed interventions.",
    sourceCount: 4,
    evidence: "14 cross-cutting programs, all 5 CGIAR impact areas, systems-thinking demand",
  },
  {
    id: "NDS-009",
    title: "Zero digital agriculture programs despite strong digital investment and CGIAR supply",
    strength: 6.6,
    domain: "Sector",
    cluster: "Digital Agriculture & Innovation",
    description: "No programs target digital agriculture despite $10B NDEPS, 97.9% phone ownership, and 29 CGIAR digital tools.",
    sourceCount: 5,
    evidence: "0 digital ag programs, $10B NDEPS, 97.9% phone ownership, 29 CGIAR digital tools",
  },
  {
    id: "NDS-028",
    title: "Market conditions are the top external barrier to innovation scaling",
    strength: 6.6,
    domain: "Market Intelligence",
    cluster: "Value Chain & Market Development",
    description: "75% of stakeholders cite market conditions (access, profitability, inflation) as top external barrier.",
    sourceCount: 4,
    evidence: "75% market barrier, price volatility, missing cold chains, post-harvest losses",
  },
  {
    id: "NDS-026",
    title: "Political instability and governance challenges impede innovation scaling",
    strength: 6.5,
    domain: "Enabling Environment",
    cluster: "Conflict, Fragility & Displacement",
    description: "64% of stakeholders cite political factors as external barriers. Conflict affects northern program delivery.",
    sourceCount: 4,
    evidence: "64% political barrier, farmer-herder conflict, NE insurgency",
  },
  {
    id: "NDS-027",
    title: "$1.25B renewable energy investment creates solar-agriculture nexus opportunity",
    strength: 6.3,
    domain: "Resource & Investment",
    cluster: "Solar Irrigation & Water Management",
    description: "DARES ($750M) + SPIN ($500M) create $1.25B investment platform but no solar-irrigation bridge exists.",
    sourceCount: 4,
    evidence: "DARES $750M solar access, SPIN $500M irrigation/hydropower, no solar irrigation bridge",
  },
  {
    id: "NDS-006",
    title: "Youth employment in agriculture is a top institutional priority",
    strength: 6.2,
    domain: "Sector",
    cluster: "Youth & Agricultural Employment",
    description: "60% population under 25, 12+ youth programs, but no agricultural youth policy framework.",
    sourceCount: 5,
    evidence: "60% under 25, 12+ programs, iDICE $618M, N-Power Agro, YEAP",
  },
];

export const TOP_GAPS: DemandGap[] = [
  {
    id: "NDG-001",
    title: "Critical Financial Exclusion: 88.5% of Farmers Lack Input Credit Access",
    severity: 9.5,
    gapType: "Financial",
    cluster: "Financial Access Barriers",
    description: "Prevents acquisition of irrigation equipment, improved inputs, and technology adoption.",
    blockingEffect: "Without credit, even profitable investments (132-378% ROI) cannot be realized.",
    affectedPopulation: "Smallholder farmers across Nigeria, particularly in northern states",
  },
  {
    id: "NDG-005",
    title: "Zero CGIAR Solar Irrigation Innovation Supply Despite Critical Demand",
    severity: 9.0,
    gapType: "Technology",
    cluster: "Solar Irrigation System Gaps",
    description: "Only 1 of 60 Nigeria-targeted innovations is solar-related (a dryer, not irrigation).",
    blockingEffect: "$1.25B in energy/irrigation investments exist without a solar irrigation bridge.",
    affectedPopulation: "5.04M hectares irrigable land; 579+ surveyed farming households",
  },
  {
    id: "NDG-002",
    title: "Absence of Sharia-Compliant Agricultural Financing Products",
    severity: 8.5,
    gapType: "Financial",
    cluster: "Financial Access Barriers",
    description: "Islamic financing is the #1 positive attribute for adoption (coefficient 4.61) but barely exists.",
    blockingEffect: "The most desired financing product is unavailable in northern Nigeria.",
    affectedPopulation: "Muslim farming communities in Kano and Kebbi states",
  },
  {
    id: "NDG-014",
    title: "Pervasive Absence of Budget Allocations: 80.6% of Policies Unfunded",
    severity: 8.5,
    gapType: "Policy",
    cluster: "Policy Implementation Gaps",
    description: "29 of 36 policies lack any financial commitment. Even NATIP has no specified budget.",
    blockingEffect: "Policy demand for agricultural innovation is aspirational, not operational.",
    affectedPopulation: "All stakeholders dependent on policy-backed agricultural programs",
  },
  {
    id: "NDG-015",
    title: "Critically Thin Environmental Health & Biodiversity Policy Coverage",
    severity: 8.5,
    gapType: "Policy",
    cluster: "Policy Implementation Gaps",
    description: "Only 2 policies (5.6%) cover EHB. No policy on soil health or ecosystem services.",
    blockingEffect: "No policy on soil health, agrobiodiversity, or ecosystem services for agriculture.",
    affectedPopulation: "All agricultural communities facing deforestation (3.5% annual loss)",
  },
  {
    id: "NDG-021",
    title: "Political Instability and Governance Challenges Impede Scaling",
    severity: 8.5,
    gapType: "Institutional",
    cluster: "Institutional and Governance Gaps",
    description: "Political instability, government changes, and conflict undermine long-term investment.",
    blockingEffect: "Undermines long-term investment in agricultural innovation programs.",
    affectedPopulation: "64% of stakeholders; conflict-affected NE Nigeria populations",
  },
  {
    id: "NDG-007",
    title: "Near-Total Reliance on Traditional Seed Varieties (~100% in Kebbi/Kano)",
    severity: 8.0,
    gapType: "Technology",
    cluster: "Agricultural Technology Adoption Gaps",
    description: "Improved seed expenditure only NGN 1,940/acre vs NGN 44,762 for traditional seed.",
    blockingEffect: "Limits yield potential and the economic case for irrigation investment.",
    affectedPopulation: "Smallholder farmers in Kebbi, Kano, and Kaduna states",
  },
  {
    id: "NDG-009",
    title: "Severe Extension Service Gaps (56-70% Without Access)",
    severity: 8.0,
    gapType: "Capacity",
    cluster: "Knowledge and Capacity Gaps",
    description: "Without extension support, new technologies cannot be properly adopted or maintained.",
    blockingEffect: "Critical knowledge and training deficit prevents technology adoption.",
    affectedPopulation: "70% of Kaduna farmers; 56.3% crop observations nationally",
  },
  {
    id: "NDG-012",
    title: "Gender Exclusion in Agriculture: 99% Male Farming in Kebbi/Kano",
    severity: 8.0,
    gapType: "Institutional",
    cluster: "Gender and Equity Gaps",
    description: "Women face compounded barriers: 11.3% credit access vs 22.2% men, 2.5 vs 4.0 acres.",
    blockingEffect: "Scaling pathways risk reinforcing gender exclusion despite $1.7B+ programs.",
    affectedPopulation: "Women farmers; 11.3% credit access vs 22.2% for men",
  },
  {
    id: "NDG-010",
    title: "High Unfamiliarity with Modern Irrigation Technologies (70-77% Unaware)",
    severity: 7.8,
    gapType: "Knowledge",
    cluster: "Knowledge and Capacity Gaps",
    description: "70-77% of farmers are unaware of modern irrigation options including solar pumps.",
    blockingEffect: "Cannot demand what you do not know exists.",
    affectedPopulation: "Smallholder farmers across Kebbi, Kano, and Kaduna",
  },
  {
    id: "NDG-011",
    title: "Inadequate Data and Evidence for Demand-Driven Decisions",
    severity: 7.8,
    gapType: "Knowledge",
    cluster: "Knowledge and Capacity Gaps",
    description: "68% of stakeholders report inadequate information for evidence-based decisions.",
    blockingEffect: "Prevents data-driven targeting and investment prioritization.",
    affectedPopulation: "Decision-makers and program designers across the sector",
  },
  {
    id: "NDG-018",
    title: "Market Conditions as Top External Barrier to Innovation Scaling",
    severity: 7.8,
    gapType: "Market",
    cluster: "Market System Gaps",
    description: "75% cite market access, profitability, and inflation as barriers to scaling.",
    blockingEffect: "Innovation adoption undermined by market dysfunction.",
    affectedPopulation: "Farmers and agribusinesses across value chains",
  },
  {
    id: "NDG-024",
    title: "No Post-Harvest Loss Reduction Policy or Programs",
    severity: 7.5,
    gapType: "Policy",
    cluster: "Market System Gaps",
    description: "30-40% perishable crop losses with no cold chain or post-harvest technology programs.",
    blockingEffect: "Value chain investments undermined by massive post-harvest losses.",
    affectedPopulation: "All agricultural producers, especially perishable crop farmers",
  },
  {
    id: "NDG-008",
    title: "Near-Zero Agricultural Mechanization",
    severity: 7.3,
    gapType: "Technology",
    cluster: "Agricultural Technology Adoption Gaps",
    description: "Virtually zero ownership of advanced equipment like tractors or harvesters.",
    blockingEffect: "Manual farming limits productivity and the business case for irrigation.",
    affectedPopulation: "Smallholder farmers relying on manual labor",
  },
  {
    id: "NDG-004",
    title: "Mobile Money Adoption Gap Despite Near-Universal Phone Ownership",
    severity: 6.8,
    gapType: "Infrastructure",
    cluster: "Financial Access Barriers",
    description: "97.9% phone ownership but only 43.7% mobile money accounts.",
    blockingEffect: "Digital payment infrastructure exists but is not utilized for agriculture.",
    affectedPopulation: "54.2% of phone owners without mobile money access",
  },
];

export const INTERSECTIONS: Intersection[] = [
  {
    id: "INT-001",
    title: "Solar Irrigation: Overwhelming Demand Meets Financial Exclusion and Zero CGIAR Supply",
    demandSummary: "98.2% irrigation experience, 81.3% climate water stress, 5.04M hectares irrigable, $1.25B government investment, Islamic financing as #1 preference",
    narrative: "Northern Nigeria presents one of the strongest demand cases for solar irrigation globally. The DCE reveals clear product preferences: shared ownership + Islamic financing + 2-year terms. Yet this massive demand collides with the most severe gap cluster: only 21% access any credit, 88.5% lack input credit, and CGIAR has zero solar irrigation innovations for Nigeria out of 60 in its portfolio.",
    implication: "CGIAR should urgently develop a Nigeria solar irrigation innovation package combining Islamic financing models, shared ownership cooperatives, high-value crop packages, and quality standards. Partner with DARES ($750M) and SPIN ($500M).",
    flagship: true,
  },
  {
    id: "INT-002",
    title: "Climate Adaptation: Universal Need Meets Policy Vacuum and Fragmented Programs",
    demandSummary: "86% stakeholder priority, 81.3% farmer water stress, $700M ACReSAL program, NCCP 2021-2030",
    narrative: "Climate adaptation is the top-ranked priority across all stakeholder groups (86%). Yet there is no dedicated Climate-Smart Agriculture strategy with specific targets or budgets. The climate policies are framework documents without binding mechanisms.",
    implication: "Support development of a standalone Nigerian CSA Strategy. Use ACReSAL ($700M) as an immediate delivery vehicle for climate-resilient innovations.",
    flagship: false,
  },
  {
    id: "INT-003",
    title: "Seed System Modernization: Massive Breeding Supply Meets Zero Farmer Adoption",
    demandSummary: "26 CGIAR crop breeding innovations, national seed policies (2020, 2022), NATIP calls for improved varieties",
    narrative: "CGIAR has 26 crop breeding innovations for Nigeria, but ~100% of farmers in Kebbi and Kano rely on traditional seeds. No dedicated seed system program exists, 56% receive no extension visits. This is a last-mile delivery failure.",
    implication: "Design an integrated seed-to-farmer delivery model combining improved varieties with solar irrigation packages and extension strengthening. Partner with VCN ($158M) and Propcom+ ($118M).",
    flagship: false,
  },
  {
    id: "INT-004",
    title: "Gender-Responsive Agriculture: Strong Policy Commitment Meets Severe Exclusion",
    demandSummary: "4 gender policies, $1.7B+ in women's programs, 24 of 57 programs target women",
    narrative: "Nigeria has one of the strongest gender policy architectures in West Africa. Yet farming in Kebbi and Kano is ~99% male. Women who farm have 11.3% credit access (vs 22.2% men), 2.5 acres (vs 4.0), and 24.2% training rate (vs 56.3%).",
    implication: "Focus on bridging the policy-practice gap. Design solar irrigation models that include women. Use NFWP-SU ($500M) as a delivery channel for gender-responsive agricultural technology.",
    flagship: false,
  },
  {
    id: "INT-005",
    title: "Digital Agriculture: Massive Digital Investment Meets Zero Agricultural Application",
    demandSummary: "97.9% phone ownership, iDICE ($618M), NDEPS ($10B), 29 CGIAR digital tools available",
    narrative: "Nigeria is investing massively in digital infrastructure but zero programs target digital agriculture. Only 43.7% have mobile money despite near-universal phone ownership. CGIAR has 29 digital tools for Nigeria with no delivery vehicle.",
    implication: "Position CGIAR's 29 digital tools as the agricultural layer on Nigeria's digital infrastructure. Design mobile-first advisory services. Partner with iDICE ($618M).",
    flagship: false,
  },
  {
    id: "INT-006",
    title: "Youth in Agriculture: Demographic Pressure Meets Commitment Without Policy Framework",
    demandSummary: "60% population under 25, 12+ youth programs, $618M iDICE, 22 mentions of 'youth' in programs",
    narrative: "Nigeria has the strongest institutional commitment to youth employment in agriculture, but no dedicated youth-in-agriculture policy framework. Programs exist without policy scaffolding for land access, agricultural finance, or agripreneurship.",
    implication: "Help design a National Youth in Agriculture Strategy. Position solar irrigation cooperatives as youth employment enablers.",
    flagship: false,
  },
];

export const TRACING_EXAMPLES: TracingExample[] = [
  {
    label: "Solar Irrigation Demand (Flagship)",
    chain: [
      { step: "Data Source", value: "HHS Survey (579 farmers, Kebbi/Kano/Kaduna)" },
      { step: "Raw Signal", value: "98.2% practice irrigation; 81.3% water stress; DCE preferences" },
      { step: "Consolidated Signal", value: "NDS-001: Strong farmer demand for solar-powered irrigation (7.1/10)" },
      { step: "Domain", value: "Domain 2: Sector" },
      { step: "Dimension", value: "Demand Signals (7.2/10)" },
      { step: "Indicator", value: "1.2.2 Irrigation and water control systems" },
    ],
  },
  {
    label: "Financial Exclusion Gap",
    chain: [
      { step: "Data Source", value: "HHS Raw Data (513 HH) + Stakeholder Survey (28)" },
      { step: "Raw Gap", value: "Only 21% credit access; 88.5% lack input credit; 82% cite finance barrier" },
      { step: "Consolidated Gap", value: "NDG-001: Critical Financial Exclusion (9.5/10 severity)" },
      { step: "Domain", value: "Domain 5: Resource & Investment" },
      { step: "Dimension", value: "Demand Gaps (6.3/10, inverted)" },
      { step: "Indicator", value: "5.7.1 Access to credit among farmers, SMEs, and firms" },
    ],
  },
  {
    label: "Islamic Financing Preference",
    chain: [
      { step: "Data Source", value: "DCE Analysis (513 HH discrete choice experiment)" },
      { step: "Raw Signal", value: "Islamic financing coefficient 4.61 (strongest positive attribute)" },
      { step: "Consolidated Gap", value: "NDG-002: Absence of Sharia-Compliant Products (8.5/10)" },
      { step: "Domain", value: "Domain 4: Enabling Environment" },
      { step: "Dimension", value: "Demand Gaps" },
      { step: "Indicator", value: "4.6.3 Costs of compliance and certification" },
    ],
  },
];

export const DATA_SOURCES: DataSource[] = [
  { name: "Policy/Program Demand Data", shortName: "Policy Data", signals: 170, gaps: 65, description: "34 policy/program documents analyzed" },
  { name: "Solar Irrigation HHS Report", shortName: "HHS Report", signals: 18, gaps: 18, description: "Household survey report, 579 households" },
  { name: "Solar Irrigation Raw Data", shortName: "HHS Data", signals: 11, gaps: 14, description: "Raw data from 513 households" },
  { name: "Stakeholder Survey", shortName: "Stakeholders", signals: 18, gaps: 15, description: "28 expert respondents" },
  { name: "Policies Inventory", shortName: "Policies", signals: 18, gaps: 12, description: "36 national policies analyzed" },
  { name: "Program Inventories", shortName: "Programs", signals: 12, gaps: 12, description: "57 active programs analyzed" },
  { name: "CGIAR PRMS Innovation Supply", shortName: "PRMS", signals: 13, gaps: 7, description: "60 Nigeria innovations from 827 global" },
];

// Cluster colors for signals
export const CLUSTER_COLORS: Record<string, string> = {
  "Solar Irrigation & Water Management": "#0ea5e9",
  "Gender Equality & Women's Empowerment": "#ec4899",
  "Nutrition, Health & Food Security": "#10b981",
  "Value Chain & Market Development": "#f59e0b",
  "Financial Inclusion & Agricultural Finance": "#8b5cf6",
  "Climate Adaptation & Resilience": "#0d9488",
  "Stakeholder Partnerships & Coordination": "#6366f1",
  "Digital Agriculture & Innovation": "#3b82f6",
  "Youth & Agricultural Employment": "#f97316",
  "Poverty Reduction & Livelihoods": "#14b8a6",
  "Conflict, Fragility & Displacement": "#ef4444",
  "Policy & Governance Frameworks": "#a855f7",
  "Pest & Disease Management": "#84cc16",
  "Livestock & Pastoral Systems": "#d97706",
  "Environmental Health & Biodiversity": "#22c55e",
  "Seed Systems & Crop Improvement": "#eab308",
};

export const GAP_TYPE_COLORS: Record<string, string> = {
  Financial: "#ef4444",
  Technology: "#f59e0b",
  Policy: "#8b5cf6",
  Institutional: "#6366f1",
  Capacity: "#0ea5e9",
  Knowledge: "#3b82f6",
  Infrastructure: "#f97316",
  Market: "#ec4899",
};

export const UNIQUE_DOMAINS = [
  "Sector",
  "Stakeholders",
  "Enabling Environment",
  "Resource & Investment",
  "Market Intelligence",
  "Scaling Context",
  "Innovation Portfolio",
];

export const UNIQUE_CLUSTERS = [
  ...new Set([...TOP_SIGNALS.map((s) => s.cluster), ...TOP_GAPS.map((g) => g.cluster)]),
].sort();
