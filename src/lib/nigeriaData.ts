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

export interface RawSource {
  file: string;
  location: string;
  originalId: string;
  evidenceQuote: string;
}

export interface DemandSignal {
  id: string;
  title: string;
  strength: number;
  domain: string;
  cluster: string;
  description: string;
  sourceCount: number;
  evidence: string;
  rawSources: RawSource[];
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
  rawSources: RawSource[];
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DS-006: Women's empowerment programs", originalId: "PR-DS-006", evidenceQuote: "Women are targeted by 24 of 57 unique programs. Dedicated women-focused programs include: Nigeria for Women Program Scale-Up ($500M), AGILE ($500M+$700M additional). Together, women-focused World Bank programs alone exceed $1.7 billion." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "Gender policies: 4 dedicated instruments", originalId: "PI-DS-010", evidenceQuote: "Gender agriculture policies explicitly target mainstreaming gender into agricultural policies, promoting equitable access to productive resources, enhancing women's participation in decision-making." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.1, Table 3", originalId: "SR-DG-012", evidenceQuote: "In Kebbi and Kano States, the farming population sampled is overwhelmingly male (approximately 99%). Kaduna shows a notably different demographic and gender profile, with about 25% female participation." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Indicate your sex / gender", originalId: "SD-DG-008", evidenceQuote: "Male credit access: 22.2% vs Female: 11.3%. Male avg farmland: 4.0 acres vs Female: 2.5 acres." },
    ],
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
    rawSources: [
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "NHFS sheet: 20 of 36 policies", originalId: "PI-DS-002", evidenceQuote: "Key activities include promoting biofortified and micronutrient-rich foods, enhancing nutrition-sensitive agricultural value chains, and improving food safety and post-harvest practices. AFSNS budget: N339.3 billion." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Desired impact areas", originalId: "SS-DS-004", evidenceQuote: "17 of 28 respondents (61%) selected nutrition, health, and food security as a desired impact." },
      { file: "Program Inventories (57 programs)", location: "PR-DS-009: Healthcare & nutrition programs", originalId: "PR-DS-009", evidenceQuote: "At least 12 programs focus on healthcare: ANRiN ($232M), HOPE-PHC ($570M), IMPACT ($650M), NHGSFP, Nutrition 774 Initiative. 'Health' appears 33 times in thematic focus." },
      { file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", location: "Sheet: Sheet1, Row: 4", originalId: "HD-DS-008", evidenceQuote: "Digital transformation, renewable energy, PPP models targeting nutrition, health, food security across policy documents." },
    ],
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DS-005: Value chain programs", originalId: "PR-DS-005", evidenceQuote: "Multiple programs focus on value chains: VCN ($158M, all 5 areas, Northern Nigeria focus), SAPZ ($538M, agro-industrial processing zones), ATASP-1, Propcom+ ($118M)." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PI-DG-008: Post-harvest gap", originalId: "PI-DG-008", evidenceQuote: "Despite the AFSNS mentioning post-harvest practices and NATIP targeting value chains, there is no dedicated policy or strategy for post-harvest loss reduction. Nigeria loses an estimated 30-50% of perishable crops." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-009: Post-harvest program gap", originalId: "PR-DG-009", evidenceQuote: "Only 2 programs mention post-harvest or storage: ATASP-1 and SPIN (in the context of water storage, not crop storage). Despite extensive investment in value chains, no program targets cold chain infrastructure." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: External barriers", originalId: "SS-DG-003", evidenceQuote: "21 of 28 respondents (75%) identified market conditions as an external barrier preventing innovation scaling." },
    ],
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
    rawSources: [
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Have you practiced irrigation before?", originalId: "SD-DS-001", evidenceQuote: "98.2% of households (504/513) have practiced irrigation before." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.8.6, Figure 18", originalId: "SR-DS-006", evidenceQuote: "Climate-induced water stress is not a contested issue, but an intensely felt reality. Across the pooled sample, an overwhelming 81.3% of farmers agree or strongly agree that they are experiencing water stress." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 4.6, Table 28 (Pooled top 10 predicted utilities)", originalId: "SR-DS-001", evidenceQuote: "The highest utility bundles consistently feature shared ownership (2-member or 3-member groups) combined with long-tenor financing. The central, non-negotiable finding is the overwhelming farmer preference for models that minimize individual financial exposure." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 4.0, Table 24 (ML model coefficients)", originalId: "SR-DS-002", evidenceQuote: "Islamic financing emerging as the single most influential positive determinant, yielding the highest pooled coefficient (4.6121) and dominating preferences in Kebbi (7.6102) and Kano (6.2004)." },
      { file: "Program Inventories (57 programs)", location: "PR-DS-004: DARES + SPIN", originalId: "PR-DS-004", evidenceQuote: "DARES ($750M) focuses on solar hybrid mini-grids and stand-alone solar solutions to provide electricity to 17.5 million Nigerians. SPIN ($500M) combines power and irrigation. Together, $1.25B at the energy-agriculture nexus." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Internal barriers to scaling", originalId: "SS-DG-001", evidenceQuote: "23 of 28 respondents (82%) identified financial resources as an internal barrier, making it the top barrier. 25 of 28 (89%) also listed it as a needed resource." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Resources needed for scaling", originalId: "SS-DS-007", evidenceQuote: "25 of 28 respondents (89%) identified financial resources and mechanisms as a needed resource for scaling." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Do you have any access to input credit?", originalId: "SD-DG-001", evidenceQuote: "88.5% lack input credit access (454/513). Only 21% have access to any cash credit." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "Budget analysis across 36 policies", originalId: "PI-DG-007", evidenceQuote: "29 of 36 policies (80.6%) lack any specified budget allocation. Policy demand for agricultural innovation is aspirational, not operational." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Resources needed for scaling", originalId: "SS-DS-006", evidenceQuote: "26 of 28 respondents (93%) identified stakeholder collaboration and partnerships as a needed resource for scaling, the highest of all resource categories." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Enabling conditions for scaling", originalId: "SS-DS-013", evidenceQuote: "22 of 28 respondents (79%) rated strategic partnerships as the most important enabling condition for implementing scaling strategies." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Social conflict external barriers", originalId: "SS-DG-010", evidenceQuote: "10 of 28 respondents (36%) identified social conflict factors (civil war, tensions between groups, displacement) as external barriers to scaling." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-004: PPP programs", originalId: "PR-DG-004", evidenceQuote: "Of 57 unique programs, 37 are government schemes, 11 donor-funded, and only 7 are public-private partnerships. Only 1 program has private sector as primary funding source." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Desired impact areas", originalId: "SS-DS-002", evidenceQuote: "24 of 28 respondents (86%) selected climate adaptation and mitigation as a desired impact, the highest of all impact categories." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.8.6, Figure 18", originalId: "SR-DS-006", evidenceQuote: "Climate-induced water stress is not a contested issue, but an intensely felt reality. Across the pooled sample, an overwhelming 81.3% of farmers agree or strongly agree that they are experiencing water stress." },
      { file: "Program Inventories (57 programs)", location: "PR-DS-001: Climate-smart agriculture programs", originalId: "PR-DS-001", evidenceQuote: "Multiple large-scale programs target climate-smart agriculture: ACReSAL ($700M, all 5 impact areas), Propcom+ ($118M, all 5 areas, FCDO-funded), Farmer Incubator Program for CSA." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "CAM sheet: NCCP 2021-2030", originalId: "PI-DS-001", evidenceQuote: "NCCP objectives include promoting sustainable development through climate-resilient pathways and enhancing adaptive capacity across sectors. NAP Framework specifically targets agriculture and food security." },
    ],
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
    rawSources: [
      { file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", location: "Sheet: Sheet1, Row: 3", originalId: "HD-DS-001", evidenceQuote: "An economic programme that would support the achievement of President Buhari's goal of lifting 100 million people out of poverty would take into consideration not only the salient character of Nigeria's poverty, but also recent headwinds to the economy." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PRLJ sheet: NDP + NPRGS", originalId: "PI-DS-005", evidenceQuote: "NDP targets sustainable economic growth, poverty reduction, job creation, infrastructure improvement, and human capital development with agriculture as a priority sector. NPRGS: USD 1.6 trillion over 10 years." },
      { file: "Program Inventories (57 programs)", location: "PR-DS-008: Social protection programs", originalId: "PR-DS-008", evidenceQuote: "NASSP-SU ($800M -- the single largest program), NG-CARES ($750M), NSIP, NCTP, GEEP form a comprehensive social protection architecture. 'Poverty' appears 11 times in thematic focus." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Desired impact areas", originalId: "SS-DS-003", evidenceQuote: "21 of 28 respondents (75%) selected poverty reduction, livelihoods, and jobs as a desired impact." },
    ],
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DS-002: World Bank programs", originalId: "PR-DS-002", evidenceQuote: "The World Bank is mentioned 22 times as partner/funder. At least 10 programs are World Bank-financed with combined budgets exceeding $5 billion: NASSP-SU ($800M), NG-CARES ($750M), DARES ($750M), ACReSAL ($700M), iDICE ($618M)." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.7, Tables 5-9", originalId: "SR-DS-004", evidenceQuote: "High-value crops -- specifically Pepper, Onion, and Tomatoes -- offer substantially superior Returns on Investment (ROI) and Gross Margins. Pepper ROI in Kebbi: 472.27%. Rice pooled ROI: 215.78%." },
      { file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", location: "Sheet: Sheet1, Rows: 4, 8, 9", originalId: "HD-DS-026", evidenceQuote: "World Bank-funded DARES, SPIN, SAPZ, ACReSAL programs with combined $2.7B+ investment in agricultural transformation infrastructure." },
    ],
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DS-012: Cross-cutting programs", originalId: "PR-DS-012", evidenceQuote: "14 programs appear across all 5 impact areas, indicating recognition that interventions must address climate, nutrition, environment, poverty, and gender simultaneously. These include the largest programs: DARES ($750M), ACReSAL ($700M), RAAMP ($575M)." },
      { file: "Program Inventories (57 programs)", location: "Summary statistics", originalId: "PR-META", evidenceQuote: "Total of 206 entries across 5 CGIAR impact area files. 57 unique programs deduplicated. 14 programs spanning all 5 areas. Total budget where available: $9.67 billion." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Scaling strategies", originalId: "SS-DS-008", evidenceQuote: "23 of 28 respondents (82%) selected 'Localize and contextualize innovations for broad adoption' as the most important scaling strategy." },
    ],
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DG-005: Digital agriculture gap", originalId: "PR-DG-005", evidenceQuote: "While DL4ALL and iDICE ($618M) invest heavily in digital literacy and digital enterprises, no program specifically targets digital agriculture, precision farming, remote sensing for agriculture, or digital extension." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Do you own a mobile phone?", originalId: "SD-DS-009", evidenceQuote: "97.9% mobile phone ownership (502/513)." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "NDAS 2020-2030", originalId: "PI-DS-003", evidenceQuote: "Nigeria Digital Agriculture Strategy (NDAS) 2020-2030 sets ambitious targets: 50% productivity improvement, 50% food wastage reduction, creation of 10 million jobs. Calls for AgTech training and e-extension services." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Enabling factors", originalId: "SS-DS-016", evidenceQuote: "17 of 28 respondents (61%) identified digital innovation availability and affordability as a key enabling factor. 12 of 28 (43%) already use AI/digital assistants for information sourcing." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: External barriers to scaling", originalId: "SS-DG-003", evidenceQuote: "21 of 28 respondents (75%) identified market conditions as an external barrier preventing innovation scaling." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.6, Figures 6 and 7", originalId: "SR-DS-005", evidenceQuote: "The agricultural system across these states is commercialized, not subsistence-based. With the vast majority of harvested output being sold (approximately 69%), far exceeding what is consumed (approximately 21%)." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.7, Table 9", originalId: "SR-DG-013", evidenceQuote: "Rice and Wheat dominate the landscape, accounting for 45% and 25.3% of all observations. While Rice yields a strong ROI of 215.78%, Wheat achieves only 92.78%. High-value crops like Pepper (132.48% ROI) and Onion (189.55% ROI) offer superior returns but are underrepresented." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: External barriers (political)", originalId: "SS-DG-004", evidenceQuote: "18 of 28 respondents (64%) identified political factors (civil unrest, government changes, resource scarcity) as an external barrier." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Social conflict barriers", originalId: "SS-DG-010", evidenceQuote: "10 of 28 respondents (36%) identified social conflict factors (civil war, tensions between groups, displacement) as external barriers to scaling." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-010: Conflict-sensitive gaps", originalId: "PR-DG-010", evidenceQuote: "Only 1 program mentions 'pastoralist' in target groups. No program specifically targets livestock development, animal health, dairy value chains, or poultry in conflict areas." },
    ],
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DS-004: DARES + SPIN", originalId: "PR-DS-004", evidenceQuote: "DARES ($750M) focuses on solar hybrid mini-grids and stand-alone solar solutions to provide electricity to 17.5 million Nigerians. SPIN ($500M) combines power and irrigation. Together, $1.25 billion at the energy-agriculture nexus." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-001: Solar irrigation gap", originalId: "PR-DG-001", evidenceQuote: "DARES ($750M) focuses on solar energy access but not irrigation. SPIN ($500M) focuses on irrigation and hydropower but not solar-powered irrigation. No program explicitly combines solar energy with irrigation." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "Irrigation + Water policies", originalId: "PI-DS-008", evidenceQuote: "Irrigation policy objectives include improving productivity and food security through irrigation, promoting private sector investment, and enhancing institutional capacity for water governance." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PI-DG-005: Solar irrigation policy gap", originalId: "PI-DG-005", evidenceQuote: "Despite the irrigation policy (2015), water resources bill (2020), and climate change policy (2021), there is no specific policy or program for solar-powered irrigation in agriculture." },
    ],
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
    rawSources: [
      { file: "Program Inventories (57 programs)", location: "PR-DS-003: Youth employment programs", originalId: "PR-DS-003", evidenceQuote: "At least 12 programs explicitly target youth employment: N-Power, YEAP, NYSP, NYSE, SKYE II, iDICE, P-YES, NIYEAP, YES-P, LEEP, AGILE, Youth Back to Farm. 'Youth' appears 22 times in thematic focus." },
      { file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", location: "Sheet: Sheet1, Rows: 4, 6", originalId: "HD-DS-016", evidenceQuote: "Youth employment programs with dedicated funding: iDICE ($618M), YEAP, N-Power Agro, linking youth to agriculture and digital enterprises." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Desired impact areas", originalId: "SS-DS-003", evidenceQuote: "21 of 28 respondents (75%) selected poverty reduction, livelihoods, and jobs as a desired impact -- directly linked to youth employment agenda." },
    ],
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
    rawSources: [
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Do you have any access to input credit?", originalId: "SD-DG-001", evidenceQuote: "88.5% lack input credit access (454/513)." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Did you have access to any cash credit source?", originalId: "SD-DG-002", evidenceQuote: "79.1% lack cash credit access (406/513). Only 21% have access to any cash credit." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Internal barriers to scaling", originalId: "SS-DG-001", evidenceQuote: "23 of 28 respondents (82%) identified financial resources as an internal barrier, making it the top barrier." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.7, Tables 5-9", originalId: "SR-DS-004", evidenceQuote: "High-value crops offer ROI of 132-378% but remain inaccessible without credit. Pepper ROI in Kebbi: 472.27%. Rice pooled ROI: 215.78%." },
    ],
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
    rawSources: [
      { file: "innovation_supply_nigeria.json", location: "PRMS solar irrigation category", originalId: "PRMS-Solar-powered irriga", evidenceQuote: "Only 1 solar-related innovation (solar dryer, not irrigation). No solar pump or solar irrigation systems despite strong demand signals from Nigeria's smallholder sector." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-001: Solar irrigation program gap", originalId: "PR-DG-001", evidenceQuote: "DARES ($750M) focuses on solar energy access but not irrigation. SPIN ($500M) focuses on irrigation and hydropower but not solar-powered irrigation. No program explicitly combines solar energy with irrigation." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PI-DG-005: Solar irrigation policy gap", originalId: "PI-DG-005", evidenceQuote: "Despite the irrigation policy (2015), water resources bill (2020), and climate change policy (2021), there is no specific policy or program for solar-powered irrigation in agriculture." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.8.6, Figure 18", originalId: "SR-DG-016", evidenceQuote: "Kebbi is highly cost-sensitive and explicitly rejects the higher expense of the mobile cart option, demanding the most affordable, fixed systems. Cart coefficient: Kebbi -6.4905, Pooled -2.9436." },
    ],
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
    rawSources: [
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 4.0, Table 24 (ML model coefficients)", originalId: "SR-DS-002", evidenceQuote: "Islamic financing emerging as the single most influential positive determinant, yielding the highest pooled coefficient (4.6121) and dominating preferences in Kebbi (7.6102) and Kano (6.2004)." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: What financing option do you prefer?", originalId: "SD-DS-006", evidenceQuote: "52.2% prefer 'BOA Loan - 2 Years' financing. Islamic financing is the top utility driver in the DCE model." },
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 4.0, Table 24; Section 4.6, Table 28", originalId: "SR-DS-003", evidenceQuote: "The two most desired financing products are the BOA 2-year loan and Islamic financing. Critically, all short-term debt is rejected as an acceptable pathway." },
    ],
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
    rawSources: [
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "Budget analysis across 36 policies", originalId: "PI-DG-007", evidenceQuote: "Only 7 of 36 policies (19.4%) specify budgets. 29 policies lack any financial commitment. Most policies are framework documents without binding implementation mechanisms." },
      { file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", location: "Sheet: Sheet1, Row: 3", originalId: "HD-DS-001", evidenceQuote: "An economic programme that would support the achievement of President Buhari's goal of lifting 100 million people out of poverty -- but no explicit funding commitment identified." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "NATIP 2022-2027", originalId: "PI-DS-004", evidenceQuote: "NATIP is Nigeria's flagship agricultural policy emphasizing technology, innovation, and private sector engagement -- but has no specified budget allocation." },
    ],
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
    rawSources: [
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "EHB sheet: 2 of 36 policies", originalId: "PI-DG-001", evidenceQuote: "Only 2 policies (5.6% of total) are classified under Environmental Health & Biodiversity: the National Biosecurity Policy (2022-2026) and the National Forest Policy (2006)." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-002: EHB programs gap", originalId: "PR-DG-002", evidenceQuote: "EHB has only 22 entries (vs. CAM 36, NHFS 45, PRLJ 52, GEYSI 51). 35 of 57 unique programs do NOT cover EHB. 'Biodiversity' appears only 2 times in thematic focus across all programs." },
      { file: "innovation_supply_nigeria.json", location: "PRMS soil health category", originalId: "PRMS-Soil health manageme", evidenceQuote: "Limited innovations specifically addressing soil degradation and fertility management in Nigeria's agricultural context." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: External barriers (political)", originalId: "SS-DG-004", evidenceQuote: "18 of 28 respondents (64%) identified political factors (civil unrest, government changes, resource scarcity) as an external barrier." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Social conflict barriers", originalId: "SS-DG-010", evidenceQuote: "10 of 28 respondents (36%) identified social conflict factors (civil war, tensions between groups, displacement) as external barriers to scaling." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-010: Conflict programs gap", originalId: "PR-DG-010", evidenceQuote: "Only 1 program mentions 'pastoralist' in target groups. No program specifically targets livestock development or animal health in conflict areas." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Free-text governance barriers", originalId: "SS-DG-015", evidenceQuote: "Free-text responses: 'Lack of government policy', 'Policy issue in Government'. Governance challenges compound other barriers." },
    ],
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
    rawSources: [
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.4, Table 4, Figure 4", originalId: "SR-DG-005", evidenceQuote: "The use of traditional seed varieties dominates across all states, with only limited adoption of improved seeds. In Kano and Kebbi States, nearly all farmers, close to 100%, still rely on traditional seeds." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-003: Seed system program gap", originalId: "PR-DG-003", evidenceQuote: "Despite 23 agriculture-related programs, none specifically target seed system development, crop breeding, variety release, or seed multiplication and distribution." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "Seed policies: NSRM 2020 + NASP 2022", originalId: "PI-DS-007", evidenceQuote: "Two seed policies exist -- National Seed Road Map (2020) and National Agricultural Seed Policy (2022) -- but no dedicated seed system program exists to implement them." },
    ],
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
    rawSources: [
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.5, Figure 5", originalId: "SR-DG-006", evidenceQuote: "In Kaduna State, about 70% of farmers reported having no access to extension support, while only around 30% had some form of contact with extension agents." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: crop_repeat, Variable: Did you have any extension visit?", originalId: "SD-DG-014", evidenceQuote: "56.3% of crop observations had no extension visits in the last cropping season." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Did you receive training on irrigation?", originalId: "SD-DG-004", evidenceQuote: "47.6% never received irrigation training in last 10 years (244/513)." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PI-DG-012: Extension policy gap", originalId: "PI-DG-012", evidenceQuote: "Multiple policies reference weak extension services as a challenge (NATIP, Zero Hunger Review, seed policies), yet there is no dedicated extension system reform policy." },
    ],
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
    rawSources: [
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.1, Table 3", originalId: "SR-DG-012", evidenceQuote: "In Kebbi and Kano States, the farming population sampled is overwhelmingly male (approximately 99%). Kaduna shows a notably different demographic and gender profile, with about 25% female participation." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Gender x Credit access", originalId: "SD-DG-008", evidenceQuote: "Male credit access: 22.2% vs Female: 11.3%." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Gender x Farmland", originalId: "SD-DG-009", evidenceQuote: "Male avg farmland: 4.0 acres vs Female: 2.5 acres." },
      { file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", location: "Sheet: Sheet1, Row: 14 (Gender policies)", originalId: "HD-DS-056", evidenceQuote: "Goal: To mainstream gender considerations into Nigeria's climate change processes. Despite 4 gender policies and $1.7B+ in women's programs, farming exclusion persists." },
    ],
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
    rawSources: [
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.8, Figures 8-11", originalId: "SR-DG-004", evidenceQuote: "A major impediment to modern irrigation adoption is a clear information and awareness deficit, best captured by the high percentages of 'Unfamiliar' responses across irrigation methods." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Unfamiliar with Drip", originalId: "SD-DG-005", evidenceQuote: "69.8% unfamiliar with drip irrigation (358/513)." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Unfamiliar with Raintube", originalId: "SD-DG-006", evidenceQuote: "73.5% unfamiliar with raintube (377/513). Gun sprinkler unfamiliarity: 76.8% (394/513)." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Information adequacy rating", originalId: "SS-DG-005", evidenceQuote: "18 of 28 respondents (64%) rated information sources as only 'Somewhat well' meeting their needs, with 1 rating 'Somewhat poorly'. Only 32% said 'Very well'." },
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: Free-text data gaps", originalId: "SS-DG-006", evidenceQuote: "Multiple free-text responses cite specific data gaps: 'Evidence on the impact', 'Insightful data backed with evidence', 'Non Availability of data', 'Science-based evidence and data'." },
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PI-DG-011: Data governance gap", originalId: "PI-DG-011", evidenceQuote: "While the Digital Agriculture Strategy mentions data platforms and several policies reference M&E frameworks, there is no dedicated agricultural statistics or data governance policy." },
    ],
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
    rawSources: [
      { file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", location: "Q: External barriers to scaling", originalId: "SS-DG-003", evidenceQuote: "21 of 28 respondents (75%) identified market conditions as an external barrier preventing innovation scaling." },
      { file: "innovation_supply_nigeria.json", location: "PRMS market access category", originalId: "PRMS-Market access and va", evidenceQuote: "Digital tools exist but are largely research-oriented; limited market-facing or value chain innovations available for Nigeria." },
    ],
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
    rawSources: [
      { file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", location: "PI-DG-008: Post-harvest policy gap", originalId: "PI-DG-008", evidenceQuote: "Despite the AFSNS mentioning post-harvest practices and NATIP targeting value chains, there is no dedicated policy or strategy for post-harvest loss reduction. Nigeria loses an estimated 30-50% of perishable crops." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-009: Post-harvest program gap", originalId: "PR-DG-009", evidenceQuote: "Only 2 programs mention post-harvest or storage: ATASP-1 and SPIN (in the context of water storage, not crop storage). No program targets cold chain infrastructure." },
    ],
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
    rawSources: [
      { file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", location: "Section 3.9, Tables 11-14", originalId: "SR-DG-008", evidenceQuote: "The low level of agricultural mechanization across the board, with virtually zero ownership of advanced equipment like tractors or harvesters." },
      { file: "Program Inventories (57 programs)", location: "PR-DG-008: Mechanization gap", originalId: "PR-DG-008", evidenceQuote: "The term 'mechanization' appears only tangentially in 3 programs. No dedicated mechanization or agricultural equipment program exists in the inventory." },
      { file: "innovation_supply_nigeria.json", location: "PRMS mechanization category", originalId: "PRMS-Mechanization for sm", evidenceQuote: "No innovations addressing farm mechanization, which is a major productivity constraint for smallholder farmers in Nigeria." },
    ],
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
    rawSources: [
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variables: Mobile phone + Mobile money account", originalId: "SD-DG-011", evidenceQuote: "Mobile phone ownership: 97.9% vs Mobile money accounts: 43.7%. Despite near-universal phone ownership, digital financial infrastructure remains underutilized." },
      { file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", location: "Sheet: SPIS 001 FINAL, Variable: Do you own a mobile phone?", originalId: "SD-DS-009", evidenceQuote: "97.9% mobile phone ownership (502/513). Phone type: 98% self-owned." },
    ],
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

export interface InspectorSource {
  name: string;
  file: string;
  type: string;
  signalsExtracted: number;
  gapsExtracted: number;
  keyVariables: string;
}

export const INSPECTOR_SOURCES: InspectorSource[] = [
  { name: "Solar Irrigation HHS Report (579 HH)", file: "Solar Irrigation_HHS_Nigeria_Report_2025.docx", type: "Research report with Discrete Choice Experiment", signalsExtracted: 18, gapsExtracted: 18, keyVariables: "pump preferences, financing models, crop ROI, credit access, climate water stress" },
  { name: "Solar Irrigation Raw Data (513 HH)", file: "Solar_Irrigation_HHS_Data_Nigeria_2025.xlsx", type: "Household survey data (8 sheets, 266 variables)", signalsExtracted: 11, gapsExtracted: 14, keyVariables: "irrigation experience, credit access, mobile money, seed types, extension visits, gender disaggregation" },
  { name: "Stakeholder Profiling Survey (28 respondents)", file: "Survey Data on Stakeholder Profiling Nigeria.xlsx", type: "Expert stakeholder survey (3 groups: facilitators, strategic, innovators)", signalsExtracted: 18, gapsExtracted: 15, keyVariables: "scaling priorities, impact areas, barriers, enabling conditions, resource needs" },
  { name: "Policy/Program Demand Data (34 documents)", file: "Human-Extracted demand data from policy and programs-Nigeria.xlsx", type: "Human-extracted demand data across 18 structured fields", signalsExtracted: 170, gapsExtracted: 65, keyVariables: "needs, goals, calls for action, effective demand, innovation types, CGIAR impact areas" },
  { name: "Policies Inventory (36 policies)", file: "Policies Inventory_Nigeria_by CG impact areas_Charity_Mesay.xlsx", type: "Policy inventory across 5 CGIAR impact area sheets", signalsExtracted: 18, gapsExtracted: 12, keyVariables: "policy instruments, budgets, implementing bodies, coverage gaps, CGIAR alignment" },
  { name: "Program Inventories (57 programs)", file: "Program Inventories (5 files across CGIAR Impact Areas)", type: "Active program analysis (206 entries deduplicated to 57)", signalsExtracted: 12, gapsExtracted: 12, keyVariables: "program budgets, donors, thematic focus, target groups, geographic scope" },
  { name: "CGIAR PRMS Innovation Supply (60 innovations)", file: "innovation_supply_nigeria.json", type: "Innovation portfolio analysis (60 Nigeria-targeted from 827 global)", signalsExtracted: 13, gapsExtracted: 7, keyVariables: "innovation categories, supply-demand gaps, technology readiness, coverage" },
];
