export interface Innovation {
  innovation_name: string;
  country: string;
  // 5 Demand Signaling Dimensions (0-10 scores)
  geography_priority_score: number;
  demand_signals_score: number;
  innovation_supply_score: number;
  demand_gaps_score: number;        // INVERSE: higher = more gaps = worse
  investment_feasibility_score: number;
  // Scaling Opportunity (computed: average of 5 dimensions, with demand_gaps inverted)
  scaling_opportunity_score: number;
  // 7 Data Signal Domains (0-10 scores)
  domain_scaling_context: number;
  domain_sector: number;
  domain_stakeholders: number;
  domain_enabling_env: number;
  domain_resource_investment: number;
  domain_market_intelligence: number;
  domain_innovation_portfolio: number;
  // Domain→Dimension Interaction scores (0-10)
  context_geography: number;         // Scaling Context → Geography & Priority
  sector_demand: number;             // Sector → Demand Signals
  stakeholder_demand: number;        // Stakeholders → Demand Signals
  stakeholder_gaps: number;          // Stakeholders → Demand Gaps
  enabling_feasibility: number;      // Enabling Env → Investment Feasibility
  resource_feasibility: number;      // Resource & Investment → Investment Feasibility
  market_feasibility: number;        // Market Intelligence → Investment Feasibility
  market_gaps: number;               // Market Intelligence → Demand Gaps
  portfolio_supply: number;          // Innovation Portfolio → Innovation Supply
  // Metadata
  source_reference: string;
  evidence_date: string;
  scaling_justification: string;
}

export const COUNTRIES = ['Nigeria', 'Bangladesh', 'Kenya', 'Ethiopia', 'Zambia', 'Colombia'] as const;

export type CountryName = typeof COUNTRIES[number];

export interface CountryGeo {
  name: CountryName;
  lat: number;
  lng: number;
  code: string;
}

export const COUNTRY_GEO: CountryGeo[] = [
  { name: 'Nigeria', lat: 9.08, lng: 7.49, code: 'NGA' },
  { name: 'Bangladesh', lat: 23.68, lng: 90.35, code: 'BGD' },
  { name: 'Kenya', lat: -1.29, lng: 36.82, code: 'KEN' },
  { name: 'Ethiopia', lat: 9.02, lng: 38.75, code: 'ETH' },
  { name: 'Zambia', lat: -15.39, lng: 28.32, code: 'ZMB' },
  { name: 'Colombia', lat: 4.71, lng: -74.07, code: 'COL' },
];

export type SignalLevel = 'high' | 'medium' | 'low';

// Signal logic based on demand_gaps_score
// High Gap Signal (red): demand_gaps_score > 6 (severe gaps preventing scaling)
// Moderate Signal (yellow): demand_gaps_score 3-6
// Low Gap Signal (green): demand_gaps_score < 3 (gaps manageable, scaling feasible)
export function getSignalLevel(innovation: Innovation): SignalLevel {
  if (innovation.demand_gaps_score > 6) return 'high';
  if (innovation.demand_gaps_score >= 3) return 'medium';
  return 'low';
}

export function getSignalColor(level: SignalLevel): string {
  if (level === 'high') return 'hsl(0, 85%, 55%)';
  if (level === 'medium') return 'hsl(45, 95%, 55%)';
  return 'hsl(145, 65%, 45%)';
}

export function getSignalLabel(level: SignalLevel): string {
  if (level === 'high') return 'High Gap';
  if (level === 'medium') return 'Moderate';
  return 'Low Gap';
}

function clamp(val: number): number {
  return +Math.min(10, Math.max(0, val)).toFixed(1);
}

function interact(a: number, b: number): number {
  return clamp((a + b) / 2 + (Math.random() * 1.4 - 0.7));
}

function domainScore(base: number): number {
  return clamp(base + (Math.random() * 1.6 - 0.8));
}

function computeScaling(geo: number, dem: number, sup: number, gaps: number, feas: number): number {
  // Scaling Opportunity = average of 5 dimensions with demand_gaps inverted
  return clamp((geo + dem + sup + (10 - gaps) + feas) / 5);
}

