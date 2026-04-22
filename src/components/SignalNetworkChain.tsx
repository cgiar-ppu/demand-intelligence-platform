import { useMemo, useState } from "react";
import type { Innovation } from "@/lib/data";
import { NETWORK_DOMAINS, generateNetworkScores, getArcColor } from "@/lib/networkData";

// ─── Layout Constants ──────────────────────────────────────────────────────────

const VB_W = 1300;
const VB_H = 900;

const X_IND = 80;
const X_THEME = 340;
const X_DOMAIN = 600;
const X_DIM = 870;
const X_CENTER = 1150;

const R_IND = 4;
const R_THEME = 10;
const R_DOMAIN = 24;
const R_DIM = 28;
const R_CENTER = 45;

const V_PAD = 55;
const USABLE_H = VB_H - V_PAD * 2;

// ─── Demand Signaling Dimensions ──────────────────────────────────────────────

interface Dimension {
  id: string;
  label: string;
  sub: string;
  color: string;
  scoreKey: keyof Innovation;
  fedByDomains: string[];
  interactionKeys: (keyof Innovation)[];
}

const DIMENSIONS: Dimension[] = [
  {
    id: "geo",
    label: "Geography & Priority",
    sub: "Where and for whom?",
    color: "#0d9488",
    scoreKey: "geography_priority_score",
    fedByDomains: ["d1"],
    interactionKeys: ["context_geography"],
  },
  {
    id: "dem",
    label: "Demand Signals",
    sub: "What is needed?",
    color: "#f59e0b",
    scoreKey: "demand_signals_score",
    fedByDomains: ["d2", "d3"],
    interactionKeys: ["sector_demand", "stakeholder_demand"],
  },
  {
    id: "sup",
    label: "Innovation Supply",
    sub: "What solutions exist?",
    color: "#8b5cf6",
    scoreKey: "innovation_supply_score",
    fedByDomains: ["d7"],
    interactionKeys: ["portfolio_supply"],
  },
  {
    id: "gap",
    label: "Demand Gaps",
    sub: "What prevents scaling?",
    color: "#f43f5e",
    scoreKey: "demand_gaps_score",
    fedByDomains: ["d3", "d6"],
    interactionKeys: ["stakeholder_gaps", "market_gaps"],
  },
  {
    id: "feas",
    label: "Investment Feasibility",
    sub: "Is it viable?",
    color: "#0ea5e9",
    scoreKey: "investment_feasibility_score",
    fedByDomains: ["d4", "d5", "d6"],
    interactionKeys: ["enabling_feasibility", "resource_feasibility", "market_feasibility"],
  },
];

// Domain index → which dimensions it feeds (dimension index)
// d1(0)→geo(0), d2(1)→dem(1), d3(2)→dem(1)+gap(3), d4(3)→feas(4), d5(4)→feas(4), d6(5)→feas(4)+gap(3), d7(6)→sup(2)
const DOMAIN_TO_DIMS: Record<string, number[]> = {
  d1: [0],
  d2: [1],
  d3: [1, 3],
  d4: [4],
  d5: [4],
  d6: [4, 3],
  d7: [2],
};

// ─── Geometry Helpers ─────────────────────────────────────────────────────────

function distributeY(count: number, totalH: number, topOffset: number): number[] {
  if (count === 0) return [];
  const spacing = totalH / count;
  return Array.from({ length: count }, (_, i) => topOffset + spacing * (i + 0.5));
}

