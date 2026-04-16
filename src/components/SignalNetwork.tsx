import { useState, useMemo, useCallback } from "react";
import type { Innovation } from "@/lib/data";
import {
  NETWORK_DOMAINS,
  THEME_MAP,
  generateNetworkScores,
  getArcColor,
  type NetworkDomain,
  type NetworkTheme,
  type NetworkIndicator,
  type NetworkScores,
} from "@/lib/networkData";

// ─── Layout Constants ──────────────────────────────────────────────────────────

const VB_W = 1200;
const VB_H = 700;

// X positions of the three columns
const X_DOMAIN = 110;
const X_THEME = 440;
const X_INDICATOR = 770;

// Node radii
const R_DOMAIN = 28;
const R_THEME = 13;
const R_INDICATOR = 6;

// Vertical padding top/bottom for the whole diagram
const V_PAD = 40;
const USABLE_H = VB_H - V_PAD * 2;

// ─── Geometry Helpers ─────────────────────────────────────────────────────────

interface Point {
  x: number;
  y: number;
}

// Evenly distribute n items within [top, top+height] centered
function distributeY(count: number, totalHeight: number, topOffset: number): number[] {
  if (count === 0) return [];
  const spacing = totalHeight / count;
  return Array.from({ length: count }, (_, i) => topOffset + spacing * (i + 0.5));
}

// Compute pre-calculated layout positions for all nodes
function computeLayout() {
  const domainYs = distributeY(7, USABLE_H, V_PAD);

  const themeYsByDomain: number[][] = [];
  const indicatorYsByTheme: number[][] = [];

  // Count totals to compute proportional spacing
  const totalThemes = NETWORK_DOMAINS.reduce((a, d) => a + d.themes.length, 0);
  const totalIndicators = NETWORK_DOMAINS.reduce(
    (a, d) => a + d.themes.reduce((b, t) => b + t.indicators.length, 0),
    0
  );

  let themeOffset = V_PAD;
  let indicatorOffset = V_PAD;

  for (const domain of NETWORK_DOMAINS) {
    const themeCount = domain.themes.length;
    const domainThemeFraction = themeCount / totalThemes;
    const themeBlockHeight = USABLE_H * domainThemeFraction;
    const ys = distributeY(themeCount, themeBlockHeight, themeOffset);
    themeYsByDomain.push(ys);

    const themeIndicatorYs: number[][] = [];
    for (const theme of domain.themes) {
      const iCount = theme.indicators.length;
      const domainIndicatorFraction = iCount / totalIndicators;
      const iBlockHeight = USABLE_H * domainIndicatorFraction;
      const iYs = distributeY(iCount, iBlockHeight, indicatorOffset);
      themeIndicatorYs.push(iYs);
      indicatorOffset += iBlockHeight;
    }
    indicatorYsByTheme.push(themeIndicatorYs);

    themeOffset += themeBlockHeight;
  }

  return { domainYs, themeYsByDomain, indicatorYsByTheme };
}

const LAYOUT = computeLayout();

// ─── SVG Arc Helper (activation arc around domain circle) ────────────────────

