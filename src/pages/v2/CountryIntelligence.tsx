import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  STRATEGIC_FINDINGS,
  FINDING_TYPE_META,
  NIGERIA_INTELLIGENCE,
  KEY_STATS,
  statusColor,
  statusLabel,
  TOP_SIGNALS,
  TOP_GAPS,
  DATA_SOURCES,
  type StrategicFinding,
} from "@/lib/journalData";
import { UNIQUE_DOMAINS, CLUSTER_COLORS, GAP_TYPE_COLORS } from "@/lib/nigeriaData";
import { PinButton } from "@/components/PinButton";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function confidenceBadge(level: "high" | "medium" | "low") {
  const colors: Record<string, string> = {
    high: "#10b981",
    medium: "#f59e0b",
    low: "#ef4444",
  };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: `${colors[level]}20`, color: colors[level] }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: colors[level] }}
      />
      {level} confidence
    </span>
  );
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
    <div className="mb-6">
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

function MetricCard({
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
      <span className="text-2xl font-display font-bold" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
        {label}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Strategic Finding Card
// ---------------------------------------------------------------------------

function FindingCard({ finding }: { finding: StrategicFinding }) {
  const [expanded, setExpanded] = useState(false);
  const meta = FINDING_TYPE_META[finding.type];

  return (
    <motion.div
      layout
      className="glass-card !p-0 overflow-hidden"
    >
      {/* Header */}
      <div
        className="px-5 py-4 cursor-pointer"
        onClick={() => setExpanded((p) => !p)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Type badge */}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
              style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </span>

            <h4 className="text-sm font-semibold leading-snug mt-1">{finding.title}</h4>

            {/* Evidence summaries */}
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground/70">Demand evidence:</span>{" "}
                {finding.demandEvidence}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground/70">Gap evidence:</span>{" "}
                {finding.gapEvidence}
              </p>
            </div>

            <div className="mt-2">
              {confidenceBadge(finding.confidence)}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 mt-1">
            <PinButton
              id={finding.id}
              type="finding"
              title={finding.title}
              summary={finding.demandEvidence}
              evidence={finding.gapEvidence}
              source={finding.country}
            />
            <button
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all text-muted-foreground ${
                expanded
                  ? "bg-primary/20 text-primary rotate-180"
                  : "hover:bg-primary/10"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 py-4 space-y-3 border-t"
              style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                  Innovation Supply Assessment
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {finding.supplyAssessment}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                  Readiness
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {finding.readiness}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                  Strategic Implication
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {finding.strategicImplication}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                  Recommended Action
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {finding.recommendedAction}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Signal Row
// ---------------------------------------------------------------------------

function SignalRow({
  signal,
  isExpanded,
  onToggle,
}: {
  signal: (typeof TOP_SIGNALS)[number];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const color = strengthColor(signal.strength);
  const pct = (signal.strength / 10) * 100;
  const clusterColor = CLUSTER_COLORS[signal.cluster] || "#94a3b8";

  return (
    <>
      <tr
        className="cursor-pointer transition-colors hover:bg-primary/5"
        onClick={onToggle}
      >
        <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground whitespace-nowrap">
          {signal.id}
        </td>
        <td className="px-3 py-2.5 text-xs font-semibold leading-snug max-w-xs">
          {signal.title}
        </td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color }}>
              {signal.strength.toFixed(1)}
            </span>
          </div>
        </td>
        <td className="px-3 py-2.5">
          <span className="text-[10px] font-semibold text-muted-foreground">
            {signal.domain}
          </span>
        </td>
        <td className="px-3 py-2.5">
          <span
            className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
            style={{ backgroundColor: `${clusterColor}20`, color: clusterColor }}
          >
            {signal.cluster}
          </span>
        </td>
        <td className="px-3 py-2.5">
          <PinButton
            id={signal.id}
            type="signal"
            title={signal.title}
            summary={signal.description}
            evidence={signal.evidence}
            score={signal.strength}
          />
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={6} className="p-0">
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-3 bg-primary/5 border-t border-b" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
                    Evidence
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {signal.evidence}
                  </p>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Gap Card
// ---------------------------------------------------------------------------

function GapCard({ gap }: { gap: (typeof TOP_GAPS)[number] }) {
  const color = severityColor(gap.severity);
  const pct = (gap.severity / 10) * 100;
  const typeColor = GAP_TYPE_COLORS[gap.gapType] || "#94a3b8";

  return (
    <motion.div
      {...fadeUp}
      className="glass-card !p-4 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug flex-1 min-w-0">
          {gap.title}
        </h4>
        <PinButton
          id={gap.id}
          type="gap"
          title={gap.title}
          summary={gap.description}
          evidence={gap.blockingEffect}
          score={gap.severity}
        />
      </div>

      {/* Severity bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground font-semibold w-14 shrink-0">
          Severity
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-muted/30 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <span className="text-xs font-bold w-8 text-right" style={{ color }}>
          {gap.severity.toFixed(1)}
        </span>
      </div>

      {/* Type and cluster */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
        >
          {gap.gapType}
        </span>
        <span className="text-[10px] text-muted-foreground">{gap.cluster}</span>
      </div>

      {/* Blocking effect */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground/70">Blocking effect:</span>{" "}
        {gap.blockingEffect}
      </p>

      {/* Affected population */}
      <p className="text-[10px] text-muted-foreground italic">
        Affected: {gap.affectedPopulation}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CountryIntelligence() {
  const [expandedFindingType, setExpandedFindingType] = useState<string | null>(null);
  const [signalDomainFilter, setSignalDomainFilter] = useState("all");
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);

  const intel = NIGERIA_INTELLIGENCE;

  // Filter findings to Nigeria
  const nigeriaFindings = useMemo(
    () => STRATEGIC_FINDINGS.filter((f) => f.country === "Nigeria"),
    [],
  );

  // Filter findings by type
  const filteredFindings = useMemo(() => {
    if (!expandedFindingType) return nigeriaFindings;
    return nigeriaFindings.filter((f) => f.type === expandedFindingType);
  }, [nigeriaFindings, expandedFindingType]);

  // Filter signals by domain
  const filteredSignals = useMemo(() => {
    if (signalDomainFilter === "all") return TOP_SIGNALS;
    return TOP_SIGNALS.filter((s) => s.domain === signalDomainFilter);
  }, [signalDomainFilter]);

  // Count findings by type for filter chips
  const findingTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of nigeriaFindings) {
      counts[f.type] = (counts[f.type] || 0) + 1;
    }
    return counts;
  }, [nigeriaFindings]);

  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-12">
      {/* ================================================================ */}
      {/* HERO SECTION                                                     */}
      {/* ================================================================ */}
      <motion.section {...fadeUp}>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            Country Intelligence
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">
          Country Intelligence:{" "}
          <span className="text-primary">{intel.country}</span>
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {intel.summary}
        </p>

        {/* Top demand area pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {intel.topDemandAreas.map((area) => (
            <span
              key={area}
              className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20"
            >
              {area}
            </span>
          ))}
        </div>
      </motion.section>

      {/* ================================================================ */}
      {/* TOP METRICS STRIP                                                */}
      {/* ================================================================ */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Signals Identified"
          value={String(intel.signalCount)}
          accent="#0ea5e9"
          delay={0}
        />
        <MetricCard
          label="Gaps Identified"
          value={String(intel.gapCount)}
          accent="#f97316"
          delay={0.05}
        />
        <MetricCard
          label="Related Innovations"
          value={String(intel.innovationCount)}
          accent="#8b5cf6"
          delay={0.1}
        />
        <MetricCard
          label="Strategic Findings"
          value={String(intel.findingCount)}
          accent="#10b981"
          delay={0.15}
        />
        <MetricCard
          label="Evidence Confidence"
          value={statusLabel(intel.confidenceLevel)}
          accent={statusColor(intel.confidenceLevel)}
          delay={0.2}
        />
        <MetricCard
          label="Main Constraint"
          value={truncate(intel.mainConstraint, 50)}
          accent="#94a3b8"
          delay={0.25}
        />
      </section>

      {/* ================================================================ */}
      {/* STRATEGIC FINDINGS                                               */}
      {/* ================================================================ */}
      <section>
        <SectionHeader
          badge="Strategic Findings"
          badgeColor="#10b981"
          title="Key Intelligence Findings"
          subtitle={`${nigeriaFindings.length} findings synthesized from demand signals, gaps, and innovation supply analysis`}
        />

        {/* Type filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              !expandedFindingType
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setExpandedFindingType(null)}
          >
            All ({nigeriaFindings.length})
          </button>
          {(Object.keys(FINDING_TYPE_META) as Array<keyof typeof FINDING_TYPE_META>).map(
            (type) => {
              const meta = FINDING_TYPE_META[type];
              const count = findingTypeCounts[type] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={type}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    expandedFindingType === type
                      ? "text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  style={
                    expandedFindingType === type
                      ? { backgroundColor: meta.color }
                      : { backgroundColor: `${meta.color}15` }
                  }
                  onClick={() =>
                    setExpandedFindingType(expandedFindingType === type ? null : type)
                  }
                >
                  {meta.label} ({count})
                </button>
              );
            },
          )}
        </div>

        {/* Finding cards */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* DEMAND SIGNALS TABLE                                             */}
      {/* ================================================================ */}
      <section>
        <SectionHeader
          badge="Demand Signals"
          badgeColor="#0ea5e9"
          title="Consolidated Demand Signals"
          subtitle={`${TOP_SIGNALS.length} signals consolidated from ${KEY_STATS.signalsExtracted} raw extractions across ${KEY_STATS.dataSourcesAnalyzed} sources`}
        />

        {/* Domain filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              signalDomainFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
            onClick={() => setSignalDomainFilter("all")}
          >
            All Domains
          </button>
          {UNIQUE_DOMAINS.map((domain) => (
            <button
              key={domain}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                signalDomainFilter === domain
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
              onClick={() =>
                setSignalDomainFilter(signalDomainFilter === domain ? "all" : domain)
              }
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Signals table */}
        <div className="glass-card !p-0 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  ID
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Signal Title
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Strength
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Domain
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Cluster
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-10">
                  Pin
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSignals.map((signal) => (
                <SignalRow
                  key={signal.id}
                  signal={signal}
                  isExpanded={expandedSignalId === signal.id}
                  onToggle={() =>
                    setExpandedSignalId(expandedSignalId === signal.id ? null : signal.id)
                  }
                />
              ))}
            </tbody>
          </table>
          {filteredSignals.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              No signals match the selected domain filter.
            </div>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/* DEMAND GAPS GRID                                                 */}
      {/* ================================================================ */}
      <section>
        <SectionHeader
          badge="Demand Gaps"
          badgeColor="#f97316"
          title="Consolidated Demand Gaps"
          subtitle={`${TOP_GAPS.length} gaps identified -- barriers blocking demand from translating into outcomes`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOP_GAPS.map((gap) => (
            <GapCard key={gap.id} gap={gap} />
          ))}
        </div>
      </section>

      {/* ================================================================ */}
      {/* DATA SOURCES                                                     */}
      {/* ================================================================ */}
      <section>
        <SectionHeader
          badge="Evidence Base"
          badgeColor="#8b5cf6"
          title="Data Sources"
          subtitle={`${DATA_SOURCES.length} sources analyzed to produce this intelligence`}
        />

        <div className="glass-card !p-0 overflow-hidden">
          <div className="divide-y" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
            {DATA_SOURCES.map((source, i) => (
              <motion.div
                key={source.shortName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="px-5 py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{source.name}</p>
                  <p className="text-[11px] text-muted-foreground">{source.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <span className="text-sm font-bold text-sky-400">{source.signals}</span>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                      Signals
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-orange-400">{source.gaps}</span>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
                      Gaps
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
