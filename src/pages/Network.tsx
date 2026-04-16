import { useState, useMemo, useCallback, useRef } from "react";
import type { Innovation } from "@/lib/data";
import { masterData, getSignalLevel } from "@/lib/data";
import {
  NETWORK_DOMAINS,
  generateNetworkScores,
  getArcColor,
  type NetworkDomain,
  type NetworkTheme,
  type NetworkIndicator,
  type NetworkScores,
} from "@/lib/networkData";
import { SignalNetworkChain } from "@/components/SignalNetworkChain";
import { NetworkCounts } from "@/components/NetworkCounts";

// ─── Tab Types ─────────────────────────────────────────────────────────────────

type NetworkTab = "signal" | "chain" | "summary";

// ─── Full Layout Constants ─────────────────────────────────────────────────────

const VB_W = 1800;
const VB_H = 1100;

const X_DOMAIN = 200;
const X_THEME = 750;
const X_INDICATOR = 1300;

const R_DOMAIN = 36;
const R_THEME = 18;
const R_INDICATOR = 10;

const V_PAD = 60;
const USABLE_H = VB_H - V_PAD * 2;

// ─── Geometry Helpers ─────────────────────────────────────────────────────────

function distributeY(count: number, totalHeight: number, topOffset: number): number[] {
  if (count === 0) return [];
  const spacing = totalHeight / count;
  return Array.from({ length: count }, (_, i) => topOffset + spacing * (i + 0.5));
}

