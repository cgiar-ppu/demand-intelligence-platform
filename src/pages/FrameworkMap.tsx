import { useRef, useEffect } from "react";

const NS = "http://www.w3.org/2000/svg";

function buildVisualization(svg: SVGSVGElement) {
  // Clear any previous content (for StrictMode double-invoke)
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // --- Defs ---
  const defs = document.createElementNS(NS, "defs");

  const defsHTML = `
    <radialGradient id="bgGrad" cx="80%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#e2e8f0" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bgGrad2" cx="10%" cy="50%" r="40%">
      <stop offset="0%" stop-color="#e2e8f0" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#0d9488" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#f59e0b" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#8b5cf6" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-indigo" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#6366f1" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-sky" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#0ea5e9" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#ec4899" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-tealgreen" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#14b8a6" flood-opacity="0.25" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-final" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="8" result="blur"/><feFlood flood-color="#10b981" flood-opacity="0.3" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-dim-gold" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#f59e0b" flood-opacity="0.2" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-dim-orange" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#f97316" flood-opacity="0.2" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-dim-green" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#10b981" flood-opacity="0.2" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-dim-rose" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#f43f5e" flood-opacity="0.2" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-dim-blue" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#3b82f6" flood-opacity="0.2" result="color"/><feComposite in="color" in2="blur" operator="in" result="shadow"/><feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/><feOffset dx="0" dy="1" result="shadow"/><feFlood flood-color="#000" flood-opacity="0.1"/><feComposite in2="shadow" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="srcShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/><feOffset dx="0" dy="2" result="shadow"/><feFlood flood-color="#000" flood-opacity="0.15"/><feComposite in2="shadow" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  `;
  defs.innerHTML = defsHTML;
  svg.appendChild(defs);

  // --- Background ---
  const bgRect = document.createElementNS(NS, "rect");
  bgRect.setAttribute("width", "1600"); bgRect.setAttribute("height", "900"); bgRect.setAttribute("fill", "#f8fafc");
  svg.appendChild(bgRect);
  const bgGradRect = document.createElementNS(NS, "rect");
  bgGradRect.setAttribute("width", "1600"); bgGradRect.setAttribute("height", "900"); bgGradRect.setAttribute("fill", "url(#bgGrad)");
  svg.appendChild(bgGradRect);
  const bgGrad2Rect = document.createElementNS(NS, "rect");
  bgGrad2Rect.setAttribute("width", "1600"); bgGrad2Rect.setAttribute("height", "900"); bgGrad2Rect.setAttribute("fill", "url(#bgGrad2)");
  svg.appendChild(bgGrad2Rect);

  // --- Vertical guide lines ---
  const guidesG = document.createElementNS(NS, "g");
  guidesG.setAttribute("opacity", "0.15");
  guidesG.setAttribute("stroke", "#94a3b8");
  guidesG.setAttribute("stroke-width", "0.5");
  guidesG.setAttribute("stroke-dasharray", "4,6");
  [150, 330, 555, 840, 1210].forEach((x) => {
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", String(x)); line.setAttribute("y1", "65");
    line.setAttribute("x2", String(x)); line.setAttribute("y2", "880");
    guidesG.appendChild(line);
  });
  svg.appendChild(guidesG);

  // --- Title ---
  const titleMain = document.createElementNS(NS, "text");
  titleMain.setAttribute("x", "35"); titleMain.setAttribute("y", "28");
  titleMain.setAttribute("class", "title-main");
  titleMain.textContent = "Demand Intelligence Framework";
  svg.appendChild(titleMain);
  const titleSub = document.createElementNS(NS, "text");
  titleSub.setAttribute("x", "35"); titleSub.setAttribute("y", "42");
  titleSub.setAttribute("class", "title-sub");
  titleSub.textContent = "Signal Chain Architecture \u2014 7\u21925\u21921 Framework";
  svg.appendChild(titleSub);

  // --- Data ---
  const colX = [70, 230, 430, 680, 1000, 1420];
  const headerY = 68;
  const startY = 90;
  const endY = 880;

  const headers = [
    { label: "3 Data Sources", sub: "Knowledge Platforms" },
    { label: "~75 Indicators", sub: "Evidence Points" },
    { label: "28 Themes", sub: "Diagnostic Cells" },
    { label: "7 Domains", sub: "Data Signals" },
    { label: "5 Dimensions", sub: "Signal Analysis" },
    { label: "Demand Intel.", sub: "Scaling Outcome" },
  ];

  headers.forEach((h, i) => {
    const t1 = document.createElementNS(NS, "text");
    t1.setAttribute("x", String(colX[i])); t1.setAttribute("y", String(headerY));
    t1.setAttribute("class", "col-header"); t1.textContent = h.label;
    svg.appendChild(t1);
    const t2 = document.createElementNS(NS, "text");
    t2.setAttribute("x", String(colX[i])); t2.setAttribute("y", String(headerY + 12));
    t2.setAttribute("class", "col-sub"); t2.textContent = h.sub;
    svg.appendChild(t2);
  });

  const counts = ["3", "~75", "28", "7", "5", "1"];
  headers.forEach((_h, i) => {
    const badgeY = headerY + 24;
    const rect = document.createElementNS(NS, "rect");
    const w = counts[i].length * 7 + 12;
    rect.setAttribute("x", String(colX[i] - w / 2)); rect.setAttribute("y", String(badgeY - 7));
    rect.setAttribute("width", String(w)); rect.setAttribute("height", "13");
    rect.setAttribute("rx", "6"); rect.setAttribute("ry", "6");
    rect.setAttribute("fill", "#e2e8f0"); rect.setAttribute("stroke", "#cbd5e1"); rect.setAttribute("stroke-width", "0.5");
    svg.appendChild(rect);
    const bt = document.createElementNS(NS, "text");
    bt.setAttribute("x", String(colX[i])); bt.setAttribute("y", String(badgeY));
    bt.setAttribute("text-anchor", "middle"); bt.setAttribute("dominant-baseline", "central");
    bt.setAttribute("font-size", "7px"); bt.setAttribute("fill", "#475569");
    bt.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
    bt.setAttribute("font-weight", "600");
    bt.textContent = counts[i];
    svg.appendChild(bt);
  });

  interface DomainDef {
    id: number;
    name: string;
    color: string;
    glow: string;
    q: string;
    themes: string[];
    indicators: string[][];
    _indCount?: number;
    _themePositions?: ThemePos[];
  }

  interface ThemePos {
    x: number;
    y: number;
    color: string;
    label: string;
    domainIdx: number;
    globalIdx?: number;
  }

  interface IndicatorPos {
    x: number;
    y: number;
    color: string;
    label: string;
    domainIdx: number;
  }

  interface DomainPos {
    x: number;
    y: number;
    color: string;
    glow: string;
    id: number;
    name: string;
    q: string;
    domainIdx: number;
  }

  const domains: DomainDef[] = [
    { id: 1, name: "Scaling Context", color: "#0d9488", glow: "glow-teal", q: "Where does demand occur?",
      themes: ["Natural Systems", "Physical Infrastructure", "Farming Systems", "Socio-Economic"],
      indicators: [["Climate Data", "Soil Quality", "Water Availability"], ["Roads & Transport", "Energy Access", "Digital Connectivity"], ["Crop Productivity", "Input Use", "Shock Exposure"], ["Income & Poverty", "Gender & Youth", "Education & Literacy"]] },
    { id: 2, name: "Sector", color: "#f59e0b", glow: "glow-amber", q: "What system/problem?",
      themes: ["Sector Definition", "Performance", "Constraints", "Targets"],
      indicators: [["System Classification", "Sub-sector Segments"], ["Productivity Metrics", "Sustainability", "Resilience"], ["Technical Barriers", "Market Failures", "Behavioral Barriers"], ["Productivity Goals", "Inclusion Targets"]] },
    { id: 3, name: "Stakeholders", color: "#8b5cf6", glow: "glow-purple", q: "Who shapes demand?",
      themes: ["Actor Typology", "Needs & Preferences", "Capacity", "Networks"],
      indicators: [["Innovators & Firms", "Investors", "End-users"], ["Expressed Needs", "Willingness to Adopt"], ["Technical Capacity", "Financial Capacity", "Organizational"], ["Partnerships", "Information Flows", "Intermediaries"]] },
    { id: 4, name: "Enabling Env.", color: "#6366f1", glow: "glow-indigo", q: "Can demand become action?",
      themes: ["Policy & Regulation", "Institutions", "Public Programs", "System Constraints"],
      indicators: [["Sector Policies", "Trade Rules", "Compliance"], ["Governance Quality", "Coordination", "Decentralization"], ["Budget Allocation", "Extension Services", "Implementation"], ["Bureaucracy", "Regulatory Barriers", "Policy Gaps"]] },
    { id: 5, name: "Resource & Inv.", color: "#0ea5e9", glow: "glow-sky", q: "Is demand fundable?",
      themes: ["Financial Actors", "Financial Instruments", "Capital Flows", "Access & Inclusion"],
      indicators: [["Banks & DFIs", "Impact Investors", "Fintechs"], ["Credit Products", "Insurance", "Digital Finance"], ["Public vs Private", "Investment Pipeline", "Disbursement"], ["Credit Access", "Gender Gaps", "Rural Outreach"]] },
    { id: 6, name: "Market Intel.", color: "#ec4899", glow: "glow-pink", q: "Is demand viable?",
      themes: ["Demand Trends", "Value Chains", "Prices", "Consumer Behavior"],
      indicators: [["Market Size", "Growth Rates", "Consumption Patterns"], ["Actor Margins", "Cost Structure", "Governance"], ["Farmgate Prices", "Price Volatility", "Input Costs"], ["Preferences", "Willingness to Pay", "Segmentation"]] },
    { id: 7, name: "Innovation Port.", color: "#14b8a6", glow: "glow-tealgreen", q: "What solutions exist?",
      themes: ["Innovation Inventory", "Readiness & Evidence", "Adoption & Diffusion", "Delivery & Bundling"],
      indicators: [["Technologies", "Services", "Business Models"], ["Maturity Level", "Impact Evidence", "Cost-effectiveness"], ["Adoption Rates", "Geographic Spread", "Barriers"], ["Delivery Channels", "Bundling Potential", "Partnerships"]] },
  ];

  const dataSources = [
    { name: "Primary Data", color: "#2563eb", feedsDomains: [0, 1, 5] },
    { name: "Secondary Data", color: "#7c3aed", feedsDomains: [0, 3, 4, 5] },
    { name: "Partner Data", color: "#059669", feedsDomains: [1, 2, 4, 6] },
  ];

  const dimGlowIds = ["glow-dim-gold", "glow-dim-orange", "glow-dim-green", "glow-dim-rose", "glow-dim-blue"];
  const dimensions = [
    { name: "Geography &\nPriority", score: "7.3", color: "#f59e0b", glowId: dimGlowIds[0], fromDomains: [1] },
    { name: "Demand\nSignals", score: "7.2", color: "#f97316", glowId: dimGlowIds[1], fromDomains: [2, 3] },
    { name: "Innovation\nSupply", score: "5.0", color: "#10b981", glowId: dimGlowIds[2], fromDomains: [7] },
    { name: "Demand\nGaps", score: "6.3", color: "#f43f5e", glowId: dimGlowIds[3], fromDomains: [3, 6], inverse: true },
    { name: "Investment\nFeasibility", score: "5.6", color: "#3b82f6", glowId: dimGlowIds[4], fromDomains: [4, 5, 6] },
  ];

  const domainGap = 7;
  const indSpacing = 10;

  let totalIndHeight = 0;
  domains.forEach((d) => {
    let c = 0;
    d.indicators.forEach((arr) => (c += arr.length));
    d._indCount = c;
    totalIndHeight += c * indSpacing;
  });
  totalIndHeight += (domains.length - 1) * domainGap;

  const contentStartY = startY + 28;
  const indStartY = contentStartY + (endY - contentStartY - totalIndHeight) / 2;

  let curY = indStartY;
  const indicatorPositions: IndicatorPos[] = [];
  const themePositions: ThemePos[] = [];
  const domainPositions: DomainPos[] = [];
  const domainYRanges: { startY: number; endY: number; centerY: number }[] = [];

  domains.forEach((d, di) => {
    const domStartY = curY;
    d._themePositions = [];
    d.themes.forEach((_theme, ti) => {
      const indArr = d.indicators[ti];
      const themeStartY = curY;
      indArr.forEach((ind) => {
        indicatorPositions.push({ x: colX[1], y: curY, color: d.color, label: ind, domainIdx: di });
        curY += indSpacing;
      });
      const themeCenterY = (themeStartY + curY - indSpacing) / 2;
      d._themePositions!.push({ x: colX[2], y: themeCenterY, color: d.color, label: d.themes[ti], domainIdx: di });
    });
    d._themePositions!.forEach((tp) => {
      tp.globalIdx = themePositions.length;
      themePositions.push(tp);
    });
    const domCenterY = (domStartY + curY - indSpacing) / 2;
    domainPositions.push({ x: colX[3], y: domCenterY, color: d.color, glow: d.glow, id: d.id, name: d.name, q: d.q, domainIdx: di });
    domainYRanges.push({ startY: domStartY, endY: curY - indSpacing, centerY: domCenterY });
    curY += domainGap;
  });

  // Data source block positions — evenly distributed vertically
  const srcBlockWidth = 90;
  const srcBlockHeight = 45;
  const totalSrcHeight = dataSources.length * srcBlockHeight;
  const srcGap = (endY - contentStartY - totalSrcHeight) / (dataSources.length + 1);
  const dataSourcePositions: { x: number; y: number; w: number; h: number; centerX: number; centerY: number; color: string; name: string; feedsDomains: number[] }[] = [];

  dataSources.forEach((src, si) => {
    const blockY = contentStartY + srcGap * (si + 1) + srcBlockHeight * si;
    const blockCenterY = blockY + srcBlockHeight / 2;
    dataSourcePositions.push({
      x: colX[0] - srcBlockWidth / 2,
      y: blockY,
      w: srcBlockWidth,
      h: srcBlockHeight,
      centerX: colX[0],
      centerY: blockCenterY,
      color: src.color,
      name: src.name,
      feedsDomains: src.feedsDomains,
    });
  });

  const dimSpacing = (endY - contentStartY) / (dimensions.length + 1);
  const dimensionPositions = dimensions.map((dim, i) => ({
    x: colX[4],
    y: contentStartY + dimSpacing * (i + 1),
    color: dim.color,
    glowId: dim.glowId,
    name: dim.name,
    score: dim.score,
    fromDomains: dim.fromDomains,
    inverse: dim.inverse || false,
  }));

  const finalPos = { x: colX[5], y: (contentStartY + endY) / 2 };

  function bezier(x1: number, y1: number, x2: number, y2: number) {
    const dx = (x2 - x1) * 0.42;
    return "M" + x1 + "," + y1 + " C" + (x1 + dx) + "," + y1 + " " + (x2 - dx) + "," + y2 + " " + x2 + "," + y2;
  }

  const gLines = document.createElementNS(NS, "g");
  gLines.id = "lines";
  const gNodes = document.createElementNS(NS, "g");
  gNodes.id = "nodes";
  svg.appendChild(gLines);
  svg.appendChild(gNodes);

  // Data Sources -> Indicator dots
  dataSourcePositions.forEach((src) => {
    indicatorPositions.forEach((ind) => {
      if (src.feedsDomains.indexOf(ind.domainIdx) >= 0) {
        const path = document.createElementNS(NS, "path");
        const x1 = src.x + src.w;
        const y1 = Math.min(Math.max(ind.y, src.y + 4), src.y + src.h - 4);
        const x2 = ind.x - 4;
        const y2 = ind.y;
        path.setAttribute("d", bezier(x1, y1, x2, y2));
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", src.color);
        path.setAttribute("stroke-width", "0.7");
        path.setAttribute("stroke-opacity", "0.3");
        gLines.appendChild(path);
      }
    });
  });

  // Indicators -> Themes
  indicatorPositions.forEach((ind) => {
    const d = domains[ind.domainIdx];
    let foundTheme = -1;
    for (let ti = 0; ti < d.themes.length; ti++) {
      if (d.indicators[ti].indexOf(ind.label) >= 0) { foundTheme = ti; break; }
    }
    let gIdx = 0;
    for (let di = 0; di < ind.domainIdx; di++) gIdx += domains[di].themes.length;
    gIdx += foundTheme;
    const theme = themePositions[gIdx];
    if (!theme) return;
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", bezier(ind.x + 4, ind.y, theme.x - 10, theme.y));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", ind.color);
    path.setAttribute("stroke-width", "0.8");
    path.setAttribute("stroke-opacity", "0.45");
    gLines.appendChild(path);
  });

  // Themes -> Domains
  themePositions.forEach((theme) => {
    const domain = domainPositions[theme.domainIdx];
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", bezier(theme.x + 55, theme.y, domain.x - 22, domain.y));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", theme.color);
    path.setAttribute("stroke-width", "1.2");
    path.setAttribute("stroke-opacity", "0.38");
    gLines.appendChild(path);
  });

  // Domains -> Dimensions
  const domainToDim: Record<number, number[]> = { 0: [0], 1: [1], 2: [1, 3], 3: [4], 4: [4], 5: [3, 4], 6: [2] };
  Object.keys(domainToDim).forEach((diStr) => {
    const di = parseInt(diStr);
    const domain = domainPositions[di];
    domainToDim[di].forEach((dimIdx) => {
      const dim = dimensionPositions[dimIdx];
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", bezier(domain.x + 22, domain.y, dim.x - 20, dim.y));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", domain.color);
      path.setAttribute("stroke-width", "1.8");
      path.setAttribute("stroke-opacity", "0.4");
      gLines.appendChild(path);
    });
  });

  // Dimensions -> Final
  dimensionPositions.forEach((dim) => {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", bezier(dim.x + 20, dim.y, finalPos.x - 40, finalPos.y));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", dim.color);
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-opacity", "0.38");
    gLines.appendChild(path);
  });

  // Data Source blocks
  dataSourcePositions.forEach((src) => {
    const rect = document.createElementNS(NS, "rect");
    rect.setAttribute("x", String(src.x)); rect.setAttribute("y", String(src.y));
    rect.setAttribute("width", String(src.w)); rect.setAttribute("height", String(src.h));
    rect.setAttribute("rx", "10"); rect.setAttribute("ry", "10");
    rect.setAttribute("fill", src.color);
    rect.setAttribute("filter", "url(#srcShadow)");
    gNodes.appendChild(rect);
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(src.centerX)); t.setAttribute("y", String(src.centerY));
    t.setAttribute("text-anchor", "middle");
    t.setAttribute("dominant-baseline", "central");
    t.setAttribute("font-size", "11px");
    t.setAttribute("fill", "#ffffff");
    t.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
    t.setAttribute("font-weight", "700");
    t.setAttribute("letter-spacing", "0.03em");
    t.textContent = src.name;
    gNodes.appendChild(t);
  });

  // Indicator dots
  indicatorPositions.forEach((ind) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", String(ind.x)); c.setAttribute("cy", String(ind.y));
    c.setAttribute("r", "2.5");
    c.setAttribute("fill", ind.color);
    c.setAttribute("fill-opacity", "1.0");
    gNodes.appendChild(c);
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(ind.x + 6)); t.setAttribute("y", String(ind.y + 2.5));
    t.setAttribute("text-anchor", "start");
    t.setAttribute("font-size", "7px");
    t.setAttribute("fill", "#475569");
    t.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
    t.setAttribute("font-weight", "400");
    t.textContent = ind.label;
    gNodes.appendChild(t);
  });

  // Theme nodes
  themePositions.forEach((theme) => {
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", String(theme.x)); c.setAttribute("cy", String(theme.y));
    c.setAttribute("r", "7");
    c.setAttribute("fill", theme.color);
    c.setAttribute("fill-opacity", "0.12");
    c.setAttribute("stroke", theme.color);
    c.setAttribute("stroke-width", "1.2");
    c.setAttribute("stroke-opacity", "0.7");
    c.setAttribute("filter", "url(#softShadow)");
    gNodes.appendChild(c);
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", String(theme.x + 11)); t.setAttribute("y", String(theme.y + 2.5));
    t.setAttribute("class", "theme-label");
    t.textContent = theme.label;
    gNodes.appendChild(t);
  });

  // Domain nodes
  domainPositions.forEach((domain) => {
    const cAmb = document.createElementNS(NS, "circle");
    cAmb.setAttribute("cx", String(domain.x)); cAmb.setAttribute("cy", String(domain.y));
    cAmb.setAttribute("r", "24");
    cAmb.setAttribute("fill", domain.color);
    cAmb.setAttribute("fill-opacity", "0.08");
    gNodes.appendChild(cAmb);
    const cGlow = document.createElementNS(NS, "circle");
    cGlow.setAttribute("cx", String(domain.x)); cGlow.setAttribute("cy", String(domain.y));
    cGlow.setAttribute("r", "20");
    cGlow.setAttribute("fill", "none");
    cGlow.setAttribute("stroke", domain.color);
    cGlow.setAttribute("stroke-width", "0.8");
    cGlow.setAttribute("stroke-opacity", "0.2");
    gNodes.appendChild(cGlow);
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", String(domain.x)); c.setAttribute("cy", String(domain.y));
    c.setAttribute("r", "17");
    c.setAttribute("fill", domain.color);
    c.setAttribute("stroke", domain.color);
    c.setAttribute("stroke-width", "2");
    c.setAttribute("filter", "url(#" + domain.glow + ")");
    gNodes.appendChild(c);
    const cInner = document.createElementNS(NS, "circle");
    cInner.setAttribute("cx", String(domain.x)); cInner.setAttribute("cy", String(domain.y));
    cInner.setAttribute("r", "14");
    cInner.setAttribute("fill", domain.color);
    cInner.setAttribute("fill-opacity", "0.15");
    gNodes.appendChild(cInner);
    const tn = document.createElementNS(NS, "text");
    tn.setAttribute("x", String(domain.x)); tn.setAttribute("y", String(domain.y));
    tn.setAttribute("class", "domain-num");
    tn.textContent = String(domain.id);
    gNodes.appendChild(tn);
    const tl = document.createElementNS(NS, "text");
    tl.setAttribute("x", String(domain.x)); tl.setAttribute("y", String(domain.y + 26));
    tl.setAttribute("class", "domain-label");
    tl.textContent = domain.name;
    gNodes.appendChild(tl);
    const tq = document.createElementNS(NS, "text");
    tq.setAttribute("x", String(domain.x)); tq.setAttribute("y", String(domain.y + 35));
    tq.setAttribute("class", "domain-question");
    tq.textContent = "\u201C" + domain.q + "\u201D";
    gNodes.appendChild(tq);
  });

  // Dimension nodes
  dimensionPositions.forEach((dim) => {
    const cAmb = document.createElementNS(NS, "circle");
    cAmb.setAttribute("cx", String(dim.x)); cAmb.setAttribute("cy", String(dim.y));
    cAmb.setAttribute("r", "22");
    cAmb.setAttribute("fill", dim.color);
    cAmb.setAttribute("fill-opacity", "0.06");
    gNodes.appendChild(cAmb);
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", String(dim.x)); c.setAttribute("cy", String(dim.y));
    c.setAttribute("r", "16");
    c.setAttribute("fill", dim.color);
    c.setAttribute("stroke", dim.color);
    c.setAttribute("stroke-width", "2");
    c.setAttribute("filter", "url(#" + dim.glowId + ")");
    gNodes.appendChild(c);
    const cInner = document.createElementNS(NS, "circle");
    cInner.setAttribute("cx", String(dim.x)); cInner.setAttribute("cy", String(dim.y));
    cInner.setAttribute("r", "13");
    cInner.setAttribute("fill", dim.color);
    cInner.setAttribute("fill-opacity", "0.15");
    gNodes.appendChild(cInner);
    const ts = document.createElementNS(NS, "text");
    ts.setAttribute("x", String(dim.x)); ts.setAttribute("y", String(dim.y));
    ts.setAttribute("class", "dim-score");
    ts.textContent = dim.score;
    gNodes.appendChild(ts);
    const lines = dim.name.split("\n");
    lines.forEach((line, li) => {
      const tl = document.createElementNS(NS, "text");
      tl.setAttribute("x", String(dim.x)); tl.setAttribute("y", String(dim.y + 24 + li * 11));
      tl.setAttribute("class", "dim-label");
      tl.setAttribute("fill", dim.color);
      tl.textContent = line;
      gNodes.appendChild(tl);
    });
    if (dim.inverse) {
      const ti = document.createElementNS(NS, "text");
      ti.setAttribute("x", String(dim.x)); ti.setAttribute("y", String(dim.y + 24 + lines.length * 11 + 1));
      ti.setAttribute("text-anchor", "middle");
      ti.setAttribute("font-size", "6px");
      ti.setAttribute("fill", "#e11d48");
      ti.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
      ti.setAttribute("font-style", "italic");
      ti.setAttribute("opacity", "0.7");
      ti.textContent = "(inverse: lower = better)";
      gNodes.appendChild(ti);
    }
  });

  // Final node with pulse animation
  const pulseRing = document.createElementNS(NS, "circle");
  pulseRing.setAttribute("cx", String(finalPos.x)); pulseRing.setAttribute("cy", String(finalPos.y));
  pulseRing.setAttribute("r", "50");
  pulseRing.setAttribute("fill", "none");
  pulseRing.setAttribute("stroke", "#10b981");
  pulseRing.setAttribute("stroke-width", "1");
  pulseRing.setAttribute("stroke-opacity", "0");
  gNodes.appendChild(pulseRing);
  const anim1 = document.createElementNS(NS, "animate");
  anim1.setAttribute("attributeName", "r"); anim1.setAttribute("from", "38"); anim1.setAttribute("to", "60");
  anim1.setAttribute("dur", "3s"); anim1.setAttribute("repeatCount", "indefinite");
  pulseRing.appendChild(anim1);
  const anim2 = document.createElementNS(NS, "animate");
  anim2.setAttribute("attributeName", "stroke-opacity"); anim2.setAttribute("from", "0.25"); anim2.setAttribute("to", "0");
  anim2.setAttribute("dur", "3s"); anim2.setAttribute("repeatCount", "indefinite");
  pulseRing.appendChild(anim2);

  const pulseRing2 = document.createElementNS(NS, "circle");
  pulseRing2.setAttribute("cx", String(finalPos.x)); pulseRing2.setAttribute("cy", String(finalPos.y));
  pulseRing2.setAttribute("r", "38");
  pulseRing2.setAttribute("fill", "none");
  pulseRing2.setAttribute("stroke", "#10b981");
  pulseRing2.setAttribute("stroke-width", "0.8");
  pulseRing2.setAttribute("stroke-opacity", "0");
  gNodes.appendChild(pulseRing2);
  const anim3 = document.createElementNS(NS, "animate");
  anim3.setAttribute("attributeName", "r"); anim3.setAttribute("from", "38"); anim3.setAttribute("to", "60");
  anim3.setAttribute("dur", "3s"); anim3.setAttribute("begin", "1.5s"); anim3.setAttribute("repeatCount", "indefinite");
  pulseRing2.appendChild(anim3);
  const anim4 = document.createElementNS(NS, "animate");
  anim4.setAttribute("attributeName", "stroke-opacity"); anim4.setAttribute("from", "0.2"); anim4.setAttribute("to", "0");
  anim4.setAttribute("dur", "3s"); anim4.setAttribute("begin", "1.5s"); anim4.setAttribute("repeatCount", "indefinite");
  pulseRing2.appendChild(anim4);

  const fGlow1 = document.createElementNS(NS, "circle");
  fGlow1.setAttribute("cx", String(finalPos.x)); fGlow1.setAttribute("cy", String(finalPos.y));
  fGlow1.setAttribute("r", "45");
  fGlow1.setAttribute("fill", "#10b981");
  fGlow1.setAttribute("fill-opacity", "0.06");
  gNodes.appendChild(fGlow1);

  const fGlow2 = document.createElementNS(NS, "circle");
  fGlow2.setAttribute("cx", String(finalPos.x)); fGlow2.setAttribute("cy", String(finalPos.y));
  fGlow2.setAttribute("r", "38");
  fGlow2.setAttribute("fill", "#10b981");
  fGlow2.setAttribute("fill-opacity", "0.08");
  fGlow2.setAttribute("filter", "url(#glow-final)");
  gNodes.appendChild(fGlow2);

  const fCircle = document.createElementNS(NS, "circle");
  fCircle.setAttribute("cx", String(finalPos.x)); fCircle.setAttribute("cy", String(finalPos.y));
  fCircle.setAttribute("r", "34");
  fCircle.setAttribute("fill", "#10b981");
  fCircle.setAttribute("stroke", "#059669");
  fCircle.setAttribute("stroke-width", "2.5");
  fCircle.setAttribute("filter", "url(#glow-final)");
  gNodes.appendChild(fCircle);

  const fInner = document.createElementNS(NS, "circle");
  fInner.setAttribute("cx", String(finalPos.x)); fInner.setAttribute("cy", String(finalPos.y));
  fInner.setAttribute("r", "30");
  fInner.setAttribute("fill", "#fff");
  fInner.setAttribute("fill-opacity", "0.08");
  gNodes.appendChild(fInner);

  const fScore = document.createElementNS(NS, "text");
  fScore.setAttribute("x", String(finalPos.x)); fScore.setAttribute("y", String(finalPos.y + 2));
  fScore.setAttribute("class", "final-score");
  fScore.textContent = "5.8";
  gNodes.appendChild(fScore);

  const fLabel = document.createElementNS(NS, "text");
  fLabel.setAttribute("x", String(finalPos.x)); fLabel.setAttribute("y", String(finalPos.y + 50));
  fLabel.setAttribute("class", "final-label");
  fLabel.textContent = "Demand Intelligence";
  gNodes.appendChild(fLabel);

  const fSub = document.createElementNS(NS, "text");
  fSub.setAttribute("x", String(finalPos.x)); fSub.setAttribute("y", String(finalPos.y + 63));
  fSub.setAttribute("class", "final-sub");
  fSub.textContent = "Scaling Opportunity";
  gNodes.appendChild(fSub);

  const fUnit = document.createElementNS(NS, "text");
  fUnit.setAttribute("x", String(finalPos.x)); fUnit.setAttribute("y", String(finalPos.y + 75));
  fUnit.setAttribute("text-anchor", "middle");
  fUnit.setAttribute("font-size", "7px");
  fUnit.setAttribute("fill", "#64748b");
  fUnit.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
  fUnit.textContent = "Composite Score (0\u201310)";
  gNodes.appendChild(fUnit);

  // Flow direction arrows
  const arrowY = endY + 10;
  const arrowG = document.createElementNS(NS, "g");
  arrowG.setAttribute("opacity", "0.2");
  arrowG.setAttribute("fill", "none");
  arrowG.setAttribute("stroke", "#94a3b8");
  arrowG.setAttribute("stroke-width", "1");
  svg.appendChild(arrowG);
  const arrowLabels = ["Source", "Classify", "Aggregate", "Score", "Compose"];
  for (let i = 0; i < 5; i++) {
    const x1 = colX[i] + 30;
    const x2 = colX[i + 1] - 30;
    const mid = (x1 + x2) / 2;
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", "M" + x1 + "," + arrowY + " L" + x2 + "," + arrowY);
    arrowG.appendChild(p);
    const ah = document.createElementNS(NS, "path");
    ah.setAttribute("d", "M" + (x2 - 5) + "," + (arrowY - 3) + " L" + x2 + "," + arrowY + " L" + (x2 - 5) + "," + (arrowY + 3));
    arrowG.appendChild(ah);
    const at = document.createElementNS(NS, "text");
    at.setAttribute("x", String(mid)); at.setAttribute("y", String(arrowY - 5));
    at.setAttribute("text-anchor", "middle");
    at.setAttribute("font-size", "6px");
    at.setAttribute("fill", "#64748b");
    at.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
    at.setAttribute("opacity", "1");
    at.textContent = arrowLabels[i];
    arrowG.appendChild(at);
  }

  const footer = document.createElementNS(NS, "text");
  footer.setAttribute("x", "1575"); footer.setAttribute("y", "895");
  footer.setAttribute("text-anchor", "end");
  footer.setAttribute("font-size", "6.5px");
  footer.setAttribute("fill", "#64748b");
  footer.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
  footer.textContent = "Demand Intelligence Framework  |  Signal Chain Architecture  |  April 2026";
  svg.appendChild(footer);
}

