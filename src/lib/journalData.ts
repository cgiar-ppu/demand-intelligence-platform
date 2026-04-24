// Journal View Data — transforms existing data into the Strategic Findings / Journal format
// This bridges the existing nigeriaData + masterData into the new user journey structure

import {
  TOP_SIGNALS,
  TOP_GAPS,
  INTERSECTIONS,
  DATA_SOURCES,
  KEY_STATS,
  DIMENSION_SCORES,
  type DemandSignal,
  type DemandGap,
  type Intersection,
} from "./nigeriaData";

import { masterData, type Innovation } from "./data";

// ============================================================
// Strategic Finding Types
// ============================================================

export type FindingType =
  | "scaling_opportunity"
  | "innovation_gap"
  | "finance_gap"
  | "policy_gap"
  | "validation_need";

export const FINDING_TYPE_META: Record<FindingType, { label: string; color: string; icon: string }> = {
  scaling_opportunity: { label: "Scaling Opportunity", color: "#10b981", icon: "rocket" },
  innovation_gap: { label: "Innovation Gap", color: "#f59e0b", icon: "lightbulb" },
  finance_gap: { label: "Finance / Market Gap", color: "#ef4444", icon: "banknotes" },
  policy_gap: { label: "Policy / Institutional Gap", color: "#8b5cf6", icon: "building" },
  validation_need: { label: "Validation Need", color: "#0ea5e9", icon: "flask" },
};

export interface StrategicFinding {
  id: string;
  type: FindingType;
  title: string;
  demandEvidence: string;
  gapEvidence: string;
  supplyAssessment: string;
  readiness: string;
  strategicImplication: string;
  recommendedAction: string;
  confidence: "high" | "medium" | "low";
  sources: string[];
  relatedSignals: string[];
  relatedGaps: string[];
  country: string;
  demandArea: string;
}

// ============================================================
// Status labels for diagnostic dimensions
// ============================================================

export type DemandLevel = "weak" | "emerging" | "strong" | "very_strong";
export type SupplyLevel = "absent" | "nascent" | "emerging" | "established";
export type GapSeverity = "managed" | "moderate" | "severe" | "critical";
export type ReadinessLevel = "low" | "emerging" | "promising" | "strong";
export type OpportunityStatus = "monitor" | "explore" | "prepare" | "act";

export function getDemandLevel(score: number): DemandLevel {
  if (score >= 8) return "very_strong";
  if (score >= 6) return "strong";
  if (score >= 4) return "emerging";
  return "weak";
}

export function getSupplyLevel(score: number): SupplyLevel {
  if (score >= 7) return "established";
  if (score >= 5) return "emerging";
  if (score >= 3) return "nascent";
  return "absent";
}

export function getGapSeverity(score: number): GapSeverity {
  if (score >= 8) return "critical";
  if (score >= 6) return "severe";
  if (score >= 4) return "moderate";
  return "managed";
}

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score >= 7) return "strong";
  if (score >= 5) return "promising";
  if (score >= 3) return "emerging";
  return "low";
}

export function getOpportunityStatus(score: number): OpportunityStatus {
  if (score >= 7) return "act";
  if (score >= 5.5) return "prepare";
  if (score >= 4) return "explore";
  return "monitor";
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    very_strong: "#10b981", strong: "#22c55e", emerging: "#f59e0b", weak: "#ef4444",
    established: "#10b981", nascent: "#f59e0b", absent: "#ef4444",
    managed: "#10b981", moderate: "#f59e0b", severe: "#f97316", critical: "#ef4444",
    low: "#ef4444", promising: "#22c55e",
    monitor: "#94a3b8", explore: "#0ea5e9", prepare: "#f59e0b", act: "#10b981",
  };
  return map[status] || "#94a3b8";
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ============================================================
// Transform existing intersections into Strategic Findings
// ============================================================

