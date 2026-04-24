import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { masterData, COUNTRIES, type Innovation } from "@/lib/data";
import {
  getInnovationDiagnostic,
  statusColor,
  statusLabel,
  getOpportunityStatus,
  getDemandLevel,
  getSupplyLevel,
  getGapSeverity,
  getReadinessLevel,
} from "@/lib/journalData";
import { PinButton } from "@/components/PinButton";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// ---------------------------------------------------------------------------
// Diagnostic Card
// ---------------------------------------------------------------------------

function DiagnosticCard({
  label,
  score,
  status,
}: {
  label: string;
  score: number;
  status: string;
}) {
  const color = statusColor(status);
  const pct = Math.min(score / 10, 1) * 100;

  return (
    <div className="glass-card !p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground/80">{label}</span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + "22", color }}
        >
          {statusLabel(status)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-lg font-display font-bold" style={{ color }}>
          {score.toFixed(1)}
        </span>
        <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function InnovationMatch() {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filtered innovation list
  const filtered = useMemo(() => {
    let list = [...masterData];
    if (countryFilter !== "all") {
      list = list.filter((d) => d.country === countryFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.innovation_name.toLowerCase().includes(q));
    }
    list.sort((a, b) => b.scaling_opportunity_score - a.scaling_opportunity_score);
    return list;
  }, [search, countryFilter]);

  const selected: Innovation | null = useMemo(() => {
    if (!selectedId) return null;
    return masterData.find((d) => d.innovation_name === selectedId) ?? null;
  }, [selectedId]);

  const diag = selected ? getInnovationDiagnostic(selected) : null;

  // Radar data
  const radarData = diag
    ? [
        { axis: "Geography", value: diag.geography.score },
        { axis: "Demand", value: diag.demand.score },
        { axis: "Supply", value: diag.supply.score },
        { axis: "Gaps (inv)", value: 10 - diag.gaps.score },
        { axis: "Readiness", value: diag.readiness.score },
      ]
    : [];

  // Narrative
  const narrative = selected && diag
    ? `Strong demand exists for ${selected.innovation_name} in ${selected.country}, but ${statusLabel(diag.supply.level).toLowerCase()} supply and ${statusLabel(diag.gaps.severity).toLowerCase()} gaps constrain scaling. The opportunity is "${statusLabel(diag.opportunity.status).toLowerCase()}" but conditional on closing supply and readiness deficits.`
    : "";

  // Decision pathway
  const pathway = diag
    ? `${statusLabel(diag.demand.level)} demand -> ${statusLabel(diag.supply.level).toLowerCase()} supply -> ${statusLabel(diag.gaps.severity).toLowerCase()} gaps -> ${statusLabel(diag.readiness.level).toLowerCase()} readiness -> ${statusLabel(diag.opportunity.status)} Scaling Opportunity`
    : "";

  // Action guidance
  const actions: string[] = [];
  if (selected && diag) {
    if (diag.supply.score < 4) {
      actions.push("Develop or source innovations addressing this demand area");
    }
    if (diag.gaps.score > 6) {
      actions.push(
        "Address critical gaps before scaling: finance, delivery, or institutional barriers"
      );
    }
    if (diag.readiness.score < 5) {
      actions.push("Build readiness through pilot programs and partnerships");
    }
    if (diag.opportunity.score >= 5) {
      actions.push(
        "Prepare scaling strategy with delivery and finance partners"
      );
    }
    if (actions.length === 0) {
      actions.push("Continue monitoring and strengthening evidence base");
    }
  }

  const opportunityColor = diag ? statusColor(diag.opportunity.status) : "#94a3b8";

  return (
    <div className="min-h-screen">
      <main className="max-w-[1400px] mx-auto px-6 py-8 md:px-10 space-y-8">
        {/* Hero */}
        <motion.section {...fadeUp}>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-500">
              Page 3
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Innovation Match
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Assess whether a specific innovation fits real demand and where it could scale.
          </p>
        </motion.section>

        {/* Search & Filter */}
        <motion.div
          className="glass-card !p-4 flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <input
            type="text"
            placeholder="Search innovations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-muted/30 border border-white/5 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-muted/30 border border-white/5 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Innovation List */}
          <motion.div
            className="lg:col-span-4 space-y-2 max-h-[80vh] overflow-y-auto pr-1"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {filtered.map((inn) => {
              const isActive = selectedId === inn.innovation_name;
              const oppStatus = getOpportunityStatus(inn.scaling_opportunity_score);
              const oppColor = statusColor(oppStatus);
              return (
                <button
                  key={inn.innovation_name}
                  onClick={() => setSelectedId(inn.innovation_name)}
                  className={`w-full text-left glass-card !p-3 transition-all cursor-pointer ${
                    isActive
                      ? "ring-2 ring-primary/50 bg-primary/5"
                      : "hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-snug truncate">
                        {inn.innovation_name}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">
                        {inn.country}
                      </span>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className="text-lg font-display font-bold"
                        style={{ color: oppColor }}
                      >
                        {inn.scaling_opportunity_score.toFixed(1)}
                      </span>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider"
                        style={{ color: oppColor }}
                      >
                        {statusLabel(oppStatus)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="glass-card !p-6 text-center text-muted-foreground text-sm">
                No innovations match your filters.
              </div>
            )}
          </motion.div>

          {/* Detail Panel */}
          <div className="lg:col-span-8">
            {!selected || !diag ? (
              <motion.div
                className="glass-card !p-12 text-center"
                {...fadeUp}
              >
                <p className="text-muted-foreground text-sm">
                  Select an innovation from the list to view its diagnostic assessment.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selected.innovation_name}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Overview */}
                <div className="glass-card !p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-display font-bold tracking-tight">
                        {selected.innovation_name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 rounded-full bg-muted/40 font-semibold">
                          {selected.country}
                        </span>
                        <span>{selected.source_reference}</span>
                        <span className="opacity-50">|</span>
                        <span>{selected.evidence_date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                        {selected.scaling_justification}
                      </p>
                    </div>
                    <PinButton
                      id={`innovation-${selected.innovation_name}`}
                      type="innovation"
                      title={selected.innovation_name}
                      summary={selected.scaling_justification}
                      source={selected.source_reference}
                      score={selected.scaling_opportunity_score}
                      size="md"
                    />
                  </div>
                </div>

                {/* Narrative */}
                <div className="glass-card !p-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                    Narrative Interpretation
                  </h3>
                  <p className="text-sm text-foreground/80 italic leading-relaxed">
                    {narrative}
                  </p>
                </div>

                {/* Five Diagnostic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  <DiagnosticCard
                    label="Geography & Priority"
                    score={diag.geography.score}
                    status={diag.geography.level}
                  />
                  <DiagnosticCard
                    label="Demand Signals"
                    score={diag.demand.score}
                    status={diag.demand.level}
                  />
                  <DiagnosticCard
                    label="Innovation Supply"
                    score={diag.supply.score}
                    status={diag.supply.level}
                  />
                  <DiagnosticCard
                    label="Demand Gaps"
                    score={diag.gaps.score}
                    status={diag.gaps.severity}
                  />
                  <DiagnosticCard
                    label="Readiness & Feasibility"
                    score={diag.readiness.score}
                    status={diag.readiness.level}
                  />
                </div>

                {/* Radar Chart */}
                <div className="glass-card !p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
                    Dimension Radar
                  </h3>
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                        <PolarGrid stroke="hsl(var(--muted-foreground) / 0.15)" />
                        <PolarAngleAxis
                          dataKey="axis"
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 10]}
                          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground) / 0.5)" }}
                        />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Status labels under radar */}
                  <div className="flex flex-wrap justify-center gap-4 mt-2 text-[10px]">
                    <span>
                      Demand:{" "}
                      <strong style={{ color: statusColor(diag.demand.level) }}>
                        {statusLabel(diag.demand.level)}
                      </strong>
                    </span>
                    <span>
                      Supply:{" "}
                      <strong style={{ color: statusColor(diag.supply.level) }}>
                        {statusLabel(diag.supply.level)}
                      </strong>
                    </span>
                    <span>
                      Gaps:{" "}
                      <strong style={{ color: statusColor(diag.gaps.severity) }}>
                        {statusLabel(diag.gaps.severity)}
                      </strong>
                    </span>
                    <span>
                      Readiness:{" "}
                      <strong style={{ color: statusColor(diag.readiness.level) }}>
                        {statusLabel(diag.readiness.level)}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Scaling Opportunity */}
                <div className="glass-card !p-6 flex flex-col items-center text-center">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">
                    Scaling Opportunity
                  </h3>
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
                    style={{
                      background: `linear-gradient(135deg, ${opportunityColor}33, ${opportunityColor}11)`,
                      border: `3px solid ${opportunityColor}`,
                    }}
                  >
                    <span
                      className="text-3xl font-display font-bold"
                      style={{ color: opportunityColor }}
                    >
                      {diag.opportunity.score.toFixed(1)}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold uppercase tracking-wider mb-2"
                    style={{ color: opportunityColor }}
                  >
                    {statusLabel(diag.opportunity.status)}
                  </span>
                  <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                    {pathway}
                  </p>
                </div>

                {/* Action Guidance */}
                <div className="glass-card !p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
                    Action Guidance
                  </h3>
                  <ul className="space-y-2">
                    {actions.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
