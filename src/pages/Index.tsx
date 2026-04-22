import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { masterData, COUNTRIES, type Innovation, type CountryName, getSignalLevel } from "@/lib/data";
import { InnovationDemandMap } from "@/components/InnovationDemandMap";
import { InnovationList } from "@/components/InnovationList";
import { AdvancedAnalysisPanel } from "@/components/AdvancedAnalysisPanel";
import { generateInnovationReport } from "@/lib/generateReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 50;

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedInnovation, setSelectedInnovation] = useState<Innovation | null>(null);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    setVisibleCount(PAGE_SIZE);
    return masterData.filter((d) => {
      const matchSearch =
        d.innovation_name.toLowerCase().includes(search.toLowerCase()) ||
        d.country.toLowerCase().includes(search.toLowerCase());
      const matchCountry = !selectedCountry || d.country === selectedCountry;
      return matchSearch && matchCountry;
    });
  }, [search, selectedCountry]);

  const visibleInnovations = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  const handleCountryClick = (country: CountryName) => {
    setSelectedCountry((prev) => (prev === country ? null : country));
  };

  const handleCountrySelect = (value: string) => {
    setSelectedCountry(value === "all" ? null : value);
  };

  const handleInnovationSelect = (item: Innovation) => {
    setSelectedInnovation(item);
    setAdvancedExpanded(true);
  };

  const avgNeed = +(filtered.reduce((a, b) => a + b.need_score, 0) / (filtered.length || 1)).toFixed(1);
  const avgDemand = +(filtered.reduce((a, b) => a + b.effective_demand_score, 0) / (filtered.length || 1)).toFixed(1);
  const avgGap = +(avgNeed - avgDemand).toFixed(1);
  const highSignals = filtered.filter((d) => getSignalLevel(d) === "high").length;
  const medSignals = filtered.filter((d) => getSignalLevel(d) === "medium").length;
  const lowSignals = filtered.filter((d) => getSignalLevel(d) === "low").length;

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      {/* Search Bar */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
        <div className="max-w-[1600px] mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search innovations or countries…"
              className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {/* Country Dropdown */}
          <Select value={selectedCountry ?? "all"} onValueChange={handleCountrySelect}>
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Signal summary */}
          <div className="hidden lg:flex items-center gap-3 ml-auto text-xs">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full signal-high" />
              <span className="font-bold text-muted-foreground">{highSignals}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full signal-medium" />
              <span className="font-bold text-muted-foreground">{medSignals}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full signal-low" />
              <span className="font-bold text-muted-foreground">{lowSignals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden max-w-[1800px] mx-auto w-full">
        {/* Column 1 — Innovation List */}
        <div className="w-72 shrink-0 border-r overflow-y-auto custom-scroll p-3" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display">Innovations</h3>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <InnovationList
            data={visibleInnovations}
            selectedInnovation={selectedInnovation}
            onSelect={handleInnovationSelect}
          />
          {visibleCount < filtered.length && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="w-full mt-2 py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-xl transition"
            >
              Show more ({filtered.length - visibleCount} remaining)
            </button>
          )}
        </div>

        {/* Column 2 — Insights & Reports */}
        <div className="flex-1 overflow-y-auto custom-scroll">
          <div className="p-4 space-y-4">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatMini label="Innovations" value={String(filtered.length)} accent="primary" />
              <StatMini label="Avg Need" value={String(avgNeed)} accent="emerald" />
              <StatMini label="Avg Demand" value={String(avgDemand)} accent="sky" />
              <StatMini label="Avg Gap" value={avgGap > 0 ? `+${avgGap}` : String(avgGap)} accent={avgGap > 1.5 ? "rose" : "emerald"} />
              <StatMini label="Critical" value={String(highSignals)} accent="rose" />
            </div>

            {/* Innovation Demand Map */}
            <div className="glass-card !p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-display">Innovation Demand Map</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  {filtered.length} signals
                </span>
              </div>
              <InnovationDemandMap
                filteredData={filtered}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
                onInnovationClick={handleInnovationSelect}
              />
            </div>

            {/* Innovation Table */}
            <div className="glass-card !p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                <h3 className="text-sm font-display">Intelligence Matrix</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  0–10 Scale
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                      {["Signal", "Innovation", "Region", "Need", "Demand", "Supply", "Gap", "Report"].map((h) => (
                        <th key={h} className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-3 font-bold tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleInnovations.map((item) => {
                      const gap = item.need_score - item.effective_demand_score;
                      const signal = getSignalLevel(item);
                      return (
                        <tr
                          key={`${item.innovation_name}-${item.country}`}
                          className="border-b hover:bg-primary/5 transition cursor-pointer"
                          style={{ borderColor: "hsl(var(--glass-border) / 0.04)" }}
                          onClick={() => handleInnovationSelect(item)}
                        >
                          <td className="py-2.5 px-3">
                            <span className={`h-2.5 w-2.5 rounded-full inline-block ${signal === "high" ? "signal-high" : signal === "medium" ? "signal-medium" : "signal-low"}`} />
                          </td>
                          <td className="py-2.5 px-3 font-semibold">{item.innovation_name}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-md text-muted-foreground">{item.country}</span>
                          </td>
                          <td className="py-2.5 px-3"><span className="score-badge">{item.need_score}</span></td>
                          <td className="py-2.5 px-3"><span className="score-badge score-badge-demand">{item.effective_demand_score}</span></td>
                          <td className="py-2.5 px-3"><span className="score-badge score-badge-supply">{item.supply_score}</span></td>
                          <td className="py-2.5 px-3">
                            <span className={`text-xs font-bold ${gap > 2 ? "text-rose" : gap > 0 ? "text-amber" : "text-emerald"}`}>
                              {gap > 0 ? `+${gap}` : gap}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); generateInnovationReport(item); }}
                              className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-full transition"
                            >
                              ↓ PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {visibleCount < filtered.length && (
                <div className="px-4 py-3 border-t" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="w-full py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-xl transition"
                  >
                    Load more ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3 — Advanced Analysis */}
        <div
          className={`shrink-0 border-l overflow-y-auto custom-scroll p-3 transition-all duration-300 ${
            advancedExpanded ? "w-[360px]" : "w-16"
          }`}
          style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
        >
          {!advancedExpanded ? (
            <button
              onClick={() => setAdvancedExpanded(true)}
              className="h-full w-full flex items-center justify-center"
            >
              <div className="panel-collapsed flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground [writing-mode:vertical-lr] rotate-180">
                  Advanced Analysis
                </span>
                <span className="text-muted-foreground text-xs">→</span>
              </div>
            </button>
          ) : (
            <AdvancedAnalysisPanel
              innovation={selectedInnovation}
              expanded={advancedExpanded}
              onToggle={() => setAdvancedExpanded(!advancedExpanded)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

function StatMini({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card !p-3 flex flex-col"
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-2xl font-display mt-1" style={{ color: `hsl(var(--${accent}))` }}>{value}</span>
    </motion.div>
  );
}

export default Index;
