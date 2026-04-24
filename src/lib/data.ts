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
  // ============================================================================
  // NIGERIA: 20 real demand areas from Wave 1 extraction (7 source files)
  // All scores derived from evidence in signals_from_*.json files
  // ============================================================================
  // Scoring key:
  //   geo = Geography & Priority (0-10): geographic concentration + policy alignment
  //   dem = Demand Signals (0-10): policy commitments + stakeholder needs + survey evidence
  //   sup = Innovation Supply (0-10): CGIAR PRMS innovations matching this area
  //   gaps = Demand Gaps (0-10): INVERSE - higher = more barriers = worse
  //   feas = Investment Feasibility (0-10): funding evidence + ROI + institutional capacity

  // -- 1. Solar Irrigation in Northern Nigeria --
  // THE flagship demand area with deepest evidence base
  // geo 8.5: Concentrated in Kebbi/Kano/Kaduna; 5.04M ha irrigable potential; Northern Nigeria targeted by ACReSAL ($700M), VCN ($158M), SPIN ($500M)
  // dem 9.0: 81.3% farmers report climate-induced water stress; 85.3% own pumps (upgrade market); 69% output sold (commercial); Islamic finance coefficient 4.6121; ROI 132-378% on irrigated crops
  // sup 1.5: Only 1 solar irrigation innovation in PRMS for Nigeria (solar dryer); massive CGIAR supply gap
  // gaps 7.5: Only 21% access formal credit; 50% lack mobile money; near-zero improved seed use; no dedicated solar irrigation program despite $1.25B in separate energy+irrigation investments
  // feas 5.5: DARES $750M + SPIN $500M create enabling environment but not directly solar-irrigation; Kebbi distributed 10,000 units; BOA 2-year loans preferred; hybrid finance appetite positive
  mkInnovation("Solar Irrigation Systems (Northern Nigeria)", "Nigeria",
    8.5, 9.0, 1.5, 7.5, 5.5,
    "HHS/DCE Survey (579 HH), PRMS, Programs Inventory", "2025",
    "Deep HHS/DCE evidence: 81.3% climate water stress, Islamic finance most preferred (coeff 4.6121), ROI 132-378%, but only 21% credit access and 1 CGIAR innovation in PRMS."),

  // -- 2. Climate-Smart Agriculture --
  // geo 8.0: NCCP 2021-2030 national scope; ACReSAL $700M in semi-arid North; Great Green Wall; NAP Framework targets ag as priority
  // dem 8.5: 86% stakeholders select climate adaptation as top impact priority; NCCP explicit demand; 24 PRMS innovations with significant climate targeting
  // sup 7.0: 16 Climate Adaptation innovations in PRMS; 24 with significant climate cross-cutting; FIP-CSA program exists
  // gaps 5.0: No dedicated CSA strategy (policy specificity gap); only 8.3% policies address CAM; framework policies lack budgets
  // feas 7.0: ACReSAL $700M, Propcom+ $118M, multiple World Bank programs; strong donor alignment
  mkInnovation("Climate-Smart Agriculture", "Nigeria",
    8.0, 8.5, 7.0, 5.0, 7.0,
    "Policies Inventory, Programs Inventory, Stakeholder Survey, PRMS", "2025",
    "86% stakeholders prioritize climate adaptation; ACReSAL $700M + Propcom+ $118M; 16 CGIAR climate innovations; but no dedicated CSA policy with budget."),

  // -- 3. Drought-Tolerant Crop Varieties --
  // geo 8.0: Northern Nigeria semi-arid zones; Great Green Wall states; climate vulnerability high
  // dem 7.5: NATIP calls for improved varieties; AFSNS demands biofortification; stakeholder survey confirms food security priority (61%)
  // sup 8.5: 26 Crop Breeding & Genetics innovations in PRMS; strong yam, cassava, maize, cowpea breeding pipelines
  // gaps 4.5: Near-total reliance on traditional seeds in Kebbi/Kano (~100%); seed policy exists but no dedicated program
  // feas 6.5: NASC institutional support; IITA as NATIP partner; seed policies in place (NSRM 2020, NASP 2022)
  mkInnovation("Drought-Tolerant Crop Varieties", "Nigeria",
    8.0, 7.5, 8.5, 4.5, 6.5,
    "PRMS, Policies Inventory, Solar HHS Data", "2025",
    "26 CGIAR breeding innovations in PRMS; NATIP + seed policies signal demand; but near-100% traditional seed use in northern states indicates adoption gap."),

  // -- 4. Nutrition-Sensitive Agriculture --
  // geo 7.0: National scope; NMPFAN targets all 36 states; school feeding nationwide
  // dem 8.5: AFSNS N339.3B budget; NMPFAN N294.75B; 61% stakeholders prioritize nutrition/health/food security; ANRiN $232M
  // sup 6.0: 13 Nutrition & Food Security innovations in PRMS; 35 with significant nutrition cross-cutting; biofortified crops
  // gaps 4.0: Strong policy framework in place; multiple implementing bodies; some coordination challenges
  // feas 8.0: Most well-funded policy area: AFSNS N339.3B + NMPFAN N294.75B + NHGSFP + ANRiN $232M; donor convergence (UNICEF, Gates, EU, USAID)
  mkInnovation("Nutrition-Sensitive Agriculture", "Nigeria",
    7.0, 8.5, 6.0, 4.0, 8.0,
    "Policies Inventory, Programs Inventory, PRMS", "2025",
    "Strongest budget signals: AFSNS N339.3B + NMPFAN N294.75B; 20 NHFS policies (55.6% of total); donor convergence; 13 PRMS nutrition innovations."),

  // -- 5. Digital Agricultural Advisory Services --
  // geo 6.5: National digital economy agenda; but rural connectivity gaps; DL4ALL program
  // dem 7.0: NDAS 2020-2030 targets 50% productivity improvement via digital; 61% stakeholders want digital innovation; NATIP calls for e-extension
  // sup 8.0: 29 Digital Tools & Data innovations in PRMS -- highest category; FARRMS, AquaIndex, etc.
  // gaps 6.5: No agriculture-specific digital programs despite $618M iDICE; 68% stakeholders report info inadequacy; rural connectivity gap
  // feas 5.5: NDEPS $10B digital economy budget; DL4ALL, iDICE $618M; but none agriculture-specific; 97.9% phone ownership, 43.7% mobile money
  mkInnovation("Digital Agricultural Advisory Services", "Nigeria",
    6.5, 7.0, 8.0, 6.5, 5.5,
    "Policies Inventory, Programs Inventory, PRMS, Stakeholder Survey", "2025",
    "29 CGIAR digital innovations (highest PRMS category); NDAS targets 50% productivity via digital; but zero agriculture-specific digital programs."),

  // -- 6. Smallholder Financial Inclusion --
  // geo 7.5: Northern Nigeria acute; but national relevance; ABP nationwide
  // dem 8.0: 89% stakeholders identify financial resources as needed; Islamic finance highest DCE coefficient (4.6121); 82% cite finance as top barrier
  // sup 3.0: No CGIAR financial inclusion innovations in PRMS for Nigeria; this is not a CGIAR core area
  // gaps 8.5: Only 21% credit access; 50% lack mobile money; only 2 ag finance programs (ABP, GEEP); no crop/livestock insurance programs; moneylenders dominant source (75 of 123 credit entries)
  // feas 4.0: Anchor Borrowers Programme exists but limited; NAIC Act outdated (1993); no modern ag insurance; GEEP limited
  mkInnovation("Smallholder Financial Inclusion", "Nigeria",
    7.5, 8.0, 3.0, 8.5, 4.0,
    "Solar HHS/DCE Survey, Stakeholder Survey, Programs Inventory", "2025",
    "89% stakeholders demand finance; only 21% HH access credit; moneylenders dominate; only 2 ag finance programs; Islamic finance demand strongest signal in DCE."),

  // -- 7. Post-Harvest Loss Reduction --
  // geo 7.0: National problem; SAPZ zones create concentrated opportunity; value chain focus in North (VCN $158M)
  // dem 6.5: AFSNS calls for improved post-harvest practices; SAPZ agro-processing; value chain programs
  // sup 3.0: Only 5 Post-Harvest & Value Addition innovations in PRMS; limited supply
  // gaps 7.0: Only 2 programs mention post-harvest; no cold chain; no storage infrastructure programs; estimated 30-40% perishable crop losses
  // feas 4.5: SAPZ $538M creates infrastructure but not post-harvest specific; ATASP-1 touches processing; no dedicated funding
  mkInnovation("Post-Harvest Loss Reduction", "Nigeria",
    7.0, 6.5, 3.0, 7.0, 4.5,
    "Programs Inventory, PRMS, Policies Inventory", "2025",
    "Only 5 PRMS post-harvest innovations; 30-40% perishable crop losses; only 2 programs mention post-harvest; SAPZ $538M creates partial infrastructure."),

  // -- 8. Youth in Agriculture --
  // geo 7.5: National scope; multiple state-level programs; youth demographic bulge
  // dem 8.5: 12+ programs target youth; 'youth' appears 22 times in thematic focus; YEAP, N-Power Agro, iDICE $618M; 33.3% unemployment rate
  // sup 4.0: Limited CGIAR youth-specific innovations; some gender/inclusion cross-cutting (12 innovations)
  // gaps 5.5: Programs are employment-focused not agriculture-innovation focused; SKYE II ending 2026; coordination across many programs
  // feas 7.0: iDICE $618M; AGILE $500M+$700M; N-Power; strong government + donor funding; World Bank backing
  mkInnovation("Youth in Agriculture", "Nigeria",
    7.5, 8.5, 4.0, 5.5, 7.0,
    "Programs Inventory, Policies Inventory", "2025",
    "12+ youth programs; 'youth' mentioned 22 times; iDICE $618M + AGILE $1.2B; but programs focus on employment not agricultural innovation."),

  // -- 9. Gender-Responsive Agricultural Innovation --
  // geo 7.0: National scope; 4 gender policies cover agriculture; GEYSI has 51 program entries
  // dem 7.5: 4 dedicated gender policies; 24 of 57 programs target women; $1.7B+ in women-focused World Bank programs; NGPA explicit demand
  // sup 5.0: 12 Gender & Social Inclusion innovations in PRMS; 25 with significant/principal gender targeting
  // gaps 6.0: All gender policies lack budgets; HHS shows only 12.1% female respondents; 88% male-dominated farming
  // feas 7.5: NFWP-SU $500M; AGILE $1.2B; strong World Bank commitment; UNDP/UN Women support
  mkInnovation("Gender-Responsive Agricultural Innovation", "Nigeria",
    7.0, 7.5, 5.0, 6.0, 7.5,
    "Policies Inventory, Programs Inventory, PRMS", "2025",
    "4 gender policies + 24 programs targeting women; $1.7B+ women-focused WB programs; but all gender policies lack budgets; 12.1% female farmer representation in HHS."),

  // -- 10. Water Management Infrastructure --
  // geo 8.5: Northern semi-arid zones critical; 67.5% farmers within 7 min of water but surface irrigation dominates (75-90%)
  // dem 7.0: National Irrigation and Drainage Policy (2015); Water Resources Bill (2020); SPIN $500M; 81.3% climate water stress
  // sup 2.0: Only 1 Solar Irrigation & Water innovation in PRMS; massive supply deficit
  // gaps 8.0: No smallholder water harvesting programs; SPIN focuses on institutional/hydropower; 'water' appears only 4 times in program thematic focus; 66% practice no water conservation
  // feas 5.0: SPIN $500M exists but institutional-level; irrigation policy exists but no budget; water bill not yet enacted
  mkInnovation("Water Management Infrastructure", "Nigeria",
    8.5, 7.0, 2.0, 8.0, 5.0,
    "Policies Inventory, Programs Inventory, Solar HHS Data", "2025",
    "81.3% climate water stress; SPIN $500M institutional but not smallholder; only 1 PRMS water innovation; 66% farmers practice no water conservation."),

  // -- 11. Pest & Disease Management --
  // geo 6.5: National relevance; Aflasafe concentrated in West Africa; disease is top crop failure reason (121 mentions in HHS)
  // dem 6.0: Diseases cited as top crop failure reason in HHS data (121 of 224 reasons); food safety policies; stakeholder demand for biopesticides
  // sup 8.5: 17 Pest & Disease Management innovations in PRMS; Aflasafe ARDIT facility; biopesticide-based IPM; strong pipeline
  // gaps 4.5: One Health policies exist but implementation uncertain; food safety regulatory framework in place; some coordination gaps
  // feas 6.0: Aflasafe has commercial model; food safety regulations exist; NAFDAC institutional support; but limited dedicated program funding
  mkInnovation("Pest & Disease Management", "Nigeria",
    6.5, 6.0, 8.5, 4.5, 6.0,
    "PRMS, Programs Inventory, Solar HHS Data", "2025",
    "17 PRMS pest/disease innovations including Aflasafe; diseases are #1 crop failure reason (121 HHS mentions); strong supply but limited program funding."),

  // -- 12. Seed System Strengthening --
  // geo 7.5: National relevance; acute in North where near-100% traditional seed use
  // dem 7.5: NSRM 2020 + NASP 2022 explicitly demand seed system reform; NATIP calls for improved varieties; NASC as implementing body
  // sup 7.5: 17 Seed Systems innovations in PRMS; strong yam, cowpea, maize breeding; released varieties for vulgarization
  // gaps 6.5: No dedicated seed systems program in inventory; near-100% traditional seed in Kebbi/Kano; improved seed expenditure only N1,940/acre vs N44,762 traditional
  // feas 5.5: NASC institutional framework exists; seed policies in place; but no budget allocation; no dedicated program
  mkInnovation("Seed System Strengthening", "Nigeria",
    7.5, 7.5, 7.5, 6.5, 5.5,
    "Policies Inventory, Programs Inventory, PRMS, Solar HHS Data", "2025",
    "Two seed policies (NSRM 2020, NASP 2022) + 17 PRMS innovations; but zero dedicated seed programs and near-100% traditional seed use in northern states."),

  // -- 13. Value Chain Integration --
  // geo 7.0: VCN $158M targets Northern Nigeria; SAPZ zones nationally; RAAMP $575M rural access
  // dem 7.0: 69% of output sold (commercial farmers); VCN, SAPZ, ATASP-1, Propcom+ programs; NATIP value chain focus
  // sup 4.0: Limited PRMS value chain innovations; 5 post-harvest; some digital tools
  // gaps 5.5: Programs production-focused not market-systems; limited post-production attention; infrastructure gaps
  // feas 7.0: VCN $158M + SAPZ $538M + RAAMP $575M + Propcom+ $118M = $1.4B+ in value chain infrastructure
  mkInnovation("Value Chain Integration", "Nigeria",
    7.0, 7.0, 4.0, 5.5, 7.0,
    "Programs Inventory, Solar HHS Survey, Policies Inventory", "2025",
    "69% of farmer output sold; $1.4B+ in VCN/SAPZ/RAAMP/Propcom+ programs; but production-focused with limited market systems attention."),

  // -- 14. Agricultural Mechanization --
  // geo 7.0: National need; 83.2% self-employed in agriculture; near-zero mechanization in HHS data
  // dem 6.0: NATIP calls for mechanization; 27.7% farmers report farm labor difficulty; but no strong quantitative signal
  // sup 2.5: No mechanization innovations in PRMS for Nigeria; minimal CGIAR supply
  // gaps 7.5: No dedicated mechanization program; 'mechanization' appears only tangentially in 3 programs; near-zero in survey data
  // feas 4.0: No program funding; no institutional framework; ACReSAL mentions it as one component only
  mkInnovation("Agricultural Mechanization", "Nigeria",
    7.0, 6.0, 2.5, 7.5, 4.0,
    "Programs Inventory, Solar HHS Data, Policies Inventory", "2025",
    "NATIP calls for mechanization; 27.7% report labor difficulty; but zero dedicated programs, near-zero PRMS innovations, no institutional framework."),

  // -- 15. Cassava & Yam Improvement --
  // geo 7.0: Nigeria is world's largest cassava/yam producer; national crop significance
  // dem 6.5: NATIP targets productivity; AFSNS includes biofortification (Vitamin A cassava); economic sustainability plan
  // sup 9.0: Strong PRMS presence: released yam varieties, marker-trait associations, elite yam clones, cassava breeding; INIT-01 has 9 innovations
  // gaps 4.0: Institutional pathways exist through NASC and IITA partnership; variety release pipelines functional
  // feas 6.5: IITA named in NATIP; established breeding infrastructure; variety vulgarization underway; NASC operational
  mkInnovation("Cassava & Yam Improvement", "Nigeria",
    7.0, 6.5, 9.0, 4.0, 6.5,
    "PRMS, Policies Inventory, Programs Inventory", "2025",
    "Strongest PRMS supply area: yam varieties released, marker-trait associations, elite clones; IITA in NATIP partnership; Nigeria is world's top producer."),

  // -- 16. Rice Value Chain Development --
  // geo 7.5: Northern Nigeria primary production zone; Kebbi/Kano major rice states; ABP rice focus
  // dem 7.0: Rice ROI 215.78% pooled (HHS data); ABP targets rice; import substitution priority in NESP; rice as top irrigated crop
  // sup 5.0: Some CGIAR rice innovations but not heavily Nigeria-focused in PRMS; AfricaRice relevant
  // gaps 5.0: ABP credit model has limitations; traditional seed dominance; import dependence persists
  // feas 6.5: ABP active; NESP import substitution priority; SAPZ processing zones; high demonstrated ROI
  mkInnovation("Rice Value Chain Development", "Nigeria",
    7.5, 7.0, 5.0, 5.0, 6.5,
    "Solar HHS Survey, Programs Inventory, Policies Inventory", "2025",
    "Rice ROI 215.78% in HHS data; ABP program active; NESP import substitution priority; but traditional seed dominance and limited PRMS presence."),

  // -- 17. Livestock Systems Development --
  // geo 7.5: Northern Nigeria pastoral systems; farmer-herder conflict zone; 48.9% HHS respondents farm livestock
  // dem 7.0: NLTP 2019-2028; Dairy Policy 2023; livestock asset values high (cows N1.19M avg); farmer-herder conflict political priority
  // sup 5.5: 10 Livestock & Aquaculture innovations in PRMS; AquaIndex; some digital tools
  // gaps 7.0: Only 1 program mentions pastoralists; no livestock development programs; no animal health/dairy/poultry programs; severe under-programming
  // feas 4.5: NLTP exists but no budget; Dairy Policy 2023 new; limited institutional framework; conflict complicates investment
  mkInnovation("Livestock Systems Development", "Nigeria",
    7.5, 7.0, 5.5, 7.0, 4.5,
    "Policies Inventory, Programs Inventory, PRMS, Solar HHS Data", "2025",
    "NLTP + Dairy Policy signal demand; 48.9% HHS respondents have livestock; but only 1 program mentions pastoralists; severe programmatic under-representation."),

  // -- 18. Soil Health Management --
  // geo 7.0: National relevance; Northern degradation; Great Green Wall target zone
  // dem 5.5: Only 2 EHB policies (5.6% of total); poor soil cited as crop failure reason (15 HHS mentions); Great Green Wall
  // sup 4.0: Limited soil health innovations in PRMS for Nigeria; some environmental biodiversity cross-cutting (24 significant)
  // gaps 7.0: Only 2 EHB policies; no soil health policy; no ecosystem services valuation framework; no sustainable land management policy
  // feas 4.0: Great Green Wall Initiative exists; but EHB most underfunded impact area; no dedicated budget
  mkInnovation("Soil Health Management", "Nigeria",
    7.0, 5.5, 4.0, 7.0, 4.0,
    "Policies Inventory, Solar HHS Data, PRMS", "2025",
    "Only 2 EHB policies (5.6% of total); poor soil a crop failure factor; no soil health policy; Great Green Wall only relevant program."),

  // -- 19. Agricultural Extension Modernization --
  // geo 7.0: National relevance; 56.3% HHS farmers received no extension visits
  // dem 7.5: Extension officers trusted by 76.9% as primary info source; 82% stakeholders want localization; NATIP calls for extension reform
  // sup 5.0: Some digital advisory tools in PRMS; 29 digital tools broadly; extension-adjacent
  // gaps 6.0: 56.3% no extension visits; Kaduna irrigation training only ~36% vs Kebbi 70%; 68% stakeholders report info inadequacy
  // feas 5.0: NATIP policy framework; some NGO-provided training; but no dedicated extension modernization program or budget
  mkInnovation("Agricultural Extension Modernization", "Nigeria",
    7.0, 7.5, 5.0, 6.0, 5.0,
    "Solar HHS Survey, Stakeholder Survey, Programs Inventory, PRMS", "2025",
    "Extension officers trusted by 76.9%; but 56.3% receive no visits; 82% stakeholders demand localization; no dedicated extension program."),

  // -- 20. Islamic Agricultural Finance --
  // geo 7.5: Concentrated in Northern Nigeria Muslim-majority states; Kebbi/Kano strongest signal
  // dem 8.0: Highest pooled DCE coefficient (4.6121); Kebbi 7.6102, Kano 6.2004; deep cultural alignment; revealed preference data
  // sup 1.0: Zero CGIAR innovations addressing Islamic finance; not a CGIAR research area
  // gaps 8.0: No competitive Islamic finance products for agriculture exist; massive unmet demand; standard deviation 8.0436 shows variation
  // feas 4.5: Jaiz Bank exists in Nigeria; some Islamic banking infrastructure; but no agriculture-specific products; regulatory framework exists for Islamic finance
  mkInnovation("Islamic Agricultural Finance", "Nigeria",
    7.5, 8.0, 1.0, 8.0, 4.5,
    "Solar HHS/DCE Survey", "2025",
    "Highest DCE coefficient (4.6121) across all attributes; Kebbi 7.6102, Kano 6.2004; zero CGIAR supply; no competitive ag-specific Islamic products exist."),

  // ============================================================================
  // OTHER COUNTRIES: Illustrative records showing multi-country vision
  // ============================================================================

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
      { name: 'Water Scarcity', value: 32 },
      { name: 'Pest & Disease', value: 28 },
      { name: 'Market Access', value: 24 },
      { name: 'Input Access', value: 16 },
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
      { name: 'Smallholders', value: 45 },
      { name: 'Facilitators/Research', value: 20 },
      { name: 'Gov & Policy', value: 15 },
      { name: 'Private Sector', value: 10 },
      { name: 'Innovators/Market', value: 10 },
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
      { name: 'Mixed (Gov+Donor)', value: 43 },
      { name: 'Government', value: 29 },
      { name: 'Donor/DFI', value: 20 },
      { name: 'Private/PPP', value: 8 },
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
      { name: 'Solar Irrigation', risk: 7.5, return: 8.0 },
      { name: 'Improved Seeds', risk: 3.0, return: 7.0 },
      { name: 'Digital Advisory', risk: 5.0, return: 6.5 },
      { name: 'Post-Harvest', risk: 6.0, return: 7.5 },
      { name: 'Nutrition/Biofortified', risk: 3.5, return: 6.0 },
    ],
  };
}