function mkInnovation(
  name: string, country: string,
  geo: number, dem: number, sup: number, gaps: number, feas: number,
  source: string, year: string, justification: string
): Innovation {
  const scaling = computeScaling(geo, dem, sup, gaps, feas);
  const avgDim = (geo + dem + sup + feas) / 4;
  return {
    innovation_name: name, country,
    geography_priority_score: geo,
    demand_signals_score: dem,
    innovation_supply_score: sup,
    demand_gaps_score: gaps,
    investment_feasibility_score: feas,
    scaling_opportunity_score: scaling,
    source_reference: source,
    evidence_date: year,
    scaling_justification: justification,
    // Domain scores — weighted toward relevant dimensions
    domain_scaling_context: domainScore(geo * 0.8 + avgDim * 0.2),
    domain_sector: domainScore(dem * 0.7 + sup * 0.3),
    domain_stakeholders: domainScore(dem * 0.5 + (10 - gaps) * 0.5),
    domain_enabling_env: domainScore(feas * 0.7 + avgDim * 0.3),
    domain_resource_investment: domainScore(feas * 0.6 + sup * 0.4),
    domain_market_intelligence: domainScore(dem * 0.6 + feas * 0.4),
    domain_innovation_portfolio: domainScore(sup * 0.7 + geo * 0.3),
    // Domain→Dimension interactions
    context_geography: interact(geo, domainScore(geo)),
    sector_demand: interact(dem, domainScore(dem)),
    stakeholder_demand: interact(dem, domainScore(dem * 0.5 + (10 - gaps) * 0.5)),
    stakeholder_gaps: interact(10 - gaps, domainScore((10 - gaps))),
    enabling_feasibility: interact(feas, domainScore(feas * 0.7 + avgDim * 0.3)),
    resource_feasibility: interact(feas, domainScore(feas * 0.6 + sup * 0.4)),
    market_feasibility: interact(feas, domainScore(dem * 0.6 + feas * 0.4)),
    market_gaps: interact(10 - gaps, domainScore(dem * 0.6 + feas * 0.4)),
    portfolio_supply: interact(sup, domainScore(sup * 0.7 + geo * 0.3)),
  };
}

