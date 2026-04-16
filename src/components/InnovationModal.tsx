import { motion, AnimatePresence } from "framer-motion";
import type { Innovation } from "@/lib/data";
import { getSignalLevel, getSignalColor, getSignalLabel } from "@/lib/data";

interface Props {
  item: Innovation | null;
  onClose: () => void;
}

function ScoreTier(score: number): { label: string; color: string } {
  if (score <= 3) return { label: "NASCENT", color: "hsl(var(--rose))" };
  if (score <= 6) return { label: "EMERGING", color: "hsl(var(--amber))" };
  if (score <= 8) return { label: "STRATEGIC", color: "hsl(var(--sky))" };
  return { label: "SCALED", color: "hsl(var(--emerald))" };
}

function DimCard({ label, score, color }: { label: string; score: number; color?: string }) {
  const tier = ScoreTier(score);
  return (
    <div className="glass-card !p-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">{label}</p>
      <p className="text-2xl font-display mt-1" style={{ color: color || tier.color }}>
        {score}<span className="text-sm text-muted-foreground">/10</span>
      </p>
      <span className="text-[9px] font-bold uppercase tracking-wide mt-1 inline-block" style={{ color: tier.color }}>{tier.label}</span>
    </div>
  );
}

function InteractionBar({ label, value, color }: { label: string; value: number; color?: string }) {
  const pct = (value / 10) * 100;
  const tier = ScoreTier(value);
  const barColor = color || tier.color;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-32 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <span className="text-xs font-bold w-8" style={{ color: barColor }}>{value}</span>
    </div>
  );
}

export function InnovationModal({ item, onClose }: Props) {
  if (!item) return null;
  const signal = getSignalLevel(item);

  const domains = [
    { label: "Scaling Context", score: item.domain_scaling_context },
    { label: "Sector", score: item.domain_sector },
    { label: "Stakeholders", score: item.domain_stakeholders },
    { label: "Enabling Env.", score: item.domain_enabling_env },
    { label: "Resources", score: item.domain_resource_investment },
    { label: "Market Intel.", score: item.domain_market_intelligence },
    { label: "Portfolio", score: item.domain_innovation_portfolio },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-3 w-3 rounded-full ${signal === "high" ? "signal-high" : signal === "medium" ? "signal-medium" : "signal-low"}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getSignalColor(signal) }}>
                  {getSignalLabel(signal)} Demand Gap Signal
                </span>
              </div>
              <h2 className="text-2xl font-display">{item.innovation_name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{item.country} · {item.evidence_date}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">&#x2715;</button>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">5 Demand Signaling Dimensions</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <DimCard label="Geography & Priority" score={item.geography_priority_score} color="#0d9488" />
            <DimCard label="Demand Signals" score={item.demand_signals_score} color="#f59e0b" />
            <DimCard label="Innovation Supply" score={item.innovation_supply_score} color="#8b5cf6" />
            <DimCard label="Demand Gaps (inverse)" score={item.demand_gaps_score} color={item.demand_gaps_score > 6 ? "#f43f5e" : item.demand_gaps_score >= 3 ? "#f59e0b" : "#10b981"} />
            <DimCard label="Investment Feasibility" score={item.investment_feasibility_score} color="#0ea5e9" />
            <DimCard label="Scaling Opportunity" score={item.scaling_opportunity_score} color="#0f766e" />
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">9 Domain&#x2192;Dimension Interactions</h4>
          <div className="glass-card !p-5 mb-4 space-y-2">
            <InteractionBar label="Ctx&#x2192;Geography" value={item.context_geography} color="#0d9488" />
            <InteractionBar label="Sec&#x2192;Demand Sig." value={item.sector_demand} color="#f59e0b" />
            <InteractionBar label="Stk&#x2192;Demand Sig." value={item.stakeholder_demand} color="#f59e0b" />
            <InteractionBar label="Stk&#x2192;Demand Gaps" value={item.stakeholder_gaps} color="#f43f5e" />
            <InteractionBar label="Env&#x2192;Feasibility" value={item.enabling_feasibility} color="#0ea5e9" />
            <InteractionBar label="Res&#x2192;Feasibility" value={item.resource_feasibility} color="#0ea5e9" />
            <InteractionBar label="Mkt&#x2192;Feasibility" value={item.market_feasibility} color="#0ea5e9" />
            <InteractionBar label="Mkt&#x2192;Demand Gaps" value={item.market_gaps} color="#f43f5e" />
            <InteractionBar label="Port&#x2192;Supply" value={item.portfolio_supply} color="#8b5cf6" />
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">7 Data Signal Domains</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {domains.map((d) => (
              <DimCard key={d.label} label={d.label} score={d.score} />
            ))}
          </div>

          <div className="rounded-2xl border border-sky/20 bg-sky/5 p-5">
            <h4 className="text-sm font-bold text-sky mb-3">Evidence Source &amp; Traceability</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground uppercase">Primary Source</span>
                <p className="font-semibold mt-0.5">{item.source_reference}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase">Evidence Year</span>
                <p className="font-semibold mt-0.5">{item.evidence_date}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-sky/10">{item.scaling_justification}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
