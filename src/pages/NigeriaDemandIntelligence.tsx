import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  DIMENSION_SCORES,
  KEY_STATS,
  TOP_SIGNALS,
  TOP_GAPS,
  INTERSECTIONS,
  TRACING_EXAMPLES,
  DATA_SOURCES,
  CLUSTER_COLORS,
  GAP_TYPE_COLORS,
  UNIQUE_DOMAINS,
  INSPECTOR_SOURCES,
  type DemandSignal,
  type DemandGap,
  type RawSource,
} from "@/lib/nigeriaData";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

function strengthColor(score: number): string {
  if (score >= 8) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#ef4444";
}

function severityColor(score: number): string {
  if (score >= 8) return "#ef4444";
  if (score >= 5) return "#f97316";
  return "#eab308";
}

function severityLabel(score: number): string {
  if (score >= 8) return "Critical";
  if (score >= 5) return "High";
  return "Moderate";
}

function strengthLabel(score: number): string {
  if (score >= 8) return "Very Strong";
  if (score >= 5) return "Strong";
  return "Emerging";
}

// -- Sub-components --

function StatCard({
  label,
  value,
  accent,
  delay = 0,
}: {
  label: string;
  value: string;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="glass-card !p-4 flex flex-col items-center text-center"
    >
      <span className="text-3xl font-display font-bold" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
    </motion.div>
  );
}

function SectionHeader({
  badge,
  badgeColor,
  title,
  subtitle,
}: {
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: badgeColor }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: badgeColor }}
        >
          {badge}
        </span>
      </div>
      <h3 className="text-xl font-display tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  );
}