function computeChainLayout() {
  const dimYs = distributeY(5, USABLE_H, V_PAD);

  const domainYs = distributeY(7, USABLE_H, V_PAD);

  const totalThemes = NETWORK_DOMAINS.reduce((a, d) => a + d.themes.length, 0);
  const totalIndicators = NETWORK_DOMAINS.reduce(
    (a, d) => a + d.themes.reduce((b, t) => b + t.indicators.length, 0),
    0
  );

  const themeYsByDomain: number[][] = [];
  const indicatorYsByTheme: number[][] = [];

  let themeOffset = V_PAD;
  let indicatorOffset = V_PAD;

  for (const domain of NETWORK_DOMAINS) {
    const themeCount = domain.themes.length;
    const themeFrac = themeCount / totalThemes;
    const themeBlockH = USABLE_H * themeFrac;
    const themeYs = distributeY(themeCount, themeBlockH, themeOffset);
    themeYsByDomain.push(themeYs);

    const themeIndicatorYs: number[][] = [];
    for (const theme of domain.themes) {
      const iCount = theme.indicators.length;
      const iFrac = iCount / totalIndicators;
      const iBlockH = USABLE_H * iFrac;
      const iYs = distributeY(iCount, iBlockH, indicatorOffset);
      themeIndicatorYs.push(iYs);
      indicatorOffset += iBlockH;
    }
    indicatorYsByTheme.push(themeIndicatorYs);
    themeOffset += themeBlockH;
  }

  return { dimYs, domainYs, themeYsByDomain, indicatorYsByTheme };
}

const CHAIN_LAYOUT = computeChainLayout();

// ─── SVG Arc Helper ───────────────────────────────────────────────────────────

function describeArc(cx: number, cy: number, r: number, score: number): string {
  const pct = Math.min(score / 10, 0.9999);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + pct * 2 * Math.PI;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = pct > 0.5 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

// ─── Score Helpers ─────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 7) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#f43f5e";
}

// ─── Column Headers ────────────────────────────────────────────────────────────

