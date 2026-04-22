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
  doc.text(`DIIS Innovation Intelligence Report`, 18, 287);
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
  const gap = item.need_score - item.effective_demand_score;
  const signal = getSignalLevel(item);
  const sigRGB = signalRGB(signal);
  const totalPages = 6;
  const nexusAvg = +((item.need_supply + item.demand_scaling + item.supply_demand + item.supply_scaling + item.need_scaling + item.scaling_demand) / 6).toFixed(1);
  const domainAvg = +((item.domain_scaling_context + item.domain_sector + item.domain_stakeholders + item.domain_enabling_env + item.domain_resource_ecosystem + item.domain_market_intelligence + item.domain_innovation_portfolio) / 7).toFixed(1);

  // ═══════════════════════════════════════════
  // PAGE 1 — Cover & Executive Summary
  // ═══════════════════════════════════════════
  // Cover banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 65, "F");

  // Signal stripe at top
  doc.setFillColor(...sigRGB);
  doc.rect(0, 0, pageWidth, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DIIS — Demand-Led Innovation Intelligence System", margin, 18);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Innovation Intelligence Report", margin, 36);
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
  doc.roundedRect(margin + 60, y - 6, 45, 12, 2, 2, "F");
  doc.setTextColor(40, 40, 60);
  doc.text(`Gap: ${gap > 0 ? "+" : ""}${gap}`, margin + 65, y + 1);

  doc.setFillColor(240, 240, 245);
  doc.roundedRect(margin + 110, y - 6, 55, 12, 2, 2, "F");
  doc.setTextColor(40, 40, 60);
  doc.setFontSize(9);
  doc.text(`Nexus: ${nexusAvg}  Domain: ${domainAvg}`, margin + 114, y + 1);

  y += 18;

  // Executive summary
  y = sectionHeader(doc, y, "Executive Summary", margin);
  const summary = `This report provides a comprehensive demand-led intelligence assessment for "${item.innovation_name}" in ${item.country}. The analysis reveals a ${getSignalLabel(signal).toLowerCase()} signal with a need-demand gap of ${gap > 0 ? "+" : ""}${gap}. The overall nexus coherence is ${nexusAvg}/10 (${scoreTier(nexusAvg)}) and domain readiness averages ${domainAvg}/10 (${scoreTier(domainAvg)}). ${item.scaling_justification}`;
  y = bodyText(doc, y, summary, margin, contentWidth);

  // Interpretation box
  // Light tinted box for interpretation
  doc.setFillColor(sigRGB[0], sigRGB[1], sigRGB[2]);
  doc.roundedRect(margin, y - 2, contentWidth, 22, 2, 2, "F");
  // Overlay white to create tint effect
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y - 2, contentWidth, 22, 2, 2, "F");
  // Draw a colored left border
  doc.setFillColor(...sigRGB);
  doc.rect(margin, y - 2, 2, 22, "F");
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...sigRGB);
  doc.text("Interpretation", margin + 4, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 80);
  const interp = gap > 2
    ? `A high gap of +${gap} indicates critical unmet need. The innovation ecosystem is not yet delivering at the scale required. Priority: demand-side activation and supply chain strengthening.`
    : gap > 0
    ? `A moderate gap of +${gap} suggests partial alignment. Some ecosystem elements are in place but targeted investment can accelerate scaling.`
    : `A low/no gap indicates strong alignment between need and delivery. Focus on sustaining momentum and documenting scaling pathways.`;
  const interpLines = doc.splitTextToSize(interp, contentWidth - 8);
  doc.text(interpLines, margin + 4, y + 11);
  y += 28;

  // 4 Core Pillars with trends
  y = sectionHeader(doc, y, "Core Pillar Scores & Trends", margin);
  const pillars = [
    { label: "System Need", score: item.need_score },
    { label: "Effective Demand", score: item.effective_demand_score },
    { label: "Supply Readiness", score: item.supply_score },
    { label: "Scaling Opportunity", score: item.scaling_opportunity_score },
  ];
  for (const p of pillars) {
    const tc = tierColor(p.score);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 120);
    doc.text(p.label, margin, y + 4);
    doc.setTextColor(...tc);
    doc.setFont("helvetica", "bold");
    doc.text(`${p.score}/10  ${scoreTier(p.score)}`, margin + 46, y + 4);
    drawBar(doc, margin + 100, y, contentWidth - 130, p.score, 10, tc);
    // Trend indicator
    const trend = trendArrow(p.score, 5);
    doc.setFontSize(7);
    doc.setTextColor(...tc);
    doc.text(trend, margin + contentWidth - 24, y + 4);
    y += 12;
  }

  y += 4;
  y = sectionHeader(doc, y, "Strategic Gap Analysis", margin);
  y = bodyText(doc, y, `Need − Demand Gap: ${gap > 0 ? "+" : ""}${gap}. ${item.scaling_justification}`, margin, contentWidth);

  pageFooter(doc, 1, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 2 — Strategic Nexus & Interaction Pillars
  // ═══════════════════════════════════════════
  doc.addPage();

  // Color stripe
  doc.setFillColor(14, 165, 233);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "6 Interaction Pillars (Strategic Nexus)", margin);
  y = bodyText(doc, y, "The interaction pillars capture bi-directional relationships between core dimensions, revealing bottlenecks and synergies across the innovation system.", margin, contentWidth);

  const interactions = [
    { label: "Need ↔ Supply", score: item.need_supply, interp: item.need_supply > 6 ? "Strong alignment between identified needs and innovation supply" : "Alignment gap — supply does not adequately match system needs" },
    { label: "Demand ↔ Scaling", score: item.demand_scaling, interp: item.demand_scaling > 6 ? "Scaling tracks demand signals effectively" : "Scaling lags behind effective demand — bottleneck detected" },
    { label: "Supply ↔ Demand", score: item.supply_demand, interp: item.supply_demand > 6 ? "Market clearing — supply meets demand conditions" : "Market friction — supply and demand are misaligned" },
    { label: "Supply ↔ Scaling", score: item.supply_scaling, interp: item.supply_scaling > 6 ? "Supply chain supports scaling pathways" : "Supply chain is a bottleneck for scaling" },
    { label: "Need ↔ Scaling", score: item.need_scaling, interp: item.need_scaling > 6 ? "Need is driving scale-up effectively" : "Need not yet translating to scaling activity" },
    { label: "Scaling ↔ Demand", score: item.scaling_demand, interp: item.scaling_demand > 6 ? "Demand-responsive scaling in place" : "Scaling is not demand-driven — risk of misallocation" },
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Interaction", "Score", "Tier", "Trend", "Interpretation"]],
    body: interactions.map(ix => [
      ix.label,
      String(ix.score),
      scoreTier(ix.score),
      trendArrow(ix.score, 5),
      ix.interp,
    ]),
    styles: { fontSize: 7.5, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: {
      3: { fontStyle: "bold" },
      4: { fontStyle: "italic", textColor: [100, 100, 120] },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  y = sectionHeader(doc, y, "Nexus Coherence Assessment", margin);
  y = bodyText(doc, y, `Overall nexus strength: ${nexusAvg}/10 (${scoreTier(nexusAvg)}). ${nexusAvg > 6 ? "The innovation system shows strong internal coherence across pillars — interactions reinforce each other." : "Significant friction exists between pillars — targeted interventions are recommended to align supply, demand, and scaling pathways."}`, margin, contentWidth);

  // Visual bars
  for (const ix of interactions) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 120);
    doc.text(ix.label, margin, y + 3.5);
    drawBar(doc, margin + 40, y, contentWidth - 55, ix.score, 10, tierColor(ix.score));
    doc.setTextColor(...tierColor(ix.score));
    doc.setFont("helvetica", "bold");
    doc.text(String(ix.score), margin + contentWidth - 10, y + 3.5);
    y += 8;
  }

  pageFooter(doc, 2, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 3 — 7 Scaling Domains
  // ═══════════════════════════════════════════
  doc.addPage();

  doc.setFillColor(139, 92, 246);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "7 Scaling Domain Assessment", margin);
  y = bodyText(doc, y, "Each scaling domain is scored on a 0–10 scale reflecting the enabling conditions, readiness, and capacity of the innovation ecosystem.", margin, contentWidth);

  const domains = [
    { label: "Scaling Context", score: item.domain_scaling_context, desc: "Climate risks, infrastructure readiness, geographic suitability" },
    { label: "Sector", score: item.domain_sector, desc: "Productivity, efficiency, system constraints, WEF nexus" },
    { label: "Stakeholders & Networks", score: item.domain_stakeholders, desc: "Actor profiles, adoption willingness, network structure" },
    { label: "Enabling Environment", score: item.domain_enabling_env, desc: "Policy frameworks, regulation, institutional capacity" },
    { label: "Resource Ecosystem", score: item.domain_resource_ecosystem, desc: "Funding sources, finance access, risk-return profiles" },
    { label: "Market Intelligence", score: item.domain_market_intelligence, desc: "Demand trends, price signals, value-chain margins" },
    { label: "Innovation Portfolio", score: item.domain_innovation_portfolio, desc: "Readiness levels, performance evidence, adaptability" },
  ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Domain", "Score", "Tier", "Trend", "Description"]],
    body: domains.map(d => [d.label, String(d.score), scoreTier(d.score), trendArrow(d.score, 5), d.desc]),
    styles: { fontSize: 7.5, cellPadding: 3.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: {
      3: { fontStyle: "bold" },
      4: { fontStyle: "italic", textColor: [100, 100, 120] },
    },
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
  y = sectionHeader(doc, y, "Domain Interpretation", margin);

  // Find weakest and strongest domains
  const sorted = [...domains].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  y = bodyText(doc, y, `Average domain score: ${domainAvg}/10 (${scoreTier(domainAvg)}). Strongest domain: ${strongest.label} (${strongest.score}/10). Weakest domain: ${weakest.label} (${weakest.score}/10). ${domainAvg > 6 ? "The ecosystem shows strong multi-dimensional readiness for scaling." : `Key gap in "${weakest.label}" may constrain scaling — targeted capacity building recommended.`}`, margin, contentWidth);

  pageFooter(doc, 3, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 4 — Strategic Pillar Analysis Deep-Dive
  // ═══════════════════════════════════════════
  doc.addPage();
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "Critical Scaling Pillar Deep-Dive", margin);
  y = bodyText(doc, y, "A detailed examination of the four critical pillars determining scaling potential: Resources, Market Intelligence, Enabling Environment, and Innovation Portfolio.", margin, contentWidth);

  const criticalPillars = [
    { label: "Enabling Environment", score: item.domain_enabling_env, key: 'enabling_env' },
    { label: "Resource Ecosystem", score: item.domain_resource_ecosystem, key: 'resources' },
    { label: "Market Intelligence", score: item.domain_market_intelligence, key: 'market_intel' },
    { label: "Innovation Portfolio", score: item.domain_innovation_portfolio, key: 'portfolio' },
  ];

  for (const pillar of criticalPillars) {
    y = sectionHeader(doc, y, pillar.label, margin);
    const tc = tierColor(pillar.score);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...tc);
    doc.text(`Score: ${pillar.score}/10 — ${scoreTier(pillar.score)}`, margin, y + 4);
    drawBar(doc, margin + 70, y, contentWidth - 80, pillar.score, 10, tc);
    y += 10;

    let interpretation = "";
    if (pillar.key === 'enabling_env') {
        interpretation = pillar.score > 7 
            ? "Strong policy alignment and institutional support are present. The regulatory framework is a catalyst for scaling and private sector engagement."
            : pillar.score > 4
            ? "Moderate institutional support. Some regulatory hurdles or policy gaps exist that may slow down widespread adoption or investment."
            : "Weak enabling environment. Significant policy reform or institutional capacity building is required to create a viable scaling pathway.";
    } else if (pillar.key === 'resources') {
        interpretation = pillar.score > 7
            ? "Abundant resource access and strong financial ecosystem. Funding and human capital are not constraints for expansion at this stage."
            : pillar.score > 4
            ? "Resources are available but fragmented. Strategic coordination of funding and expertise is needed to reach target scale efficiently."
            : "Resource scarcity. High risk of scaling failure due to insufficient funding, lack of technical expertise, or weak infrastructure.";
    } else if (pillar.key === 'market_intel') {
        interpretation = pillar.score > 7
            ? "High market transparency. Demand signals and value-chain dynamics are well-understood, significantly de-risking commercial scaling."
            : pillar.score > 4
            ? "Partial market visibility. More data is needed on price elasticity, competitive landscape, and consumer behavior to optimize strategy."
            : "Low market intelligence. Scaling is currently blind to critical market signals. Investment in market data systems is a top priority.";
    } else if (pillar.key === 'portfolio') {
        interpretation = pillar.score > 7
            ? "Solid evidence base and high readiness level. The innovation has demonstrated consistent performance across diverse agro-ecologies."
            : pillar.score > 4
            ? "Emerging evidence. Positive results in controlled environments, but requires more field-based validation at scale in local contexts."
            : "Nascent portfolio. Evidence of impact is anecdotal or limited to very specific conditions. High research and adaptation need.";
    }

    y = bodyText(doc, y, interpretation, margin, contentWidth);
    y += 2;
  }

  pageFooter(doc, 4, totalPages, pageWidth);

  // ═══════════════════════════════════════════
  // PAGE 5 — Market, Investment & Trend Analysis
  // ═══════════════════════════════════════════
  doc.addPage();

  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "Market & Investment Analysis", margin);
  y = bodyText(doc, y, "This section synthesizes market intelligence, resource ecosystem indicators, and trend signals to inform investment decisions and partnership strategy.", margin, contentWidth);

  // Market position
  y = sectionHeader(doc, y, "Market Position & Trends", margin);
  const marketData = [
    ["Market Intelligence", String(item.domain_market_intelligence), scoreTier(item.domain_market_intelligence), trendArrow(item.domain_market_intelligence, 5)],
    ["Resource Ecosystem", String(item.domain_resource_ecosystem), scoreTier(item.domain_resource_ecosystem), trendArrow(item.domain_resource_ecosystem, 5)],
    ["Effective Demand", String(item.effective_demand_score), scoreTier(item.effective_demand_score), trendArrow(item.effective_demand_score, 6)],
    ["Supply Readiness", String(item.supply_score), scoreTier(item.supply_score), trendArrow(item.supply_score, 5)],
    ["Scaling Opportunity", String(item.scaling_opportunity_score), scoreTier(item.scaling_opportunity_score), trendArrow(item.scaling_opportunity_score, 6)],
  ];
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Indicator", "Score", "Assessment", "Trend"]],
    body: marketData,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 3: { fontStyle: "bold" } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // Investment readiness
  y = sectionHeader(doc, y, "Investment Readiness Profile", margin);
  const investmentReadiness = +((item.domain_resource_ecosystem + item.domain_market_intelligence + item.scaling_opportunity_score) / 3).toFixed(1);
  y = bodyText(doc, y, `Investment readiness: ${investmentReadiness}/10 (${scoreTier(investmentReadiness)}). ${investmentReadiness > 6 ? "This innovation presents a strong case for investment with demonstrated market traction and ecosystem support." : "Pre-investment capacity building is recommended to strengthen market access and institutional readiness before large-scale funding."}`, margin, contentWidth);

  // Risk factors
  y = sectionHeader(doc, y, "Risk Factors", margin);
  const risks: string[] = [];
  if (item.supply_score < 5) risks.push("Supply chain immaturity (score: " + item.supply_score + ") — limited distribution and manufacturing capacity");
  if (item.domain_enabling_env < 5) risks.push("Weak policy/institutional environment (score: " + item.domain_enabling_env + ") — regulatory barriers may slow adoption");
  if (item.domain_resource_ecosystem < 5) risks.push("Limited funding access (score: " + item.domain_resource_ecosystem + ") — financial instruments not yet in place");
  if (gap > 3) risks.push("Large need-demand gap (+${gap}) — adoption barriers may be structural");
  if (item.domain_stakeholders < 5) risks.push("Low stakeholder readiness (score: " + item.domain_stakeholders + ") — network capacity needs strengthening");
  if (item.domain_market_intelligence < 5) risks.push("Weak market intelligence (score: " + item.domain_market_intelligence + ") — pricing and demand signals unclear");
  if (risks.length === 0) risks.push("No critical risk factors identified at this stage");

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
  if (item.need_score > 7) opps.push("Strong system need (score: " + item.need_score + ") — clear demand pull for innovation");
  if (item.scaling_opportunity_score > 7) opps.push("High scaling opportunity (score: " + item.scaling_opportunity_score + ") — ecosystem supports expansion");
  if (item.domain_market_intelligence > 6) opps.push("Market intelligence supports informed scaling decisions (score: " + item.domain_market_intelligence + ")");
  if (item.effective_demand_score > 6) opps.push("Effective demand validates willingness to adopt (score: " + item.effective_demand_score + ")");
  if (item.domain_innovation_portfolio > 6) opps.push("Innovation portfolio strength (score: " + item.domain_innovation_portfolio + ") — evidence base is maturing");
  if (opps.length === 0) opps.push("Opportunities exist but require further de-risking and ecosystem strengthening");

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

  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 2, "F");

  y = 18;
  y = sectionHeader(doc, y, "Strategic Recommendations", margin);
  y = bodyText(doc, y, `Based on the comprehensive analysis of "${item.innovation_name}" in ${item.country}, the following strategic recommendations are prioritized by signal severity and domain gaps:`, margin, contentWidth);

  const recs: string[][] = [];
  if (gap > 2) {
    recs.push(["Close the Gap", "Prioritize demand-side interventions including awareness campaigns, demonstration pilots, and financing mechanisms to bridge the need-demand gap of +" + gap + "."]);
  }
  if (item.supply_score < 6) {
    recs.push(["Strengthen Supply", "Invest in supply chain development, local manufacturing capacity, and distribution networks to improve innovation delivery (current: " + item.supply_score + "/10)."]);
  }
  if (item.domain_enabling_env < 6) {
    recs.push(["Policy Engagement", "Engage with policymakers to create enabling regulations, incentives, and institutional support structures (current: " + item.domain_enabling_env + "/10)."]);
  }
  if (item.domain_stakeholders < 6) {
    recs.push(["Stakeholder Mobilization", "Build multi-stakeholder platforms, strengthen farmer organizations, and invest in extension services (current: " + item.domain_stakeholders + "/10)."]);
  }
  if (item.domain_resource_ecosystem < 6) {
    recs.push(["Unlock Finance", "Design blended finance instruments, risk-sharing mechanisms, and results-based financing to catalyze investment (current: " + item.domain_resource_ecosystem + "/10)."]);
  }
  if (item.domain_market_intelligence < 6) {
    recs.push(["Improve Market Intelligence", "Invest in market data systems, price monitoring, and value chain analysis to strengthen demand signals (current: " + item.domain_market_intelligence + "/10)."]);
  }
  recs.push(["Monitor & Adapt", "Establish a real-time monitoring framework using DIIS signals to track progress, recalibrate interventions, and adapt the scaling strategy."]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Action Area", "Recommendation"]],
    body: recs,
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  y = sectionHeader(doc, y, "Implementation Roadmap", margin);
  const roadmap = [
    ["0–3 months", "Stakeholder mapping, baseline data collection, pilot site selection, policy dialogue initiation"],
    ["3–6 months", "Demand-side interventions, supply chain strengthening, policy engagement, first-round monitoring"],
    ["6–12 months", "Scale-up in priority corridors, monitoring framework activation, impact assessment, finance mobilization"],
    ["12–24 months", "Cross-country learning, model refinement, institutional embedding, sustainability planning"],
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

  // Finalization summary
  y = sectionHeader(doc, y, "Report Finalization", margin);
  const finalization = `This assessment classifies "${item.innovation_name}" as a ${scoreTier(item.scaling_opportunity_score).split(" ")[0]}-stage innovation with ${getSignalLabel(signal).toLowerCase()} signal intensity. The need-demand gap of ${gap > 0 ? "+" : ""}${gap} combined with a nexus coherence of ${nexusAvg}/10 and domain readiness of ${domainAvg}/10 indicates ${domainAvg > 6 && nexusAvg > 6 ? "a system ready for accelerated scaling with targeted support" : domainAvg > 4 ? "an emerging system that requires strategic capacity building before full-scale deployment" : "a nascent system requiring foundational investments across multiple domains"}.`;
  y = bodyText(doc, y, finalization, margin, contentWidth);

  y = sectionHeader(doc, y, "Methodology & Disclaimer", margin);
  y = bodyText(doc, y, "Scores are derived from multi-source data synthesis including FAOSTAT, CGIAR outputs, World Bank LSMS, and local evidence. All scores are on a 0-10 scale and should be triangulated with local context. The 6 interaction pillars and 7 scaling domains use a demand-led intelligence framework developed by DIIS.", margin, contentWidth);

  // Final branding bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 270, pageWidth, 27, "F");
  // Signal color accent
  doc.setFillColor(...sigRGB);
  doc.rect(0, 270, pageWidth, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DIIS — Demand-Led Innovation Intelligence System", margin, 280);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 210);
  doc.text(`Report generated: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}  ·  Signal: ${getSignalLabel(signal)}  ·  Gap: ${gap > 0 ? "+" : ""}${gap}`, margin, 286);

  pageFooter(doc, 6, totalPages, pageWidth);

  doc.save(`DIIS_Report_${item.innovation_name.replace(/\s+/g, "_")}.pdf`);
}
