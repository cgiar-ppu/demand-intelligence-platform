import { useMemo } from "react";
import type { Innovation } from "@/lib/data";

// ─── Domain & Dimension Config ─────────────────────────────────────────────────

interface DomainConfig {
  id: number;
  key: keyof Innovation;
  label: string;
  shortLabel: string;
  color: string;
  angleOffset: number; // degrees, clockwise from top
}

interface DimensionConfig {
  label: string;
  shortLabel: string;
  key: keyof Innovation;
  // which domain indices (0-based) this dimension connects to
  domainIndices: number[];
}

// 7 domains arranged around the circle
// We spread them evenly: 360/7 ≈ 51.4° apart, starting from top (-90° = 12 o'clock)
const DOMAIN_CONFIGS: DomainConfig[] = [
  {
    id: 1,
    key: "domain_scaling_context",
    label: "Scaling Context",
    shortLabel: "Scaling\nContext",
    color: "#0d9488",
    angleOffset: 0,
  },
  {
    id: 2,
    key: "domain_sector",
    label: "Sector",
    shortLabel: "Sector",
    color: "#f59e0b",
    angleOffset: 51.4,
  },
  {
    id: 3,
    key: "domain_stakeholders",
    label: "Stakeholders",
    shortLabel: "Stake-\nholders",
    color: "#8b5cf6",
    angleOffset: 102.9,
  },
  {
    id: 4,
    key: "domain_enabling_env",
    label: "Enabling Environment",
    shortLabel: "Enabling\nEnv.",
    color: "#6366f1",
    angleOffset: 154.3,
  },
  {
    id: 5,
    key: "domain_resource_investment",
    label: "Resource & Investment",
    shortLabel: "Resource &\nInvest.",
    color: "#0ea5e9",
    angleOffset: 205.7,
  },
  {
    id: 6,
    key: "domain_market_intelligence",
    label: "Market Intelligence",
    shortLabel: "Market\nIntel.",
    color: "#ec4899",
    angleOffset: 257.1,
  },
  {
    id: 7,
    key: "domain_innovation_portfolio",
    label: "Innovation Portfolio",
    shortLabel: "Innovation\nPortfolio",
    color: "#14b8a6",
    angleOffset: 308.6,
  },
];

// 5 dimensions, each placed between center and the petals they connect to
// We compute their position as the angular midpoint of their connected domains
const DIMENSION_CONFIGS: DimensionConfig[] = [
  {
    label: "Geography & Priority",
    shortLabel: "Geo &\nPriority",
    key: "geography_priority_score",
    domainIndices: [0], // Scaling Context
  },
  {
    label: "Demand Signals",
    shortLabel: "Demand\nSignals",
    key: "demand_signals_score",
    domainIndices: [1, 2], // Sector, Stakeholders
  },
  {
    label: "Innovation Supply",
    shortLabel: "Innov.\nSupply",
    key: "innovation_supply_score",
    domainIndices: [6], // Innovation Portfolio
  },
  {
    label: "Demand Gaps",
    shortLabel: "Demand\nGaps",
    key: "demand_gaps_score",
    domainIndices: [2, 5], // Stakeholders, Market Intelligence (demand_gaps is INVERSE)
  },
  {
    label: "Investment Feasibility",
    shortLabel: "Invest.\nFeasib.",
    key: "investment_feasibility_score",
    domainIndices: [3, 4, 5], // Enabling Env, Resource & Investment, Market Intelligence
  },
];

// ─── Geometry Helpers ──────────────────────────────────────────────────────────

const CX = 250; // center X of 500x500 viewBox
const CY = 250; // center Y
const OUTER_R = 185; // radius to petal centers
const INNER_R = 108; // radius to dimension node centers
const PETAL_RX = 44; // petal ellipse horizontal radius
const PETAL_RY = 30; // petal ellipse vertical radius
const CENTER_R = 52; // center circle radius
const DIM_NODE_R = 16; // dimension node circle radius

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Angle in degrees from top (0=up, clockwise)
function getAngle(angleOffset: number): number {
  return -90 + angleOffset;
}

