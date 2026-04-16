import { motion, AnimatePresence } from "framer-motion";
import type { Innovation } from "@/lib/data";
import { getSignalLevel, getSignalColor, getSignalLabel } from "@/lib/data";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from "recharts";

interface Props {
  innovation: Innovation | null;
  expanded: boolean;
  onToggle: () => void;
}

const TOOLTIP_STYLE = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 };

// 5 Dimension colors
const DIM_COLORS = {
  geography: "#0d9488",
  demand: "#f59e0b",
  supply: "#8b5cf6",
  gaps: "#f43f5e",
  feasibility: "#0ea5e9",
  scaling: "#0f766e",
};

function ScoreTier(score: number): { label: string; color: string } {
  if (score <= 3) return { label: "NASCENT", color: "hsl(var(--rose))" };
  if (score <= 6) return { label: "EMERGING", color: "hsl(var(--amber))" };
  if (score <= 8) return { label: "STRATEGIC", color: "hsl(var(--sky))" };
  return { label: "SCALED", color: "hsl(var(--emerald))" };
}

function GapTier(score: number): { label: string; color: string } {
  if (score > 6) return { label: "CRITICAL", color: "hsl(var(--rose))" };
  if (score >= 3) return { label: "MODERATE", color: "hsl(var(--amber))" };
  return { label: "MANAGED", color: "hsl(var(--emerald))" };
}