export function getMarketData(data: Innovation[]) {
  return {
    demandTrends: [
      { month: 'Irrigated Crops', demand: 8.5, supply: 3.0 },
      { month: 'Climate Adapt.', demand: 8.0, supply: 7.0 },
      { month: 'Financial Prod.', demand: 9.0, supply: 1.0 },
      { month: 'Digital Ag', demand: 7.0, supply: 8.0 },
      { month: 'Post-Harvest', demand: 6.5, supply: 3.0 },
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
      { name: 'Digital Tools & Data', value: 29 },
      { name: 'Crop Breeding', value: 26 },
      { name: 'Pest & Disease', value: 17 },
      { name: 'Seed Systems', value: 17 },
      { name: 'Climate Adaptation', value: 16 },
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
  { name: "Human-Extracted Demand Data (34 Policy Documents)", dimension: "Demand Signals", domain: "Sector", formats: ["XLSX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
  { name: "Solar Irrigation HHS/DCE Report (579 Households)", dimension: "Demand Signals", domain: "Stakeholders", formats: ["DOCX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
  { name: "Solar Irrigation HHS Raw Data (513 Households)", dimension: "Demand Signals", domain: "Stakeholders", formats: ["XLSX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
  { name: "Stakeholder Profiling Survey (28 Respondents)", dimension: "Demand Gaps", domain: "Stakeholders", formats: ["XLSX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
  { name: "Nigeria Policies Inventory (36 Policies, 5 Impact Areas)", dimension: "Investment Feasibility", domain: "Enabling Environment", formats: ["XLSX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
  { name: "Nigeria Programs Inventory (57 Unique Programs, $9.67B)", dimension: "Investment Feasibility", domain: "Resource & Investment", formats: ["XLSX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
  { name: "CGIAR Innovation PRMS Export (60 Nigeria / 827 Global)", dimension: "Innovation Supply", domain: "Innovation Portfolio", formats: ["XLSX"], status: "ACTIVE", lastRefresh: "24 Apr 2026" },
];
