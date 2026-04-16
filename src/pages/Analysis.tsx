import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell,
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

// Colors for 9 Domain→Dimension interactions
const INTERACTION_COLORS: Record<string, string> = {
  "Ctx→Geo": "#0d9488",
  "Sec→Dem": "#f59e0b",
  "Stk→Dem": "#f59e0b",
  "Stk→Gaps": "#f43f5e",
  "Env→Feas": "#0ea5e9",
  "Res→Feas": "#0ea5e9",
  "Mkt→Feas": "#0ea5e9",
  "Mkt→Gaps": "#f43f5e",
  "Port→Sup": "#8b5cf6",
};

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

  // 5-Dimension Alignment Radar
  const radarData = [
    { axis: "Geo & Priority", value: avg(data, "geography_priority_score") },
    { axis: "Demand Signals", value: avg(data, "demand_signals_score") },
    { axis: "Innov. Supply", value: avg(data, "innovation_supply_score") },
    { axis: "Demand Gaps (inv.)", value: +(10 - avg(data, "demand_gaps_score")).toFixed(1) },
    { axis: "Inv. Feasibility", value: avg(data, "investment_feasibility_score") },
  ];

  // 9 Domain→Dimension Interaction data
  const interactionData = [
    { name: "Ctx→Geo", value: avg(data, "context_geography"), color: "#0d9488" },
    { name: "Sec→Dem", value: avg(data, "sector_demand"), color: "#f59e0b" },
    { name: "Stk→Dem", value: avg(data, "stakeholder_demand"), color: "#f59e0b" },
    { name: "Stk→Gaps", value: avg(data, "stakeholder_gaps"), color: "#f43f5e" },
    { name: "Env→Feas", value: avg(data, "enabling_feasibility"), color: "#0ea5e9" },
    { name: "Res→Feas", value: avg(data, "resource_feasibility"), color: "#0ea5e9" },
    { name: "Mkt→Feas", value: avg(data, "market_feasibility"), color: "#0ea5e9" },
    { name: "Mkt→Gaps", value: avg(data, "market_gaps"), color: "#f43f5e" },
    { name: "Port→Sup", value: avg(data, "portfolio_supply"), color: "#8b5cf6" },
  ];

  // Country comparison by 3 main dimensions
  const countryDimData = COUNTRIES.map((c) => {
    const cd = masterData.filter((d) => d.country === c);
    return {
      country: c,
      "Demand Sig.": avg(cd, "demand_signals_score"),
      "Innov. Supply": avg(cd, "innovation_supply_score"),
      "Inv. Feasib.": avg(cd, "investment_feasibility_score"),
    };
  });

  // Top scaling opportunities (highest scaling_opportunity_score)
  const topScaling = [...data].sort((a, b) => b.scaling_opportunity_score - a.scaling_opportunity_score).slice(0, 5);

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
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky">Demand Signal Analysis</span>
            </div>
            <h2 className="text-3xl md:text-4xl tracking-tight">Framework Analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">
              7&#x2192;5&#x2192;1 Demand Signaling Framework — dimension alignment, domain interactions &amp; country comparisons
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-6 mr-4">
              <MiniStat label="Geo Priority" value={avg(data, "geography_priority_score")} color="#0d9488" />
              <MiniStat label="Demand Sig." value={avg(data, "demand_signals_score")} color="#f59e0b" />
              <MiniStat label="Inv. Supply" value={avg(data, "innovation_supply_score")} color="#8b5cf6" />
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
          {/* 5-Dimension Alignment Radar */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 rounded-full" style={{ background: "#0f766e" }} />
              <h3 className="text-sm font-display">5-Dimension Alignment Radar</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">
              Demand Gaps axis is inverted — higher = fewer gaps = better alignment
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 9 }} />
                <Radar dataKey="value" stroke="#0f766e" fill="#0f766e" fillOpacity={0.18} strokeWidth={2.5} dot={{ r: 4, fill: "#0f766e" }} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 9 Domain→Dimension Interaction Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card !p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 rounded-full" style={{ background: "#8b5cf6" }} />
              <h3 className="text-sm font-display">Domain&#x2192;Dimension Interactions</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">
              9 causal pathways: how 7 data domains drive the 5 signaling dimensions
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={interactionData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" width={68} tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {interactionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Country Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4 md:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1 h-5 rounded-full" style={{ background: "#0ea5e9" }} />
              <h3 className="text-sm font-display">Country Dimension Comparison</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Demand Signals, Innovation Supply, and Investment Feasibility by country</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={countryDimData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="country" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Demand Sig." fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Innov. Supply" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Inv. Feasib." fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card !p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-5 rounded-full" style={{ background: "#0f766e" }} />
              <h3 className="text-sm font-display">Top Scaling Opportunities</h3>
            </div>
            <div className="space-y-2">
              {topScaling.map((item, i) => (
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
                  <span className="text-sm font-display font-bold" style={{ color: "#0f766e" }}>
                    {item.scaling_opportunity_score}
                  </span>
                </div>
              ))}
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
  );
};

export default Analysis;