export function AdvancedAnalysisPanel({ innovation, expanded, onToggle }: Props) {
  if (!innovation) {
    return (
      <div
        onClick={onToggle}
        className={`h-full flex items-center justify-center cursor-pointer transition-all ${expanded ? "" : "panel-collapsed"}`}
      >
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Select an innovation to analyze</p>
          <p className="text-[10px] text-muted-foreground mt-1">Click to expand</p>
        </div>
      </div>
    );
  }

  const signal = getSignalLevel(innovation);

  // 5-axis dimension radar
  const dimensionData = [
    { axis: "Geo & Priority", value: innovation.geography_priority_score },
    { axis: "Demand Signals", value: innovation.demand_signals_score },
    { axis: "Innov. Supply", value: innovation.innovation_supply_score },
    { axis: "Inv. Feasibility", value: innovation.investment_feasibility_score },
    { axis: "Gaps (inv.)", value: +(10 - innovation.demand_gaps_score).toFixed(1) },
  ];

  // 9 Domain→Dimension interactions
  const interactionData = [
    { name: "Ctx→Geo", value: innovation.context_geography, color: DIM_COLORS.geography },
    { name: "Sec→Dem", value: innovation.sector_demand, color: DIM_COLORS.demand },
    { name: "Stk→Dem", value: innovation.stakeholder_demand, color: DIM_COLORS.demand },
    { name: "Stk→Gaps", value: innovation.stakeholder_gaps, color: DIM_COLORS.gaps },
    { name: "Env→Feas", value: innovation.enabling_feasibility, color: DIM_COLORS.feasibility },
    { name: "Res→Feas", value: innovation.resource_feasibility, color: DIM_COLORS.feasibility },
    { name: "Mkt→Feas", value: innovation.market_feasibility, color: DIM_COLORS.feasibility },
    { name: "Mkt→Gaps", value: innovation.market_gaps, color: DIM_COLORS.gaps },
    { name: "Port→Sup", value: innovation.portfolio_supply, color: DIM_COLORS.supply },
  ];

  // 7 Domain scores
  const domainData = [
    { name: "Scaling Ctx", score: innovation.domain_scaling_context },
    { name: "Sector", score: innovation.domain_sector },
    { name: "Stakeholders", score: innovation.domain_stakeholders },
    { name: "Enabling", score: innovation.domain_enabling_env },
    { name: "Resources", score: innovation.domain_resource_investment },
    { name: "Market", score: innovation.domain_market_intelligence },
    { name: "Portfolio", score: innovation.domain_innovation_portfolio },
  ];

  const DOMAIN_COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#6366f1"];

  const scalingTier = ScoreTier(innovation.scaling_opportunity_score);
  const gapTier = GapTier(innovation.demand_gaps_score);

  return (
    <div
      onClick={!expanded ? onToggle : undefined}
      className={`h-full transition-all ${expanded ? "panel-expanded" : "panel-collapsed cursor-pointer"}`}
    >
      <AnimatePresence mode="wait">
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`h-3 w-3 rounded-full ${signal === "high" ? "signal-high" : signal === "medium" ? "signal-medium" : "signal-low"}`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getSignalColor(signal) }}>
                    {getSignalLabel(signal)} Signal
                  </span>
                </div>
                <h3 className="text-lg font-display leading-tight">{innovation.innovation_name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{innovation.country} · {innovation.evidence_date}</p>
              </div>
              <button onClick={onToggle} className="text-muted-foreground hover:text-foreground text-sm p-1">&#x2715;</button>
            </div>

            {/* 5 Dimension Scores */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Geo & Priority", score: innovation.geography_priority_score, color: DIM_COLORS.geography },
                { label: "Demand Signals", score: innovation.demand_signals_score, color: DIM_COLORS.demand },
                { label: "Innov. Supply", score: innovation.innovation_supply_score, color: DIM_COLORS.supply },
                { label: "Inv. Feasibility", score: innovation.investment_feasibility_score, color: DIM_COLORS.feasibility },
              ].map((p) => {
                const tier = ScoreTier(p.score);
                return (
                  <div key={p.label} className="glass-card !p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">{p.label}</p>
                    <p className="text-xl font-display" style={{ color: p.color }}>
                      {p.score}<span className="text-xs text-muted-foreground">/10</span>
                    </p>
                    <span className="text-[9px] font-bold uppercase" style={{ color: tier.color }}>{tier.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Demand Gaps + Scaling Opportunity */}
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card !p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Demand Gaps</p>
                <p className="text-xl font-display" style={{ color: DIM_COLORS.gaps }}>
                  {innovation.demand_gaps_score}<span className="text-xs text-muted-foreground">/10</span>
                </p>
                <span className="text-[9px] font-bold uppercase" style={{ color: gapTier.color }}>{gapTier.label}</span>
              </div>
              <div className="glass-card !p-3" style={{ borderColor: DIM_COLORS.scaling + "40" }}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Scaling Opp.</p>
                <p className="text-xl font-display" style={{ color: DIM_COLORS.scaling }}>
                  {innovation.scaling_opportunity_score}<span className="text-xs text-muted-foreground">/10</span>
                </p>
                <span className="text-[9px] font-bold uppercase" style={{ color: scalingTier.color }}>{scalingTier.label}</span>
              </div>
            </div>

            {/* 5-Dimension Radar */}
            <div className="glass-card !p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">5-Dimension Alignment Radar</h4>
              <ResponsiveContainer width="100%" height={190}>
                <RadarChart data={dimensionData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 8 }} />
                  <Radar dataKey="value" stroke={DIM_COLORS.scaling} fill={DIM_COLORS.scaling} fillOpacity={0.18} strokeWidth={2} dot={{ r: 3, fill: DIM_COLORS.scaling }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Domain→Dimension Interaction Bars (9 interactions) */}
            <div className="glass-card !p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Domain&#x2192;Dimension Interactions</h4>
              <div className="space-y-1.5">
                {interactionData.map((n) => {
                  const tier = ScoreTier(n.value);
                  return (
                    <div key={n.name} className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground w-16 shrink-0 text-right">{n.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(n.value / 10) * 100}%`, background: n.color }} />
                      </div>
                      <span className="text-[9px] font-bold w-6" style={{ color: tier.color }}>{n.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7 Scaling Domains */}
            <div className="glass-card !p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">7 Data Signal Domains</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={domainData} layout="vertical" margin={{ left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {domainData.map((_, i) => <Cell key={i} fill={DOMAIN_COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Evidence */}
            <div className="rounded-xl border border-sky/20 bg-sky/5 p-4">
              <h4 className="text-xs font-bold text-sky mb-2">Evidence &amp; Traceability</h4>
              <p className="text-xs"><span className="text-muted-foreground">Source:</span> <span className="font-semibold">{innovation.source_reference}</span></p>
              <p className="text-xs mt-1"><span className="text-muted-foreground">Year:</span> <span className="font-semibold">{innovation.evidence_date}</span></p>
              <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-sky/10">{innovation.scaling_justification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
