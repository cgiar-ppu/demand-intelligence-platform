import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Innovation } from "./data";
import { getSignalLevel, getSignalLabel } from "./data";

function scoreTier(score: number): string {
  if (score <= 3) return "Nascent (0-3)";
  if (score <= 6) return "Emerging (4-6)";
  if (score <= 8) return "Strategic (7-8)";
  return "Scaled (9-10)";
}

function tierColor(score: number): [number, number, number] {
  if (score <= 3) return [220, 38, 38];
  if (score <= 6) return [217, 119, 6];
  if (score <= 8) return [14, 165, 233];
  return [16, 185, 129];
}

function gapTierColor(score: number): [number, number, number] {
  if (score > 6) return [220, 38, 38];
  if (score >= 3) return [217, 119, 6];
  return [16, 185, 129];
}

function signalRGB(signal: string): [number, number, number] {
  if (signal === "high") return [220, 38, 38];
  if (signal === "medium") return [217, 119, 6];
  return [16, 185, 129];
}

function drawBar(doc: jsPDF, x: number, y: number, width: number, score: number, maxScore: number, color: [number, number, number]) {
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(x, y, width, 6, 1, 1, "F");
  const fillWidth = (score / maxScore) * width;
  doc.setFillColor(...color);
  doc.roundedRect(x, y, fillWidth, 6, 1, 1, "F");
}

function sectionHeader(doc: jsPDF, y: number, title: string, margin: number): number {
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(title, margin, y);
  return y + 8;
}

function bodyText(doc: jsPDF, y: number, text: string, margin: number, maxWidth: number): number {
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, margin, y);
  return y + lines.length * 4.5 + 4;
}

function pageFooter(doc: jsPDF, pageNum: number, totalPages: number, pageWidth: number) {
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 170);
  doc.text(`CGIAR Demand Intelligence Platform — 7→5→1 Framework Report`, 18, 287);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 18, 287, { align: "right" });
  doc.setDrawColor(220, 220, 230);
  doc.line(18, 283, pageWidth - 18, 283);
}

function trendArrow(current: number, threshold: number): string {
  if (current >= threshold + 1.5) return "▲ Strong";
  if (current >= threshold) return "▲ Positive";
  if (current >= threshold - 1) return "► Stable";
  return "▼ Declining";
}