export const masterData: Innovation[] = [
  mkInnovation("Solar Irrigation Systems", "Nigeria",
    7, 8, 4, 7.5, 5,
    "FAOSTAT / IRENA", "2023",
    "High smallholder demand in northern corridors; supply chain for panels/pumps immature; financing products nascent."),

  mkInnovation("Climate-Resilient Seeds", "Bangladesh",
    8, 9, 8, 2, 8,
    "CGIAR / BRRI", "2024",
    "BR-29 salt-tolerant varieties scaled across coastal zones; strong NARS support; demand gaps largely resolved."),

  mkInnovation("Digital Agri-Finance", "Kenya",
    7, 8, 6, 4, 7,
    "GLoMIP / KNBS", "2023",
    "Mobile money penetration enables rapid disbursement; credit scoring gaps remain for marginal farmers."),

  mkInnovation("Cold Storage Logistics", "Ethiopia",
    8, 7, 3, 8, 4,
    "AfDB / EHDA", "2022",
    "Post-harvest losses exceed 40%; infrastructure deficit in rural highlands; policy support emerging but weak."),

  mkInnovation("Smallholder Mechanization", "Zambia",
    6, 7, 5, 4.5, 6,
    "FAO / IAPRI", "2023",
    "Cooperative-driven tractor pools showing 30% productivity gains; institutional demand signal growing."),

  mkInnovation("Precision Pest Management", "Colombia",
    7, 6, 7, 3.5, 7,
    "CIAT / ICA", "2024",
    "Bio-control agents paired with digital advisory reaching 15k farmers; commercial market pathway forming."),

  mkInnovation("Drip Irrigation Kits", "Nigeria",
    8, 7, 5, 6.5, 5,
    "GLoMIP / NAERLS", "2023",
    "Water-use efficiency gains of 40% documented; affordability and last-mile delivery remain major barriers."),

  mkInnovation("Aquaculture Feed Innovation", "Bangladesh",
    7, 7, 7, 3, 7,
    "WorldFish / DoF", "2024",
    "Local feed formulations reducing import dependency by 25% in SW region; private sector scaling."),

  mkInnovation("Drone-Based Crop Monitoring", "Kenya",
    6, 6, 4, 6, 5,
    "KALRO / GIZ", "2022",
    "Pilot phase in Nakuru County; regulatory framework under development; high-gap on institutional adoption."),

  mkInnovation("Warehouse Receipt System", "Ethiopia",
    7, 7, 4, 5.5, 5,
    "ECX / WFP", "2023",
    "Commodity exchange integration improving price discovery for teff/wheat; rural coverage gaps remain."),

  mkInnovation("Conservation Agriculture", "Zambia",
    7, 7, 6, 3.5, 7,
    "CIMMYT / MAL", "2024",
    "Minimum tillage at 18% national adoption; extension service gaps closing with NGO support."),

  mkInnovation("Biofortified Crops", "Colombia",
    6, 5, 8, 3, 6,
    "HarvestPlus / AGROSAVIA", "2023",
    "Iron-rich beans reaching 200k households; consumer acceptance positive; demand signal moderate."),

  mkInnovation("Mobile Extension Services", "Nigeria",
    7, 8, 3, 7, 5,
    "FMARD / GIZ", "2024",
    "USSD-based advisory reaching 500k farmers; content localization gap for 12 languages; supply thin."),

  mkInnovation("Flood-Tolerant Rice", "Bangladesh",
    9, 9, 9, 1.5, 9,
    "IRRI / BRRI", "2024",
    "Sub1 varieties covering 2.5M hectares; institutional scaling model globally referenced; near-zero gaps."),

  mkInnovation("Soil Health Diagnostics", "Kenya",
    7, 6, 5, 5, 5,
    "ICRAF / SoilCares", "2023",
    "Portable NIR scanners deployed in 8 counties; lab integration and cost reduction gaps persist."),

  mkInnovation("Livestock Insurance", "Ethiopia",
    8, 7, 3, 7, 4,
    "ILRI / Oromia Insurance", "2022",
    "Index-based coverage protecting 50k pastoralists; payout trigger refinement and scale-up gaps remain."),

  mkInnovation("Mushroom Value Chains", "Zambia",
    5, 6, 6, 4, 5,
    "FAO / ZARI", "2024",
    "Urban demand growing 20% YoY; spawn production localized in Lusaka; moderate institutional gap."),

  mkInnovation("Organic Certification Systems", "Colombia",
    6, 5, 7, 3.5, 6,
    "IFOAM / MinAgricultura", "2023",
    "Participatory Guarantee Systems covering 3k farms; EU export compliance advancing; low gap signal."),
];

// ─── Domain Chart Data Generators ─────────────────────────────────────────────

function avg(data: Innovation[], key: keyof Innovation): number {
  if (!data.length) return 0;
  return +(data.reduce((a, b) => a + (Number(b[key]) || 0), 0) / data.length).toFixed(1);
}

export function getScalingContextData(data: Innovation[]) {
  return {
    constraintsVsOpportunities: [
      { name: 'Climate Risk', constraints: +(10 - avg(data, 'domain_scaling_context')).toFixed(1), opportunities: avg(data, 'domain_scaling_context') },
      { name: 'Infrastructure', constraints: +(10 - avg(data, 'domain_resource_investment')).toFixed(1), opportunities: avg(data, 'domain_resource_investment') },
      { name: 'Socio-Economic', constraints: +(10 - avg(data, 'domain_enabling_env')).toFixed(1), opportunities: avg(data, 'domain_enabling_env') },
      { name: 'Value Chain', constraints: +(10 - avg(data, 'domain_market_intelligence')).toFixed(1), opportunities: avg(data, 'domain_market_intelligence') },
    ],
    infrastructureAccess: [
      { name: 'Roads & Transport', value: +(avg(data, 'domain_scaling_context') * 10 + 5).toFixed(0) },
      { name: 'Cold Chain', value: +(avg(data, 'domain_resource_investment') * 8).toFixed(0) },
      { name: 'Digital Connectivity', value: +(avg(data, 'domain_market_intelligence') * 11).toFixed(0) },
      { name: 'Energy Access', value: +(avg(data, 'innovation_supply_score') * 9).toFixed(0) },
    ],
    spatialSuitability: COUNTRIES.map(c => {
      const cd = data.filter(d => d.country === c);
      return { country: c, suitability: cd.length ? avg(cd, 'domain_scaling_context') : 0 };
    }),
  };
}