function computeFullLayout() {
  const domainYs = distributeY(7, USABLE_H, V_PAD);

  const themeYsByDomain: number[][] = [];
  const indicatorYsByTheme: number[][] = [];

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

const FULL_LAYOUT = computeFullLayout();

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

// ─── Network Defs ─────────────────────────────────────────────────────────────

function FullNetworkDefs() {
  return (
    <defs>
      <style>{`
        @keyframes networkPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0; }
        }
        @keyframes signalIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .full-domain-enter { animation: signalIn 0.4s ease forwards; }
        .full-theme-enter  { animation: signalIn 0.4s ease 0.2s forwards; opacity: 0; }
        .full-indicator-enter { animation: signalIn 0.4s ease 0.4s forwards; opacity: 0; }
      `}</style>

      {NETWORK_DOMAINS.map((d) => (
        <filter key={d.id} id={`full-glow-${d.id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}

      {/* No dark background gradient — transparent for light theme */}
    </defs>
  );
}

// ─── Full Connections ─────────────────────────────────────────────────────────

interface FullConnectionsProps {
  scores: NetworkScores | null;
  hoveredDomainId: string | null;
}

function FullConnections({ scores, hoveredDomainId }: FullConnectionsProps) {
  return (
    <g>
      {NETWORK_DOMAINS.map((domain, di) => {
        const domainY = FULL_LAYOUT.domainYs[di];
        const domainScore = scores ? scores.domains[domain.id] : null;
        const isDomainActive = domainScore !== null ? domainScore >= 5 : false;
        const isOtherHovered = hoveredDomainId !== null && hoveredDomainId !== domain.id;
        const isHighlighted = hoveredDomainId === domain.id;

        return domain.themes.map((theme, ti) => {
          const themeY = FULL_LAYOUT.themeYsByDomain[di][ti];
          const themeScore = scores ? scores.themes[theme.id] : null;
          const isThemeActive = themeScore !== null ? themeScore >= 5 : false;

          const dThemeActive = isDomainActive && isThemeActive;
          const dThemeOpacity = isOtherHovered
            ? 0.03
            : isHighlighted
            ? dThemeActive ? 0.75 : 0.2
            : scores
            ? dThemeActive ? 0.45 : 0.08
            : 0.12;

          const dThemeStroke = dThemeActive ? domain.color : "#cbd5e1";

          return (
            <g key={theme.id}>
              <line
                x1={X_DOMAIN + R_DOMAIN}
                y1={domainY}
                x2={X_THEME - R_THEME}
                y2={themeY}
                stroke={dThemeStroke}
                strokeWidth={dThemeActive ? 1.8 : 0.8}
                strokeOpacity={dThemeOpacity}
                style={{ transition: "stroke-opacity 0.5s ease, stroke 0.5s ease" }}
              />

              {theme.indicators.map((indicator, ii) => {
                const indicatorY = FULL_LAYOUT.indicatorYsByTheme[di][ti][ii];
                const iScore = scores ? scores.indicators[indicator.id] : null;
                const isIndActive = iScore !== null ? iScore >= 5 : false;
                const tIActive = isThemeActive && isIndActive;

                const tIOpacity = isOtherHovered
                  ? 0.02
                  : isHighlighted
                  ? tIActive ? 0.55 : 0.12
                  : scores
                  ? tIActive ? 0.32 : 0.06
                  : 0.08;

                return (
                  <line
                    key={indicator.id}
                    x1={X_THEME + R_THEME}
                    y1={themeY}
                    x2={X_INDICATOR - R_INDICATOR}
                    y2={indicatorY}
                    stroke={tIActive ? domain.color : "#cbd5e1"}
                    strokeWidth={tIActive ? 1.1 : 0.5}
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

// ─── Full Domain Node ─────────────────────────────────────────────────────────

interface FullDomainNodeProps {
  domain: NetworkDomain;
  cy: number;
  score: number | null;
  noSelection: boolean;
  isHovered: boolean;
  isOtherHovered: boolean;
  isAnimating: boolean;
  onHover: (id: string | null) => void;
}

function FullDomainNode({
  domain,
  cy,
  score,
  noSelection,
  isHovered,
  isOtherHovered,
  isAnimating,
  onHover,
}: FullDomainNodeProps) {
  const active = score !== null ? score >= 5 : false;
  const opacity = noSelection ? 0.4 : isOtherHovered ? 0.25 : active ? 1 : 0.38;

  const arcColor = score !== null ? getArcColor(score) : domain.color;
  const arcR = R_DOMAIN + 7;

  // Full label for display (multi-line)
  const labelLines = domain.label.split(" ");
  // Group into lines of ~2 words
  const lineGroups: string[] = [];
  for (let i = 0; i < labelLines.length; i += 2) {
    lineGroups.push(labelLines.slice(i, i + 2).join(" "));
  }

  const labelLineHeight = 13;
  const totalLabelH = lineGroups.length * labelLineHeight;

  return (
    <g
      style={{ transition: "opacity 0.5s ease", opacity, cursor: "pointer" }}
      onMouseEnter={() => onHover(domain.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Subtle glow behind circle */}
      {active && !noSelection && (
        <circle
          cx={X_DOMAIN}
          cy={cy}
          r={R_DOMAIN + 12}
          fill={domain.color}
          opacity={0.1}
          style={{ filter: "blur(7px)", transition: "opacity 0.5s ease" }}
        />
      )}

      {/* Activation arc track */}
      {score !== null && (
        <>
          <circle
            cx={X_DOMAIN}
            cy={cy}
            r={arcR}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={3}
          />
          <path
            d={describeArc(X_DOMAIN, cy, arcR, score)}
            fill="none"
            stroke={arcColor}
            strokeWidth={3}
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
        strokeWidth={active && !noSelection ? 2 : 1}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
        className={isAnimating ? "full-domain-enter" : undefined}
      />

      {/* Domain number */}
      <text
        x={X_DOMAIN}
        y={cy - (score !== null ? 10 : 0)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="13"
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
          y={cy + 11}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="700"
          fill={active ? "white" : "#475569"}
          fontFamily="Outfit, sans-serif"
          style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
        >
          {score.toFixed(1)}
        </text>
      )}

      {/* Full domain label to the left */}
      <text
        x={X_DOMAIN - R_DOMAIN - arcR - 8}
        y={cy - totalLabelH / 2 + labelLineHeight / 2}
        textAnchor="end"
        fontFamily="Inter, sans-serif"
        style={{ pointerEvents: "none" }}
      >
        {lineGroups.map((line, i) => (
          <tspan
            key={i}
            x={X_DOMAIN - R_DOMAIN - arcR - 8}
            dy={i === 0 ? 0 : labelLineHeight}
            fontSize="11"
            fontWeight="700"
            fill={noSelection ? domain.color + "99" : active ? domain.color : "#475569"}
            style={{ transition: "fill 0.5s ease" }}
          >
            {line}
          </tspan>
        ))}
      </text>

      {/* Guiding question below label */}
      <text
        x={X_DOMAIN - R_DOMAIN - arcR - 8}
        y={cy + totalLabelH / 2 + 4}
        textAnchor="end"
        fontSize="8.5"
        fontStyle="italic"
        fontWeight="400"
        fill={noSelection ? "#94a3b8" : active ? domain.color + "88" : "#94a3b8"}
        fontFamily="Inter, sans-serif"
        style={{ pointerEvents: "none", transition: "fill 0.5s ease" }}
      >
        {domain.question.length > 44
          ? domain.question.slice(0, 42) + "…"
          : domain.question}
      </text>
    </g>
  );
}

// ─── Full Theme Node ──────────────────────────────────────────────────────────

interface FullThemeNodeProps {
  theme: NetworkTheme;
  domain: NetworkDomain;
  cy: number;
  score: number | null;
  noSelection: boolean;
  isHighlighted: boolean;
  isOtherHovered: boolean;
  isAnimating: boolean;
  labelSide: "above" | "below";
}

function FullThemeNode({
  theme,
  domain,
  cy,
  score,
  noSelection,
  isHighlighted,
  isOtherHovered,
  isAnimating,
  labelSide,
}: FullThemeNodeProps) {
  const active = score !== null ? score >= 5 : false;
  const opacity = noSelection ? 0.3 : isOtherHovered ? 0.15 : active ? 1 : 0.3;

  const labelY = labelSide === "above" ? cy - R_THEME - 5 : cy + R_THEME + 13;
  const labelAnchor = "middle";

  return (
    <g style={{ transition: "opacity 0.5s ease", opacity, cursor: "default" }}>
      {active && !noSelection && (
        <circle
          cx={X_THEME}
          cy={cy}
          r={R_THEME + 7}
          fill={domain.color}
          opacity={0.1}
          style={{ filter: "blur(4px)" }}
        />
      )}

      <circle
        cx={X_THEME}
        cy={cy}
        r={R_THEME}
        fill={active && !noSelection ? domain.color : "#f1f5f9"}
        stroke={noSelection ? domain.color + "44" : active ? domain.color : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 1.5 : 0.8}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
        className={isAnimating ? "full-theme-enter" : undefined}
      />

      {/* Score inside theme node */}
      {score !== null && (
        <text
          x={X_THEME}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8.5"
          fontWeight="700"
          fill={active ? "white" : "#475569"}
          fontFamily="Outfit, sans-serif"
          style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
        >
          {score.toFixed(1)}
        </text>
      )}

      {/* Full theme label */}
      <text
        x={X_THEME}
        y={labelY}
        textAnchor={labelAnchor}
        fontSize="9"
        fontWeight="600"
        fill={noSelection ? "#64748b" : active ? domain.color : "#64748b"}
        fontFamily="Inter, sans-serif"
        style={{ pointerEvents: "none", transition: "fill 0.5s ease" }}
      >
        {theme.label}
      </text>
    </g>
  );
}

// ─── Full Indicator Node ──────────────────────────────────────────────────────

interface FullIndicatorNodeProps {
  indicator: NetworkIndicator;
  domain: NetworkDomain;
  cy: number;
  score: number | null;
  noSelection: boolean;
  isHighlighted: boolean;
  isOtherHovered: boolean;
  isAnimating: boolean;
}

function FullIndicatorNode({
  indicator,
  domain,
  cy,
  score,
  noSelection,
  isHighlighted,
  isOtherHovered,
  isAnimating,
}: FullIndicatorNodeProps) {
  const active = score !== null ? score >= 5 : false;
  const opacity = noSelection ? 0.28 : isOtherHovered ? 0.12 : active ? 1 : 0.25;

  return (
    <g style={{ transition: "opacity 0.5s ease", opacity }}>
      {/* Active glow */}
      {active && !noSelection && (
        <circle
          cx={X_INDICATOR}
          cy={cy}
          r={R_INDICATOR + 4}
          fill={domain.color}
          opacity={0.2}
          style={{ filter: "blur(3px)" }}
        />
      )}

      <circle
        cx={X_INDICATOR}
        cy={cy}
        r={R_INDICATOR}
        fill={active && !noSelection ? domain.color : "#e2e8f0"}
        stroke={noSelection ? domain.color + "33" : active ? domain.color : "#cbd5e1"}
        strokeWidth={active && !noSelection ? 1 : 0.5}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
        className={isAnimating ? "full-indicator-enter" : undefined}
      />

      {/* Score inside indicator */}
      {score !== null && (
        <text
          x={X_INDICATOR}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="5.5"
          fontWeight="700"
          fill={active ? "white" : "#475569"}
          fontFamily="Outfit, sans-serif"
          style={{ transition: "fill 0.5s ease", pointerEvents: "none" }}
        >
          {score.toFixed(1)}
        </text>
      )}

      {/* Indicator label to the right */}
      <text
        x={X_INDICATOR + R_INDICATOR + 7}
        y={cy}
        textAnchor="start"
        dominantBaseline="central"
        fontSize="8"
        fontWeight="500"
        fill={noSelection ? "#94a3b8" : active ? domain.color + "cc" : "#64748b"}
        fontFamily="Inter, sans-serif"
        style={{ pointerEvents: "none", transition: "fill 0.5s ease" }}
      >
        {indicator.label}
      </text>
    </g>
  );
}

// ─── Column Headers ───────────────────────────────────────────────────────────

function FullColumnHeaders() {
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
            y={22}
            textAnchor="middle"
            fontSize="14"
            fontWeight="700"
            fill="#334155"
            fontFamily="Inter, sans-serif"
          >
            {h.label}
          </text>
          <text
            x={h.x}
            y={38}
            textAnchor="middle"
            fontSize="10"
            fontWeight="500"
            fill="#64748b"
            fontFamily="Inter, sans-serif"
          >
            {h.sub}
          </text>
        </g>
      ))}
      <text
        x={(X_DOMAIN + X_THEME) / 2}
        y={22}
        textAnchor="middle"
        fontSize="18"
        fill="#94a3b8"
      >
        →
      </text>
      <text
        x={(X_THEME + X_INDICATOR) / 2}
        y={22}
        textAnchor="middle"
        fontSize="18"
        fill="#94a3b8"
      >
        →
      </text>
    </g>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function FullEmptyOverlay() {
  const cx = (X_DOMAIN + X_INDICATOR) / 2;
  const cy = VB_H / 2;

  return (
    <g pointerEvents="none">
      <rect
        x={cx - 260}
        y={cy - 36}
        width={520}
        height={72}
        rx={14}
        fill="rgba(241,245,249,0.92)"
        stroke="#e2e8f0"
        strokeWidth={1}
      />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="16"
        fontWeight="700"
        fill="#0d9488"
        fontFamily="Inter, sans-serif"
      >
        Select an innovation to activate the signal network
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="500"
        fill="#64748b"
        fontFamily="Inter, sans-serif"
      >
        Nodes will illuminate based on domain, theme, and indicator scores
      </text>
    </g>
  );
}

// ─── Full Network SVG Component ───────────────────────────────────────────────

interface SignalNetworkFullProps {
  innovation: Innovation | null;
  hoveredDomainId: string | null;
  onHoverDomain: (id: string | null) => void;
}

function SignalNetworkFull({ innovation, hoveredDomainId, onHoverDomain }: SignalNetworkFullProps) {
  const scores: NetworkScores | null = useMemo(() => {
    if (!innovation) return null;
    return generateNetworkScores(innovation);
  }, [innovation]);

  const animKey = innovation?.innovation_name ?? "empty";
  const noSelection = innovation === null;

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
        aria-label="Domain Signal Network — 7 domains, themes, and indicators"
        preserveAspectRatio="xMidYMid meet"
      >
        <FullNetworkDefs />

        {/* Background — transparent */}
        <rect width={VB_W} height={VB_H} fill="transparent" />

        {/* Column dividers */}
        <line
          x1={(X_DOMAIN + X_THEME) / 2}
          y1={50}
          x2={(X_DOMAIN + X_THEME) / 2}
          y2={VB_H - 16}
          stroke="#e2e8f0"
          strokeWidth={0.6}
          strokeOpacity={0.8}
        />
        <line
          x1={(X_THEME + X_INDICATOR) / 2}
          y1={50}
          x2={(X_THEME + X_INDICATOR) / 2}
          y2={VB_H - 16}
          stroke="#e2e8f0"
          strokeWidth={0.6}
          strokeOpacity={0.8}
        />

        <FullColumnHeaders />

        {/* Connections behind nodes */}
        <FullConnections scores={scores} hoveredDomainId={hoveredDomainId} />

        {/* Nodes */}
        {NETWORK_DOMAINS.map((domain, di) => {
          const domainScore = scores ? scores.domains[domain.id] : null;
          const isHovered = hoveredDomainId === domain.id;
          const isOtherHovered = hoveredDomainId !== null && hoveredDomainId !== domain.id;

          return (
            <g key={domain.id}>
              <FullDomainNode
                domain={domain}
                cy={FULL_LAYOUT.domainYs[di]}
                score={domainScore}
                noSelection={noSelection}
                isHovered={isHovered}
                isOtherHovered={isOtherHovered}
                isAnimating={!noSelection}
                onHover={onHoverDomain}
              />

              {domain.themes.map((theme, ti) => {
                const themeScore = scores ? scores.themes[theme.id] : null;
                const labelSide: "above" | "below" = ti % 2 === 0 ? "above" : "below";

                return (
                  <g key={theme.id}>
                    <FullThemeNode
                      theme={theme}
                      domain={domain}
                      cy={FULL_LAYOUT.themeYsByDomain[di][ti]}
                      score={themeScore}
                      noSelection={noSelection}
                      isHighlighted={isHovered}
                      isOtherHovered={isOtherHovered}
                      isAnimating={!noSelection}
                      labelSide={labelSide}
                    />

                    {theme.indicators.map((indicator, ii) => {
                      const iScore = scores ? scores.indicators[indicator.id] : null;
                      return (
                        <FullIndicatorNode
                          key={indicator.id}
                          indicator={indicator}
                          domain={domain}
                          cy={FULL_LAYOUT.indicatorYsByTheme[di][ti][ii]}
                          score={iScore}
                          noSelection={noSelection}
                          isHighlighted={isHovered}
                          isOtherHovered={isOtherHovered}
                          isAnimating={!noSelection}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          );
        })}

        {noSelection && <FullEmptyOverlay />}
      </svg>
    </div>
  );
}

// ─── Score Color Helpers ───────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 7) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#f43f5e";
}

function scoreBg(score: number): string {
  if (score >= 7) return "rgba(16,185,129,0.12)";
  if (score >= 5) return "rgba(245,158,11,0.12)";
  return "rgba(244,63,94,0.12)";
}

// ─── Innovation Selector Panel ────────────────────────────────────────────────

interface SidePanelProps {
  selected: Innovation | null;
  onSelect: (i: Innovation | null) => void;
  hoveredDomainId: string | null;
  onHoverDomain: (id: string | null) => void;
}

function SidePanel({ selected, onSelect, hoveredDomainId, onHoverDomain }: SidePanelProps) {
  const [search, setSearch] = useState("");
  const [expandedDomainId, setExpandedDomainId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return masterData.filter(
      (inn) =>
        inn.innovation_name.toLowerCase().includes(q) ||
        inn.country.toLowerCase().includes(q)
    );
  }, [search]);

  const scores: NetworkScores | null = useMemo(() => {
    if (!selected) return null;
    return generateNetworkScores(selected);
  }, [selected]);

  // Stats
  const stats = useMemo(() => {
    if (!scores) return null;
    const activeDomains = Object.values(scores.domains).filter((s) => s >= 5).length;
    const activeThemes = Object.values(scores.themes).filter((s) => s >= 5).length;
    const activeIndicators = Object.values(scores.indicators).filter((s) => s >= 5).length;
    const totalThemes = Object.keys(scores.themes).length;
    const totalIndicators = Object.keys(scores.indicators).length;
    const rate = Math.round((activeIndicators / totalIndicators) * 100);
    return { activeDomains, activeThemes, activeIndicators, totalThemes, totalIndicators, rate };
  }, [scores]);

  const signalLevel = selected ? getSignalLevel(selected) : null;
  const signalColors: Record<string, string> = {
    high: "#f43f5e",
    medium: "#f59e0b",
    low: "#10b981",
  };
  const signalLabels: Record<string, string> = {
    high: "High Gap",
    medium: "Moderate",
    low: "Low Gap",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#ffffff",
        borderLeft: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px 12px",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Innovation Selector
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search innovations or countries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "7px 10px 7px 30px",
              color: "#0f172a",
              fontSize: 12,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <svg
            style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }}
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#475569"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Innovation List */}
      <div style={{ flex: "0 0 auto", maxHeight: 240, overflowY: "auto", borderBottom: "1px solid #e2e8f0" }}>
        {filtered.length === 0 && (
          <div style={{ padding: "14px 18px", color: "#94a3b8", fontSize: 12 }}>No innovations found</div>
        )}
        {filtered.map((inn) => {
          const isSelected = selected?.innovation_name === inn.innovation_name;
          const level = getSignalLevel(inn);
          return (
            <button
              key={inn.innovation_name}
              onClick={() => onSelect(isSelected ? null : inn)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "9px 18px",
                background: isSelected ? "rgba(13,148,136,0.07)" : "transparent",
                border: "none",
                borderLeft: isSelected ? "3px solid #0d9488" : "3px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? "#0d9488" : "#1e293b", lineHeight: 1.3 }}>
                  {inn.innovation_name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>{inn.country}</div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  padding: "2px 7px",
                  borderRadius: 999,
                  fontSize: 9,
                  fontWeight: 700,
                  background: signalColors[level] + "22",
                  color: signalColors[level],
                  letterSpacing: "0.04em",
                }}
              >
                {signalLabels[level]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Scroll area for score details */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
        {!selected ? (
          <div style={{ textAlign: "center", paddingTop: 32 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
              Select an innovation above to see domain scores and network activation.
            </div>
          </div>
        ) : (
          <>
            {/* Selected Innovation Header */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, fontFamily: "Outfit, sans-serif" }}>
                {selected.innovation_name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#64748b" }}>{selected.country}</span>
                {signalLevel && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontSize: 9,
                      fontWeight: 700,
                      background: signalColors[signalLevel] + "22",
                      color: signalColors[signalLevel],
                    }}
                  >
                    {signalLabels[signalLevel]}
                  </span>
                )}
              </div>
            </div>

            {/* Domain Score Summary */}
            <div style={{ fontSize: 10, fontWeight: 700, color: "#0d9488", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Domain Scores
            </div>

            {NETWORK_DOMAINS.map((domain, di) => {
              const domScore = scores ? scores.domains[domain.id] : null;
              const active = domScore !== null ? domScore >= 5 : false;
              const isExpanded = expandedDomainId === domain.id;
              const isHighlighted = hoveredDomainId === domain.id;

              return (
                <div
                  key={domain.id}
                  style={{
                    marginBottom: 4,
                    borderRadius: 8,
                    border: isHighlighted
                      ? `1px solid ${domain.color}55`
                      : isExpanded
                      ? "1px solid #e2e8f0"
                      : "1px solid transparent",
                    overflow: "hidden",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  {/* Domain row */}
                  <button
                    onClick={() => setExpandedDomainId(isExpanded ? null : domain.id)}
                    onMouseEnter={() => onHoverDomain(domain.id)}
                    onMouseLeave={() => onHoverDomain(null)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      background: isHighlighted
                        ? domain.color + "10"
                        : isExpanded
                        ? "#f8fafc"
                        : "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "7px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "background 0.2s ease",
                    }}
                  >
                    {/* Color dot */}
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: domain.color,
                        flexShrink: 0,
                        opacity: active ? 1 : 0.4,
                      }}
                    />

                    {/* Domain name */}
                    <span
                      style={{
                        flex: 1,
                        fontSize: 11,
                        fontWeight: 600,
                        color: active ? "#1e293b" : "#94a3b8",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {domain.num}. {domain.label}
                    </span>

                    {/* Score bar */}
                    {domScore !== null && (
                      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                        <div
                          style={{
                            width: 56,
                            height: 4,
                            borderRadius: 2,
                            background: "#e2e8f0",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${(domScore / 10) * 100}%`,
                              height: "100%",
                              borderRadius: 2,
                              background: scoreColor(domScore),
                              transition: "width 0.5s ease",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: scoreColor(domScore),
                            fontFamily: "Outfit, sans-serif",
                            minWidth: 28,
                            textAlign: "right",
                          }}
                        >
                          {domScore.toFixed(1)}
                        </span>
                      </div>
                    )}

                    {/* Active badge */}
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: 999,
                        fontSize: 8,
                        fontWeight: 700,
                        background: active ? "rgba(16,185,129,0.15)" : "rgba(100,116,139,0.12)",
                        color: active ? "#10b981" : "#64748b",
                        flexShrink: 0,
                      }}
                    >
                      {active ? "ON" : "OFF"}
                    </span>
                  </button>

                  {/* Expanded theme breakdown */}
                  {isExpanded && scores && (
                    <div style={{ padding: "6px 10px 8px 26px", background: "#f8fafc" }}>
                      {domain.themes.map((theme) => {
                        const themeScore = scores.themes[theme.id];
                        const themeActive = themeScore >= 5;

                        return (
                          <div key={theme.id} style={{ marginBottom: 6 }}>
                            {/* Theme row */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                marginBottom: 2,
                              }}
                            >
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: domain.color,
                                  opacity: themeActive ? 1 : 0.3,
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ flex: 1, fontSize: 10, fontWeight: 600, color: themeActive ? "#1e293b" : "#94a3b8" }}>
                                {theme.label}
                              </span>
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: scoreColor(themeScore),
                                  fontFamily: "Outfit, sans-serif",
                                  minWidth: 26,
                                  textAlign: "right",
                                }}
                              >
                                {themeScore.toFixed(1)}
                              </span>
                            </div>

                            {/* Indicators */}
                            {theme.indicators.map((indicator) => {
                              const iScore = scores.indicators[indicator.id];
                              const iActive = iScore >= 5;
                              return (
                                <div
                                  key={indicator.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    paddingLeft: 12,
                                    marginBottom: 1,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 4,
                                      height: 4,
                                      borderRadius: "50%",
                                      background: iActive ? domain.color : "#cbd5e1",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span style={{ flex: 1, fontSize: 9, color: iActive ? "#475569" : "#cbd5e1" }}>
                                    {indicator.label}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 9,
                                      fontWeight: 700,
                                      color: scoreColor(iScore),
                                      fontFamily: "Outfit, sans-serif",
                                      minWidth: 24,
                                      textAlign: "right",
                                    }}
                                  >
                                    {iScore.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Network Stats */}
            {stats && (
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 14px",
                  background: "#f8fafc",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#0d9488",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Network Stats
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
                  {[
                    { label: "Active Domains", value: `${stats.activeDomains}/7` },
                    { label: "Active Themes", value: `${stats.activeThemes}/${stats.totalThemes}` },
                    { label: "Active Indicators", value: `${stats.activeIndicators}/${stats.totalIndicators}` },
                    { label: "Activation Rate", value: `${stats.rate}%` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0f172a",
                          fontFamily: "Outfit, sans-serif",
                          lineHeight: 1.1,
                        }}
                      >
                        {value}
                      </div>
                      <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tab Bar ───────────────────────────────────────────────────────────────────

interface TabBarProps {
  activeTab: NetworkTab;
  onChange: (tab: NetworkTab) => void;
}

const TABS: { id: NetworkTab; label: string; sub: string }[] = [
  { id: "signal", label: "Signal Network", sub: "Domains → Themes → Indicators" },
  { id: "chain", label: "Full Chain", sub: "Indicators → … → Demand Intel." },
  { id: "summary", label: "Summary", sub: "Counts & activation rates" },
];

function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: "8px 16px",
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        flexShrink: 0,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "6px 14px",
              borderRadius: 8,
              border: isActive ? "1px solid rgba(13,148,136,0.3)" : "1px solid #e2e8f0",
              background: isActive ? "rgba(13,148,136,0.08)" : "#ffffff",
              cursor: "pointer",
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#ffffff";
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: isActive ? "#0d9488" : "#475569",
                fontFamily: "Inter, sans-serif",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </span>
            <span
              style={{
                fontSize: 9,
                color: isActive ? "#0d9488" + "99" : "#94a3b8",
                fontFamily: "Inter, sans-serif",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {tab.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Network Page ─────────────────────────────────────────────────────────────

export default function Network() {
  const [selected, setSelected] = useState<Innovation | null>(null);
  const [hoveredDomainId, setHoveredDomainId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NetworkTab>("signal");

  const tabTitles: Record<NetworkTab, { title: string; sub: string }> = {
    signal: { title: "Domain Signal Network", sub: "7 → 28 → ~75 Framework — Demand Intelligence Platform" },
    chain: { title: "Full Chain Network", sub: "Indicators → Themes → Domains → Dimensions → Demand Intelligence" },
    summary: { title: "Network Summary", sub: "Activation counts & per-domain breakdown" },
  };

  const current = tabTitles[activeTab];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 52px)",
        background: "#f8fafc",
        overflow: "hidden",
      }}
    >
      {/* Dark header bar */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 3,
              height: 22,
              borderRadius: 2,
              background: "linear-gradient(180deg, #5eead4, #0d9488)",
            }}
          />
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: "Outfit, sans-serif",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {current.title}
            </h2>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
              {current.sub}
            </div>
          </div>
        </div>

        {selected && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#64748b" }}>Viewing:</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#0d9488",
                background: "rgba(13,148,136,0.08)",
                padding: "3px 10px",
                borderRadius: 6,
                border: "1px solid rgba(13,148,136,0.2)",
              }}
            >
              {selected.innovation_name} — {selected.country}
            </span>
            <button
              onClick={() => setSelected(null)}
              style={{
                background: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                borderRadius: 6,
                color: "#f43f5e",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* Main content — two columns */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Left: Visualization area (~70%) */}
        <div
          style={{
            flex: "0 0 70%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {activeTab === "signal" && (
            <SignalNetworkFull
              innovation={selected}
              hoveredDomainId={hoveredDomainId}
              onHoverDomain={setHoveredDomainId}
            />
          )}
          {activeTab === "chain" && (
            <SignalNetworkChain
              innovation={selected}
              hoveredDomainId={hoveredDomainId}
              onHoverDomain={setHoveredDomainId}
            />
          )}
          {activeTab === "summary" && (
            <NetworkCounts innovation={selected} />
          )}
        </div>

        {/* Right: Control panel (~30%) */}
        <div
          style={{
            flex: "0 0 30%",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <SidePanel
            selected={selected}
            onSelect={setSelected}
            hoveredDomainId={hoveredDomainId}
            onHoverDomain={setHoveredDomainId}
          />
        </div>
      </div>
    </div>
  );
}
