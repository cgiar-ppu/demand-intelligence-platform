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

function ScoreTier(score: number): { label: string; color: string } {
  if (score <= 3) return { label: "NASCENT", color: "hsl(var(--rose))" };
  if (score <= 6) return { label: "EMERGING", color: "hsl(var(--amber))" };
  if (score <= 8) return { label: "STRATEGIC", color: "hsl(var(--sky))" };
  return { label: "SCALED", color: "hsl(var(--emerald))" };
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

  const gap = innovation.need_score - innovation.effective_demand_score;
  const signal = getSignalLevel(innovation);

  const pillarData = [
    { axis: "Need", value: innovation.need_score },
    { axis: "Supply", value: innovation.supply_score },
    { axis: "Demand", value: innovation.effective_demand_score },
    { axis: "Scaling", value: innovation.scaling_opportunity_score },
  ];

  const nexusData = [
    { name: "Need/Supply", value: innovation.need_supply },
    { name: "Dem/Scale", value: innovation.demand_scaling },
    { name: "Sup/Dem", value: innovation.supply_demand },
    { name: "Sup/Scale", value: innovation.supply_scaling },
    { name: "Need/Scale", value: innovation.need_scaling },
    { name: "Scale/Dem", value: innovation.scaling_demand },
  ];

  const domainData = [
    { name: "Scaling Ctx", score: innovation.domain_scaling_context },
    { name: "Sector", score: innovation.domain_sector },
    { name: "Stakeholders", score: innovation.domain_stakeholders },
    { name: "Enabling", score: innovation.domain_enabling_env },
    { name: "Resources", score: innovation.domain_resource_ecosystem },
    { name: "Market", score: innovation.domain_market_intelligence },
    { name: "Portfolio", score: innovation.domain_innovation_portfolio },
  ];

  const DOMAIN_COLORS = ["#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#3b82f6", "#ec4899", "#6366f1"];

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
                    className={`h-3 w-3 rounded-full ${signal === "high" ? "signal-high" : signal === "medium" ? "signal-medium" : "signal-low"
                      }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getSignalColor(signal) }}>
                    {getSignalLabel(signal)} Signal
                  </span>
                </div>
                <h3 className="text-lg font-display leading-tight">{innovation.innovation_name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{innovation.country} · {innovation.evidence_date}</p>
              </div>
              <button onClick={onToggle} className="text-muted-foreground hover:text-foreground text-sm p-1">✕</button>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Need", score: innovation.need_score },
                { label: "Demand", score: innovation.effective_demand_score },
                { label: "Supply", score: innovation.supply_score },
                { label: "Scaling", score: innovation.scaling_opportunity_score },
              ].map((p) => {
                const tier = ScoreTier(p.score);
                return (
                  <div key={p.label} className="glass-card !p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.label}</p>
                    <p className="text-xl font-display" style={{ color: tier.color }}>
                      {p.score}<span className="text-xs text-muted-foreground">/10</span>
                    </p>
                    <span className="text-[9px] font-bold uppercase" style={{ color: tier.color }}>{tier.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Gap */}
            <div className="glass-card !p-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Strategic Gap</span>
              <span className={`text-xl font-display ${gap > 2 ? "text-rose" : "text-emerald"}`}>
                {gap > 0 ? `+${gap}` : gap}
              </span>
            </div>

            {/* Radar */}
            <div className="glass-card !p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Pillar Radar</h4>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={pillarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 9 }} />
                  <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: "#10b981" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Nexus Bars */}
            <div className="glass-card !p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Interaction Nexus</h4>
              <div className="space-y-2">
                {nexusData.map((n) => {
                  const tier = ScoreTier(n.value);
                  return (
                    <div key={n.name} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20 shrink-0 text-right">{n.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(n.value / 10) * 100}%`, background: tier.color }} />
                      </div>
                      <span className="text-[10px] font-bold w-6" style={{ color: tier.color }}>{n.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7 Scaling Domains */}
            <div className="glass-card !p-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">7 Scaling Domains</h4>
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
              <h4 className="text-xs font-bold text-sky mb-2">Evidence & Traceability</h4>
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