function describeArc(cx: number, cy: number, r: number, score: number): string {
  // Arc goes from top (-90deg) clockwise, length proportional to score/10
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

// ─── Tooltip State ────────────────────────────────────────────────────────────

interface TooltipInfo {
  x: number;
  y: number;
  label: string;
  score: number | null;
  color: string;
  layer: "domain" | "theme" | "indicator";
}

// ─── SVG Defs ─────────────────────────────────────────────────────────────────

function NetworkDefs() {
  return (
    <defs>
      <style>{`
        @keyframes networkPulse {
          0%, 100% { opacity: 0.7; r: 0; }
          50% { opacity: 0; r: 6; }
        }
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .node-active {
          animation: nodePulse 2.8s ease-in-out infinite;
        }
        @keyframes signalIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .domain-node-enter { animation: signalIn 0.4s ease forwards; }
        .theme-node-enter  { animation: signalIn 0.4s ease 0.2s forwards; opacity: 0; }
        .indicator-node-enter { animation: signalIn 0.4s ease 0.4s forwards; opacity: 0; }
      `}</style>

      {/* Domain-colored glow filters */}
      {NETWORK_DOMAINS.map((d) => (
        <filter key={d.id} id={`glow-${d.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}

      {/* Background — transparent so the card parent shows through */}
    </defs>
  );
}

// ─── Connection Lines ─────────────────────────────────────────────────────────

interface ConnectionsProps {
  scores: NetworkScores | null;
  hoveredDomainId: string | null;
}

function Connections({ scores, hoveredDomainId }: ConnectionsProps) {
  return (
    <g>
      {NETWORK_DOMAINS.map((domain, di) => {
        const domainY = LAYOUT.domainYs[di];
        const domainScore = scores ? scores.domains[domain.id] : null;
        const isDomainActive = domainScore !== null ? domainScore >= 5 : false;
        const isHighlighted = hoveredDomainId === domain.id;
        const isOtherHovered = hoveredDomainId !== null && hoveredDomainId !== domain.id;

        return domain.themes.map((theme, ti) => {
          const themeY = LAYOUT.themeYsByDomain[di][ti];
          const themeScore = scores ? scores.themes[theme.id] : null;
          const isThemeActive = themeScore !== null ? themeScore >= 5 : false;

          // Domain → Theme line
          const dThemeActive = isDomainActive && isThemeActive;
          const dThemeOpacity = isOtherHovered
            ? 0.04
            : isHighlighted
            ? dThemeActive ? 0.7 : 0.2
            : scores
            ? dThemeActive ? 0.4 : 0.08
            : 0.12;

          const dThemeStroke = dThemeActive ? domain.color : "#cbd5e1";

          return (
            <g key={theme.id}>
              {/* Domain → Theme */}
              <line
                x1={X_DOMAIN + R_DOMAIN}
                y1={domainY}
                x2={X_THEME - R_THEME}
                y2={themeY}
                stroke={dThemeStroke}
                strokeWidth={dThemeActive ? 1.2 : 0.6}
                strokeOpacity={dThemeOpacity}
                style={{ transition: "stroke-opacity 0.5s ease, stroke 0.5s ease" }}
              />

              {/* Theme → Indicator lines */}
              {theme.indicators.map((indicator, ii) => {
                const indicatorY = LAYOUT.indicatorYsByTheme[di][ti][ii];
                const iScore = scores ? scores.indicators[indicator.id] : null;
                const isIndActive = iScore !== null ? iScore >= 5 : false;
                const tIActive = isThemeActive && isIndActive;

                const tIOpacity = isOtherHovered
                  ? 0.02
                  : isHighlighted
                  ? tIActive ? 0.5 : 0.12
                  : scores
                  ? tIActive ? 0.3 : 0.06
                  : 0.08;

                return (
                  <line
                    key={indicator.id}
                    x1={X_THEME + R_THEME}
                    y1={themeY}
                    x2={X_INDICATOR - R_INDICATOR}
                    y2={indicatorY}
                    stroke={tIActive ? domain.color : "#cbd5e1"}
                    strokeWidth={tIActive ? 0.8 : 0.4}
                    strokeOpacity={tIOpacity}
                    style={{ transition: "stroke-opacity 0.5s ease, stroke 0.5s ease" }}
                  />
                );
              })}
            </g>
          );
        });
      })}
    </g>
  );
}

// ─── Domain Node ─────────────────────────────────────────────────────────────

interface DomainNodeProps {
  domain: NetworkDomain;
  cy: number;
  score: number | null;
  noSelection: boolean;
  isHovered: boolean;
  isOtherHovered: boolean;
  isAnimating: boolean;
  onHover: (id: string | null, evt: React.MouseEvent) => void;
  onMouseMove: (evt: React.MouseEvent) => void;
}

function DomainNode({
  domain,
  cy,
  score,
  noSelection,
  isHovered,
  isOtherHovered,
  isAnimating,
  onHover,
  onMouseMove,
}: DomainNodeProps) {
  const active = score !== null ? score >= 5 : false;
  const opacity = noSelection
    ? 0.35
    : isOtherHovered
    ? 0.25
    : active
    ? 1
    : 0.35;

  const arcColor = score !== null ? getArcColor(score) : domain.color;
  const arcR = R_DOMAIN + 5;

  // Label lines for short label
  const labelLines = domain.shortLabel.split("\n");

  return (
    <g
      style={{
        transition: "opacity 0.5s ease",
        opacity,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => onHover(domain.id, e)}
      onMouseLeave={() => onHover(null, {} as React.MouseEvent)}
      onMouseMove={onMouseMove}
    >
      {/* Subtle glow behind circle when active */}
      {active && !noSelection && (
        <circle
          cx={X_DOMAIN}
          cy={cy}
          r={R_DOMAIN + 8}
          fill={domain.color}
          opacity={0.12}
          style={{ filter: "blur(5px)", transition: "opacity 0.5s ease" }}
        />
      )}

      {/* Activation arc (score progress around the circle) */}
      {score !== null && (
        <>
          {/* Track arc (light gray) */}
          <circle
            cx={X_DOMAIN}
            cy={cy}
            r={arcR}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={2.5}
          />
          {/* Score arc */}
          <path
            d={describeArc(X_DOMAIN, cy, arcR, score)}
            fill="none"
            stroke={arcColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            style={{ transition: "stroke 0.5s ease" }}
          />
        </>
      )}

      {/* Main circle */}
      <circle
        cx={X_DOMAIN}
        cy={cy}
        r={R_DOMAIN}
        fill={active && !noSelection ? domain.color : "#f1f5f9"}
        stroke={noSelection ? domain.color + "55" : active ? domain.color : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 1.5 : 0.8}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
        className={isAnimating ? "domain-node-enter" : undefined}
      />

      {/* Domain number */}
      <text
        x={X_DOMAIN}
        y={cy - (score !== null ? 8 : 2)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="800"
        fill={active && !noSelection ? "white" : domain.color}
        fontFamily="Outfit, sans-serif"
        style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
      >
        {domain.num}
      </text>

      {/* Score inside circle */}
      {score !== null && (
        <text
          x={X_DOMAIN}
          y={cy + 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fontWeight="700"
          fill={active ? "white" : "#475569"}
          fontFamily="Outfit, sans-serif"
          style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
        >
          {score.toFixed(1)}
        </text>
      )}

      {/* Domain label to the left */}
      <text
        x={X_DOMAIN - R_DOMAIN - 8}
        y={cy}
        textAnchor="end"
        dominantBaseline="central"
        fontFamily="Inter, sans-serif"
        style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
      >
        {labelLines.map((line, i) => (
          <tspan
            key={i}
            x={X_DOMAIN - R_DOMAIN - 8}
            dy={
              i === 0
                ? `${-(labelLines.length - 1) * 5}px`
                : "11px"
            }
            fontSize="9"
            fontWeight="600"
            fill={noSelection ? domain.color + "88" : active ? domain.color : "#64748b"}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

// ─── Theme Node ───────────────────────────────────────────────────────────────

interface ThemeNodeProps {
  theme: NetworkTheme;
  domain: NetworkDomain;
  cy: number;
  score: number | null;
  noSelection: boolean;
  isHighlighted: boolean;
  isOtherHovered: boolean;
  isAnimating: boolean;
  onTooltip: (info: TooltipInfo | null) => void;
  onMouseMove: (evt: React.MouseEvent) => void;
}

function ThemeNode({
  theme,
  domain,
  cy,
  score,
  noSelection,
  isHighlighted,
  isOtherHovered,
  isAnimating,
  onTooltip,
  onMouseMove,
}: ThemeNodeProps) {
  const active = score !== null ? score >= 5 : false;

  const opacity = noSelection
    ? 0.3
    : isOtherHovered
    ? 0.15
    : active
    ? 1
    : 0.3;

  return (
    <g
      style={{ transition: "opacity 0.5s ease", opacity, cursor: "default" }}
      onMouseEnter={(e) =>
        onTooltip({
          x: e.clientX,
          y: e.clientY,
          label: theme.label,
          score,
          color: domain.color,
          layer: "theme",
        })
      }
      onMouseLeave={() => onTooltip(null)}
      onMouseMove={(e) => {
        onMouseMove(e);
        onTooltip({
          x: e.clientX,
          y: e.clientY,
          label: theme.label,
          score,
          color: domain.color,
          layer: "theme",
        });
      }}
    >
      {/* Subtle glow for active */}
      {active && !noSelection && (
        <circle
          cx={X_THEME}
          cy={cy}
          r={R_THEME + 5}
          fill={domain.color}
          opacity={0.1}
          style={{ filter: "blur(3px)" }}
        />
      )}

      <circle
        cx={X_THEME}
        cy={cy}
        r={R_THEME}
        fill={active && !noSelection ? domain.color : "#f1f5f9"}
        stroke={noSelection ? domain.color + "44" : active ? domain.color : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 1.2 : 0.6}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
        className={isAnimating ? "theme-node-enter" : undefined}
      />

      {score !== null && (
        <text
          x={X_THEME}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="6.5"
          fontWeight="700"
          fill={active ? "white" : "#475569"}
          fontFamily="Outfit, sans-serif"
          style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
        >
          {score.toFixed(1)}
        </text>
      )}
    </g>
  );
}

// ─── Indicator Node ───────────────────────────────────────────────────────────

interface IndicatorNodeProps {
  indicator: NetworkIndicator;
  domain: NetworkDomain;
  cy: number;
  score: number | null;
  noSelection: boolean;
  isHighlighted: boolean;
  isOtherHovered: boolean;
  isAnimating: boolean;
  onTooltip: (info: TooltipInfo | null) => void;
  onMouseMove: (evt: React.MouseEvent) => void;
}

function IndicatorNode({
  indicator,
  domain,
  cy,
  score,
  noSelection,
  isHighlighted,
  isOtherHovered,
  isAnimating,
  onTooltip,
  onMouseMove,
}: IndicatorNodeProps) {
  const active = score !== null ? score >= 5 : false;

  const opacity = noSelection
    ? 0.28
    : isOtherHovered
    ? 0.12
    : active
    ? 1
    : 0.25;

  return (
    <circle
      cx={X_INDICATOR}
      cy={cy}
      r={R_INDICATOR}
      fill={active && !noSelection ? domain.color : "#e2e8f0"}
      stroke={noSelection ? domain.color + "33" : active ? domain.color : "#cbd5e1"}
      strokeWidth={active && !noSelection ? 0.8 : 0.4}
      style={{
        transition: "fill 0.5s ease, stroke 0.5s ease, opacity 0.5s ease",
        opacity,
        cursor: "default",
      }}
      className={isAnimating ? "indicator-node-enter" : undefined}
      onMouseEnter={(e) =>
        onTooltip({
          x: e.clientX,
          y: e.clientY,
          label: indicator.label,
          score,
          color: domain.color,
          layer: "indicator",
        })
      }
      onMouseLeave={() => onTooltip(null)}
      onMouseMove={(e) => {
        onMouseMove(e);
        onTooltip({
          x: e.clientX,
          y: e.clientY,
          label: indicator.label,
          score,
          color: domain.color,
          layer: "indicator",
        });
      }}
    />
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipProps {
  info: TooltipInfo;
  containerRect: DOMRect | null;
}

function NetworkTooltip({ info, containerRect }: TooltipProps) {
  if (!containerRect) return null;

  const x = info.x - containerRect.left + 12;
  const y = info.y - containerRect.top - 32;

  const statusText =
    info.score === null
      ? "No data"
      : info.score >= 7
      ? "Strong signal"
      : info.score >= 5
      ? "Active"
      : "Weak signal";

  const scoreColor =
    info.score === null
      ? "#64748b"
      : info.score >= 7
      ? "#10b981"
      : info.score >= 5
      ? "#f59e0b"
      : "#f43f5e";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.97)",
        border: `1px solid ${info.color}55`,
        borderRadius: 8,
        padding: "6px 10px",
        minWidth: 140,
        backdropFilter: "blur(12px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: info.color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 2,
        }}
      >
        {info.layer}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#1e293b",
          marginBottom: 4,
          lineHeight: 1.3,
        }}
      >
        {info.label}
      </div>
      {info.score !== null && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: scoreColor,
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {info.score.toFixed(1)}
          </span>
          <span style={{ fontSize: 10, color: scoreColor, fontWeight: 600 }}>
            {statusText}
          </span>
        </div>
      )}
      {info.score === null && (
        <span style={{ fontSize: 10, color: "#94a3b8" }}>Select an innovation</span>
      )}
    </div>
  );
}

// ─── Column Headers ───────────────────────────────────────────────────────────

function ColumnHeaders() {
  const headers = [
    { x: X_DOMAIN, label: "7 Domains", sub: "Data Signal Sources" },
    { x: X_THEME, label: "28 Themes", sub: "Diagnostic Categories" },
    { x: X_INDICATOR, label: "~75 Indicators", sub: "Evidence Points" },
  ];

  return (
    <g>
      {headers.map((h) => (
        <g key={h.x}>
          <text
            x={h.x}
            y={16}
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#334155"
            fontFamily="Inter, sans-serif"
          >
            {h.label}
          </text>
          <text
            x={h.x}
            y={29}
            textAnchor="middle"
            fontSize="8"
            fontWeight="500"
            fill="#64748b"
            fontFamily="Inter, sans-serif"
          >
            {h.sub}
          </text>
        </g>
      ))}
      {/* Arrows between column headers */}
      <text x={(X_DOMAIN + X_THEME) / 2} y={16} textAnchor="middle" fontSize="14" fill="#94a3b8">
        →
      </text>
      <text x={(X_THEME + X_INDICATOR) / 2} y={16} textAnchor="middle" fontSize="14" fill="#94a3b8">
        →
      </text>
    </g>
  );
}

// ─── Empty State Overlay ──────────────────────────────────────────────────────

function EmptyOverlay() {
  const cx = (X_DOMAIN + X_INDICATOR) / 2;
  const cy = VB_H / 2;

  return (
    <g pointerEvents="none">
      <rect
        x={X_DOMAIN - 60}
        y={cy - 28}
        width={X_INDICATOR - X_DOMAIN + 120}
        height={56}
        rx={10}
        fill="rgba(241,245,249,0.9)"
        stroke="#e2e8f0"
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        fill="#0d9488"
        fontFamily="Inter, sans-serif"
      >
        Select an innovation to activate the signal network
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontWeight="500"
        fill="#64748b"
        fontFamily="Inter, sans-serif"
      >
        Nodes will light up based on domain, theme, and indicator scores
      </text>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface SignalNetworkProps {
  innovation: Innovation | null;
}

export function SignalNetwork({ innovation }: SignalNetworkProps) {
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
  const [animating, setAnimating] = useState(false);

  const scores: NetworkScores | null = useMemo(() => {
    if (!innovation) return null;
    return generateNetworkScores(innovation);
  }, [innovation]);

  // Trigger animation key change when innovation changes
  const animKey = innovation?.innovation_name ?? "empty";

  const handleContainerRef = useCallback((el: SVGSVGElement | null) => {
    if (el) {
      setContainerRect(el.getBoundingClientRect());
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // Update container rect on mouse move for accurate tooltip positioning
    const target = (e.currentTarget as SVGElement).closest("svg");
    if (target) {
      setContainerRect(target.getBoundingClientRect());
    }
  }, []);

  const handleDomainHover = useCallback(
    (id: string | null, e: React.MouseEvent) => {
      setHoveredDomainId(id);
      if (id) {
        const domain = NETWORK_DOMAINS.find((d) => d.id === id);
        if (domain) {
          const score = scores ? scores.domains[id] : null;
          setTooltip({
            x: e.clientX,
            y: e.clientY,
            label: domain.label,
            score,
            color: domain.color,
            layer: "domain",
          });
        }
      } else {
        setTooltip(null);
      }
    },
    [scores]
  );

  const noSelection = innovation === null;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        key={animKey}
        ref={handleContainerRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        style={{ display: "block" }}
        aria-label="Domain Signal Network — 7 domains, themes, and indicators"
      >
        <NetworkDefs />

        {/* Background — transparent */}
        <rect width={VB_W} height={VB_H} fill="transparent" />

        {/* Subtle vertical column dividers */}
        <line
          x1={(X_DOMAIN + X_THEME) / 2}
          y1={36}
          x2={(X_DOMAIN + X_THEME) / 2}
          y2={VB_H - 10}
          stroke="#e2e8f0"
          strokeWidth={0.5}
          strokeOpacity={0.8}
        />
        <line
          x1={(X_THEME + X_INDICATOR) / 2}
          y1={36}
          x2={(X_THEME + X_INDICATOR) / 2}
          y2={VB_H - 10}
          stroke="#e2e8f0"
          strokeWidth={0.5}
          strokeOpacity={0.8}
        />

        {/* Column headers */}
        <ColumnHeaders />

        {/* Connection lines (rendered behind nodes) */}
        <Connections scores={scores} hoveredDomainId={hoveredDomainId} />

        {/* Nodes */}
        {NETWORK_DOMAINS.map((domain, di) => {
          const domainScore = scores ? scores.domains[domain.id] : null;
          const isHovered = hoveredDomainId === domain.id;
          const isOtherHovered = hoveredDomainId !== null && hoveredDomainId !== domain.id;

          return (
            <g key={domain.id}>
              {/* Domain node */}
              <DomainNode
                domain={domain}
                cy={LAYOUT.domainYs[di]}
                score={domainScore}
                noSelection={noSelection}
                isHovered={isHovered}
                isOtherHovered={isOtherHovered}
                isAnimating={!noSelection}
                onHover={handleDomainHover}
                onMouseMove={handleMouseMove}
              />

              {/* Theme nodes */}
              {domain.themes.map((theme, ti) => {
                const themeScore = scores ? scores.themes[theme.id] : null;
                return (
                  <g key={theme.id}>
                    <ThemeNode
                      theme={theme}
                      domain={domain}
                      cy={LAYOUT.themeYsByDomain[di][ti]}
                      score={themeScore}
                      noSelection={noSelection}
                      isHighlighted={isHovered}
                      isOtherHovered={isOtherHovered}
                      isAnimating={!noSelection}
                      onTooltip={setTooltip}
                      onMouseMove={handleMouseMove}
                    />

                    {/* Indicator nodes */}
                    {theme.indicators.map((indicator, ii) => {
                      const iScore = scores ? scores.indicators[indicator.id] : null;
                      return (
                        <IndicatorNode
                          key={indicator.id}
                          indicator={indicator}
                          domain={domain}
                          cy={LAYOUT.indicatorYsByTheme[di][ti][ii]}
                          score={iScore}
                          noSelection={noSelection}
                          isHighlighted={isHovered}
                          isOtherHovered={isOtherHovered}
                          isAnimating={!noSelection}
                          onTooltip={setTooltip}
                          onMouseMove={handleMouseMove}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Empty state overlay */}
        {noSelection && <EmptyOverlay />}
      </svg>

      {/* HTML Tooltip (outside SVG for proper positioning) */}
      {tooltip && <NetworkTooltip info={tooltip} containerRect={containerRect} />}
    </div>
  );
}