function polarToXY(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = toRad(angleDeg);
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

// Compute the midpoint angle for a set of domain indices
function midAngle(indices: number[]): number {
  const angles = indices.map((i) => getAngle(DOMAIN_CONFIGS[i].angleOffset));
  // Handle wrap-around: if spread > 180°, adjust
  let minA = Math.min(...angles);
  let maxA = Math.max(...angles);
  if (maxA - minA > 180) {
    // Wrap: add 360 to angles < 0
    const adjusted = angles.map((a) => (a < 0 ? a + 360 : a));
    const mid = adjusted.reduce((a, b) => a + b, 0) / adjusted.length;
    return mid > 180 ? mid - 360 : mid;
  }
  return (minA + maxA) / 2;
}

// Generate a rounded petal path as an ellipse rotated to the given angle
function petalPath(
  cx: number,
  cy: number,
  angleDeg: number,
  rx: number,
  ry: number
): string {
  // We draw an ellipse centered at cx,cy, rotated so its major axis
  // points outward from center (along angleDeg)
  // SVG ellipse doesn't support rotation natively, so we use transform
  // Instead return the center + rotation for use with <ellipse transform>
  return `rotate(${angleDeg + 90}, ${cx}, ${cy})`;
}

// Cubic bezier path from center to a point, curving gently
function curvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature: number = 0.2
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Control points offset perpendicular
  const dx = x2 - x1;
  const dy = y2 - y1;
  const cx1 = x1 + dx * 0.33 - dy * curvature;
  const cy1 = y1 + dy * 0.33 + dx * curvature;
  const cx2 = x1 + dx * 0.67 - dy * curvature;
  const cy2 = y1 + dy * 0.67 + dx * curvature;
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface PetalProps {
  domain: DomainConfig;
  score: number | null;
  active: boolean;
  noSelection: boolean;
}

function Petal({ domain, score, active, noSelection }: PetalProps) {
  const angleDeg = getAngle(domain.angleOffset);
  const pos = polarToXY(angleDeg, OUTER_R);

  const opacity = noSelection ? 0.55 : active ? 1.0 : 0.22;
  const filter = active ? `url(#glow-${domain.id})` : "url(#grayscale)";
  const scaleStr = active ? "scale(1.06)" : "scale(1)";

  // Text lines from shortLabel
  const lines = domain.shortLabel.split("\n");

  // Petal rotation aligns ellipse major axis toward center
  const rotAngle = angleDeg + 90;

  return (
    <g
      style={{
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity,
        transformOrigin: `${pos.x}px ${pos.y}px`,
        transform: active ? "scale(1.06)" : "scale(1)",
      }}
    >
      {/* Petal glow filter layer */}
      {active && (
        <ellipse
          cx={pos.x}
          cy={pos.y}
          rx={PETAL_RX + 6}
          ry={PETAL_RY + 4}
          fill={domain.color}
          opacity={0.2}
          transform={`rotate(${rotAngle}, ${pos.x}, ${pos.y})`}
          style={{ filter: `blur(6px)` }}
        />
      )}

      {/* Petal body */}
      <ellipse
        cx={pos.x}
        cy={pos.y}
        rx={PETAL_RX}
        ry={PETAL_RY}
        fill={noSelection ? domain.color : active ? domain.color : "#94a3b8"}
        transform={`rotate(${rotAngle}, ${pos.x}, ${pos.y})`}
        style={{
          transition: "fill 0.4s ease",
          filter: active
            ? `drop-shadow(0 0 8px ${domain.color}aa)`
            : undefined,
        }}
      />

      {/* Petal border ring */}
      <ellipse
        cx={pos.x}
        cy={pos.y}
        rx={PETAL_RX}
        ry={PETAL_RY}
        fill="none"
        stroke={noSelection ? domain.color : active ? domain.color : "#64748b"}
        strokeWidth={active ? 1.5 : 0.8}
        strokeOpacity={active ? 0.8 : 0.3}
        transform={`rotate(${rotAngle}, ${pos.x}, ${pos.y})`}
        style={{ transition: "stroke 0.4s ease" }}
      />

      {/* Domain number badge */}
      <circle
        cx={pos.x}
        cy={pos.y - PETAL_RY + 10}
        r={9}
        fill={
          noSelection
            ? domain.color + "cc"
            : active
            ? domain.color + "dd"
            : "#64748b88"
        }
        style={{ transition: "fill 0.4s ease" }}
      />
      <text
        x={pos.x}
        y={pos.y - PETAL_RY + 10}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="7"
        fontWeight="800"
        fill="white"
        fontFamily="Outfit, sans-serif"
      >
        {domain.id}
      </text>

      {/* Score display (only when innovation selected) */}
      {score !== null && (
        <text
          x={pos.x}
          y={pos.y + 6}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight="800"
          fill="white"
          fontFamily="Outfit, sans-serif"
          fillOpacity={active ? 1 : 0.5}
          style={{ transition: "fill-opacity 0.4s ease" }}
        >
          {score.toFixed(1)}
        </text>
      )}

      {/* Label text — positioned outside petal */}
      {(() => {
        // Place label further out from the petal
        const labelPos = polarToXY(angleDeg, OUTER_R + PETAL_RY + 18);
        return (
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8.5"
            fontWeight="600"
            fill={
              noSelection
                ? domain.color
                : active
                ? domain.color
                : "#94a3b8"
            }
            fontFamily="Inter, sans-serif"
            style={{ transition: "fill 0.4s ease" }}
          >
            {lines.map((line, i) => (
              <tspan
                key={i}
                x={labelPos.x}
                dy={i === 0 ? `-${(lines.length - 1) * 5.5}` : "11"}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })()}
    </g>
  );
}

interface DimensionNodeProps {
  dimension: DimensionConfig;
  score: number | null;
  active: boolean;
  noSelection: boolean;
  isGapDimension: boolean;
}

function DimensionNode({
  dimension,
  score,
  active,
  noSelection,
  isGapDimension,
}: DimensionNodeProps) {
  const angleDeg = midAngle(dimension.domainIndices);
  const pos = polarToXY(angleDeg, INNER_R);

  // For demand_gaps, active means LOW score (manageable)
  const displayScore =
    score !== null
      ? isGapDimension
        ? (10 - score).toFixed(1)
        : score.toFixed(1)
      : null;

  const nodeColor = active ? "#0f766e" : noSelection ? "#0f766e" : "#94a3b8";
  const opacity = noSelection ? 0.65 : active ? 1 : 0.3;
  const lines = dimension.shortLabel.split("\n");

  return (
    <g
      style={{
        transition: "opacity 0.4s ease",
        opacity,
      }}
    >
      {/* Glow ring for active */}
      {active && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={DIM_NODE_R + 5}
          fill="#0d9488"
          opacity={0.1}
          style={{ filter: "blur(3px)" }}
        />
      )}

      {/* Node circle */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={DIM_NODE_R}
        fill={active ? "rgba(13,148,136,0.12)" : noSelection ? "rgba(13,148,136,0.07)" : "#f1f5f9"}
        stroke={active ? "#0d9488" : noSelection ? "#0d9488" + "66" : "#cbd5e1"}
        strokeWidth={active ? 1.5 : 0.8}
        style={{ transition: "fill 0.4s ease, stroke 0.4s ease" }}
      />

      {/* Score or label inside node */}
      {displayScore !== null ? (
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="800"
          fill={active ? "#0d9488" : "#64748b"}
          fontFamily="Outfit, sans-serif"
          style={{ transition: "fill 0.4s ease" }}
        >
          {displayScore}
        </text>
      ) : (
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="6"
          fontWeight="700"
          fill={active ? "#0d9488" : "#94a3b8"}
          fontFamily="Inter, sans-serif"
        >
          ●
        </text>
      )}

      {/* Label near node — offset slightly outward from center */}
      {(() => {
        // Nudge label slightly between node and petal direction
        const labelAngle = angleDeg;
        const labelDist = INNER_R + DIM_NODE_R + 14;
        const labelPos = polarToXY(labelAngle, labelDist);
        // Avoid overlapping petal labels by only showing short label
        return (
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="7"
            fontWeight="600"
            fill={active ? "#0d9488" : noSelection ? "#0d9488" + "99" : "#64748b"}
            fontFamily="Inter, sans-serif"
            style={{ transition: "fill 0.4s ease" }}
          >
            {lines.map((line, i) => (
              <tspan
                key={i}
                x={labelPos.x}
                dy={i === 0 ? `-${(lines.length - 1) * 4.5}` : "9"}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })()}
    </g>
  );
}

// ─── SVG Defs (filters) ────────────────────────────────────────────────────────

function SvgDefs() {
  return (
    <defs>
      {/* Per-domain glow filters */}
      {DOMAIN_CONFIGS.map((d) => (
        <filter key={d.id} id={`glow-${d.id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}
      {/* Grayscale filter for inactive petals */}
      <filter id="grayscale">
        <feColorMatrix type="saturate" values="0" />
      </filter>
      {/* Center glow */}
      <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f0fdf4" />
        <stop offset="100%" stopColor="#dcfce7" />
      </radialGradient>
      <radialGradient id="centerGradActive" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ccfbf1" />
        <stop offset="100%" stopColor="#99f6e4" />
      </radialGradient>
      {/* Petal pulse animation */}
      <style>{`
        @keyframes petalPulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.32; }
        }
        .petal-glow-active {
          animation: petalPulse 2.4s ease-in-out infinite;
        }
        @keyframes centerPulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1.0; }
        }
        .center-active {
          animation: centerPulse 2s ease-in-out infinite;
        }
      `}</style>
    </defs>
  );
}

// ─── Connection lines ──────────────────────────────────────────────────────────

interface ConnectionsProps {
  innovation: Innovation | null;
}

function Connections({ innovation }: ConnectionsProps) {
  // Draw lines from center → dimension nodes → domain petals
  return (
    <g opacity={0.18}>
      {DIMENSION_CONFIGS.map((dim, di) => {
        const dimAngleDeg = midAngle(dim.domainIndices);
        const dimPos = polarToXY(dimAngleDeg, INNER_R);

        // Center to dimension
        const centerEdge = polarToXY(dimAngleDeg, CENTER_R + 2);

        return (
          <g key={di}>
            {/* Center → dimension node */}
            <path
              d={curvedPath(centerEdge.x, centerEdge.y, dimPos.x, dimPos.y, 0)}
              fill="none"
              stroke="#2dd4bf"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />

            {/* Dimension node → each connected petal */}
            {dim.domainIndices.map((pi) => {
              const domain = DOMAIN_CONFIGS[pi];
              const domainAngleDeg = getAngle(domain.angleOffset);
              const petalEdge = polarToXY(domainAngleDeg, OUTER_R - PETAL_RY - 2);
              const dimEdge = polarToXY(dimAngleDeg, INNER_R + DIM_NODE_R + 1);

              return (
                <path
                  key={pi}
                  d={curvedPath(dimEdge.x, dimEdge.y, petalEdge.x, petalEdge.y, 0.05)}
                  fill="none"
                  stroke={domain.color}
                  strokeWidth={0.7}
                  strokeDasharray="2 4"
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface FrameworkDiagramProps {
  innovation: Innovation | null;
}

export function FrameworkDiagram({ innovation }: FrameworkDiagramProps) {
  const noSelection = innovation === null;

  // Compute active states
  const domainActive = useMemo(() => {
    if (!innovation) return DOMAIN_CONFIGS.map(() => false);
    return DOMAIN_CONFIGS.map((d) => {
      const score = innovation[d.key] as number;
      return score >= 5;
    });
  }, [innovation]);

  const dimActive = useMemo(() => {
    if (!innovation) return DIMENSION_CONFIGS.map(() => false);
    return DIMENSION_CONFIGS.map((dim, i) => {
      const score = innovation[dim.key] as number;
      // demand_gaps is inverse: active if score < 5 (manageable)
      if (dim.key === "demand_gaps_score") return score < 5;
      return score >= 5;
    });
  }, [innovation]);

  const centerActive =
    innovation !== null && innovation.scaling_opportunity_score >= 7;

  return (
    <svg
      viewBox="0 0 500 500"
      width="100%"
      height="100%"
      style={{ maxWidth: 480, maxHeight: 480, overflow: "visible" }}
      aria-label="7→5→1 Demand Signaling Framework Diagram"
    >
      <SvgDefs />

      {/* Background subtle circle rings */}
      <circle cx={CX} cy={CY} r={OUTER_R + 30} fill="none" stroke="#cbd5e1" strokeWidth={0.5} opacity={0.5} />
      <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="#cbd5e1" strokeWidth={0.4} opacity={0.4} />
      <circle cx={CX} cy={CY} r={INNER_R + DIM_NODE_R + 4} fill="none" stroke="#cbd5e1" strokeWidth={0.4} opacity={0.3} />

      {/* Connection lines (behind petals) */}
      <Connections innovation={innovation} />

      {/* Domain petals */}
      {DOMAIN_CONFIGS.map((domain, i) => (
        <Petal
          key={domain.id}
          domain={domain}
          score={innovation ? (innovation[domain.key] as number) : null}
          active={domainActive[i]}
          noSelection={noSelection}
        />
      ))}

      {/* Dimension nodes */}
      {DIMENSION_CONFIGS.map((dim, i) => (
        <DimensionNode
          key={i}
          dimension={dim}
          score={innovation ? (innovation[dim.key] as number) : null}
          active={dimActive[i]}
          noSelection={noSelection}
          isGapDimension={dim.key === "demand_gaps_score"}
        />
      ))}

      {/* Center circle */}
      <circle
        cx={CX}
        cy={CY}
        r={CENTER_R + 6}
        fill={centerActive ? "#0d9488" : "#a7f3d0"}
        opacity={0.12}
        style={{
          filter: centerActive ? "blur(7px)" : undefined,
          transition: "opacity 0.5s ease",
        }}
        className={centerActive ? "center-active" : undefined}
      />
      <circle
        cx={CX}
        cy={CY}
        r={CENTER_R}
        fill={centerActive ? "url(#centerGradActive)" : "url(#centerGrad)"}
        stroke={centerActive ? "#0d9488" : "#a7f3d0"}
        strokeWidth={centerActive ? 2 : 1}
        style={{ transition: "fill 0.5s ease, stroke 0.5s ease" }}
      />

      {/* Center text */}
      {noSelection ? (
        <>
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8.5"
            fontWeight="700"
            fill="#0d9488"
            fontFamily="Inter, sans-serif"
          >
            Select an
          </text>
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8.5"
            fontWeight="700"
            fill="#0d9488"
            fontFamily="Inter, sans-serif"
          >
            innovation
          </text>
        </>
      ) : (
        <>
          <text
            x={CX}
            y={CY - 14}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="7"
            fontWeight="600"
            fill={centerActive ? "#0d9488" : "#64748b"}
            fontFamily="Inter, sans-serif"
          >
            Scaling Opp.
          </text>
          <text
            x={CX}
            y={CY + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="18"
            fontWeight="800"
            fill={centerActive ? "#0f766e" : "#334155"}
            fontFamily="Outfit, sans-serif"
            style={{ transition: "fill 0.4s ease" }}
          >
            {innovation.scaling_opportunity_score.toFixed(1)}
          </text>
          <text
            x={CX}
            y={CY + 17}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="6.5"
            fontWeight="600"
            fill={centerActive ? "#0d9488" : "#94a3b8"}
            fontFamily="Inter, sans-serif"
          >
            {centerActive ? "Effective Demand" : "/ 10"}
          </text>
        </>
      )}

      {/* Center active badge */}
      {centerActive && (
        <circle
          cx={CX + CENTER_R - 8}
          cy={CY - CENTER_R + 8}
          r={7}
          fill="#10b981"
          stroke="#ffffff"
          strokeWidth={1}
        />
      )}
      {centerActive && (
        <text
          x={CX + CENTER_R - 8}
          y={CY - CENTER_R + 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="7"
          fontWeight="900"
          fill="white"
          fontFamily="Inter, sans-serif"
        >
          ✓
        </text>
      )}
    </svg>
  );
}