export function getSectorData(data: Innovation[]) {
  return {
    performanceIndicators: [
      { name: 'Productivity', score: avg(data, 'demand_signals_score') },
      { name: 'Efficiency', score: avg(data, 'innovation_supply_score') },
      { name: 'Resilience', score: avg(data, 'scaling_opportunity_score') },
      { name: 'Sustainability', score: avg(data, 'domain_sector') },
    ],
    constraintsDistribution: [
      { name: 'Water Scarcity', value: 30 },
      { name: 'Energy Access', value: 22 },
      { name: 'Market Access', value: 28 },
      { name: 'Labor Shortage', value: 20 },
    ],
    wefNexus: [
      { axis: 'Water', value: avg(data, 'domain_resource_investment') },
      { axis: 'Energy', value: avg(data, 'innovation_supply_score') },
      { axis: 'Food', value: avg(data, 'demand_signals_score') },
      { axis: 'Climate', value: avg(data, 'domain_scaling_context') },
      { axis: 'Land', value: avg(data, 'domain_sector') },
    ],
  };
}

export function getStakeholderData(data: Innovation[]) {
  return {
    stakeholderTypes: [
      { name: 'Smallholders', value: 40 },
      { name: 'Agri-Business', value: 22 },
      { name: 'Gov & Policy', value: 18 },
      { name: 'NGOs / Dev', value: 12 },
      { name: 'Research', value: 8 },
    ],
    adoptionGaps: COUNTRIES.map(c => {
      const cd = data.filter(d => d.country === c);
      return {
        country: c,
        willingness: cd.length ? avg(cd, 'demand_signals_score') : 0,
        capacity: cd.length ? avg(cd, 'domain_stakeholders') : 0,
      };
    }),
    networkStrength: [
      { name: 'Coordination', score: avg(data, 'domain_stakeholders') },
      { name: 'Info Flow', score: avg(data, 'domain_market_intelligence') },
      { name: 'Trust', score: +(avg(data, 'domain_stakeholders') * 0.9).toFixed(1) },
      { name: 'Inclusivity', score: +(avg(data, 'domain_enabling_env') * 0.85).toFixed(1) },
    ],
  };
}

export function getEnablingEnvData(data: Innovation[]) {
  return {
    policyStrength: COUNTRIES.map(c => {
      const cd = data.filter(d => d.country === c);
      return {
        country: c,
        policy: cd.length ? avg(cd, 'domain_enabling_env') : 0,
        regulatory: cd.length ? +(avg(cd, 'domain_enabling_env') * 0.9 + 0.5).toFixed(1) : 0,
        institutional: cd.length ? avg(cd, 'domain_stakeholders') : 0,
      };
    }),
    governanceQuality: [
      { name: 'Transparency', score: avg(data, 'domain_enabling_env') },
      { name: 'Accountability', score: +(avg(data, 'domain_enabling_env') * 0.85).toFixed(1) },
      { name: 'Participation', score: avg(data, 'domain_stakeholders') },
      { name: 'Rule of Law', score: +(avg(data, 'domain_enabling_env') * 0.92).toFixed(1) },
    ],
  };
}

export function getResourceData(data: Innovation[]) {
  return {
    fundingDistribution: [
      { name: 'Public/Gov', value: 35 },
      { name: 'DFIs/MDBs', value: 28 },
      { name: 'Private', value: 22 },
      { name: 'Blended', value: 15 },
    ],
    financeAccessibility: COUNTRIES.map(c => {
      const cd = data.filter(d => d.country === c);
      return {
        country: c,
        access: cd.length ? avg(cd, 'domain_resource_investment') : 0,
        instruments: cd.length ? +(avg(cd, 'domain_resource_investment') * 0.8 + 0.5).toFixed(1) : 0,
      };
    }),
    riskReturn: [
      { name: 'Solar Irrigation', risk: 6, return: 8 },
      { name: 'Digital Finance', risk: 4, return: 9 },
      { name: 'Cold Storage', risk: 8, return: 7 },
      { name: 'Mechanization', risk: 5, return: 7 },
      { name: 'Bio-Crops', risk: 3, return: 6 },
    ],
  };
}