export async function generateInnovationReport(item: Innovation) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const signal = getSignalLevel(item);
  const sigRGB = signalRGB(signal);
  const totalPages = 6;

  const domainAvg = +((item.domain_scaling_context + item.domain_sector + item.domain_stakeholders +
    item.domain_enabling_env + item.domain_resource_investment + item.domain_market_intelligence +
    item.domain_innovation_portfolio) / 7).toFixed(1);

  const interactionAvg = +((item.context_geography + item.sector_demand + item.stakeholder_demand +
    item.stakeholder_gaps + item.enabling_feasibility + item.resource_feasibility +
    item.market_feasibility + item.market_gaps + item.portfolio_supply) / 9).toFixed(1);

  // ═══════════════════════════════════════════
  // PAGE 1 — Cover & Executive Summary
  // ═══════════════════════════════════════════
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 65, "F");
  doc.setFillColor(...sigRGB);
  doc.rect(0, 0, pageWidth, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("CGIAR Demand Intelligence Platform — 7→5→1 Demand Signaling Framework", margin, 18);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Demand Signal Intelligence Report", margin, 35);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(item.innovation_name, margin, 48);
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 210);
  doc.text(`${item.country}  ·  ${item.evidence_date}  ·  Source: ${item.source_reference}`, margin, 57);

  let y = 78;

  // Signal & Gap badges
  doc.setFillColor(...sigRGB);
  doc.roundedRect(margin, y - 6, 55, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Signal: ${getSignalLabel(signal)}`, margin + 5, y + 1);

  doc.setFillColor(240, 240, 245);
  doc.roundedRect(margin + 60, y - 6, 55, 12, 2, 2, "F");
  doc.setTextColor(40, 40, 60);
  doc.text(`Demand Gaps: ${item.demand_gaps_score}/10`, margin + 64, y + 1);

  doc.setFillColor(240, 240, 245);
  doc.roundedRect(margin + 120, y - 6, 55, 12, 2, 2, "F");
  doc.setTextColor(40, 40, 60);
  doc.setFontSize(9);
  doc.text(`Scaling Opp.: ${item.scaling_opportunity_score}/10`, margin + 124, y + 1);

  y += 18;

  // Executive summary
  y = sectionHeader(doc, y, "Executive Summary", margin);
  const summary = `This report provides a comprehensive demand signal intelligence assessment for "${item.innovation_name}" in ${item.country} using the CGIAR 7→5→1 Demand Signaling Framework. The analysis reveals a ${getSignalLabel(signal).toLowerCase()} demand gap signal with a Demand Gaps score of ${item.demand_gaps_score}/10. The Scaling Opportunity convergence score is ${item.scaling_opportunity_score}/10 (${scoreTier(item.scaling_opportunity_score)}). Overall domain readiness averages ${domainAvg}/10 and interaction pathway coherence averages ${interactionAvg}/10. ${item.scaling_justification}`;
  y = bodyText(doc, y, summary, margin, contentWidth);

  // Interpretation box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y - 2, contentWidth, 24, 2, 2, "F");
  doc.setFillColor(...sigRGB);
  doc.rect(margin, y - 2, 2, 24, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...sigRGB);
  doc.text("Framework Interpretation", margin + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 80);
  const interp = item.demand_gaps_score > 6
    ? `High Demand Gaps score (${item.demand_gaps_score}/10) indicates critical structural barriers preventing scaling. Strong systemic interventions are needed to resolve access, affordability, and institutional constraints before investment can flow effectively.`
    : item.demand_gaps_score >= 3
    ? `Moderate Demand Gaps score (${item.demand_gaps_score}/10) suggests partial alignment. Some barriers remain. Targeted investments in capacity building, market development, or policy reform can unlock the scaling pathway.`
    : `Low Demand Gaps score (${item.demand_gaps_score}/10) indicates manageable conditions. The ecosystem is broadly aligned — focus on sustaining momentum, documenting pathways, and mobilizing investment at scale.`;
  const interpLines = doc.splitTextToSize(interp, contentWidth - 8);
  doc.text(interpLines, margin + 4, y + 11);
  y += 30;

  // 5 Dimension Scores
  y = sectionHeader(doc, y, "5-Dimension Alignment Scores", margin);
  const dimensions = [
    { label: "Geography & Priority", score: item.geography_priority_score, color: tierColor(item.geography_priority_score) },
    { label: "Demand Signals", score: item.demand_signals_score, color: tierColor(item.demand_signals_score) },
    { label: "Innovation Supply", score: item.innovation_supply_score, color: tierColor(item.innovation_supply_score) },
    { label: "Demand Gaps (inverse)", score: item.demand_gaps_score, color: gapTierColor(item.demand_gaps_score) },
    { label: "Investment Feasibility", score: item.investment_feasibility_score, color: tierColor(item.investment_feasibility_score) },
  ];

  for (const p of dimensions) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 120);
    doc.text(p.label, margin, y + 4);
    doc.setTextColor(...p.color);
    doc.setFont("helvetica", "bold");
    doc.text(`${p.score}/10  ${scoreTier(p.score)}`, margin + 56, y + 4);
    drawBar(doc, margin + 110, y, contentWidth - 130, p.score, 10, p.color);
    const trend = trendArrow(p.score, 5);
    doc.setFontSize(7);
    doc.text(trend, margin + contentWidth - 18, y + 4);
    y += 12;
  }

  y += 4;
  // Scaling Opportunity convergence
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 118, 110);
  doc.text(`Scaling Opportunity: ${item.scaling_opportunity_score}/10 — ${scoreTier(item.scaling_opportunity_score)}`, margin, y);
  y += 6;

  pageFooter(doc, 1, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 2 — 9 Domain→Dimension Interactions
  // ═══════════════════════════════════════════
  doc.addPage();
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "9 Domain→Dimension Interaction Pathways", margin);
  y = bodyText(doc, y, "The 9 causal pathways capture how each of the 7 data signal domains drives specific demand signaling dimensions. These interactions reveal which pathways are strong, which are bottlenecks, and where targeted interventions can have the greatest systemic impact.", margin, contentWidth);

  const interactions = [
    { label: "Scaling Context → Geography & Priority", score: item.context_geography, interp: item.context_geography > 6 ? "Strong biophysical and geographic context supports strategic prioritization" : "Scaling context constraints are limiting geographic targeting clarity" },
    { label: "Sector → Demand Signals", score: item.sector_demand, interp: item.sector_demand > 6 ? "Sector dynamics are generating clear and strong demand signals" : "Sector constraints are muting or distorting demand articulation" },
    { label: "Stakeholders → Demand Signals", score: item.stakeholder_demand, interp: item.stakeholder_demand > 6 ? "Key actors are effectively articulating and legitimizing demand" : "Stakeholder fragmentation is weakening demand signal coherence" },
    { label: "Stakeholders → Demand Gaps", score: item.stakeholder_gaps, interp: item.stakeholder_gaps > 6 ? "Stakeholder capacity is sufficient to navigate most adoption barriers" : "Stakeholder capacity gaps are amplifying structural barriers" },
    { label: "Enabling Env. → Investment Feasibility", score: item.enabling_feasibility, interp: item.enabling_feasibility > 6 ? "Policy and institutional environment supports investment confidence" : "Regulatory or governance gaps are reducing investment feasibility" },
    { label: "Resource & Investment → Investment Feasibility", score: item.resource_feasibility, interp: item.resource_feasibility > 6 ? "Capital availability and instruments support scaling investment" : "Financial ecosystem constraints limit investment mobilization" },
    { label: "Market Intelligence → Investment Feasibility", score: item.market_feasibility, interp: item.market_feasibility > 6 ? "Market clarity de-risks investment and supports bankable propositions" : "Market data gaps are reducing investor confidence" },
    { label: "Market Intelligence → Demand Gaps", score: item.market_gaps, interp: item.market_gaps > 6 ? "Market access pathways are largely clear and open" : "Market friction and access barriers are amplifying demand gaps" },
    { label: "Innovation Portfolio → Innovation Supply", score: item.portfolio_supply, interp: item.portfolio_supply > 6 ? "Portfolio readiness and delivery models support strong supply response" : "Pipeline immaturity or delivery model gaps constrain supply response" },
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Interaction Pathway", "Score", "Tier", "Interpretation"]],
    body: interactions.map(ix => [ix.label, String(ix.score), scoreTier(ix.score), ix.interp]),
    styles: { fontSize: 7, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 3: { fontStyle: "italic", textColor: [100, 100, 120] } },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  y = sectionHeader(doc, y, "Interaction Coherence Assessment", margin);
  y = bodyText(doc, y, `Overall interaction coherence: ${interactionAvg}/10 (${scoreTier(interactionAvg)}). ${interactionAvg > 6 ? "Strong pathway coherence — domains are effectively feeding the demand signaling dimensions." : "Significant friction in domain-to-dimension pathways — targeted capacity building in weaker interactions is recommended."}`, margin, contentWidth);

  for (const ix of interactions) {
    const shortLabel = ix.label.split(" → ").join("→").substring(0, 42);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 120);
    doc.text(shortLabel, margin, y + 3.5);
    drawBar(doc, margin + 80, y, contentWidth - 95, ix.score, 10, tierColor(ix.score));
    doc.setTextColor(...tierColor(ix.score));
    doc.setFont("helvetica", "bold");
    doc.text(String(ix.score), margin + contentWidth - 10, y + 3.5);
    y += 8;
    if (y > 265) break;
  }

  pageFooter(doc, 2, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 3 — 7 Scaling Domain Assessment
  // ═══════════════════════════════════════════
  doc.addPage();
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "7 Data Signal Domain Assessment", margin);
  y = bodyText(doc, y, "Each of the 7 data signal domains is scored on a 0–10 scale reflecting the enabling conditions, readiness, and intelligence quality feeding into the 5 demand signaling dimensions.", margin, contentWidth);

  const domains = [
    { label: "Scaling Context", score: item.domain_scaling_context, desc: "Biophysical conditions, socio-economic profiles, geographic suitability → Geography & Priority" },
    { label: "Sector", score: item.domain_sector, desc: "Sector performance, system constraints, WEF nexus → Demand Signals" },
    { label: "Stakeholders", score: item.domain_stakeholders, desc: "Actor profiles, needs, capacity, networks, trust → Demand Signals, Demand Gaps" },
    { label: "Enabling Environment", score: item.domain_enabling_env, desc: "Policy, regulation, institutional capacity, governance → Investment Feasibility" },
    { label: "Resource & Investment", score: item.domain_resource_investment, desc: "Financial actors, instruments, capital flows, investment criteria → Investment Feasibility" },
    { label: "Market Intelligence", score: item.domain_market_intelligence, desc: "Demand trends, price signals, market access, consumer behavior → Feasibility, Gaps" },
    { label: "Innovation Portfolio", score: item.domain_innovation_portfolio, desc: "Innovation inventory, pipeline, readiness, delivery models → Innovation Supply" },
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Domain", "Score", "Tier", "Trend", "Feeds Dimensions"]],
    body: domains.map(d => [d.label, String(d.score), scoreTier(d.score), trendArrow(d.score, 5), d.desc]),
    styles: { fontSize: 7.5, cellPadding: 3.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 3: { fontStyle: "bold" }, 4: { fontStyle: "italic", textColor: [100, 100, 120] } },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  y = sectionHeader(doc, y, "Domain Score Visualization", margin);
  for (const d of domains) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 100);
    doc.text(d.label, margin, y + 3.5);
    drawBar(doc, margin + 48, y, contentWidth - 65, d.score, 10, tierColor(d.score));
    doc.setTextColor(...tierColor(d.score));
    doc.setFont("helvetica", "bold");
    doc.text(`${d.score}`, margin + contentWidth - 12, y + 3.5);
    y += 9;
  }

  y += 6;
  y = sectionHeader(doc, y, "Domain Intelligence Summary", margin);
  const sorted = [...domains].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  y = bodyText(doc, y, `Average domain score: ${domainAvg}/10 (${scoreTier(domainAvg)}). Strongest domain: ${strongest.label} (${strongest.score}/10). Weakest domain: ${weakest.label} (${weakest.score}/10). ${domainAvg > 6 ? "The intelligence ecosystem shows strong multi-dimensional readiness for scaling." : `Key intelligence gap in "${weakest.label}" may constrain the accuracy and reliability of associated dimension scores — targeted data collection recommended.`}`, margin, contentWidth);

  pageFooter(doc, 3, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 4 — Dimension Deep-Dive
  // ═══════════════════════════════════════════
  doc.addPage();
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "5-Dimension Deep-Dive Assessment", margin);
  y = bodyText(doc, y, "A detailed examination of each of the five demand signaling dimensions determining the Scaling Opportunity convergence score.", margin, contentWidth);

  const dimDetails = [
    {
      label: "Geography & Priority",
      score: item.geography_priority_score,
      key: "geography",
      interpretation: item.geography_priority_score > 7
        ? "Strong geographic prioritization. Context conditions are favorable and the target population/geography is well-defined. High readiness for targeted scaling."
        : item.geography_priority_score > 4
        ? "Moderate geographic clarity. Some context factors constrain prioritization. Refined geographic targeting and context mapping would strengthen the dimension."
        : "Weak geographic prioritization. Scaling context is poorly mapped or highly heterogeneous. Invest in contextual analysis before deployment.",
    },
    {
      label: "Demand Signals",
      score: item.demand_signals_score,
      key: "demand",
      interpretation: item.demand_signals_score > 7
        ? "Strong demand signals from institutional actors, markets, and communities. Clear articulation of need driving the scaling agenda."
        : item.demand_signals_score > 4
        ? "Moderate demand signals. Some actors are articulating demand but the signal is not yet systemic or consistent across stakeholder groups."
        : "Weak demand signals. Scaling may be supply-driven without sufficient demand articulation. Stakeholder engagement and needs assessment are priorities.",
    },
    {
      label: "Innovation Supply",
      score: item.innovation_supply_score,
      key: "supply",
      interpretation: item.innovation_supply_score > 7
        ? "Strong innovation supply. Technologies and delivery models are mature, evidence-based, and ready for scaling."
        : item.innovation_supply_score > 4
        ? "Emerging supply readiness. Innovations show promise but require additional validation, adaptation, or delivery model refinement."
        : "Nascent innovation supply. Evidence is thin or context-specific. Invest in portfolio development, piloting, and documentation before scaling.",
    },
    {
      label: "Investment Feasibility",
      score: item.investment_feasibility_score,
      key: "feasibility",
      interpretation: item.investment_feasibility_score > 7
        ? "Strong investment feasibility. The business case, policy environment, and financial ecosystem support confident investment decisions."
        : item.investment_feasibility_score > 4
        ? "Moderate feasibility. Investment potential exists but risk factors remain. Pre-investment de-risking and blended finance approaches are recommended."
        : "Low investment feasibility. Significant structural barriers to investment. Foundational policy, market, and financial ecosystem development required.",
    },
  ];

  for (const dim of dimDetails) {
    y = sectionHeader(doc, y, dim.label, margin);
    const tc = tierColor(dim.score);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...tc);
    doc.text(`Score: ${dim.score}/10 — ${scoreTier(dim.score)}`, margin, y + 4);
    drawBar(doc, margin + 65, y, contentWidth - 75, dim.score, 10, tc);
    y += 10;
    y = bodyText(doc, y, dim.interpretation, margin, contentWidth);
    y += 2;
  }

  pageFooter(doc, 4, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 5 — Risk, Opportunity & Investment Analysis
  // ═══════════════════════════════════════════
  doc.addPage();
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "Market & Investment Analysis", margin);
  y = bodyText(doc, y, "This section synthesizes market intelligence, investment feasibility, and demand gap indicators to inform scaling investment decisions and partnership strategy.", margin, contentWidth);

  // Investment position table
  y = sectionHeader(doc, y, "Dimension Investment Signals", margin);
  const investData = [
    ["Demand Signals", String(item.demand_signals_score), scoreTier(item.demand_signals_score), trendArrow(item.demand_signals_score, 6)],
    ["Innovation Supply", String(item.innovation_supply_score), scoreTier(item.innovation_supply_score), trendArrow(item.innovation_supply_score, 5)],
    ["Investment Feasibility", String(item.investment_feasibility_score), scoreTier(item.investment_feasibility_score), trendArrow(item.investment_feasibility_score, 6)],
    ["Demand Gaps (inverse)", String(item.demand_gaps_score), `Gaps: ${item.demand_gaps_score > 6 ? "Critical" : item.demand_gaps_score >= 3 ? "Moderate" : "Managed"}`, item.demand_gaps_score > 6 ? "▼ Critical" : item.demand_gaps_score >= 3 ? "► Moderate" : "▲ Managed"],
    ["Scaling Opportunity", String(item.scaling_opportunity_score), scoreTier(item.scaling_opportunity_score), trendArrow(item.scaling_opportunity_score, 6)],
  ];
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Dimension", "Score", "Assessment", "Trend"]],
    body: investData,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 3: { fontStyle: "bold" } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Investment readiness
  y = sectionHeader(doc, y, "Investment Readiness Profile", margin);
  const investmentReadiness = +((item.domain_resource_investment + item.domain_market_intelligence + item.investment_feasibility_score) / 3).toFixed(1);
  y = bodyText(doc, y, `Investment readiness composite: ${investmentReadiness}/10 (${scoreTier(investmentReadiness)}). ${investmentReadiness > 6 ? "This innovation presents a strong case for investment with demonstrated feasibility, market intelligence, and resource ecosystem support." : "Pre-investment capacity building is recommended to strengthen market access, institutional readiness, and financial ecosystem before large-scale funding commitment."}`, margin, contentWidth);

  // Risk factors
  y = sectionHeader(doc, y, "Risk Factors", margin);
  const risks: string[] = [];
  if (item.demand_gaps_score > 6) risks.push(`Critical demand gaps (${item.demand_gaps_score}/10) — structural barriers are preventing adoption at scale`);
  if (item.innovation_supply_score < 5) risks.push(`Weak innovation supply (${item.innovation_supply_score}/10) — limited delivery models and evidence base`);
  if (item.domain_enabling_env < 5) risks.push(`Weak enabling environment (${item.domain_enabling_env}/10) — regulatory or governance barriers may impede action`);
  if (item.domain_resource_investment < 5) risks.push(`Limited resource ecosystem (${item.domain_resource_investment}/10) — insufficient financial instruments or actors`);
  if (item.domain_stakeholders < 5) risks.push(`Low stakeholder capacity (${item.domain_stakeholders}/10) — network and organizational constraints amplify demand gaps`);
  if (item.domain_market_intelligence < 5) risks.push(`Weak market intelligence (${item.domain_market_intelligence}/10) — limited visibility on demand trends and market access`);
  if (risks.length === 0) risks.push("No critical risk factors identified at this stage — conditions are broadly favorable for scaling");

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Risk Factor & Impact"]],
    body: risks.map((r, i) => [String(i + 1), r]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [100, 30, 30], textColor: [255, 255, 255] },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Opportunity factors
  y = sectionHeader(doc, y, "Opportunity Factors", margin);
  const opps: string[] = [];
  if (item.demand_signals_score > 7) opps.push(`Strong demand signals (${item.demand_signals_score}/10) — clear institutional and market demand pull`);
  if (item.scaling_opportunity_score > 7) opps.push(`High scaling opportunity (${item.scaling_opportunity_score}/10) — 5-dimension convergence supports scaling`);
  if (item.domain_market_intelligence > 6) opps.push(`Market intelligence depth (${item.domain_market_intelligence}/10) — de-risks commercial scaling decisions`);
  if (item.investment_feasibility_score > 6) opps.push(`Investment feasibility (${item.investment_feasibility_score}/10) — viable business case with enabling conditions`);
  if (item.domain_innovation_portfolio > 6) opps.push(`Portfolio readiness (${item.domain_innovation_portfolio}/10) — strong evidence base and mature delivery models`);
  if (item.demand_gaps_score < 3) opps.push(`Managed demand gaps (${item.demand_gaps_score}/10) — adoption barriers are minimal and addressable`);
  if (opps.length === 0) opps.push("Opportunities exist but require strategic de-risking and ecosystem strengthening across multiple dimensions");

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["#", "Opportunity & Rationale"]],
    body: opps.map((o, i) => [String(i + 1), o]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [16, 120, 80], textColor: [255, 255, 255] },
  });

  pageFooter(doc, 5, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 6 — Recommendations, Roadmap & Finalization
  // ═══════════════════════════════════════════
  doc.addPage();
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "Strategic Recommendations", margin);
  y = bodyText(doc, y, `Based on the 7→5→1 framework assessment of "${item.innovation_name}" in ${item.country}, the following strategic recommendations are prioritized by signal severity and dimension gaps:`, margin, contentWidth);

  const recs: string[][] = [];
  if (item.demand_gaps_score > 6) {
    recs.push(["Close Demand Gaps", `Critical gaps score of ${item.demand_gaps_score}/10. Prioritize demand-side interventions: awareness campaigns, demonstration pilots, affordability mechanisms, and institutional capacity building.`]);
  }
  if (item.innovation_supply_score < 6) {
    recs.push(["Strengthen Innovation Supply", `Invest in supply chain development, delivery model refinement, evidence generation, and last-mile access (current supply: ${item.innovation_supply_score}/10).`]);
  }
  if (item.domain_enabling_env < 6) {
    recs.push(["Policy Engagement", `Engage policymakers to create enabling regulations, incentives, and institutional support (enabling environment: ${item.domain_enabling_env}/10).`]);
  }
  if (item.domain_stakeholders < 6) {
    recs.push(["Stakeholder Mobilization", `Build multi-stakeholder platforms, strengthen farmer organizations, and invest in extension services (stakeholder capacity: ${item.domain_stakeholders}/10).`]);
  }
  if (item.domain_resource_investment < 6) {
    recs.push(["Unlock Finance", `Design blended finance instruments, risk-sharing mechanisms, and results-based financing (resource ecosystem: ${item.domain_resource_investment}/10).`]);
  }
  if (item.domain_market_intelligence < 6) {
    recs.push(["Market Intelligence", `Invest in demand data systems, price monitoring, and value chain analysis to strengthen investment feasibility (market intel: ${item.domain_market_intelligence}/10).`]);
  }
  if (item.geography_priority_score < 6) {
    recs.push(["Geographic Targeting", `Refine geographic prioritization through context mapping, biophysical analysis, and stakeholder verification (geo priority: ${item.geography_priority_score}/10).`]);
  }
  recs.push(["Monitor & Adapt", "Establish a real-time monitoring framework using 7→5→1 signals to track dimension alignment, recalibrate interventions, and adapt the scaling strategy."]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Action Area", "Recommendation"]],
    body: recs,
    styles: { fontSize: 7.5, cellPadding: 4 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 38 } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  y = sectionHeader(doc, y, "Implementation Roadmap", margin);
  const roadmap = [
    ["0–3 months", "Stakeholder mapping, baseline dimension scoring, geographic prioritization, policy dialogue initiation, pilot site selection"],
    ["3–6 months", "Demand gap interventions, supply chain strengthening, policy engagement, first-round monitoring across 5 dimensions"],
    ["6–12 months", "Scale-up in priority corridors, monitoring framework activation, investment mobilization, impact documentation"],
    ["12–24 months", "Cross-country learning exchange, model refinement, institutional embedding, sustainability and exit planning"],
  ];
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Timeline", "Key Activities"]],
    body: roadmap,
    styles: { fontSize: 8, cellPadding: 3.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 28 } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  y = sectionHeader(doc, y, "Report Finalization", margin);
  const finalization = `This assessment classifies "${item.innovation_name}" as a ${scoreTier(item.scaling_opportunity_score).split(" ")[0]}-stage innovation with a ${getSignalLabel(signal).toLowerCase()} demand gap signal. The Demand Gaps score of ${item.demand_gaps_score}/10 combined with Scaling Opportunity of ${item.scaling_opportunity_score}/10, domain readiness of ${domainAvg}/10, and interaction coherence of ${interactionAvg}/10 indicates ${item.scaling_opportunity_score > 7 && item.demand_gaps_score < 4 ? "a system ready for accelerated scaling with targeted support" : item.scaling_opportunity_score > 5 ? "an emerging system requiring strategic capacity building before full-scale deployment" : "a nascent system requiring foundational investments across multiple dimensions before scaling is viable"}.`;
  y = bodyText(doc, y, finalization, margin, contentWidth);

  y = sectionHeader(doc, y, "Methodology & Disclaimer", margin);
  y = bodyText(doc, y, "Scores are derived from multi-source data synthesis including FAOSTAT, CGIAR outputs, World Bank LSMS, and local evidence. All scores are on a 0-10 scale. The 5 Demand Signaling Dimensions and 9 Domain→Dimension Interactions use the CGIAR 7→5→1 Demand Signaling Framework. Results should be triangulated with local context knowledge.", margin, contentWidth);

  // Final branding bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 270, pageWidth, 27, "F");
  doc.setFillColor(...sigRGB);
  doc.rect(0, 270, pageWidth, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CGIAR Demand Intelligence Platform — 7→5→1 Demand Signaling Framework", margin, 280);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 210);
  doc.text(`Report generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}  ·  Signal: ${getSignalLabel(signal)}  ·  Scaling Opp.: ${item.scaling_opportunity_score}/10`, margin, 286);

  pageFooter(doc, 6, totalPages, pageWidth);

  doc.save(`DIP_Report_${item.innovation_name.replace(/\s+/g, "_")}.pdf`);
}
