export interface Innovation {
  innovation_name: string;
  country: string;
  need_score: number;
  effective_demand_score: number;
  supply_score: number;
  scaling_opportunity_score: number;
  source_reference: string;
  evidence_date: string;
  scaling_justification: string;
  need_supply: number;
  demand_scaling: number;
  supply_demand: number;
  supply_scaling: number;
  need_scaling: number;
  scaling_demand: number;
  domain_scaling_context: number;
  domain_sector: number;
  domain_stakeholders: number;
  domain_enabling_env: number;
  domain_resource_ecosystem: number;
  domain_market_intelligence: number;
  domain_innovation_portfolio: number;
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

export function getSignalLevel(innovation: Innovation): SignalLevel {
  const gap = innovation.need_score - innovation.effective_demand_score;
  if (gap > 2) return 'high';
  if (gap > 0) return 'medium';
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

function nexus(a: number, b: number): number {
  return +((a + b) / 2 + (Math.random() - 0.5)).toFixed(1);
}

function domain(base: number): number {
  return +Math.min(10, Math.max(0, base + (Math.random() * 2 - 1))).toFixed(1);
}

function mkInnovation(name: string, country: string, need: number, supply: number, demand: number, scaling: number, source: string, year: string, justification: string): Innovation {
  const avg = (need + supply + demand + scaling) / 4;
  return {
    innovation_name: name, country, need_score: need, supply_score: supply,
    effective_demand_score: demand, scaling_opportunity_score: scaling,
    source_reference: source, evidence_date: year, scaling_justification: justification,
    need_supply: nexus(need, supply), demand_scaling: nexus(demand, scaling),
    supply_demand: nexus(supply, demand), supply_scaling: nexus(supply, scaling),
    need_scaling: nexus(need, scaling), scaling_demand: nexus(scaling, demand),
    domain_scaling_context: domain(avg), domain_sector: domain(avg),
    domain_stakeholders: domain(avg + 0.5), domain_enabling_env: domain(avg - 0.5),
    domain_resource_ecosystem: domain(supply), domain_market_intelligence: domain(demand),
    domain_innovation_portfolio: domain(scaling),
  };
}

export const masterData: Innovation[] = [
  mkInnovation("Solar Irrigation Systems", "Nigeria", 9, 4, 7, 6, "FAOSTAT / IRENA", "2023", "High yield gap reduction potential; limited supply chain maturity in northern corridors."),
  mkInnovation("Climate-Resilient Seeds", "Bangladesh", 8, 8, 9, 9, "CGIAR / BRRI", "2024", "Proven BR-29 salt-tolerant varieties scaled across coastal zones with strong NARS support."),
  mkInnovation("Digital Agri-Finance", "Kenya", 7, 6, 8, 8, "GLoMIP / KNBS", "2023", "Mobile money penetration enables rapid disbursement; credit scoring gaps remain."),
  mkInnovation("Cold Storage Logistics", "Ethiopia", 10, 3, 5, 5, "AfDB / EHDA", "2022", "Massive post-harvest loss (40%+); infrastructure deficit in rural highlands critical."),
  mkInnovation("Smallholder Mechanization", "Zambia", 6, 5, 8, 7, "FAO / IAPRI", "2023", "Cooperative-driven tractor pools showing 30% productivity gains in Eastern Province."),
  mkInnovation("Precision Pest Management", "Colombia", 7, 7, 6, 6, "CIAT / ICA", "2024", "Bio-control agents paired with digital advisory reaching 15k farmers in Cauca."),
  mkInnovation("Drip Irrigation Kits", "Nigeria", 8, 5, 6, 5, "GLoMIP / NAERLS", "2023", "Water-use efficiency gains of 40% documented; affordability barrier for small plots."),
  mkInnovation("Aquaculture Feed Innovation", "Bangladesh", 7, 7, 7, 8, "WorldFish / DoF", "2024", "Local feed formulations reducing import dependency by 25% in SW region."),
  mkInnovation("Drone-Based Crop Monitoring", "Kenya", 6, 4, 7, 7, "KALRO / GIZ", "2022", "Pilot phase in Nakuru County; regulatory framework under development."),
  mkInnovation("Warehouse Receipt System", "Ethiopia", 8, 4, 6, 6, "ECX / WFP", "2023", "Commodity exchange integration enables better price discovery for teff/wheat."),
  mkInnovation("Conservation Agriculture", "Zambia", 7, 6, 7, 8, "CIMMYT / MAL", "2024", "Minimum tillage adoption at 18% nationally; soil health improvements documented."),
  mkInnovation("Biofortified Crops", "Colombia", 6, 8, 5, 7, "HarvestPlus / AGROSAVIA", "2023", "Iron-rich beans reaching 200k households; consumer acceptance studies positive."),
  mkInnovation("Mobile Extension Services", "Nigeria", 7, 3, 8, 6, "FMARD / GIZ", "2024", "USSD-based advisory reaching 500k farmers; content localization needed for 12 languages."),
  mkInnovation("Flood-Tolerant Rice", "Bangladesh", 9, 9, 9, 9, "IRRI / BRRI", "2024", "Sub1 varieties covering 2.5M hectares; institutional scaling model globally referenced."),
  mkInnovation("Soil Health Diagnostics", "Kenya", 7, 5, 6, 6, "ICRAF / SoilCares", "2023", "Portable NIR scanners deployed in 8 counties; lab network integration pending."),
  mkInnovation("Livestock Insurance", "Ethiopia", 8, 3, 7, 5, "ILRI / Oromia Insurance", "2022", "Index-based coverage protecting 50k pastoralists; payout triggers need refinement."),
  mkInnovation("Mushroom Value Chains", "Zambia", 5, 6, 7, 6, "FAO / ZARI", "2024", "Urban market demand growing 20% YoY; spawn production localized in Lusaka."),
  mkInnovation("Organic Certification Systems", "Colombia", 6, 7, 5, 7, "IFOAM / MinAgricultura", "2023", "Participatory Guarantee Systems covering 3k farms; EU export compliance advancing."),
];

// Domain chart data generators
export function getScalingContextData(data: Innovation[]) {
  return {
    constraintsVsOpportunities: [
      { name: 'Climate Risk', constraints: +(10 - avg(data, 'domain_scaling_context')).toFixed(1), opportunities: avg(data, 'domain_scaling_context') },
      { name: 'Infrastructure', constraints: +(10 - avg(data, 'domain_resource_ecosystem')).toFixed(1), opportunities: avg(data, 'domain_resource_ecosystem') },
      { name: 'Socio-Economic', constraints: +(10 - avg(data, 'domain_enabling_env')).toFixed(1), opportunities: avg(data, 'domain_enabling_env') },
      { name: 'Value Chain', constraints: +(10 - avg(data, 'domain_market_intelligence')).toFixed(1), opportunities: avg(data, 'domain_market_intelligence') },
    ],
    infrastructureAccess: [
      { name: 'Roads & Transport', value: +(avg(data, 'domain_scaling_context') * 10 + 5).toFixed(0) },
      { name: 'Cold Chain', value: +(avg(data, 'domain_resource_ecosystem') * 8).toFixed(0) },
      { name: 'Digital Connectivity', value: +(avg(data, 'domain_market_intelligence') * 11).toFixed(0) },
      { name: 'Energy Access', value: +(avg(data, 'supply_score') * 9).toFixed(0) },
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
      { name: 'Productivity', score: avg(data, 'need_score') },
      { name: 'Efficiency', score: avg(data, 'supply_score') },
      { name: 'Resilience', score: avg(data, 'scaling_opportunity_score') },
      { name: 'Sustainability', score: avg(data, 'domain_sector') },
    ],
    constraintsDistribution: [
      { name: 'Water Scarcity', value: +(30 + Math.random() * 10).toFixed(0) },
      { name: 'Energy Access', value: +(20 + Math.random() * 8).toFixed(0) },
      { name: 'Market Access', value: +(25 + Math.random() * 10).toFixed(0) },
      { name: 'Labor Shortage', value: +(15 + Math.random() * 7).toFixed(0) },
    ],
    wefNexus: [
      { axis: 'Water', value: avg(data, 'domain_resource_ecosystem') },
      { axis: 'Energy', value: avg(data, 'supply_score') },
      { axis: 'Food', value: avg(data, 'need_score') },
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
        willingness: cd.length ? avg(cd, 'effective_demand_score') : 0,
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
        regulatory: cd.length ? +(avg(cd, 'domain_enabling_env') * 0.9 + Math.random()).toFixed(1) : 0,
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
        access: cd.length ? avg(cd, 'domain_resource_ecosystem') : 0,
        instruments: cd.length ? +(avg(cd, 'domain_resource_ecosystem') * 0.8 + Math.random()).toFixed(1) : 0,
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
      return { country: c, demand: cd.length ? avg(cd, 'effective_demand_score') : 0 };
    }),
  };
}

export function getPortfolioData(data: Innovation[]) {
  return {
    readinessLevels: [
      { level: 'Nascent (0-3)', count: data.filter(d => d.scaling_opportunity_score <= 3).length },
      { level: 'Emerging (4-6)', count: data.filter(d => d.scaling_opportunity_score > 3 && d.scaling_opportunity_score <= 6).length },
      { level: 'Strategic (7-8)', count: data.filter(d => d.scaling_opportunity_score > 6 && d.scaling_opportunity_score <= 8).length },
      { level: 'Scaled (9-10)', count: data.filter(d => d.scaling_opportunity_score > 8).length },
    ],
    innovationTypes: [
      { name: 'Technology', value: 35 },
      { name: 'Financial', value: 20 },
      { name: 'Institutional', value: 25 },
      { name: 'Market-based', value: 20 },
    ],
    performanceRadar: [
      { axis: 'Need Coverage', value: avg(data, 'need_score') },
      { axis: 'Supply Ready', value: avg(data, 'supply_score') },
      { axis: 'Demand Match', value: avg(data, 'effective_demand_score') },
      { axis: 'Scale Potential', value: avg(data, 'scaling_opportunity_score') },
      { axis: 'Evidence Base', value: avg(data, 'domain_innovation_portfolio') },
    ],
  };
}

function avg(data: Innovation[], key: keyof Innovation): number {
  if (!data.length) return 0;
  return +(data.reduce((a, b) => a + (Number(b[key]) || 0), 0) / data.length).toFixed(1);
}

export interface RegistrySource {
  name: string;
  pillar: string;
  formats: string[];
  status: 'ACTIVE' | 'VAULTING' | 'EXTRACTING';
  lastRefresh: string;
}

export const masterRegistry: RegistrySource[] = [
  { name: "FAOSTAT Crop Production", pillar: "Need / System Gap", formats: ["CSV", "API"], status: "ACTIVE", lastRefresh: "12 Apr 2026" },
  { name: "GLoMIP Price Intelligence", pillar: "Market Intelligence", formats: ["API", "JSON"], status: "ACTIVE", lastRefresh: "11 Apr 2026" },
  { name: "AfDB Country Diagnostics", pillar: "Scaling Opportunity", formats: ["PDF", "XLSX"], status: "ACTIVE", lastRefresh: "08 Apr 2026" },
  { name: "CGIAR Research Outputs", pillar: "Supply / Innovation", formats: ["PDF", "CSV"], status: "ACTIVE", lastRefresh: "10 Apr 2026" },
  { name: "World Bank LSMS Surveys", pillar: "Effective Demand", formats: ["STATA", "CSV"], status: "ACTIVE", lastRefresh: "05 Apr 2026" },
  { name: "IRENA Renewable Energy Data", pillar: "Supply / Infrastructure", formats: ["CSV", "API"], status: "ACTIVE", lastRefresh: "09 Apr 2026" },
  { name: "WFP VAM Food Prices", pillar: "Need / Food Security", formats: ["API", "CSV"], status: "ACTIVE", lastRefresh: "12 Apr 2026" },
  { name: "Local_Survey_Kwara.csv", pillar: "Need / Local Evidence", formats: ["CSV"], status: "VAULTING", lastRefresh: "14 Apr 2026" },
];