function ChainColumnHeaders() {
  const headers = [
    { x: X_IND, label: "~75 Indicators", sub: "Evidence Points" },
    { x: X_THEME, label: "28 Themes", sub: "Diagnostic Cats." },
    { x: X_DOMAIN, label: "7 Domains", sub: "Data Signals" },
    { x: X_DIM, label: "5 Dimensions", sub: "Signal Analysis" },
    { x: X_CENTER, label: "Demand Intel.", sub: "Scaling Outcome" },
  ];

  return (
    <g>
      {headers.map((h, i) => (
        <g key={i}>
          <text x={h.x} y={22} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" fontFamily="Inter, sans-serif">
            {h.label}
          </text>
          <text x={h.x} y={35} textAnchor="middle" fontSize="8.5" fontWeight="500" fill="#64748b" fontFamily="Inter, sans-serif">
            {h.sub}
          </text>
        </g>
      ))}
      {[
        (X_IND + X_THEME) / 2,
        (X_THEME + X_DOMAIN) / 2,
        (X_DOMAIN + X_DIM) / 2,
        (X_DIM + X_CENTER) / 2,
      ].map((ax, i) => (
        <text key={i} x={ax} y={22} textAnchor="middle" fontSize="14" fill="#94a3b8" fontFamily="Inter, sans-serif">
          →
        </text>
      ))}
    </g>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function ChainEmptyOverlay() {
  const cx = VB_W / 2;
  const cy = VB_H / 2;
  return (
    <g pointerEvents="none">
      <rect x={cx - 260} y={cy - 36} width={520} height={72} rx={14} fill="rgba(241,245,249,0.92)" stroke="#e2e8f0" strokeWidth={1} />
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="700" fill="#0d9488" fontFamily="Inter, sans-serif">
        Select an innovation to activate the full chain
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="500" fill="#64748b" fontFamily="Inter, sans-serif">
        Indicators → Themes → Domains → Dimensions → Demand Intelligence
      </text>
    </g>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipState {
  x: number;
  y: number;
  label: string;
  score: number | null;
}

// ─── Chain Connections ─────────────────────────────────────────────────────────

interface ChainConnectionsProps {
  innovation: Innovation | null;
  hoveredDomainId: string | null;
}

function ChainConnections({ innovation, hoveredDomainId }: ChainConnectionsProps) {
  const scores = useMemo(() => {
    if (!innovation) return null;
    return generateNetworkScores(innovation);
  }, [innovation]);

  const dimScores = useMemo(() => {
    if (!innovation) return null;
    return DIMENSIONS.map((d) => {
      const raw = innovation[d.scoreKey] as number;
      // demand_gaps: active when LOW (inverse logic)
      const isActive = d.id === "gap" ? raw < 5 : raw >= 5;
      return { raw, isActive };
    });
  }, [innovation]);

  return (
    <g>
      {/* Layer 1→2: Indicator to Theme */}
      {NETWORK_DOMAINS.map((domain, di) => {
        const isOther = hoveredDomainId !== null && hoveredDomainId !== domain.id;
        const isHov = hoveredDomainId === domain.id;

        return domain.themes.map((theme, ti) => {
          const themeY = CHAIN_LAYOUT.themeYsByDomain[di][ti];
          const themeScore = scores?.themes[theme.id] ?? null;
          const themeActive = themeScore !== null && themeScore >= 5;

          return theme.indicators.map((ind, ii) => {
            const indY = CHAIN_LAYOUT.indicatorYsByTheme[di][ti][ii];
            const indScore = scores?.indicators[ind.id] ?? null;
            const indActive = indScore !== null && indScore >= 5;
            const bothActive = themeActive && indActive;

            const opacity = isOther
              ? 0.02
              : isHov
              ? bothActive ? 0.55 : 0.1
              : scores
              ? bothActive ? 0.3 : 0.05
              : 0.08;

            return (
              <line
                key={ind.id}
                x1={X_IND + R_IND}
                y1={indY}
                x2={X_THEME - R_THEME}
                y2={themeY}
                stroke={bothActive ? domain.color : "#cbd5e1"}
                strokeWidth={bothActive ? 0.8 : 0.4}
                strokeOpacity={opacity}
                style={{ transition: "stroke-opacity 0.5s ease" }}
              />
            );
          });
        });
      })}

      {/* Layer 2→3: Theme to Domain */}
      {NETWORK_DOMAINS.map((domain, di) => {
        const domainY = CHAIN_LAYOUT.domainYs[di];
        const domainScore = scores?.domains[domain.id] ?? null;
        const domActive = domainScore !== null && domainScore >= 5;
        const isOther = hoveredDomainId !== null && hoveredDomainId !== domain.id;
        const isHov = hoveredDomainId === domain.id;

        return domain.themes.map((theme, ti) => {
          const themeY = CHAIN_LAYOUT.themeYsByDomain[di][ti];
          const themeScore = scores?.themes[theme.id] ?? null;
          const themeActive = themeScore !== null && themeScore >= 5;
          const bothActive = domActive && themeActive;

          const opacity = isOther
            ? 0.03
            : isHov
            ? bothActive ? 0.7 : 0.15
            : scores
            ? bothActive ? 0.4 : 0.06
            : 0.1;

          return (
            <line
              key={theme.id}
              x1={X_THEME + R_THEME}
              y1={themeY}
              x2={X_DOMAIN - R_DOMAIN}
              y2={domainY}
              stroke={bothActive ? domain.color : "#cbd5e1"}
              strokeWidth={bothActive ? 1.2 : 0.5}
              strokeOpacity={opacity}
              style={{ transition: "stroke-opacity 0.5s ease" }}
            />
          );
        });
      })}

      {/* Layer 3→4: Domain to Dimension (with weight visualization) */}
      {NETWORK_DOMAINS.map((domain, di) => {
        const domainY = CHAIN_LAYOUT.domainYs[di];
        const domainScore = scores?.domains[domain.id] ?? null;
        const domActive = domainScore !== null && domainScore >= 5;
        const isOther = hoveredDomainId !== null && hoveredDomainId !== domain.id;
        const isHov = hoveredDomainId === domain.id;

        const dimIndices = DOMAIN_TO_DIMS[domain.id] ?? [];

        return dimIndices.map((dimIdx) => {
          const dim = DIMENSIONS[dimIdx];
          const dimY = CHAIN_LAYOUT.dimYs[dimIdx];
          const dimScore = dimScores?.[dimIdx];
          const dimActive = dimScore?.isActive ?? false;

          // Get the relevant interaction score for this specific domain→dim link
          const linkInteractionKey = dim.interactionKeys[dim.fedByDomains.indexOf(domain.id)];
          const interactionScore = innovation && linkInteractionKey ? (innovation[linkInteractionKey] as number) : null;

          const bothActive = domActive && dimActive;
          const strokeW = interactionScore !== null ? 0.5 + (interactionScore / 10) * 3.5 : 1;

          const opacity = isOther
            ? 0.04
            : isHov
            ? bothActive ? 0.85 : 0.2
            : scores
            ? bothActive ? 0.6 : 0.1
            : 0.12;

          const midX = (X_DOMAIN + X_DIM) / 2;
          const pathD = `M ${X_DOMAIN + R_DOMAIN} ${domainY} C ${midX} ${domainY}, ${midX} ${dimY}, ${X_DIM - R_DIM} ${dimY}`;

          return (
            <g key={`${domain.id}-${dim.id}`}>
              <path
                d={pathD}
                fill="none"
                stroke={bothActive ? dim.color : "#cbd5e1"}
                strokeWidth={strokeW}
                strokeOpacity={opacity}
                style={{ transition: "stroke-opacity 0.5s ease, stroke-width 0.5s ease" }}
              />
              {/* Interaction score label on mid of path */}
              {interactionScore !== null && bothActive && !isOther && (
                <text
                  x={midX}
                  y={(domainY + dimY) / 2 - 4}
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="700"
                  fill={dim.color}
                  fontFamily="Outfit, sans-serif"
                  opacity={isHov ? 0.95 : 0.6}
                  style={{ pointerEvents: "none", transition: "opacity 0.3s ease" }}
                >
                  {interactionScore.toFixed(1)}
                </text>
              )}
            </g>
          );
        });
      })}

      {/* Layer 4→5: Dimensions to Center */}
      {DIMENSIONS.map((dim, di) => {
        const dimY = CHAIN_LAYOUT.dimYs[di];
        const dimScore = dimScores?.[di];
        const dimActive = dimScore?.isActive ?? false;
        const raw = dimScore?.raw ?? 0;
        const strokeW = dimActive ? 0.5 + (raw / 10) * 4 : 0.5;

        const opacity = scores ? (dimActive ? 0.7 : 0.08) : 0.12;

        const midX = (X_DIM + X_CENTER) / 2;
        const centerY = VB_H / 2;
        const pathD = `M ${X_DIM + R_DIM} ${dimY} C ${midX} ${dimY}, ${midX} ${centerY}, ${X_CENTER - R_CENTER} ${centerY}`;

        return (
          <g key={dim.id}>
            <path
              d={pathD}
              fill="none"
              stroke={dimActive ? dim.color : "#cbd5e1"}
              strokeWidth={strokeW}
              strokeOpacity={opacity}
              style={{ transition: "stroke-opacity 0.5s ease, stroke-width 0.5s ease" }}
            />
            {raw > 0 && dimActive && (
              <text
                x={midX + 10}
                y={(dimY + centerY) / 2 - 3}
                textAnchor="middle"
                fontSize="7"
                fontWeight="700"
                fill={dim.color}
                fontFamily="Outfit, sans-serif"
                opacity={0.7}
                style={{ pointerEvents: "none" }}
              >
                {raw.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

// ─── Indicator Nodes ───────────────────────────────────────────────────────────

interface IndicatorNodeProps {
  cx: number;
  cy: number;
  score: number | null;
  domainColor: string;
  noSelection: boolean;
  isHovered: boolean;
  isOther: boolean;
  label: string;
  onTooltip: (t: TooltipState | null) => void;
}

function IndicatorNode({ cx, cy, score, domainColor, noSelection, isHovered, isOther, label, onTooltip }: IndicatorNodeProps) {
  const active = score !== null && score >= 5;
  const opacity = noSelection ? 0.25 : isOther ? 0.1 : active ? 1 : 0.22;

  return (
    <g
      style={{ transition: "opacity 0.5s ease", opacity, cursor: "default" }}
      onMouseEnter={(e) => {
        const svgRect = (e.currentTarget.closest("svg") as SVGSVGElement).getBoundingClientRect();
        onTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top, label, score });
      }}
      onMouseLeave={() => onTooltip(null)}
    >
      {active && !noSelection && (
        <circle cx={cx} cy={cy} r={R_IND + 3} fill={domainColor} opacity={0.12} style={{ filter: "blur(2px)" }} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={R_IND}
        fill={active && !noSelection ? domainColor : "#e2e8f0"}
        stroke={noSelection ? domainColor + "33" : active ? domainColor : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 0.8 : 0.4}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
      />
    </g>
  );
}

// ─── Theme Node ────────────────────────────────────────────────────────────────

interface ThemeNodeProps {
  cx: number;
  cy: number;
  score: number | null;
  domainColor: string;
  noSelection: boolean;
  isHovered: boolean;
  isOther: boolean;
  label: string;
}

function ThemeNode({ cx, cy, score, domainColor, noSelection, isHovered, isOther, label }: ThemeNodeProps) {
  const active = score !== null && score >= 5;
  const opacity = noSelection ? 0.28 : isOther ? 0.12 : active ? 1 : 0.25;

  return (
    <g style={{ transition: "opacity 0.5s ease", opacity }}>
      {active && !noSelection && (
        <circle cx={cx} cy={cy} r={R_THEME + 5} fill={domainColor} opacity={0.1} style={{ filter: "blur(3px)" }} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={R_THEME}
        fill={active && !noSelection ? domainColor : "#f1f5f9"}
        stroke={noSelection ? domainColor + "44" : active ? domainColor : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 1.2 : 0.7}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
      />
      {score !== null && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="6" fontWeight="700" fill={active ? "white" : "#475569"} fontFamily="Outfit, sans-serif" style={{ pointerEvents: "none" }}>
          {score.toFixed(1)}
        </text>
      )}
    </g>
  );
}

// ─── Domain Node ───────────────────────────────────────────────────────────────

interface DomainNodeProps {
  cx: number;
  cy: number;
  score: number | null;
  domain: typeof NETWORK_DOMAINS[0];
  noSelection: boolean;
  isHovered: boolean;
  isOther: boolean;
  onHover: (id: string | null) => void;
}

function DomainNode({ cx, cy, score, domain, noSelection, isHovered, isOther, onHover }: DomainNodeProps) {
  const active = score !== null && score >= 5;
  const opacity = noSelection ? 0.4 : isOther ? 0.22 : active ? 1 : 0.35;
  const arcColor = score !== null ? getArcColor(score) : domain.color;
  const arcR = R_DOMAIN + 6;

  return (
    <g
      style={{ transition: "opacity 0.5s ease", opacity, cursor: "pointer" }}
      onMouseEnter={() => onHover(domain.id)}
      onMouseLeave={() => onHover(null)}
    >
      {active && !noSelection && (
        <circle cx={cx} cy={cy} r={R_DOMAIN + 10} fill={domain.color} opacity={0.1} style={{ filter: "blur(5px)" }} />
      )}
      {score !== null && (
        <>
          <circle cx={cx} cy={cy} r={arcR} fill="none" stroke="#e2e8f0" strokeWidth={2.5} />
          <path d={describeArc(cx, cy, arcR, score)} fill="none" stroke={arcColor} strokeWidth={2.5} strokeLinecap="round" style={{ transition: "stroke 0.5s ease" }} />
        </>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={R_DOMAIN}
        fill={active && !noSelection ? domain.color : "#f1f5f9"}
        stroke={noSelection ? domain.color + "55" : active ? domain.color : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 1.5 : 0.8}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
      />
      <text x={cx} y={cy - (score !== null ? 7 : 0)} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="800" fill={active && !noSelection ? "white" : domain.color} fontFamily="Outfit, sans-serif" style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}>
        {domain.num}
      </text>
      {score !== null && (
        <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central" fontSize="8.5" fontWeight="700" fill={active ? "white" : "#475569"} fontFamily="Outfit, sans-serif" style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}>
          {score.toFixed(1)}
        </text>
      )}
    </g>
  );
}

// ─── Dimension Node ────────────────────────────────────────────────────────────

interface DimensionNodeProps {
  cx: number;
  cy: number;
  dim: Dimension;
  score: number | null;
  isActive: boolean;
  noSelection: boolean;
}

function DimensionNode({ cx, cy, dim, score, isActive, noSelection }: DimensionNodeProps) {
  const opacity = noSelection ? 0.35 : isActive ? 1 : 0.28;

  return (
    <g style={{ transition: "opacity 0.5s ease", opacity }}>
      {isActive && !noSelection && (
        <circle cx={cx} cy={cy} r={R_DIM + 12} fill={dim.color} opacity={0.1} style={{ filter: "blur(7px)" }} />
      )}
      {score !== null && (
        <>
          <circle cx={cx} cy={cy} r={R_DIM + 7} fill="none" stroke="#e2e8f0" strokeWidth={2} />
          <path d={describeArc(cx, cy, R_DIM + 7, score)} fill="none" stroke={isActive ? dim.color : "#cbd5e1"} strokeWidth={2} strokeLinecap="round" style={{ transition: "stroke 0.5s ease" }} />
        </>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={R_DIM}
        fill={isActive && !noSelection ? dim.color + "15" : "#f1f5f9"}
        stroke={noSelection ? dim.color + "33" : isActive ? dim.color : "#cbd5e1"}
        strokeWidth={isActive && !noSelection ? 2 : 0.8}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
      />
      {/* Score */}
      {score !== null && (
        <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="800" fill={isActive ? dim.color : "#64748b"} fontFamily="Outfit, sans-serif" style={{ pointerEvents: "none" }}>
          {score.toFixed(1)}
        </text>
      )}
      {/* Label above */}
      <text x={cx + R_DIM + 8} y={cy - 6} textAnchor="start" fontSize="9" fontWeight="700" fill={noSelection ? "#64748b" : isActive ? dim.color : "#64748b"} fontFamily="Inter, sans-serif" style={{ pointerEvents: "none", transition: "fill 0.5s ease" }}>
        {dim.label}
      </text>
      <text x={cx + R_DIM + 8} y={cy + 7} textAnchor="start" fontSize="7.5" fontWeight="400" fill={noSelection ? "#94a3b8" : isActive ? dim.color + "88" : "#94a3b8"} fontFamily="Inter, sans-serif" style={{ pointerEvents: "none", transition: "fill 0.5s ease" }}>
        {dim.sub}
      </text>
    </g>
  );
}

// ─── Center Node ───────────────────────────────────────────────────────────────

interface CenterNodeProps {
  cx: number;
  cy: number;
  score: number | null;
  noSelection: boolean;
}

function CenterNode({ cx, cy, score, noSelection }: CenterNodeProps) {
  const active = score !== null && score >= 7;
  const opacity = noSelection ? 0.35 : 1;

  return (
    <g style={{ transition: "opacity 0.5s ease", opacity }}>
      {/* Outer glow */}
      {active && !noSelection && (
        <>
          <circle cx={cx} cy={cy} r={R_CENTER + 28} fill="#0f766e" opacity={0.06} style={{ filter: "blur(10px)" }} />
          <circle cx={cx} cy={cy} r={R_CENTER + 16} fill="#0f766e" opacity={0.08} style={{ filter: "blur(5px)" }} />
        </>
      )}
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R_CENTER + 8} fill="none" stroke={active ? "#0d9488" : "#e2e8f0"} strokeWidth={1.5} strokeDasharray={active ? "none" : "4 3"} style={{ transition: "stroke 0.5s ease" }} />
      {/* Arc ring */}
      {score !== null && (
        <path d={describeArc(cx, cy, R_CENTER + 8, score)} fill="none" stroke={active ? "#0d9488" : "#cbd5e1"} strokeWidth={2.5} strokeLinecap="round" style={{ transition: "stroke 0.5s ease" }} />
      )}
      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={R_CENTER}
        fill={active && !noSelection ? "rgba(13,148,136,0.12)" : "#f0fdf4"}
        stroke={noSelection ? "#0d9488" + "44" : active ? "#0d9488" : "#cbd5e1"}
        strokeWidth={active ? 2.5 : 1}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
      />
      {/* Score */}
      {score !== null ? (
        <>
          <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" fontSize="18" fontWeight="900" fill={active ? "#0d9488" : "#64748b"} fontFamily="Outfit, sans-serif" style={{ pointerEvents: "none" }}>
            {score.toFixed(1)}
          </text>
          <text x={cx} y={cy + 9} textAnchor="middle" dominantBaseline="central" fontSize="7" fontWeight="700" fill={active ? "#0d9488" : "#94a3b8"} fontFamily="Inter, sans-serif" style={{ pointerEvents: "none" }}>
            DEMAND INTEL.
          </text>
          <text x={cx} y={cy + 21} textAnchor="middle" dominantBaseline="central" fontSize="6.5" fill={active ? "#0d9488" : "#94a3b8"} fontFamily="Inter, sans-serif" style={{ pointerEvents: "none" }}>
            {active ? "Effective Demand" : "Insufficient Signal"}
          </text>
        </>
      ) : (
        <>
          <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily="Inter, sans-serif" style={{ pointerEvents: "none" }}>
            DEMAND
          </text>
          <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="700" fill="#94a3b8" fontFamily="Inter, sans-serif" style={{ pointerEvents: "none" }}>
            INTEL.
          </text>
        </>
      )}
    </g>
  );
}

// ─── SVG Defs ─────────────────────────────────────────────────────────────────

function ChainDefs() {
  return (
    <defs>
      <style>{`
        @keyframes chainPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0; }
        }
      `}</style>
      {/* No dark background gradient — transparent for light theme */}
      {NETWORK_DOMAINS.map((d) => (
        <filter key={d.id} id={`chain-glow-${d.id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}
    </defs>
  );
}

// ─── Column Dividers ──────────────────────────────────────────────────────────

function ChainColumnDividers() {
  const xs = [
    (X_IND + X_THEME) / 2,
    (X_THEME + X_DOMAIN) / 2,
    (X_DOMAIN + X_DIM) / 2,
    (X_DIM + X_CENTER) / 2,
  ];
  return (
    <g>
      {xs.map((x) => (
        <line key={x} x1={x} y1={48} x2={x} y2={VB_H - 12} stroke="#e2e8f0" strokeWidth={0.5} strokeOpacity={0.8} />
      ))}
    </g>
  );
}

// ─── SVG Tooltip ──────────────────────────────────────────────────────────────

function SvgTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;
  const w = 120;
  const h = 36;
  const px = Math.min(tooltip.x + 8, VB_W - w - 8);
  const py = Math.max(tooltip.y - h - 6, 4);
  return (
    <g pointerEvents="none">
      <rect x={px} y={py} width={w} height={h} rx={6} fill="#ffffff" stroke="#e2e8f0" strokeWidth={1} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.1))" }} />
      <text x={px + 8} y={py + 13} fontSize="9" fontWeight="600" fill="#1e293b" fontFamily="Inter, sans-serif">
        {tooltip.label.length > 18 ? tooltip.label.slice(0, 17) + "…" : tooltip.label}
      </text>
      {tooltip.score !== null && (
        <text x={px + 8} y={py + 26} fontSize="8" fill={scoreColor(tooltip.score)} fontFamily="Outfit, sans-serif" fontWeight="700">
          Score: {tooltip.score.toFixed(1)}
        </text>
      )}
    </g>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export interface SignalNetworkChainProps {
  innovation: Innovation | null;
  hoveredDomainId: string | null;
  onHoverDomain: (id: string | null) => void;
}

export function SignalNetworkChain({ innovation, hoveredDomainId, onHoverDomain }: SignalNetworkChainProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const scores = useMemo(() => {
    if (!innovation) return null;
    return generateNetworkScores(innovation);
  }, [innovation]);

  const dimScores = useMemo(() => {
    if (!innovation) return null;
    return DIMENSIONS.map((d) => {
      const raw = innovation[d.scoreKey] as number;
      const isActive = d.id === "gap" ? raw < 5 : raw >= 5;
      return { raw, isActive };
    });
  }, [innovation]);

  const centerScore = innovation ? innovation.scaling_opportunity_score : null;
  const noSelection = innovation === null;
  const animKey = innovation?.innovation_name ?? "empty";
  const centerY = VB_H / 2;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "transparent",
        borderRadius: 12,
        overflow: "auto",
      }}
    >
      <svg
        key={animKey}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        style={{ display: "block", minWidth: 900, width: "100%", height: "100%" }}
        aria-label="Full Chain Signal Network — 5 layers from Indicators to Demand Intelligence"
        preserveAspectRatio="xMidYMid meet"
      >
        <ChainDefs />
        <rect width={VB_W} height={VB_H} fill="transparent" />
        <ChainColumnDividers />
        <ChainColumnHeaders />

        {/* Connections (drawn behind nodes) */}
        <ChainConnections innovation={innovation} hoveredDomainId={hoveredDomainId} />

        {/* Layer 1: Indicator nodes */}
        {NETWORK_DOMAINS.map((domain, di) => {
          const isOther = hoveredDomainId !== null && hoveredDomainId !== domain.id;
          const isHov = hoveredDomainId === domain.id;
          return domain.themes.map((theme, ti) =>
            theme.indicators.map((ind, ii) => {
              const indY = CHAIN_LAYOUT.indicatorYsByTheme[di][ti][ii];
              const indScore = scores?.indicators[ind.id] ?? null;
              return (
                <IndicatorNode
                  key={ind.id}
                  cx={X_IND}
                  cy={indY}
                  score={indScore}
                  domainColor={domain.color}
                  noSelection={noSelection}
                  isHovered={isHov}
                  isOther={isOther}
                  label={ind.label}
                  onTooltip={setTooltip}
                />
              );
            })
          );
        })}

        {/* Layer 2: Theme nodes */}
        {NETWORK_DOMAINS.map((domain, di) => {
          const isOther = hoveredDomainId !== null && hoveredDomainId !== domain.id;
          const isHov = hoveredDomainId === domain.id;
          return domain.themes.map((theme, ti) => {
            const themeY = CHAIN_LAYOUT.themeYsByDomain[di][ti];
            const themeScore = scores?.themes[theme.id] ?? null;
            return (
              <ThemeNode
                key={theme.id}
                cx={X_THEME}
                cy={themeY}
                score={themeScore}
                domainColor={domain.color}
                noSelection={noSelection}
                isHovered={isHov}
                isOther={isOther}
                label={theme.label}
              />
            );
          });
        })}

        {/* Layer 3: Domain nodes */}
        {NETWORK_DOMAINS.map((domain, di) => {
          const domainY = CHAIN_LAYOUT.domainYs[di];
          const domainScore = scores?.domains[domain.id] ?? null;
          const isOther = hoveredDomainId !== null && hoveredDomainId !== domain.id;
          const isHov = hoveredDomainId === domain.id;
          return (
            <DomainNode
              key={domain.id}
              cx={X_DOMAIN}
              cy={domainY}
              score={domainScore}
              domain={domain}
              noSelection={noSelection}
              isHovered={isHov}
              isOther={isOther}
              onHover={onHoverDomain}
            />
          );
        })}

        {/* Layer 4: Dimension nodes */}
        {DIMENSIONS.map((dim, di) => {
          const dimY = CHAIN_LAYOUT.dimYs[di];
          const ds = dimScores?.[di];
          return (
            <DimensionNode
              key={dim.id}
              cx={X_DIM}
              cy={dimY}
              dim={dim}
              score={ds?.raw ?? null}
              isActive={ds?.isActive ?? false}
              noSelection={noSelection}
            />
          );
        })}

        {/* Layer 5: Center / Demand Intelligence node */}
        <CenterNode cx={X_CENTER} cy={centerY} score={centerScore} noSelection={noSelection} />

        {/* Tooltip */}
        <SvgTooltip tooltip={tooltip} />

        {noSelection && <ChainEmptyOverlay />}
      </svg>
    </div>
  );
}