function inferFindingType(intersection: Intersection): FindingType {
  const t = intersection.title.toLowerCase();
  if (t.includes("solar") || t.includes("scaling")) return "scaling_opportunity";
  if (t.includes("financ") || t.includes("credit") || t.includes("islamic")) return "finance_gap";
  if (t.includes("policy") || t.includes("institutional") || t.includes("extension")) return "policy_gap";
  if (t.includes("innov") || t.includes("supply") || t.includes("cgiar")) return "innovation_gap";
  return "validation_need";
}

export const STRATEGIC_FINDINGS: StrategicFinding[] = INTERSECTIONS.map((ix, i) => {
  const ft = inferFindingType(ix);
  // Match related signals and gaps by keyword overlap
  const keywords = ix.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  const relSignals = TOP_SIGNALS
    .filter((s) => keywords.some((k) => s.title.toLowerCase().includes(k)))
    .map((s) => s.id);
  const relGaps = TOP_GAPS
    .filter((g) => keywords.some((k) => g.title.toLowerCase().includes(k)))
    .map((g) => g.id);

  return {
    id: `SF-${String(i + 1).padStart(3, "0")}`,
    type: ft,
    title: ix.title,
    demandEvidence: ix.demandSummary,
    gapEvidence: ix.narrative,
    supplyAssessment: ix.narrative.includes("CGIAR")
      ? "Weak CGIAR innovation supply — few registered innovations directly address this demand area."
      : "Innovation supply present but fragmented across multiple actors and programs.",
    readiness: ix.implication.includes("conditional")
      ? "Emerging — conditional on addressing identified barriers"
      : "Emerging — requires coordinated multi-stakeholder action",
    strategicImplication: ix.implication,
    recommendedAction: ix.implication.includes("partner")
      ? "Identify delivery and finance partners; validate bundled models"
      : "Commission gap analysis and stakeholder consultations",
    confidence: ix.flagship ? "high" : "medium",
    sources: DATA_SOURCES.map((d) => d.shortName),
    relatedSignals: relSignals.length > 0 ? relSignals : [TOP_SIGNALS[0].id],
    relatedGaps: relGaps.length > 0 ? relGaps : [TOP_GAPS[0].id],
    country: "Nigeria",
    demandArea: ix.title.split(":")[0] || ix.title,
  };
});

// ============================================================
// Country-level intelligence summary
// ============================================================

export interface CountryIntelligence {
  country: string;
  summary: string;
  signalCount: number;
  gapCount: number;
  innovationCount: number;
  findingCount: number;
  confidenceLevel: "high" | "medium" | "low";
  topDemandAreas: string[];
  mainConstraint: string;
}

export const NIGERIA_INTELLIGENCE: CountryIntelligence = {
  country: "Nigeria",
  summary:
    "Nigeria shows strong expressed demand in climate adaptation, irrigation, gender-responsive agriculture, financial inclusion, and seed system modernization. The main constraint is not absence of demand, but weak alignment between demand, innovation supply, finance, and delivery mechanisms.",
  signalCount: KEY_STATS.consolidatedSignals,
  gapCount: KEY_STATS.consolidatedGaps,
  innovationCount: masterData.filter((d) => d.country === "Nigeria").length,
  findingCount: STRATEGIC_FINDINGS.length,
  confidenceLevel: "high",
  topDemandAreas: [
    "Climate Adaptation & Water Stress",
    "Solar Irrigation",
    "Financial Inclusion (Islamic Finance)",
    "Gender-Responsive Agriculture",
    "Seed System Modernization",
    "Extension & Advisory Services",
  ],
  mainConstraint:
    "Weak alignment between demand, innovation supply, finance, and delivery mechanisms — not absence of demand.",
};

// ============================================================
// Demand areas for the Demand View
// ============================================================

export interface DemandArea {
  id: string;
  name: string;
  description: string;
  countriesWithSignals: string[];
  signalStrength: number;
  gapSeverity: number;
  supplyCoverage: number;
  readiness: number;
  opportunityStatus: OpportunityStatus;
  topFinding: string;
}

