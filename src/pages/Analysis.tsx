import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import { masterData, COUNTRIES, type Innovation } from "@/lib/data";
import { DomainCharts, DOMAINS } from "@/components/DomainCharts";
import { AdvancedAnalysisPanel } from "@/components/AdvancedAnalysisPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function avg(data: Innovation[], key: keyof Innovation): number {
  return +(data.reduce((a, b) => a + (Number(b[key]) || 0), 0) / (data.length || 1)).toFixed(1);
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-display" style={{ color }}>{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  );
}

const INNOVATION_NAMES = [...new Set(masterData.map(d => d.innovation_name))].sort();

const Analysis = () => {
  const [country, setCountry] = useState("all");
  const [innovationFilter, setInnovationFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("scaling");
  const [selectedInnovation, setSelectedInnovation] = useState<Innovation | null>(null);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);

  const data = useMemo(() => {
    return masterData.filter(d => {
      const matchCountry = country === "all" || d.country === country;
      const matchInnovation = innovationFilter === "all" || d.innovation_name === innovationFilter;
      const matchSearch = !search || 
        d.innovation_name.toLowerCase().includes(search.toLowerCase()) || 
        d.country.toLowerCase().includes(search.toLowerCase());
      return matchCountry && matchInnovation && matchSearch;
    });
  }, [country, innovationFilter, search]);

  const radarData = [
    { axis: "Need", value: avg(data, "need_score") },
    { axis: "Supply", value: avg(data, "supply_score") },
    { axis: "Eff. Demand", value: avg(data, "effective_demand_score") },
    { axis: "Scaling Opp.", value: avg(data, "scaling_opportunity_score") },
  ];

  const nexusData = [
    { axis: "Need/Supply", value: avg(data, "need_supply") },
    { axis: "Demand/Scaling", value: avg(data, "demand_scaling") },
    { axis: "Supply/Demand", value: avg(data, "supply_demand") },
    { axis: "Supply/Scaling", value: avg(data, "supply_scaling") },
    { axis: "Need/Scaling", value: avg(data, "need_scaling") },
    { axis: "Scaling/Demand", value: avg(data, "scaling_demand") },
  ];

  const countryGapData = COUNTRIES.map((c) => {
    const cd = masterData.filter((d) => d.country === c);
    const n = avg(cd, "need_score");
    const d = avg(cd, "effective_demand_score");
    const s = avg(cd, "supply_score");
    return { country: c, Need: n, Demand: d, Supply: s, gap: +(n - d).toFixed(1) };
  });

  const topInnovations = [...data].sort((a, b) => (b.need_score - b.effective_demand_score) - (a.need_score - a.effective_demand_score)).slice(0, 5);

  const handleInnovationClick = (item: Innovation) => {
    setSelectedInnovation(item);
    setAdvancedExpanded(true);
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">
      <main className="flex-1 overflow-y-auto custom-scroll px-6 py-6 md:px-10 max-w-[1400px] mx-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block h-2 w-2 rounded-full bg-sky" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky">Analytical Engine</span>
            </div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Advanced Analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">Deep multi-dimensional analysis and cross-country comparisons</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-6 mr-4">
              <MiniStat label="Avg Need" value={avg(data, "need_score")} color="hsl(var(--emerald))" />
              <MiniStat label="Avg Supply" value={avg(data, "supply_score")} color="hsl(var(--violet))" />
              <MiniStat label="Avg Demand" value={avg(data, "effective_demand_score")} color="hsl(var(--sky))" />
            </div>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-40 rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-[160px] rounded-xl">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={innovationFilter} onValueChange={setInnovationFilter}>
              <SelectTrigger className="w-[200px] rounded-xl">
                <SelectValue placeholder="All Innovations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Innovations</SelectItem>
                {INNOVATION_NAMES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Radar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4">
            <h3 className="text-sm font-display mb-2">Core Maturity Radar</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card !p-4">
            <h3 className="text-sm font-display mb-2">Strategic Interaction Nexus</h3>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={nexusData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Radar dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2.5} dot={{ r: 4, fill: "#0ea5e9" }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Country Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4 md:col-span-2">
            <h3 className="text-sm font-display mb-2">Country Pillar Comparison</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={countryGapData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Need" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Demand" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Supply" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4">
            <h3 className="text-sm font-display mb-3">Highest Strategic Gaps</h3>
            <div className="space-y-2">
              {topInnovations.map((item, i) => {
                const gap = item.need_score - item.effective_demand_score;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b last:border-0 cursor-pointer hover:bg-primary/5 rounded-lg px-2 transition"
                    style={{ borderColor: "hsl(var(--glass-border) / 0.04)" }}
                    onClick={() => handleInnovationClick(item)}
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.innovation_name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.country}</p>
                    </div>
                    <span className={`text-sm font-display font-bold ${gap > 2 ? "text-rose" : "text-amber"}`}>+{gap}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Domain Deep Dive */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 overflow-x-auto">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider shrink-0">Domain Deep Dive:</span>
            {DOMAINS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDomain(d.id)}
                className={`chip whitespace-nowrap ${activeDomain === d.id ? "chip-active" : ""}`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <DomainCharts data={data} activeDomain={activeDomain} />
        </div>
      </main>

      {/* Advanced Analysis Side Panel */}
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
                Deep Analysis
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
  );
};

export default Analysis;
