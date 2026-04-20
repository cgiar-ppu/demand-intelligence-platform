import { useEffect, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";

function bezier(x1: number, y1: number, x2: number, y2: number): string {
  const dx = (x2 - x1) * 0.42;
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

export default function Framework() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clear any previous content (for strict mode double-render)
    const existingLines = svg.getElementById("fw-lines");
    const existingNodes = svg.getElementById("fw-nodes");
    const existingHeaders = svg.getElementById("fw-headers");
    const existingArrows = svg.getElementById("fw-arrows");
    const existingFooter = svg.getElementById("fw-footer");
    if (existingLines) existingLines.remove();
    if (existingNodes) existingNodes.remove();
    if (existingHeaders) existingHeaders.remove();
    if (existingArrows) existingArrows.remove();
    if (existingFooter) existingFooter.remove();

    // 6 columns: Data Sources, Indicators, Themes, Domains, Dimensions, Final
    const colX = [70, 230, 430, 680, 1000, 1420];
    const headerY = 68;
    const startY = 90;
    const endY = 880;

    // Column headers
    const headers = [
      { label: "4 Data Sources", sub: "Knowledge Platforms" },
      { label: "~75 Indicators", sub: "Evidence Points" },
      { label: "28 Themes", sub: "Diagnostic Cells" },
      { label: "7 Domains", sub: "Data Signals" },
      { label: "5 Dimensions", sub: "Signal Analysis" },
      { label: "Demand Intel.", sub: "Scaling Outcome" },
    ];

    const headerG = document.createElementNS(NS, "g");
    headerG.id = "fw-headers";
    svg.appendChild(headerG);

    headers.forEach((h, i) => {
      const t1 = document.createElementNS(NS, "text");
      t1.setAttribute("x", String(colX[i]));
      t1.setAttribute("y", String(headerY));
      t1.setAttribute("class", "col-header");
      t1.textContent = h.label;
      headerG.appendChild(t1);
      const t2 = document.createElementNS(NS, "text");
      t2.setAttribute("x", String(colX[i]));
      t2.setAttribute("y", String(headerY + 12));
      t2.setAttribute("class", "col-sub");
      t2.textContent = h.sub;
      headerG.appendChild(t2);
    });

    const counts = ["4", "~75", "28", "7", "5", "1"];
    headers.forEach((_h, i) => {
      const badgeY = headerY + 24;
      const rect = document.createElementNS(NS, "rect");
      const w = counts[i].length * 7 + 12;
      rect.setAttribute("x", String(colX[i] - w / 2));
      rect.setAttribute("y", String(badgeY - 7));
      rect.setAttribute("width", String(w));
      rect.setAttribute("height", "13");
      rect.setAttribute("rx", "6");
      rect.setAttribute("ry", "6");
      rect.setAttribute("fill", "#e2e8f0");
      rect.setAttribute("stroke", "#cbd5e1");
      rect.setAttribute("stroke-width", "0.5");
      headerG.appendChild(rect);
      const bt = document.createElementNS(NS, "text");
      bt.setAttribute("x", String(colX[i]));
      bt.setAttribute("y", String(badgeY));
      bt.setAttribute("text-anchor", "middle");
      bt.setAttribute("dominant-baseline", "central");
      bt.setAttribute("font-size", "7px");
      bt.setAttribute("fill", "#475569");
      bt.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
      bt.setAttribute("font-weight", "600");
      bt.textContent = counts[i];
      headerG.appendChild(bt);
    });

    // Domain data
    const domains = [
      {
        id: 1, name: "Scaling Context", color: "#0d9488", glow: "glow-teal",
        q: "Where does demand occur?",
        themes: ["Natural Systems", "Physical Infrastructure", "Farming Systems", "Socio-Economic"],
        indicators: [
          ["Climate Data", "Soil Quality", "Water Availability"],
          ["Roads & Transport", "Energy Access", "Digital Connectivity"],
          ["Crop Productivity", "Input Use", "Shock Exposure"],
          ["Income & Poverty", "Gender & Youth", "Education & Literacy"],
        ],
      },
      {
        id: 2, name: "Sector", color: "#f59e0b", glow: "glow-amber",
        q: "What system/problem?",
        themes: ["Sector Definition", "Performance", "Constraints", "Targets"],
        indicators: [
          ["System Classification", "Sub-sector Segments"],
          ["Productivity Metrics", "Sustainability", "Resilience"],
          ["Technical Barriers", "Market Failures", "Behavioral Barriers"],
          ["Productivity Goals", "Inclusion Targets"],
        ],
      },
      {
        id: 3, name: "Stakeholders", color: "#8b5cf6", glow: "glow-purple",
        q: "Who shapes demand?",
        themes: ["Actor Typology", "Needs & Preferences", "Capacity", "Networks"],
        indicators: [
          ["Innovators & Firms", "Investors", "End-users"],
          ["Expressed Needs", "Willingness to Adopt"],
          ["Technical Capacity", "Financial Capacity", "Organizational"],
          ["Partnerships", "Information Flows", "Intermediaries"],
        ],
      },
      {
        id: 4, name: "Enabling Env.", color: "#6366f1", glow: "glow-indigo",
        q: "Can demand become action?",
        themes: ["Policy & Regulation", "Institutions", "Public Programs", "System Constraints"],
        indicators: [
          ["Sector Policies", "Trade Rules", "Compliance"],
          ["Governance Quality", "Coordination", "Decentralization"],
          ["Budget Allocation", "Extension Services", "Implementation"],
          ["Bureaucracy", "Regulatory Barriers", "Policy Gaps"],
        ],
      },
      {
        id: 5, name: "Resource & Inv.", color: "#0ea5e9", glow: "glow-sky",
        q: "Is demand fundable?",
        themes: ["Financial Actors", "Financial Instruments", "Capital Flows", "Access & Inclusion"],
        indicators: [
          ["Banks & DFIs", "Impact Investors", "Fintechs"],
          ["Credit Products", "Insurance", "Digital Finance"],
          ["Public vs Private", "Investment Pipeline", "Disbursement"],
          ["Credit Access", "Gender Gaps", "Rural Outreach"],
        ],
      },
      {
        id: 6, name: "Market Intel.", color: "#ec4899", glow: "glow-pink",
        q: "Is demand viable?",
        themes: ["Demand Trends", "Value Chains", "Prices", "Consumer Behavior"],
        indicators: [
          ["Market Size", "Growth Rates", "Consumption Patterns"],
          ["Actor Margins", "Cost Structure", "Governance"],
          ["Farmgate Prices", "Price Volatility", "Input Costs"],
          ["Preferences", "Willingness to Pay", "Segmentation"],
        ],
      },
      {
        id: 7, name: "Innovation Port.", color: "#14b8a6", glow: "glow-tealgreen",
        q: "What solutions exist?",
        themes: ["Innovation Inventory", "Readiness & Evidence", "Adoption & Diffusion", "Delivery & Bundling"],
        indicators: [
          ["Technologies", "Services", "Business Models"],
          ["Maturity Level", "Impact Evidence", "Cost-effectiveness"],
          ["Adoption Rates", "Geographic Spread", "Barriers"],
          ["Delivery Channels", "Bundling Potential", "Partnerships"],
        ],
      },
    ];

    const dataSources = [
      { name: "GLOMIP", color: "#2563eb", feedsDomains: [0, 1] },
      { name: "PRISM", color: "#7c3aed", feedsDomains: [2, 3] },
      { name: "FINTEL", color: "#0891b2", feedsDomains: [4, 5] },
      { name: "InnoBase", color: "#059669", feedsDomains: [6] },
    ];

    const dimGlowIds = ["glow-dim-gold", "glow-dim-orange", "glow-dim-green", "glow-dim-rose", "glow-dim-blue"];
    const dimensions = [
      { name: "Geography &\nPriority", score: "8.0", color: "#f59e0b", glowId: dimGlowIds[0], fromDomains: [1] },
      { name: "Demand\nSignals", score: "8.0", color: "#f97316", glowId: dimGlowIds[1], fromDomains: [2, 3] },
      { name: "Innovation\nSupply", score: "6.0", color: "#10b981", glowId: dimGlowIds[2], fromDomains: [7] },
      { name: "Demand\nGaps", score: "3.0", color: "#f43f5e", glowId: dimGlowIds[3], fromDomains: [3, 6], inverse: true },
      { name: "Investment\nFeasibility", score: "6.0", color: "#3b82f6", glowId: dimGlowIds[4], fromDomains: [4, 5, 6] },
    ];

    const domainGap = 7;
    const indSpacing = 10;

    let totalIndHeight = 0;
    domains.forEach((d: any) => {
      let c = 0;
      d.indicators.forEach((arr: string[]) => (c += arr.length));
      d._indCount = c;
      totalIndHeight += c * indSpacing;
    });
    totalIndHeight += (domains.length - 1) * domainGap;

    const contentStartY = startY + 28;
    const indStartY = contentStartY + (endY - contentStartY - totalIndHeight) / 2;

    let curY = indStartY;
    const indicatorPositions: any[] = [];
    const themePositions: any[] = [];
    const domainPositions: any[] = [];
    const domainYRanges: any[] = [];

    domains.forEach((d: any, di) => {
      const domStartY = curY;
      d._themePositions = [];
      d.themes.forEach((theme: string, ti: number) => {
        const indArr = d.indicators[ti];
        const themeStartY = curY;
        indArr.forEach((ind: string) => {
          indicatorPositions.push({ x: colX[1], y: curY, color: d.color, label: ind, domainIdx: di });
          curY += indSpacing;
        });
        const themeCenterY = (themeStartY + curY - indSpacing) / 2;
        d._themePositions.push({ x: colX[2], y: themeCenterY, color: d.color, label: theme, domainIdx: di });
      });
      d._themePositions.forEach((tp: any) => {
        tp.globalIdx = themePositions.length;
        themePositions.push(tp);
      });
      const domCenterY = (domStartY + curY - indSpacing) / 2;
      domainPositions.push({
        x: colX[3], y: domCenterY, color: d.color, glow: d.glow,
        id: d.id, name: d.name, q: d.q, domainIdx: di,
      });
      domainYRanges.push({ startY: domStartY, endY: curY - indSpacing, centerY: domCenterY });
      curY += domainGap;
    });

    // Data source block positions
    const srcBlockWidth = 90;
    const srcBlockPadding = 8;
    const dataSourcePositions: any[] = [];

    dataSources.forEach((src) => {
      let minY = Infinity, maxY = -Infinity;
      src.feedsDomains.forEach((di) => {
        if (domainYRanges[di].startY < minY) minY = domainYRanges[di].startY;
        if (domainYRanges[di].endY > maxY) maxY = domainYRanges[di].endY;
      });
      const blockHeight = Math.max(maxY - minY + srcBlockPadding * 2, 40);
      const blockY = minY - srcBlockPadding;
      const blockCenterY = blockY + blockHeight / 2;
      dataSourcePositions.push({
        x: colX[0] - srcBlockWidth / 2, y: blockY, w: srcBlockWidth, h: blockHeight,
        centerX: colX[0], centerY: blockCenterY, color: src.color, name: src.name,
        feedsDomains: src.feedsDomains,
      });
    });

    const dimSpacing = (endY - contentStartY) / (dimensions.length + 1);
    const dimensionPositions = dimensions.map((dim, i) => ({
      x: colX[4], y: contentStartY + dimSpacing * (i + 1), color: dim.color,
      glowId: dim.glowId, name: dim.name, score: dim.score,
      fromDomains: dim.fromDomains, inverse: (dim as any).inverse || false,
    }));

    const finalPos = { x: colX[5], y: (contentStartY + endY) / 2 };

    // Create layer groups
    const gLines = document.createElementNS(NS, "g");
    gLines.id = "fw-lines";
    const gNodes = document.createElementNS(NS, "g");
    gNodes.id = "fw-nodes";
    svg.appendChild(gLines);
    svg.appendChild(gNodes);

    // --- CONNECTION LINES ---

    // Data Sources -> Indicators
    dataSourcePositions.forEach((src: any) => {
      indicatorPositions.forEach((ind: any) => {
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
    indicatorPositions.forEach((ind: any) => {
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
    themePositions.forEach((theme: any) => {
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

    // --- NODES ---

    // Data Source blocks
    dataSourcePositions.forEach((src: any) => {
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

    // Indicator dots (dot LEFT, label RIGHT)
    indicatorPositions.forEach((ind: any) => {
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
    themePositions.forEach((theme: any) => {
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
    domainPositions.forEach((domain: any) => {
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
      c.setAttribute("filter", `url(#${domain.glow})`);
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
      tq.textContent = `"${domain.q}"`;
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
      c.setAttribute("filter", `url(#${dim.glowId})`);
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
        tl.setAttribute("x", String(dim.x));
        tl.setAttribute("y", String(dim.y + 24 + li * 11));
        tl.setAttribute("class", "dim-label");
        tl.setAttribute("fill", dim.color);
        tl.textContent = line;
        gNodes.appendChild(tl);
      });
      if (dim.inverse) {
        const ti = document.createElementNS(NS, "text");
        ti.setAttribute("x", String(dim.x));
        ti.setAttribute("y", String(dim.y + 24 + lines.length * 11 + 1));
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
    pulseRing.setAttribute("cx", String(finalPos.x));
    pulseRing.setAttribute("cy", String(finalPos.y));
    pulseRing.setAttribute("r", "50");
    pulseRing.setAttribute("fill", "none");
    pulseRing.setAttribute("stroke", "#10b981");
    pulseRing.setAttribute("stroke-width", "1");
    pulseRing.setAttribute("stroke-opacity", "0");
    gNodes.appendChild(pulseRing);
    const anim1 = document.createElementNS(NS, "animate");
    anim1.setAttribute("attributeName", "r");
    anim1.setAttribute("from", "38");
    anim1.setAttribute("to", "60");
    anim1.setAttribute("dur", "3s");
    anim1.setAttribute("repeatCount", "indefinite");
    pulseRing.appendChild(anim1);
    const anim2 = document.createElementNS(NS, "animate");
    anim2.setAttribute("attributeName", "stroke-opacity");
    anim2.setAttribute("from", "0.25");
    anim2.setAttribute("to", "0");
    anim2.setAttribute("dur", "3s");
    anim2.setAttribute("repeatCount", "indefinite");
    pulseRing.appendChild(anim2);

    const pulseRing2 = document.createElementNS(NS, "circle");
    pulseRing2.setAttribute("cx", String(finalPos.x));
    pulseRing2.setAttribute("cy", String(finalPos.y));
    pulseRing2.setAttribute("r", "38");
    pulseRing2.setAttribute("fill", "none");
    pulseRing2.setAttribute("stroke", "#10b981");
    pulseRing2.setAttribute("stroke-width", "0.8");
    pulseRing2.setAttribute("stroke-opacity", "0");
    gNodes.appendChild(pulseRing2);
    const anim3 = document.createElementNS(NS, "animate");
    anim3.setAttribute("attributeName", "r");
    anim3.setAttribute("from", "38");
    anim3.setAttribute("to", "60");
    anim3.setAttribute("dur", "3s");
    anim3.setAttribute("begin", "1.5s");
    anim3.setAttribute("repeatCount", "indefinite");
    pulseRing2.appendChild(anim3);
    const anim4 = document.createElementNS(NS, "animate");
    anim4.setAttribute("attributeName", "stroke-opacity");
    anim4.setAttribute("from", "0.2");
    anim4.setAttribute("to", "0");
    anim4.setAttribute("dur", "3s");
    anim4.setAttribute("begin", "1.5s");
    anim4.setAttribute("repeatCount", "indefinite");
    pulseRing2.appendChild(anim4);

    // Final score circle
    const fGlow1 = document.createElementNS(NS, "circle");
    fGlow1.setAttribute("cx", String(finalPos.x));
    fGlow1.setAttribute("cy", String(finalPos.y));
    fGlow1.setAttribute("r", "45");
    fGlow1.setAttribute("fill", "#10b981");
    fGlow1.setAttribute("fill-opacity", "0.06");
    gNodes.appendChild(fGlow1);

    const fGlow2 = document.createElementNS(NS, "circle");
    fGlow2.setAttribute("cx", String(finalPos.x));
    fGlow2.setAttribute("cy", String(finalPos.y));
    fGlow2.setAttribute("r", "38");
    fGlow2.setAttribute("fill", "#10b981");
    fGlow2.setAttribute("fill-opacity", "0.08");
    fGlow2.setAttribute("filter", "url(#glow-final)");
    gNodes.appendChild(fGlow2);

    const fCircle = document.createElementNS(NS, "circle");
    fCircle.setAttribute("cx", String(finalPos.x));
    fCircle.setAttribute("cy", String(finalPos.y));
    fCircle.setAttribute("r", "34");
    fCircle.setAttribute("fill", "#10b981");
    fCircle.setAttribute("stroke", "#059669");
    fCircle.setAttribute("stroke-width", "2.5");
    fCircle.setAttribute("filter", "url(#glow-final)");
    gNodes.appendChild(fCircle);

    const fInner = document.createElementNS(NS, "circle");
    fInner.setAttribute("cx", String(finalPos.x));
    fInner.setAttribute("cy", String(finalPos.y));
    fInner.setAttribute("r", "30");
    fInner.setAttribute("fill", "#fff");
    fInner.setAttribute("fill-opacity", "0.08");
    gNodes.appendChild(fInner);

    const fScore = document.createElementNS(NS, "text");
    fScore.setAttribute("x", String(finalPos.x));
    fScore.setAttribute("y", String(finalPos.y + 2));
    fScore.setAttribute("class", "final-score");
    fScore.textContent = "8.2";
    gNodes.appendChild(fScore);

    const fLabel = document.createElementNS(NS, "text");
    fLabel.setAttribute("x", String(finalPos.x));
    fLabel.setAttribute("y", String(finalPos.y + 50));
    fLabel.setAttribute("class", "final-label");
    fLabel.textContent = "Demand Intelligence";
    gNodes.appendChild(fLabel);

    const fSub = document.createElementNS(NS, "text");
    fSub.setAttribute("x", String(finalPos.x));
    fSub.setAttribute("y", String(finalPos.y + 63));
    fSub.setAttribute("class", "final-sub");
    fSub.textContent = "Scaling Opportunity";
    gNodes.appendChild(fSub);

    const fUnit = document.createElementNS(NS, "text");
    fUnit.setAttribute("x", String(finalPos.x));
    fUnit.setAttribute("y", String(finalPos.y + 75));
    fUnit.setAttribute("text-anchor", "middle");
    fUnit.setAttribute("font-size", "7px");
    fUnit.setAttribute("fill", "#64748b");
    fUnit.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
    fUnit.textContent = "Composite Score (0\u201310)";
    gNodes.appendChild(fUnit);

    // Flow direction arrows
    const arrowY = endY + 10;
    const arrowG = document.createElementNS(NS, "g");
    arrowG.id = "fw-arrows";
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
      p.setAttribute("d", `M${x1},${arrowY} L${x2},${arrowY}`);
      arrowG.appendChild(p);
      const ah = document.createElementNS(NS, "path");
      ah.setAttribute("d", `M${x2 - 5},${arrowY - 3} L${x2},${arrowY} L${x2 - 5},${arrowY + 3}`);
      arrowG.appendChild(ah);
      const at = document.createElementNS(NS, "text");
      at.setAttribute("x", String(mid));
      at.setAttribute("y", String(arrowY - 5));
      at.setAttribute("text-anchor", "middle");
      at.setAttribute("font-size", "6px");
      at.setAttribute("fill", "#64748b");
      at.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
      at.setAttribute("opacity", "1");
      at.textContent = arrowLabels[i];
      arrowG.appendChild(at);
    }

    // Footer
    const footer = document.createElementNS(NS, "text");
    footer.id = "fw-footer";
    footer.setAttribute("x", "1575");
    footer.setAttribute("y", "895");
    footer.setAttribute("text-anchor", "end");
    footer.setAttribute("font-size", "6.5px");
    footer.setAttribute("fill", "#64748b");
    footer.setAttribute("font-family", "Segoe UI, system-ui, sans-serif");
    footer.textContent = "Demand Intelligence Framework  |  Signal Chain Architecture  |  April 2026";
    svg.appendChild(footer);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-56px)] bg-[#f8fafc] overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="bgGrad" cx="80%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="bgGrad2" cx="10%" cy="50%" r="40%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.1} />
            <stop offset="100%" stopColor="#f8fafc" stopOpacity={0} />
          </radialGradient>
          {/* Glow filters */}
          {[
            { id: "glow-teal", color: "#0d9488" },
            { id: "glow-amber", color: "#f59e0b" },
            { id: "glow-purple", color: "#8b5cf6" },
            { id: "glow-indigo", color: "#6366f1" },
            { id: "glow-sky", color: "#0ea5e9" },
            { id: "glow-pink", color: "#ec4899" },
            { id: "glow-tealgreen", color: "#14b8a6" },
          ].map((f) => (
            <filter key={f.id} id={f.id} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={3} result="blur" />
              <feFlood floodColor={f.color} floodOpacity={0.25} result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="glow-final" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={8} result="blur" />
            <feFlood floodColor="#10b981" floodOpacity={0.3} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {[
            { id: "glow-dim-gold", color: "#f59e0b" },
            { id: "glow-dim-orange", color: "#f97316" },
            { id: "glow-dim-green", color: "#10b981" },
            { id: "glow-dim-rose", color: "#f43f5e" },
            { id: "glow-dim-blue", color: "#3b82f6" },
          ].map((f) => (
            <filter key={f.id} id={f.id} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={3} result="blur" />
              <feFlood floodColor={f.color} floodOpacity={0.2} result="color" />
              <feComposite in="color" in2="blur" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={1.5} />
            <feOffset dx={0} dy={1} result="shadow" />
            <feFlood floodColor="#000" floodOpacity={0.1} />
            <feComposite in2="shadow" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="srcShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation={2.5} />
            <feOffset dx={0} dy={2} result="shadow" />
            <feFlood floodColor="#000" floodOpacity={0.15} />
            <feComposite in2="shadow" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background layers */}
        <rect width={1600} height={900} fill="#f8fafc" />
        <rect width={1600} height={900} fill="url(#bgGrad)" />
        <rect width={1600} height={900} fill="url(#bgGrad2)" />

        {/* Column dividers */}
        <g opacity={0.15} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="4,6">
          <line x1={150} y1={65} x2={150} y2={880} />
          <line x1={330} y1={65} x2={330} y2={880} />
          <line x1={555} y1={65} x2={555} y2={880} />
          <line x1={840} y1={65} x2={840} y2={880} />
          <line x1={1210} y1={65} x2={1210} y2={880} />
        </g>

        {/* Title */}
        <text x={35} y={28} className="title-main">
          Demand Intelligence Framework
        </text>
        <text x={35} y={42} className="title-sub">
          Signal Chain Architecture — 7→5→1 Framework
        </text>
      </svg>

      {/* Inline styles for SVG text classes */}
      <style>{`
        .col-header { font-size: 11px; font-weight: 700; fill: #334155; text-anchor: middle; letter-spacing: 0.08em; text-transform: uppercase; }
        .col-sub { font-size: 8px; fill: #64748b; text-anchor: middle; font-weight: 400; letter-spacing: 0.04em; }
        .theme-label { font-size: 7px; fill: #334155; text-anchor: start; font-weight: 500; }
        .domain-num { font-size: 13px; fill: #fff; text-anchor: middle; font-weight: 700; dominant-baseline: central; }
        .domain-label { font-size: 8px; fill: #334155; text-anchor: middle; font-weight: 600; }
        .domain-question { font-size: 6px; fill: #64748b; text-anchor: middle; font-style: italic; font-weight: 400; }
        .dim-score { font-size: 12px; fill: #fff; text-anchor: middle; font-weight: 700; dominant-baseline: central; }
        .dim-label { font-size: 7.5px; text-anchor: middle; font-weight: 600; }
        .final-score { font-size: 26px; fill: #fff; text-anchor: middle; font-weight: 800; dominant-baseline: central; }
        .final-label { font-size: 11px; fill: #1e293b; text-anchor: middle; font-weight: 700; letter-spacing: 0.04em; }
        .final-sub { font-size: 8.5px; fill: #059669; text-anchor: middle; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; }
        .title-main { font-size: 14px; fill: #1e293b; font-weight: 700; letter-spacing: 0.03em; }
        .title-sub { font-size: 9px; fill: #475569; font-weight: 400; letter-spacing: 0.02em; }
      `}</style>
    </div>
  );
}