export const DEMAND_AREAS: DemandArea[] = [
  {
    id: "DA-001",
    name: "Solar Irrigation",
    description: "Demand for affordable, scalable solar-powered irrigation systems to address water stress and energy constraints in rain-fed agriculture.",
    countriesWithSignals: ["Nigeria", "Kenya", "Ethiopia"],
    signalStrength: 9.0,
    gapSeverity: 7.5,
    supplyCoverage: 1.5,
    readiness: 5.5,
    opportunityStatus: "prepare",
    topFinding: "SF-001",
  },
  {
    id: "DA-002",
    name: "Climate-Resilient Crop Varieties",
    description: "Need for drought-tolerant, heat-resistant, and short-cycle crop varieties adapted to changing rainfall patterns.",
    countriesWithSignals: ["Nigeria", "Bangladesh", "Ethiopia", "Kenya", "Zambia"],
    signalStrength: 8.5,
    gapSeverity: 5.0,
    supplyCoverage: 6.5,
    readiness: 7.0,
    opportunityStatus: "act",
    topFinding: "SF-003",
  },
  {
    id: "DA-003",
    name: "Agricultural Financial Inclusion",
    description: "Demand for accessible financial products including Islamic finance, micro-credit, and mobile-based lending for smallholders.",
    countriesWithSignals: ["Nigeria", "Bangladesh"],
    signalStrength: 8.0,
    gapSeverity: 8.5,
    supplyCoverage: 2.0,
    readiness: 4.5,
    opportunityStatus: "explore",
    topFinding: "SF-002",
  },
  {
    id: "DA-004",
    name: "Gender-Responsive Agriculture",
    description: "Targeted interventions addressing women's economic empowerment, land rights, and equitable access to agricultural inputs and services.",
    countriesWithSignals: ["Nigeria", "Bangladesh", "Kenya", "Ethiopia"],
    signalStrength: 8.5,
    gapSeverity: 6.0,
    supplyCoverage: 4.0,
    readiness: 5.5,
    opportunityStatus: "prepare",
    topFinding: "SF-004",
  },
  {
    id: "DA-005",
    name: "Digital Extension & Advisory",
    description: "Technology-enabled agricultural extension services reaching underserved areas with personalized, timely agronomic advice.",
    countriesWithSignals: ["Nigeria", "Kenya", "Bangladesh"],
    signalStrength: 7.0,
    gapSeverity: 7.0,
    supplyCoverage: 3.5,
    readiness: 5.0,
    opportunityStatus: "explore",
    topFinding: "SF-005",
  },
  {
    id: "DA-006",
    name: "Seed System Modernization",
    description: "Formal and informal seed system reform to improve variety turnover, quality assurance, and last-mile delivery to smallholders.",
    countriesWithSignals: ["Nigeria", "Zambia", "Ethiopia"],
    signalStrength: 7.5,
    gapSeverity: 6.5,
    supplyCoverage: 5.0,
    readiness: 6.0,
    opportunityStatus: "prepare",
    topFinding: "SF-006",
  },
];

// ============================================================
// Innovation match data (from masterData, enriched)
// ============================================================

export function getInnovationDiagnostic(innovation: Innovation) {
  return {
    geography: {
      score: innovation.geography_priority_score,
      level: getDemandLevel(innovation.geography_priority_score),
    },
    demand: {
      score: innovation.demand_signals_score,
      level: getDemandLevel(innovation.demand_signals_score),
    },
    supply: {
      score: innovation.innovation_supply_score,
      level: getSupplyLevel(innovation.innovation_supply_score),
    },
    gaps: {
      score: innovation.demand_gaps_score,
      severity: getGapSeverity(innovation.demand_gaps_score),
    },
    readiness: {
      score: innovation.investment_feasibility_score,
      level: getReadinessLevel(innovation.investment_feasibility_score),
    },
    opportunity: {
      score: innovation.scaling_opportunity_score,
      status: getOpportunityStatus(innovation.scaling_opportunity_score),
    },
  };
}

// ============================================================
// Re-export for convenience
// ============================================================

export { TOP_SIGNALS, TOP_GAPS, INTERSECTIONS, DATA_SOURCES, KEY_STATS, DIMENSION_SCORES };
export type { DemandSignal, DemandGap, Intersection, Innovation };