function RawSourcesPanel({ sources, label }: { sources: RawSource[]; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden"
    >
      <div className="px-4 py-3 bg-primary/5 border-t" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {label}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {sources.length} source file{sources.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="space-y-2.5">
          {sources.map((src, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-primary/60 text-xs mt-0.5 shrink-0">&#128270;</span>
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-foreground/90 break-all">
                  {src.file}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  <span className="font-semibold">Location:</span> {src.location}
                  {src.originalId && (
                    <span className="ml-2 font-mono opacity-60">({src.originalId})</span>
                  )}
                </p>
                <p className="text-[11px] italic text-muted-foreground/80 mt-0.5 pl-2 border-l-2 border-primary/20 leading-relaxed">
                  &ldquo;{src.evidenceQuote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EyeButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-all ${
        isOpen
          ? "bg-primary/20 text-primary opacity-100"
          : "opacity-40 hover:opacity-100 hover:bg-primary/10 text-muted-foreground"
      }`}
      title={isOpen ? "Hide raw sources" : "Show raw sources"}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  );
}

// -- Main Component --

const NigeriaDemandIntelligence = () => {
  const [signalDomainFilter, setSignalDomainFilter] = useState("all");
  const [gapClusterFilter, setGapClusterFilter] = useState("all");
  const [signalSort, setSignalSort] = useState<"strength" | "sources">("strength");
  const [gapSort, setGapSort] = useState<"severity" | "type">("severity");
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);
  const [expandedGapId, setExpandedGapId] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  const filteredSignals = useMemo(() => {
    let list = [...TOP_SIGNALS];
    if (signalDomainFilter !== "all") {
      list = list.filter((s) => s.domain === signalDomainFilter);
    }
    if (signalSort === "strength") {
      list.sort((a, b) => b.strength - a.strength);
    } else {
      list.sort((a, b) => b.sourceCount - a.sourceCount);
    }
    return list;
  }, [signalDomainFilter, signalSort]);

  const gapClusters = useMemo(
    () => [...new Set(TOP_GAPS.map((g) => g.cluster))].sort(),
    []
  );

  const filteredGaps = useMemo(() => {
    let list = [...TOP_GAPS];
    if (gapClusterFilter !== "all") {
      list = list.filter((g) => g.cluster === gapClusterFilter);
    }
    if (gapSort === "severity") {
      list.sort((a, b) => b.severity - a.severity);
    } else {
      list.sort((a, b) => a.gapType.localeCompare(b.gapType));
    }
    return list;
  }, [gapClusterFilter, gapSort]);

  // Data sources bar chart
  const sourceChartData = DATA_SOURCES.map((ds) => ({
    name: ds.shortName,
    Signals: ds.signals,
    Gaps: ds.gaps,
  }));

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 space-y-10">
        {/* ===== SECTION 1: HERO ===== */}
        <section>
          <motion.div {...fadeUp}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                Country Deep Dive
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display tracking-tight mb-1">
              Nigeria Demand Intelligence
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Real signals from 7 data sources, 513 households, 34 policies, 57
              programs -- consolidated into 38 demand signals and 34 demand gaps
              through the 7&#x2192;5&#x2192;1 Demand Intelligence Framework.
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <StatCard
              label="Signals Extracted"
              value={String(KEY_STATS.signalsExtracted)}
              accent="#10b981"
              delay={0.05}
            />
            <StatCard
              label="Gaps Identified"
              value={String(KEY_STATS.gapsIdentified)}
              accent="#ef4444"
              delay={0.1}
            />
            <StatCard
              label="Strategic Intersections"
              value={String(KEY_STATS.strategicIntersections)}
              accent="#8b5cf6"
              delay={0.15}
            />
            <StatCard
              label="Data Sources Analyzed"
              value={String(KEY_STATS.dataSourcesAnalyzed)}
              accent="#0ea5e9"
              delay={0.2}
            />
          </div>

          {/* Pentagon Radar + Composite Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card !p-4 md:col-span-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-1 h-5 rounded-full"
                  style={{ background: "#0f766e" }}
                />
                <h3 className="text-sm font-display">
                  5-Dimension Pentagon -- Nigeria Aggregate
                </h3>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">
                Demand Gaps axis is inverted -- higher = fewer gaps = better
                alignment. Composite scaling opportunity: {KEY_STATS.compositeScore}
                /10
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={DIMENSION_SCORES}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <PolarRadiusAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 9 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#0f766e"
                    fill="#0f766e"
                    fillOpacity={0.2}
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: "#0f766e" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Dimension Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card !p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-1 h-5 rounded-full"
                    style={{ background: "#8b5cf6" }}
                  />
                  <h3 className="text-sm font-display">Dimension Breakdown</h3>
                </div>
                <div className="space-y-3">
                  {DIMENSION_SCORES.map((d) => (
                    <div key={d.axis}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-muted-foreground font-semibold">
                          {d.axis}
                        </span>
                        <span className="font-display font-bold">
                          {d.value}/10
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(d.value / 10) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor:
                              d.value >= 7
                                ? "#10b981"
                                : d.value >= 5
                                ? "#f59e0b"
                                : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                <div className="text-center">
                  <span className="text-3xl font-display font-bold text-primary">
                    {KEY_STATS.compositeScore}
                  </span>
                  <span className="text-xs text-muted-foreground">/10</span>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    Composite Scaling Opportunity
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 2: DEMAND-GAP INTERSECTIONS ===== */}
        <section>
          <SectionHeader
            badge="Strategic Findings"
            badgeColor="#8b5cf6"
            title="Demand-Gap Intersections"
            subtitle="Where strong demand signals meet severe gaps -- the most strategically actionable findings"
          />

          {/* Flagship Intersection */}
          {INTERSECTIONS.filter((i) => i.flagship).map((ix) => (
            <motion.div
              key={ix.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card !p-0 overflow-hidden mb-4 ring-1 ring-emerald-500/30"
            >
              <div className="px-5 py-3 bg-emerald-500/10 border-b" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    Flagship Finding
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {ix.id}
                  </span>
                </div>
                <h4 className="text-lg font-display mt-1">{ix.title}</h4>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">
                    Demand Evidence
                  </h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ix.demandSummary}
                  </p>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mt-3 mb-1">
                    Gap Evidence
                  </h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ix.narrative}
                  </p>
                </div>
                <div className="bg-muted/10 rounded-xl p-4">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                    Strategic Implication
                  </h5>
                  <p className="text-sm leading-relaxed">{ix.implication}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Other Intersections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INTERSECTIONS.filter((i) => !i.flagship).map((ix, idx) => (
              <motion.div
                key={ix.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="glass-card !p-0 overflow-hidden flex flex-col"
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
                >
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {ix.id}
                  </span>
                  <h4 className="text-sm font-display mt-0.5 leading-tight">
                    {ix.title}
                  </h4>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      {ix.narrative}
                    </p>
                  </div>
                  <div className="mt-2 pt-2 border-t" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                      Implication
                    </p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {ix.implication}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 3: TOP DEMAND SIGNALS ===== */}
        <section>
          <SectionHeader
            badge="Demand Signals"
            badgeColor="#10b981"
            title="Consolidated Demand Signals"
            subtitle={`${KEY_STATS.consolidatedSignals} signals consolidated from ${KEY_STATS.signalsExtracted} raw extractions across 7 data sources`}
          />

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Filter:
            </span>
            <button
              onClick={() => setSignalDomainFilter("all")}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                signalDomainFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              All Domains
            </button>
            {UNIQUE_DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setSignalDomainFilter(d)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                  signalDomainFilter === d
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {d}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Sort:</span>
              <button
                onClick={() => setSignalSort("strength")}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition ${
                  signalSort === "strength"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Strength
              </button>
              <button
                onClick={() => setSignalSort("sources")}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition ${
                  signalSort === "sources"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sources
              </button>
            </div>
          </div>

          {/* Signals Table */}
          <div className="glass-card !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr
                    className="border-b bg-muted/20"
                    style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
                  >
                    {["", "Signal", "Score", "Domain", "Cluster", "Sources", "Key Evidence", ""].map(
                      (h, i) => (
                        <th
                          key={`${h}-${i}`}
                          className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-3 font-bold tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredSignals.map((signal: DemandSignal) => {
                    const isExpanded = expandedSignalId === signal.id;
                    return (
                      <>
                        <tr
                          key={signal.id}
                          className="border-b hover:bg-primary/5 transition"
                          style={{ borderColor: "hsl(var(--glass-border) / 0.04)" }}
                        >
                          <td className="py-2.5 px-3">
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{
                                backgroundColor: strengthColor(signal.strength),
                              }}
                            />
                          </td>
                          <td className="py-2.5 px-3 font-semibold max-w-[280px]">
                            <span className="text-[10px] text-muted-foreground font-bold mr-1.5">
                              {signal.id}
                            </span>
                            {signal.title}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${strengthColor(signal.strength)}20`,
                                color: strengthColor(signal.strength),
                              }}
                            >
                              {signal.strength}
                              <span className="text-[9px] font-normal opacity-70">
                                {strengthLabel(signal.strength)}
                              </span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-md text-muted-foreground whitespace-nowrap">
                              {signal.domain}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                              style={{
                                backgroundColor: `${CLUSTER_COLORS[signal.cluster] || "#6b7280"}15`,
                                color: CLUSTER_COLORS[signal.cluster] || "#6b7280",
                              }}
                            >
                              {signal.cluster}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="text-xs font-bold">{signal.sourceCount}</span>
                          </td>
                          <td className="py-2.5 px-3 text-xs text-muted-foreground max-w-[260px] truncate">
                            {signal.evidence}
                          </td>
                          <td className="py-2.5 px-3">
                            <EyeButton
                              isOpen={isExpanded}
                              onClick={() => setExpandedSignalId(isExpanded ? null : signal.id)}
                            />
                          </td>
                        </tr>
                        <AnimatePresence>
                          {isExpanded && signal.rawSources.length > 0 && (
                            <tr key={`${signal.id}-sources`}>
                              <td colSpan={8} className="p-0">
                                <RawSourcesPanel sources={signal.rawSources} label="Source Files & Evidence" />
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: TOP DEMAND GAPS ===== */}
        <section>
          <SectionHeader
            badge="Demand Gaps"
            badgeColor="#ef4444"
            title="Consolidated Demand Gaps"
            subtitle={`${KEY_STATS.consolidatedGaps} gaps consolidated from ${KEY_STATS.gapsIdentified} raw extractions -- systemic barriers to innovation scaling`}
          />

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Filter:
            </span>
            <button
              onClick={() => setGapClusterFilter("all")}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                gapClusterFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              All Clusters
            </button>
            {gapClusters.map((c) => (
              <button
                key={c}
                onClick={() => setGapClusterFilter(c)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                  gapClusterFilter === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {c}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">Sort:</span>
              <button
                onClick={() => setGapSort("severity")}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition ${
                  gapSort === "severity"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Severity
              </button>
              <button
                onClick={() => setGapSort("type")}
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition ${
                  gapSort === "type"
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Type
              </button>
            </div>
          </div>

          {/* Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredGaps.map((gap: DemandGap, idx) => {
              const isGapExpanded = expandedGapId === gap.id;
              return (
                <motion.div
                  key={gap.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="glass-card !p-0 overflow-hidden flex flex-col"
                >
                  <div
                    className="px-4 py-2.5 border-b flex items-center justify-between"
                    style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: severityColor(gap.severity) }}
                      />
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {gap.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${GAP_TYPE_COLORS[gap.gapType] || "#6b7280"}20`,
                          color: GAP_TYPE_COLORS[gap.gapType] || "#6b7280",
                        }}
                      >
                        {gap.gapType}
                      </span>
                      <span
                        className="text-xs font-display font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${severityColor(gap.severity)}20`,
                          color: severityColor(gap.severity),
                        }}
                      >
                        {gap.severity} {severityLabel(gap.severity)}
                      </span>
                      <EyeButton
                        isOpen={isGapExpanded}
                        onClick={() => setExpandedGapId(isGapExpanded ? null : gap.id)}
                      />
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-semibold leading-tight mb-2">
                      {gap.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 flex-1">
                      {gap.description}
                    </p>
                    <div
                      className="pt-2 border-t text-[10px]"
                      style={{ borderColor: "hsl(var(--glass-border) / 0.06)" }}
                    >
                      <span className="font-bold text-rose-500 uppercase tracking-wider">
                        Blocking Effect:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {gap.blockingEffect}
                      </span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isGapExpanded && gap.rawSources.length > 0 && (
                      <RawSourcesPanel sources={gap.rawSources} label="Raw Evidence" />
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===== SECTION 5: SIGNAL TRACING ===== */}
        <section>
          <SectionHeader
            badge="Methodology"
            badgeColor="#0ea5e9"
            title="Signal Tracing"
            subtitle="Every signal and gap is traceable from raw data source to framework indicator -- defensible, auditable intelligence"
          />

          <div className="space-y-4">
            {TRACING_EXAMPLES.map((example, exIdx) => (
              <motion.div
                key={exIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: exIdx * 0.1 }}
                className="glass-card !p-0 overflow-hidden"
              >
                <div
                  className="px-5 py-3 border-b flex items-center gap-2"
                  style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
                >
                  {exIdx === 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                      Flagship
                    </span>
                  )}
                  <h4 className="text-sm font-display">{example.label}</h4>
                </div>
                <div className="p-5 overflow-x-auto">
                  <div className="flex items-center gap-0 min-w-[700px]">
                    {example.chain.map((link, linkIdx) => (
                      <div key={linkIdx} className="flex items-center">
                        <div className="flex flex-col items-center text-center min-w-[120px] max-w-[160px]">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">
                            {link.step}
                          </span>
                          <div
                            className="rounded-lg px-3 py-2 text-[11px] font-medium leading-tight"
                            style={{
                              backgroundColor: `hsl(var(--primary) / 0.08)`,
                              border: "1px solid hsl(var(--primary) / 0.15)",
                            }}
                          >
                            {link.value}
                          </div>
                        </div>
                        {linkIdx < example.chain.length - 1 && (
                          <div className="mx-1 text-muted-foreground text-lg shrink-0">
                            &#x2192;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 6: DATA SOURCES ===== */}
        <section>
          <SectionHeader
            badge="Data Foundation"
            badgeColor="#f59e0b"
            title="Data Sources"
            subtitle="7 distinct data sources contributing signals and gaps to the intelligence pipeline"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card !p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-1 h-5 rounded-full"
                  style={{ background: "#f59e0b" }}
                />
                <h3 className="text-sm font-display">
                  Signals & Gaps by Source
                </h3>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">
                Raw signal and gap counts before consolidation
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={sourceChartData}
                  layout="vertical"
                  margin={{ left: 10, right: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={90}
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="Signals"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="Gaps"
                    fill="#ef4444"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Source Cards */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass-card !p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-1 h-5 rounded-full"
                  style={{ background: "#0ea5e9" }}
                />
                <h3 className="text-sm font-display">Source Details</h3>
              </div>
              <div className="space-y-2">
                {DATA_SOURCES.map((ds, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-primary/5 transition border-b last:border-0"
                    style={{ borderColor: "hsl(var(--glass-border) / 0.04)" }}
                  >
                    <div>
                      <p className="text-sm font-semibold">{ds.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {ds.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs shrink-0">
                      <span className="font-bold" style={{ color: "#10b981" }}>
                        {ds.signals} sig
                      </span>
                      <span className="font-bold" style={{ color: "#ef4444" }}>
                        {ds.gaps} gap
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-3 pt-3 border-t flex items-center justify-between"
                style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
              >
                <span className="text-xs font-bold text-muted-foreground">
                  Total Raw Extractions
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold" style={{ color: "#10b981" }}>
                    {DATA_SOURCES.reduce((a, d) => a + d.signals, 0)} signals
                  </span>
                  <span className="font-bold" style={{ color: "#ef4444" }}>
                    {DATA_SOURCES.reduce((a, d) => a + d.gaps, 0)} gaps
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== SECTION 7: DATA INSPECTOR ===== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader
              badge="Raw Data"
              badgeColor="#6366f1"
              title="Data Inspector"
              subtitle="Inspect the raw source files behind every signal and gap in this intelligence product"
            />
            <button
              onClick={() => setInspectorOpen(!inspectorOpen)}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition ${
                inspectorOpen
                  ? "bg-primary/20 text-primary"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {inspectorOpen ? "Hide Inspector" : "Inspect Raw Data"}
            </button>
          </div>

          <AnimatePresence>
            {inspectorOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-3">
                  {INSPECTOR_SOURCES.map((src, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card !p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-primary/60 text-sm">&#128202;</span>
                            <h4 className="text-sm font-display font-semibold">{src.name}</h4>
                          </div>
                          <p className="font-mono text-[10px] text-muted-foreground break-all mb-1">
                            {src.file}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            <span className="font-semibold">Type:</span> {src.type}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            <span className="font-semibold">Key variables:</span> {src.keyVariables}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs shrink-0">
                          <div className="text-center">
                            <span className="font-bold text-lg" style={{ color: "#10b981" }}>
                              {src.signalsExtracted}
                            </span>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">signals</p>
                          </div>
                          <div className="text-center">
                            <span className="font-bold text-lg" style={{ color: "#ef4444" }}>
                              {src.gapsExtracted}
                            </span>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">gaps</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between text-xs"
                  style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
                >
                  <span className="text-muted-foreground font-bold">
                    Total: {INSPECTOR_SOURCES.length} source files
                  </span>
                  <div className="flex gap-4">
                    <span className="font-bold" style={{ color: "#10b981" }}>
                      {INSPECTOR_SOURCES.reduce((a, s) => a + s.signalsExtracted, 0)} raw signals
                    </span>
                    <span className="font-bold" style={{ color: "#ef4444" }}>
                      {INSPECTOR_SOURCES.reduce((a, s) => a + s.gapsExtracted, 0)} raw gaps
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            CGIAR Demand Intelligence Platform -- Nigeria Country Deep Dive --
            7&#x2192;5&#x2192;1 Framework
          </p>
        </div>
      </main>
    </div>
  );
};

export default NigeriaDemandIntelligence;
