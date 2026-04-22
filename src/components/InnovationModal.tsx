import { motion, AnimatePresence } from "framer-motion";
import type { Innovation } from "@/lib/data";

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

function PillarCard({ label, score, accent }: { label: string; score: number; accent?: string }) {
  const tier = ScoreTier(score);
  return (
    <div className="glass-card !p-4">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-display mt-1" style={{ color: accent || tier.color }}>
        {score}<span className="text-sm text-muted-foreground">/10</span>
      </p>
      <span className="text-[9px] font-bold uppercase tracking-wide mt-1 inline-block" style={{ color: tier.color }}>{tier.label}</span>
    </div>
  );
}

function NexusBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  const tier = ScoreTier(value);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: tier.color }} />
      </div>
      <span className="text-xs font-bold w-8" style={{ color: tier.color }}>{value}</span>
    </div>
  );
}

export function InnovationModal({ item, onClose }: Props) {
  if (!item) return null;
  const gap = item.need_score - item.effective_demand_score;

  const domains = [
    { label: "Scaling Context", score: item.domain_scaling_context },
    { label: "Sector Readiness", score: item.domain_sector },
    { label: "Stakeholders & Networks", score: item.domain_stakeholders },
    { label: "Enabling Environment", score: item.domain_enabling_env },
    { label: "Resource & Investment", score: item.domain_resource_ecosystem },
    { label: "Market Intelligence", score: item.domain_market_intelligence },
    { label: "Innovation Portfolio", score: item.domain_innovation_portfolio },
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
              <h2 className="text-2xl font-display">{item.innovation_name}</h2>
              <p className="text-muted-foreground text-sm mt-1">{item.country} · {item.evidence_date}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">✕</button>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">4 Core Pillars</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <PillarCard label="System Need" score={item.need_score} />
            <PillarCard label="Effective Demand" score={item.effective_demand_score} />
            <PillarCard label="Supply Score" score={item.supply_score} />
            <PillarCard label="Scaling Opportunity" score={item.scaling_opportunity_score} />
          </div>

          <div className="glass-card !p-4 mb-6 flex items-center justify-between">
            <span className="text-sm font-semibold">Strategic Gap (Need − Demand)</span>
            <span className={`text-2xl font-display ${gap > 2 ? "text-rose" : "text-emerald"}`}>{gap > 0 ? `+${gap}` : gap}</span>
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">6 Interaction Pillars (Strategic Nexus)</h4>
          <div className="glass-card !p-5 mb-6 space-y-2.5">
            <NexusBar label="Need / Supply" value={item.need_supply} />
            <NexusBar label="Demand / Scaling" value={item.demand_scaling} />
            <NexusBar label="Supply / Demand" value={item.supply_demand} />
            <NexusBar label="Supply / Scaling" value={item.supply_scaling} />
            <NexusBar label="Need / Scaling" value={item.need_scaling} />
            <NexusBar label="Scaling / Demand" value={item.scaling_demand} />
          </div>

          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">7 Scaling Domains</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {domains.map((d) => (
              <PillarCard key={d.label} label={d.label} score={d.score} />
            ))}
          </div>

          <div className="rounded-2xl border border-sky/20 bg-sky/5 p-5">
            <h4 className="text-sm font-bold text-sky mb-3">Evidence Source & Traceability</h4>
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