const svgStyles = `
  .col-header{font-size:11px;font-weight:700;fill:#334155;text-anchor:middle;letter-spacing:0.08em;text-transform:uppercase;}
  .col-sub{font-size:8px;fill:#64748b;text-anchor:middle;font-weight:400;letter-spacing:0.04em;}
  .theme-label{font-size:7px;fill:#334155;text-anchor:start;font-weight:500;}
  .domain-num{font-size:13px;fill:#fff;text-anchor:middle;font-weight:700;dominant-baseline:central;}
  .domain-label{font-size:8px;fill:#334155;text-anchor:middle;font-weight:600;}
  .domain-question{font-size:6px;fill:#64748b;text-anchor:middle;font-style:italic;font-weight:400;}
  .dim-score{font-size:12px;fill:#fff;text-anchor:middle;font-weight:700;dominant-baseline:central;}
  .dim-label{font-size:7.5px;text-anchor:middle;font-weight:600;}
  .final-score{font-size:26px;fill:#fff;text-anchor:middle;font-weight:800;dominant-baseline:central;}
  .final-label{font-size:11px;fill:#1e293b;text-anchor:middle;font-weight:700;letter-spacing:0.04em;}
  .final-sub{font-size:8.5px;fill:#059669;text-anchor:middle;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;}
  .title-main{font-size:14px;fill:#1e293b;font-weight:700;letter-spacing:0.03em;}
  .title-sub{font-size:9px;fill:#475569;font-weight:400;letter-spacing:0.02em;}
`;

export default function FrameworkMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      buildVisualization(svgRef.current);
    }
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "calc(100vh - 56px)",
        background: "#f8fafc",
        padding: "16px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{svgStyles}</style>
      <svg
        ref={svgRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", width: "100%", maxHeight: "calc(100vh - 88px)" }}
      />
    </div>
  );
}
