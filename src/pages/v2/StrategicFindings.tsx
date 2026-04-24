import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  STRATEGIC_FINDINGS,
  FINDING_TYPE_META,
  type FindingType,
} from "@/lib/journalData";
import { PinButton } from "@/components/PinButton";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const ALL_TYPES: Array<FindingType | "all"> = [
  "all",
  "scaling_opportunity",
  "innovation_gap",
  "finance_gap",
  "policy_gap",
  "validation_need",
];

const confidenceColor: Record<string, string> = {
  high: "#10b981",
  medium: "#f59e0b",
  low: "#ef4444",
};

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

function SummaryStats() {
  const total = STRATEGIC_FINDINGS.length;
  const byType: Record<string, number> = {};
  for (const f of STRATEGIC_FINDINGS) {
    byType[f.type] = (byType[f.type] || 0) + 1;
  }

  const confMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
  const avgConf =
    STRATEGIC_FINDINGS.reduce((a, f) => a + (confMap[f.confidence] || 2), 0) /
    (total || 1);
  const avgLabel = avgConf >= 2.5 ? "High" : avgConf >= 1.5 ? "Medium" : "Low";
  const avgColor = avgConf >= 2.5 ? "#10b981" : avgConf >= 1.5 ? "#f59e0b" : "#ef4444";

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
    >
      <div className="glass-card !p-4 flex flex-col items-center text-center">
        <span className="text-3xl font-display font-bold text-primary">{total}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
          Total Findings
        </span>
      </div>
      {(Object.keys(FINDING_TYPE_META) as FindingType[]).slice(0, 2).map((t) => {
        const meta = FINDING_TYPE_META[t];
        return (
          <div key={t} className="glass-card !p-4 flex flex-col items-center text-center">
            <span className="text-3xl font-display font-bold" style={{ color: meta.color }}>
              {byType[t] || 0}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
              {meta.label}
            </span>
          </div>
        );
      })}
      <div className="glass-card !p-4 flex flex-col items-center text-center">
        <span className="text-3xl font-display font-bold" style={{ color: avgColor }}>
          {avgLabel}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
          Avg Confidence
        </span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Finding Card
// ---------------------------------------------------------------------------

function FindingCard({
  finding,
  index,
}: {
  finding: (typeof STRATEGIC_FINDINGS)[number];
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = FINDING_TYPE_META[finding.type];

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.35 }}
    >
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ backgroundColor: meta.color + "22", color: meta.color }}
              >
                {meta.label}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: confidenceColor[finding.confidence] + "22",
                  color: confidenceColor[finding.confidence],
                }}
              >
                {finding.confidence} confidence
              </span>
            </div>
            <h3 className="text-base font-display font-bold tracking-tight leading-snug">
              {finding.title}
            </h3>
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
      </div>

      {/* Body - always visible */}
      <div className="px-5 py-4 space-y-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Demand Evidence
          </span>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
            {finding.demandEvidence}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Gap Evidence
          </span>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
            {finding.gapEvidence}
          </p>
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-t border-white/5 flex items-center justify-center gap-1"
      >
        {expanded ? "Show less" : "Show full assessment"}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expandable section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-500">
                  Innovation Supply Assessment
                </span>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                  {finding.supplyAssessment}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-500">
                  Readiness Assessment
                </span>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                  {finding.readiness}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500">
                  Strategic Implication
                </span>
                <p className="text-sm text-foreground font-semibold mt-1 leading-relaxed">
                  {finding.strategicImplication}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Recommended Action
                </span>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
                  {finding.recommendedAction}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sources
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {finding.sources.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Related Signals
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {finding.relatedSignals.map((id) => (
                      <span
                        key={id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Related Gaps
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {finding.relatedGaps.map((id) => (
                      <span
                        key={id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function StrategicFindings() {
  const [typeFilter, setTypeFilter] = useState<FindingType | "all">("all");

  const filtered =
    typeFilter === "all"
      ? STRATEGIC_FINDINGS
      : STRATEGIC_FINDINGS.filter((f) => f.type === typeFilter);

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 space-y-8">
        {/* Hero */}
        <motion.section {...fadeUp}>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500">
              Page 4
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Strategic Findings
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Evidence-based intelligence synthesized from demand signals, gaps, and innovation supply
          </p>
        </motion.section>

        {/* Summary Stats */}
        <SummaryStats />

        {/* Filter Chips */}
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          {ALL_TYPES.map((t) => {
            const isAll = t === "all";
            const meta = isAll ? null : FINDING_TYPE_META[t];
            const active = typeFilter === t;
            const chipColor = isAll ? "#94a3b8" : meta!.color;

            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all ${
                  active
                    ? "text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground bg-muted/20"
                }`}
                style={
                  active
                    ? { backgroundColor: chipColor, boxShadow: `0 4px 12px ${chipColor}44` }
                    : undefined
                }
              >
                {isAll ? "All" : meta!.label}
              </button>
            );
          })}
        </motion.div>

        {/* Findings List */}
        <div className="space-y-4">
          {filtered.map((f, i) => (
            <FindingCard key={f.id} finding={f} index={i} />
          ))}
          {filtered.length === 0 && (
            <motion.div className="glass-card !p-8 text-center" {...fadeUp}>
              <p className="text-muted-foreground text-sm">
                No findings match the selected filter.
              </p>
            </motion.div>
          )}
        </div>

        {/* Decision Brief CTA */}
        <motion.div
          className="glass-card !p-6 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          <p className="text-sm text-muted-foreground">
            Pin findings above, then visit the{" "}
            <span className="text-primary font-semibold">Decision Brief</span> to compose your
            output.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
