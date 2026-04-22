import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { masterData, COUNTRIES, type Innovation, type CountryName, getSignalLevel } from "@/lib/data";
import { InnovationDemandMap } from "@/components/InnovationDemandMap";
import { InnovationList } from "@/components/InnovationList";
import { AdvancedAnalysisPanel } from "@/components/AdvancedAnalysisPanel";
import { FrameworkDiagram } from "@/components/FrameworkDiagram";
import { SignalNetwork } from "@/components/SignalNetwork";
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

  // KPI computations using new 5-dimension model
  const totalCount = filtered.length;
  const avgAlignment = +(
    filtered.reduce((a, b) => a + b.scaling_opportunity_score, 0) / (filtered.length || 1)
  ).toFixed(1);
  const scalingOpps = filtered.filter((d) => d.scaling_opportunity_score >= 7).length;
  const criticalGaps = filtered.filter((d) => getSignalLevel(d) === "high").length;
  const effectiveDemand = filtered.filter(
    (d) => d.demand_signals_score >= 7 && d.demand_gaps_score < 3 && d.investment_feasibility_score >= 6
  ).length;

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
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full signal-high" />
              <span className="font-bold text-muted-foreground">{highSignals} Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full signal-medium" />
              <span className="font-bold text-muted-foreground">{medSignals} Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full signal-low" />
              <span className="font-bold text-muted-foreground">{lowSignals} Managed</span>
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
            {/* KPI Strip — 5-Dimension Model */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <StatMini label="Innovations" value={String(totalCount)} accent="primary" />
              <StatMini label="Avg Alignment" value={String(avgAlignment)} accent="emerald" />
              <StatMini label="Scaling Opps." value={String(scalingOpps)} accent="sky" />
              <StatMini label="Critical Gaps" value={String(criticalGaps)} accent="rose" />
              <StatMini label="Effective Demand" value={String(effectiveDemand)} accent="violet" />
            </div>

            {/* Innovation Demand Map */}
            <div className="glass-card !p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-display">Innovation Demand Map</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  {filtered.length} demand signals
                </span>
              </div>
              <InnovationDemandMap
                filteredData={filtered}
                selectedCountry={selectedCountry}
                onCountryClick={handleCountryClick}
                onInnovationClick={handleInnovationSelect}
              />
            </div>

            {/* 7→5→1 Framework Signal Map */}
            <div className="glass-card !p-0 overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
              >
                <div>
                  <h3 className="text-sm font-display">7&#x2192;5&#x2192;1 Framework Signal Map</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {selectedInnovation
                      ? `Viewing: ${selectedInnovation.innovation_name}`
                      : "Select an innovation to activate signal domains"}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  7 Domains · 5 Dims
                </span>
              </div>
              <div className="flex items-center justify-center p-4 bg-[#0a1628]/60" style={{ minHeight: 340 }}>
                <FrameworkDiagram innovation={selectedInnovation} />
              </div>
              {/* Legend row */}
              <div
                className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 border-t"
                style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
              >
                {[
                  { color: "#0d9488", label: "Scaling Context" },
                  { color: "#f59e0b", label: "Sector" },
                  { color: "#8b5cf6", label: "Stakeholders" },
                  { color: "#6366f1", label: "Enabling Env." },
                  { color: "#0ea5e9", label: "Resource & Invest." },
                  { color: "#ec4899", label: "Market Intel." },
                  { color: "#14b8a6", label: "Innov. Portfolio" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Signal Network */}
            <div className="glass-card !p-0 overflow-hidden">
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
              >
                <div>
                  <h3 className="text-sm font-display">Domain Signal Network</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {selectedInnovation
                      ? `Signals activated for: ${selectedInnovation.innovation_name}`
                      : "Select an innovation to explore signals across 7 domains"}
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  7 → Themes → Indicators
                </span>
              </div>

              <div className="p-3">
                <SignalNetwork innovation={selectedInnovation} />
              </div>

              {/* Legend */}
              <div
                className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-4 py-2.5 border-t"
                style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-[9px] font-semibold text-muted-foreground">Active (score ≥ 5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: "#334155" }} />
                  <span className="text-[9px] font-semibold text-muted-foreground">Inactive (score &lt; 5)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-0.5 rounded-full" style={{ background: "linear-gradient(to right, #6366f1, transparent)" }} />
                  <span className="text-[9px] font-semibold text-muted-foreground">Active connection</span>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  {[
                    { color: "#10b981", label: "Strong (≥7)" },
                    { color: "#f59e0b", label: "Active (5-7)" },
                    { color: "#f43f5e", label: "Weak (<5)" },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[9px] font-semibold text-muted-foreground">{label}</span>
                    </div>
                  ))}
                  <span className="text-[9px] text-muted-foreground">Arc score</span>
                </div>
              </div>
            </div>

            {/* Intelligence Matrix */}
            <div className="glass-card !p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                <div>
                  <h3 className="text-sm font-display">Intelligence Matrix</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">5-Dimension Demand Signaling Framework — 0-10 Scale</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                  7&#x2192;5&#x2192;1
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b bg-muted/20" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                      {["Signal", "Innovation", "Region", "Context", "Sector", "Stakeh.", "Enabling", "Resource", "Market", "Portfolio", "Report"].map((h) => (
                        <th key={h} className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-3 font-bold tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleInnovations.map((item) => {
                      const signal = getSignalLevel(item);
                      const gapColor = item.demand_gaps_score > 6 ? "#f43f5e" : item.demand_gaps_score >= 3 ? "#f59e0b" : "#10b981";
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
                          <td className="py-2.5 px-3 font-semibold max-w-[160px] truncate">{item.innovation_name}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs bg-muted/50 px-2 py-0.5 rounded-md text-muted-foreground">{item.country}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#0d9488" }}>{item.domain_scaling_context}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#f59e0b" }}>{item.domain_sector}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#8b5cf6" }}>{item.domain_stakeholders}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#6366f1" }}>{item.domain_enabling_env}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#0ea5e9" }}>{item.domain_resource_investment}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#ec4899" }}>{item.domain_market_intelligence}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="text-xs font-bold" style={{ color: "#14b8a6" }}>{item.domain_innovation_portfolio}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); generateInnovationReport(item); }}
                              className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-full transition"
                            >
                              PDF
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
                  Dimension Analysis
                </span>
                <span className="text-muted-foreground text-xs">&#x2192;</span>
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