export function getMarketData(data: Innovation[]) {
  return {
    demandTrends: [
      { month: 'Jan', demand: 5.2, supply: 4.1 },
      { month: 'Feb', demand: 5.5, supply: 4.3 },
      { month: 'Mar', demand: 6.1, supply: 4.5 },
      { month: 'Apr', demand: 6.8, supply: 4.8 },
      { month: 'May', demand: 7.2, supply: 5.0 },
      { month: 'Jun', demand: 7.5, supply: 5.2 },
    ],
    priceSignals: COUNTRIES.map(c => {
      const cd = data.filter(d => d.country === c);
      return {
        country: c,
        volatility: cd.length ? +(Math.random() * 4 + 3).toFixed(1) : 0,
        margin: cd.length ? +(Math.random() * 3 + 2).toFixed(1) : 0,
      };
    }),
    regionalDemand: COUNTRIES.map(c => {
      const cd = data.filter(d => d.country === c);
      return { country: c, demand: cd.length ? avg(cd, 'demand_signals_score') : 0 };
    }),
  };
}

export function getPortfolioData(data: Innovation[]) {
  return {
    readinessLevels: [
      { level: 'Nascent (0-3)', count: data.filter(d => d.innovation_supply_score <= 3).length },
      { level: 'Emerging (4-6)', count: data.filter(d => d.innovation_supply_score > 3 && d.innovation_supply_score <= 6).length },
      { level: 'Strategic (7-8)', count: data.filter(d => d.innovation_supply_score > 6 && d.innovation_supply_score <= 8).length },
      { level: 'Scaled (9-10)', count: data.filter(d => d.innovation_supply_score > 8).length },
    ],
    innovationTypes: [
      { name: 'Technology', value: 35 },
      { name: 'Financial', value: 20 },
      { name: 'Institutional', value: 25 },
      { name: 'Market-based', value: 20 },
    ],
    performanceRadar: [
      { axis: 'Geo Priority', value: avg(data, 'geography_priority_score') },
      { axis: 'Demand Signals', value: avg(data, 'demand_signals_score') },
      { axis: 'Supply', value: avg(data, 'innovation_supply_score') },
      { axis: 'Feasibility', value: avg(data, 'investment_feasibility_score') },
      { axis: 'Evidence Base', value: avg(data, 'domain_innovation_portfolio') },
    ],
  };
}

export interface RegistrySource {
  name: string;
  dimension: string;
  domain: string;
  formats: string[];
  status: 'ACTIVE' | 'VAULTING' | 'EXTRACTING';
  lastRefresh: string;
}

export const masterRegistry: RegistrySource[] = [
  { name: "FAOSTAT Crop Production", dimension: "Geography & Priority", domain: "Scaling Context", formats: ["CSV", "API"], status: "ACTIVE", lastRefresh: "12 Apr 2026" },
  { name: "GLoMIP Price Intelligence", dimension: "Investment Feasibility", domain: "Market Intelligence", formats: ["API", "JSON"], status: "ACTIVE", lastRefresh: "11 Apr 2026" },
  { name: "AfDB Country Diagnostics", dimension: "Investment Feasibility", domain: "Enabling Environment", formats: ["PDF", "XLSX"], status: "ACTIVE", lastRefresh: "08 Apr 2026" },
  { name: "CGIAR Research Outputs", dimension: "Innovation Supply", domain: "Innovation Portfolio", formats: ["PDF", "CSV"], status: "ACTIVE", lastRefresh: "10 Apr 2026" },
  { name: "World Bank LSMS Surveys", dimension: "Demand Signals", domain: "Stakeholders", formats: ["STATA", "CSV"], status: "ACTIVE", lastRefresh: "05 Apr 2026" },
  { name: "IRENA Renewable Energy Data", dimension: "Investment Feasibility", domain: "Resource & Investment", formats: ["CSV", "API"], status: "ACTIVE", lastRefresh: "09 Apr 2026" },
  { name: "WFP VAM Food Prices", dimension: "Demand Gaps", domain: "Market Intelligence", formats: ["API", "CSV"], status: "ACTIVE", lastRefresh: "12 Apr 2026" },
  { name: "Local_Survey_Kwara.csv", dimension: "Demand Signals", domain: "Stakeholders", formats: ["CSV"], status: "VAULTING", lastRefresh: "14 Apr 2026" },
];
