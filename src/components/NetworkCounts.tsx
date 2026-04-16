import { useMemo } from "react";
import type { Innovation } from "@/lib/data";
import { NETWORK_DOMAINS, generateNetworkScores } from "@/lib/networkData";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_INDICATORS = NETWORK_DOMAINS.reduce(
  (a, d) => a + d.themes.reduce((b, t) => b + t.indicators.length, 0),
  0
);
const TOTAL_THEMES = NETWORK_DOMAINS.reduce((a, d) => a + d.themes.length, 0);
const TOTAL_DOMAINS = NETWORK_DOMAINS.length;
const TOTAL_DIMENSIONS = 5;
const TOTAL_CENTER = 1;

// ─── Sub-helpers ──────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 7) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#f43f5e";
}

function pct(active: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((active / total) * 100);
}

// ─── Flow Level Card ──────────────────────────────────────────────────────────

interface FlowLevelProps {
  count: number;
  label: string;
  sub: string;
  activeCount: number | null;
  totalForRatio: number;
  color: string;
  isLast?: boolean;
}

function FlowLevel({ count, label, sub, activeCount, totalForRatio, color, isLast }: FlowLevelProps) {
  const activePct = activeCount !== null ? pct(activeCount, totalForRatio) : null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, flex: 1 }}>
      {/* Card */}
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minWidth: 0,
        }}
      >
        {/* Count + label */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: activeCount !== null ? color : "#cbd5e1",
              fontFamily: "Outfit, sans-serif",
              lineHeight: 1,
              transition: "color 0.4s ease",
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#475569",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {label}
          </span>
        </div>

        {/* Sub label */}
        <div style={{ fontSize: 10, color: "#64748b", fontFamily: "Inter, sans-serif" }}>
          {sub}
        </div>

        {/* Active ratio */}
        {activeCount !== null ? (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 10, color: "#64748b", fontWeight: 500 }}>
                {activeCount}/{totalForRatio} active
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: activePct !== null && activePct >= 60 ? "#10b981" : activePct !== null && activePct >= 40 ? "#f59e0b" : "#f43f5e",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {activePct}%
              </span>
            </div>
            {/* Mini bar */}
            <div
              style={{
                width: "100%",
                height: 5,
                borderRadius: 3,
                background: "#e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${activePct}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: color,
                  transition: "width 0.6s ease",
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>
            Select an innovation
          </div>
        )}
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div
          style={{
            flexShrink: 0,
            width: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M12 6l4 4-4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Domain Row ───────────────────────────────────────────────────────────────

interface DomainRowData {
  id: string;
  num: number;
  label: string;
  color: string;
  totalThemes: number;
  totalIndicators: number;
  domainScore: number | null;
  activeThemes: number | null;
  activeIndicators: number | null;
}

function DomainRow({ row }: { row: DomainRowData }) {
  const themeActivePct = row.activeThemes !== null ? pct(row.activeThemes, row.totalThemes) : null;
  const indActivePct = row.activeIndicators !== null ? pct(row.activeIndicators, row.totalIndicators) : null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "22px 1fr 80px 80px 110px 110px 90px",
        gap: 0,
        alignItems: "center",
        padding: "7px 14px",
        borderBottom: "1px solid #f1f5f9",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#f8fafc")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
    >
      {/* Color dot */}
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: row.color,
          opacity: row.domainScore !== null && row.domainScore >= 5 ? 1 : 0.35,
        }}
      />

      {/* Domain label */}
      <span style={{ fontSize: 11, fontWeight: 600, color: "#334155", fontFamily: "Inter, sans-serif", paddingRight: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {row.num}. {row.label}
      </span>

      {/* Themes */}
      <span style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>
        {row.totalThemes}
      </span>

      {/* Active Themes */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: row.activeThemes !== null ? (themeActivePct !== null && themeActivePct >= 50 ? "#10b981" : "#f59e0b") : "#94a3b8",
          fontFamily: "Outfit, sans-serif",
          textAlign: "center",
        }}
      >
        {row.activeThemes !== null ? `${row.activeThemes}/${row.totalThemes}` : "—"}
      </span>

      {/* Indicators */}
      <span style={{ fontSize: 11, color: "#475569", textAlign: "center" }}>
        {row.totalIndicators}
      </span>

      {/* Active Indicators + mini bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: row.activeIndicators !== null ? (indActivePct !== null && indActivePct >= 50 ? "#10b981" : "#f59e0b") : "#94a3b8",
            fontFamily: "Outfit, sans-serif",
            minWidth: 36,
          }}
        >
          {row.activeIndicators !== null ? `${row.activeIndicators}/${row.totalIndicators}` : "—"}
        </span>
        {row.activeIndicators !== null && (
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#e2e8f0", overflow: "hidden", minWidth: 32 }}>
            <div
              style={{
                width: `${indActivePct}%`,
                height: "100%",
                borderRadius: 2,
                background: row.color,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        )}
      </div>

      {/* Domain Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        {row.domainScore !== null ? (
          <>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "#e2e8f0", overflow: "hidden" }}>
              <div
                style={{
                  width: `${(row.domainScore / 10) * 100}%`,
                  height: "100%",
                  borderRadius: 2,
                  background: scoreColor(row.domainScore),
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: scoreColor(row.domainScore),
                fontFamily: "Outfit, sans-serif",
                minWidth: 24,
              }}
            >
              {row.domainScore.toFixed(1)}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 11, color: "#94a3b8" }}>—</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export interface NetworkCountsProps {
  innovation: Innovation | null;
}

export function NetworkCounts({ innovation }: NetworkCountsProps) {
  const scores = useMemo(() => {
    if (!innovation) return null;
    return generateNetworkScores(innovation);
  }, [innovation]);

  // Aggregate active counts
  const counts = useMemo(() => {
    if (!scores) return null;

    const activeIndicators = Object.values(scores.indicators).filter((s) => s >= 5).length;
    const activeThemes = Object.values(scores.themes).filter((s) => s >= 5).length;
    const activeDomains = Object.values(scores.domains).filter((s) => s >= 5).length;

    // Dimensions: count active using inverse logic for demand_gaps
    const dimScores = [
      innovation!.geography_priority_score,
      innovation!.demand_signals_score,
      innovation!.innovation_supply_score,
      // demand_gaps is inverse: active when low
      10 - innovation!.demand_gaps_score,
      innovation!.investment_feasibility_score,
    ];
    const activeDimensions = dimScores.filter((s) => s >= 5).length;

    const centerActive = innovation!.scaling_opportunity_score >= 7 ? 1 : 0;

    return {
      activeIndicators,
      activeThemes,
      activeDomains,
      activeDimensions,
      centerActive,
    };
  }, [scores, innovation]);

  // Per-domain breakdown
  const domainRows: DomainRowData[] = useMemo(() => {
    return NETWORK_DOMAINS.map((domain) => {
      const totalDomainThemes = domain.themes.length;
      const totalDomainIndicators = domain.themes.reduce((a, t) => a + t.indicators.length, 0);
      const domainScore = scores ? scores.domains[domain.id] : null;

      const activeThemes = scores
        ? domain.themes.filter((t) => scores.themes[t.id] >= 5).length
        : null;

      const activeIndicators = scores
        ? domain.themes.reduce(
            (a, t) => a + t.indicators.filter((i) => scores.indicators[i.id] >= 5).length,
            0
          )
        : null;

      return {
        id: domain.id,
        num: domain.num,
        label: domain.label,
        color: domain.color,
        totalThemes: totalDomainThemes,
        totalIndicators: totalDomainIndicators,
        domainScore,
        activeThemes,
        activeIndicators,
      };
    });
  }, [scores]);

  const overallActiveIndicators = counts?.activeIndicators ?? null;
  const overallActiveThemes = counts?.activeThemes ?? null;
  const overallActiveDomains = counts?.activeDomains ?? null;
  const overallActiveDims = counts?.activeDimensions ?? null;
  const centerActive = counts?.centerActive ?? null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#f8fafc",
        overflow: "auto",
        gap: 0,
      }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          padding: "16px 20px 12px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
          Network Summary
        </div>
        <div style={{ fontSize: 10, color: "#64748b" }}>
          Counts and activation rates across the full 5-layer hierarchy
        </div>
      </div>

      {/* ── Flow strip ── */}
      <div
        style={{
          flexShrink: 0,
          padding: "16px 20px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
          <FlowLevel
            count={TOTAL_INDICATORS}
            label="Indicators"
            sub="Evidence Points"
            activeCount={overallActiveIndicators}
            totalForRatio={TOTAL_INDICATORS}
            color="#64748b"
          />
          <FlowLevel
            count={TOTAL_THEMES}
            label="Themes"
            sub="Diagnostic Cats."
            activeCount={overallActiveThemes}
            totalForRatio={TOTAL_THEMES}
            color="#6366f1"
          />
          <FlowLevel
            count={TOTAL_DOMAINS}
            label="Domains"
            sub="Data Signal Sources"
            activeCount={overallActiveDomains}
            totalForRatio={TOTAL_DOMAINS}
            color="#0d9488"
          />
          <FlowLevel
            count={TOTAL_DIMENSIONS}
            label="Dimensions"
            sub="Demand Signaling"
            activeCount={overallActiveDims}
            totalForRatio={TOTAL_DIMENSIONS}
            color="#8b5cf6"
          />
          <FlowLevel
            count={TOTAL_CENTER}
            label="Demand Intel."
            sub="Scaling Outcome"
            activeCount={centerActive}
            totalForRatio={TOTAL_CENTER}
            color="#5eead4"
            isLast
          />
        </div>
      </div>

      {/* ── Summary stat row ── */}
      {innovation && counts && (
        <div
          style={{
            flexShrink: 0,
            padding: "10px 20px",
            background: "#f0f9ff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span style={{ fontSize: 10, color: "#64748b" }}>
            Viewing: <strong style={{ color: "#0d9488" }}>{innovation.innovation_name}</strong> — {innovation.country}
          </span>
          <span style={{ fontSize: 10, color: "#cbd5e1" }}>|</span>
          <span style={{ fontSize: 10, color: "#64748b" }}>
            Overall activation:{" "}
            <strong style={{ color: "#0f172a", fontFamily: "Outfit, sans-serif" }}>
              {pct(counts.activeIndicators, TOTAL_INDICATORS)}%
            </strong>{" "}
            of indicators
          </span>
          <span style={{ fontSize: 10, color: "#cbd5e1" }}>|</span>
          <span style={{ fontSize: 10, color: "#64748b" }}>
            Scaling score:{" "}
            <strong style={{ color: scoreColor(innovation.scaling_opportunity_score), fontFamily: "Outfit, sans-serif" }}>
              {innovation.scaling_opportunity_score.toFixed(1)}/10
            </strong>
          </span>
          <span style={{ fontSize: 10, color: "#cbd5e1" }}>|</span>
          <span style={{ fontSize: 10, color: "#64748b" }}>
            Demand Intel. node:{" "}
            <strong
              style={{
                color: counts.centerActive ? "#10b981" : "#f43f5e",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {counts.centerActive ? "ACTIVE" : "INACTIVE"}
            </strong>{" "}
            <span style={{ color: "#94a3b8" }}>
              (threshold: score &ge; 7)
            </span>
          </span>
        </div>
      )}

      {/* ── Per-domain breakdown table ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "22px 1fr 80px 80px 110px 110px 90px",
            gap: 0,
            padding: "8px 14px",
            background: "#f8fafc",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          {[
            { label: "", align: "center" },
            { label: "Domain", align: "left" },
            { label: "Themes", align: "center" },
            { label: "Active Themes", align: "center" },
            { label: "Indicators", align: "center" },
            { label: "Active Indicators", align: "center" },
            { label: "Domain Score", align: "center" },
          ].map((col, i) => (
            <span
              key={i}
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "#0d9488",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                textAlign: col.align as "center" | "left",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {col.label}
            </span>
          ))}
        </div>

        {/* Domain rows */}
        {domainRows.map((row) => (
          <DomainRow key={row.id} row={row} />
        ))}

        {/* Total row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "22px 1fr 80px 80px 110px 110px 90px",
            gap: 0,
            padding: "8px 14px",
            background: "#f0f9ff",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <span />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", fontFamily: "Inter, sans-serif" }}>
            Total
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", textAlign: "center", fontFamily: "Outfit, sans-serif" }}>
            {TOTAL_THEMES}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: overallActiveThemes !== null ? "#10b981" : "#94a3b8",
              fontFamily: "Outfit, sans-serif",
              textAlign: "center",
            }}
          >
            {overallActiveThemes !== null ? `${overallActiveThemes}/${TOTAL_THEMES}` : "—"}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#475569", textAlign: "center", fontFamily: "Outfit, sans-serif" }}>
            {TOTAL_INDICATORS}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: overallActiveIndicators !== null ? "#10b981" : "#94a3b8",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {overallActiveIndicators !== null ? `${overallActiveIndicators}/${TOTAL_INDICATORS}` : "—"}
          </span>
          <span style={{ fontSize: 11, color: "#94a3b8" }} />
        </div>

        {/* Empty state */}
        {!innovation && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Select an innovation in the panel to see active counts per domain.
          </div>
        )}
      </div>
    </div>
  );
}
