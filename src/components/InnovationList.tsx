import { motion } from "framer-motion";
import type { Innovation } from "@/lib/data";
import { getSignalLevel, getSignalColor, getSignalLabel } from "@/lib/data";

interface Props {
  data: Innovation[];
  selectedInnovation: Innovation | null;
  onSelect: (item: Innovation) => void;
}

export function InnovationList({ data, selectedInnovation, onSelect }: Props) {
  return (
    <div className="space-y-1.5">
      {data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">No innovations match your search</p>
      )}
      {data.map((item, i) => {
        const signal = getSignalLevel(item);
        const isSelected = selectedInnovation?.innovation_name === item.innovation_name && selectedInnovation?.country === item.country;
        const gap = item.need_score - item.effective_demand_score;

        return (
          <motion.button
            key={`${item.innovation_name}-${item.country}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => onSelect(item)}
            className={`w-full text-left rounded-xl px-3 py-2.5 transition-all group ${
              isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50 border border-transparent"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <span
                className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                  signal === "high" ? "signal-high" : signal === "medium" ? "signal-medium" : "signal-low"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : "group-hover:text-primary"} transition`}>
                  {item.innovation_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">{item.country}</span>
                  <span className="text-[10px] font-bold" style={{ color: getSignalColor(signal) }}>
                    {getSignalLabel(signal)}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold mt-1 ${gap > 2 ? "text-rose" : gap > 0 ? "text-amber" : "text-emerald"}`}>
                {gap > 0 ? `+${gap}` : gap}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
