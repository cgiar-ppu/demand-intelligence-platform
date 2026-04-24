import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DEMAND_AREAS,
  STRATEGIC_FINDINGS,
  FINDING_TYPE_META,
  KEY_STATS,
  NIGERIA_INTELLIGENCE,
  statusColor,
  statusLabel,
  type StrategicFinding,
  type FindingType,
} from "@/lib/journalData";
import { masterData } from "@/lib/data";
import { PinButton } from "@/components/PinButton";

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ALL_COUNTRIES = Array.from(
  new Set(DEMAND_AREAS.flatMap((da) => da.countriesWithSignals)),
);

const COUNTRY_COLORS: Record<string, string> = {
  Nigeria: "#10b981",
  Kenya: "#0ea5e9",
  Ethiopia: "#f59e0b",
  Bangladesh: "#8b5cf6",
  Zambia: "#f97316",
};

function confidenceBadge(level: string) {
  const colors: Record<string, string> = {
    high: "#10b981",
    medium: "#f59e0b",
    low: "#ef4444",
  };
  return colors[level] || "#94a3b8";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
      <span
        className="text-3xl font-display font-bold"
        style={{ color: accent }}
      >
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

// ---------------------------------------------------------------------------
// Demand Area Row
// ---------------------------------------------------------------------------

function DemandAreaRow({
  area,
  onClick,
}: {
  area: (typeof DEMAND_AREAS)[number];
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      {...fadeUp}
      className="glass-card !p-4 grid grid-cols-[1fr_auto] gap-4 items-center text-left w-full hover:ring-1 hover:ring-primary/30 transition-all cursor-pointer"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-display font-semibold tracking-tight">
            {area.name}
          </h4>
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              color: statusColor(area.opportunityStatus),
              backgroundColor: statusColor(area.opportunityStatus) + "18",
            }}
          >
            {statusLabel(area.opportunityStatus)}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
          {area.description}
        </p>

        {/* Micro-metrics */}
        <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
          <span>
            Signal{" "}
            <strong className="text-foreground">{area.signalStrength}</strong>
          </span>
          <span>
            Gap{" "}
            <strong className="text-foreground">{area.gapSeverity}</strong>
          </span>
          <span>
            Supply{" "}
            <strong className="text-foreground">{area.supplyCoverage}</strong>
          </span>
        </div>
      </div>

      {/* Country dots */}
      <div className="flex gap-1.5 items-center shrink-0">
        {ALL_COUNTRIES.map((c) => {
          const active = area.countriesWithSignals.includes(c);
          return (
            <span
              key={c}
              title={c}
              className="w-3 h-3 rounded-full border transition-all"
              style={{
                backgroundColor: active
                  ? COUNTRY_COLORS[c] || "#94a3b8"
                  : "transparent",
                borderColor: active
                  ? COUNTRY_COLORS[c] || "#94a3b8"
                  : "hsl(var(--muted-foreground) / 0.25)",
                opacity: active ? 1 : 0.3,
              }}
            />
          );
        })}
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Strategic Finding Card
// ---------------------------------------------------------------------------

function FindingCard({ finding }: { finding: StrategicFinding }) {
  const [expanded, setExpanded] = useState(false);
  const meta = FINDING_TYPE_META[finding.type];

  return (
    <motion.div {...fadeUp} className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* Type badge */}
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-2"
              style={{
                color: meta.color,
                backgroundColor: meta.color + "18",
              }}
            >
              {meta.label}
            </span>

            <h4 className="text-sm font-display font-semibold tracking-tight leading-snug">
              {finding.title}
            </h4>
          </div>

          <PinButton
            id={finding.id}
            type="finding"
            title={finding.title}
            summary={finding.demandEvidence}
            evidence={finding.gapEvidence}
            source={finding.sources.join(", ")}
          />
        </div>

        {/* Evidence summaries */}
        <div className="mt-3 space-y-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Demand Evidence
            </span>
            <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">
              {finding.demandEvidence}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Gap Evidence
            </span>
            <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">
              {finding.gapEvidence}
            </p>
          </div>
        </div>

        {/* Confidence badge + expand toggle */}
        <div className="flex items-center justify-between mt-3">
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              color: confidenceBadge(finding.confidence),
              backgroundColor: confidenceBadge(finding.confidence) + "18",
            }}
          >
            {finding.confidence} confidence
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? "Hide Details" : "View Details"}
          </button>
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
              style={{
                borderColor: "hsl(var(--glass-border) / 0.08)",
                backgroundColor: "hsl(var(--primary) / 0.03)",
              }}
            >
              <DetailRow label="Supply Assessment" value={finding.supplyAssessment} />
              <DetailRow label="Readiness Assessment" value={finding.readiness} />
              <DetailRow label="Strategic Implication" value={finding.strategicImplication} />
              <DetailRow label="Recommended Action" value={finding.recommendedAction} />

              {/* Related sources */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Related Sources
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {finding.sources.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function DemandView() {
  const [activeFilter, setActiveFilter] = useState<FindingType | "all">("all");
  const findingsRef = useRef<HTMLDivElement>(null);

  const uniqueCountries = useMemo(
    () => new Set(DEMAND_AREAS.flatMap((da) => da.countriesWithSignals)).size,
    [],
  );

  const innovationCount = useMemo(() => masterData.length, []);

  const filteredFindings = useMemo(
    () =>
      activeFilter === "all"
        ? STRATEGIC_FINDINGS
        : STRATEGIC_FINDINGS.filter((f) => f.type === activeFilter),
    [activeFilter],
  );

  const scrollToFindings = () => {
    findingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const findingTypes: (FindingType | "all")[] = [
    "all",
    ...Object.keys(FINDING_TYPE_META) as FindingType[],
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* ---------------------------------------------------------------- */}
      {/* Hero Section                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <motion.div {...fadeUp}>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            Intelligence Journal
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mt-2">
            Demand Intelligence
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Explore emerging demand areas across countries, sources, and
            innovations
          </p>
          <p className="text-xs text-foreground/70 mt-4 max-w-3xl leading-relaxed">
            {NIGERIA_INTELLIGENCE.summary}
          </p>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Top Metrics Strip                                                 */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Countries"
            value={String(uniqueCountries)}
            accent="#0ea5e9"
            delay={0}
          />
          <StatCard
            label="Demand Signals"
            value={String(KEY_STATS.consolidatedSignals)}
            accent="#10b981"
            delay={0.05}
          />
          <StatCard
            label="Demand Gaps"
            value={String(KEY_STATS.consolidatedGaps)}
            accent="#f59e0b"
            delay={0.1}
          />
          <StatCard
            label="Innovations"
            value={String(innovationCount)}
            accent="#8b5cf6"
            delay={0.15}
          />
          <StatCard
            label="Strategic Findings"
            value={String(STRATEGIC_FINDINGS.length)}
            accent="#f97316"
            delay={0.2}
          />
          <StatCard
            label="Evidence Confidence"
            value="High"
            accent="#10b981"
            delay={0.25}
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Demand Geography Section                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 max-w-5xl mx-auto mt-14">
        <SectionHeader
          badge="Demand Geography"
          badgeColor="#0ea5e9"
          title="Demand Areas by Country"
          subtitle="Click a demand area to view related strategic findings"
        />

        {/* Country legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {ALL_COUNTRIES.map((c) => (
            <div key={c} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COUNTRY_COLORS[c] || "#94a3b8" }}
              />
              <span className="text-[10px] text-muted-foreground">{c}</span>
            </div>
          ))}
        </div>

        <motion.div {...stagger} className="space-y-2">
          {DEMAND_AREAS.map((area) => (
            <DemandAreaRow
              key={area.id}
              area={area}
              onClick={scrollToFindings}
            />
          ))}
        </motion.div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Strategic Findings Section                                        */}
      {/* ---------------------------------------------------------------- */}
      <section ref={findingsRef} className="px-4 max-w-5xl mx-auto mt-14">
        <SectionHeader
          badge="Strategic Findings"
          badgeColor="#f59e0b"
          title="Intelligence Briefings"
          subtitle="Journal-style findings synthesized from demand signals and gap analysis"
        />

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {findingTypes.map((ft) => {
            const isAll = ft === "all";
            const label = isAll ? "All" : FINDING_TYPE_META[ft].label;
            const color = isAll ? "#94a3b8" : FINDING_TYPE_META[ft].color;
            const active = activeFilter === ft;

            return (
              <button
                key={ft}
                onClick={() => setActiveFilter(ft)}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all"
                style={{
                  borderColor: active ? color : "hsl(var(--muted-foreground) / 0.2)",
                  color: active ? color : "hsl(var(--muted-foreground))",
                  backgroundColor: active ? color + "15" : "transparent",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Finding cards */}
        <motion.div {...stagger} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFindings.map((finding) => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </AnimatePresence>

          {filteredFindings.length === 0 && (
            <motion.div
              {...fadeUp}
              className="glass-card !p-8 text-center text-sm text-muted-foreground"
            >
              No findings match the selected filter.
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Future Section Placeholder                                        */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-4 max-w-5xl mx-auto mt-14">
        <motion.div
          {...fadeUp}
          className="glass-card !p-6 text-center"
          style={{ opacity: 0.6 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
            Coming Soon
          </span>
          <h3 className="text-lg font-display tracking-tight mt-2 text-muted-foreground">
            Foresight &amp; Trends
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Future capability: demand trend analysis, weak signals detection,
            and scenario exploration.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
