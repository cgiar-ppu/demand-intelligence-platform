import { motion } from "framer-motion";

const PILLARS = [
  {
    title: "System Need",
    icon: "🔴",
    color: "hsl(var(--rose))",
    description: "Measures the gap between what a population requires and what currently exists. High need signals unmet demand for agricultural innovations — drought-resilient seeds, post-harvest infrastructure, or financial tools.",
  },
  {
    title: "Effective Demand",
    icon: "🔵",
    color: "hsl(var(--sky))",
    description: "Captures willingness and ability to adopt an innovation. Demand goes beyond need — it includes market readiness, purchasing power, institutional support, and user awareness.",
  },
  {
    title: "Supply Readiness",
    icon: "🟣",
    color: "hsl(var(--violet))",
    description: "Evaluates how mature and available the innovation's supply chain is — from R&D pipelines and manufacturing to distribution networks and last-mile delivery.",
  },
  {
    title: "Scaling Opportunity",
    icon: "🟢",
    color: "hsl(var(--emerald))",
    description: "Assesses the potential for an innovation to move from pilot to large-scale impact. Considers geographic suitability, policy readiness, and ecosystem capacity.",
  },
];

const DOMAINS = [
  { title: "Scaling Context", description: "Climate risks, infrastructure readiness, geographic value-chain suitability, and socio-economic conditions that define where an innovation can scale." },
  { title: "Sector", description: "Productivity, efficiency, system constraints, and the Water-Energy-Food (WEF) nexus landscape determining sectoral fit." },
  { title: "Stakeholders & Networks", description: "Actor profiles, adoption willingness, organizational capacities, and power dynamics within the innovation network." },
  { title: "Enabling Environment", description: "Policy frameworks, regulatory conditions, institutional capacity, and governance quality that support or hinder scaling." },
  { title: "Resource & Investment Ecosystem", description: "Funding sources, access to finance, financial instruments, and risk-return profiles for innovation investment." },
  { title: "Market & Market Intelligence", description: "Demand trends, price volatility, value-chain margins, consumer preferences, and market access conditions." },
  { title: "Innovation Portfolio", description: "Inventory of innovations, maturity/readiness levels, performance evidence, adaptability, and delivery models." },
];

const SIGNALS = [
  { label: "High Gap Signal", color: "signal-high", hex: "hsl(0, 85%, 55%)", meaning: "Critical unmet need — the innovation is highly needed but demand, supply, or scaling capacity is far behind. Immediate attention required." },
  { label: "Moderate Signal", color: "signal-medium", hex: "hsl(45, 95%, 55%)", meaning: "Partial alignment exists — some ecosystem elements are in place but gaps remain in one or more pillars. Strategic investment can close the gap." },
  { label: "Low Gap Signal", color: "signal-low", hex: "hsl(145, 65%, 45%)", meaning: "Strong alignment — need, demand, supply, and scaling are well-matched. Focus on maintaining momentum and documenting best practices." },
];

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const Extract = () => (
  <main className="max-w-[1100px] mx-auto px-6 py-10 md:px-10 space-y-12">
    {/* Hero */}
    <motion.header {...fade} className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">DIIS Platform</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-display tracking-tight leading-tight">
        Demand-Led Innovation<br />Intelligence System
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        A decision-support platform that maps the gap between <strong className="text-foreground">what communities need</strong> and
        <strong className="text-foreground"> what innovation ecosystems deliver</strong> — powered by multi-dimensional scoring,
        geospatial intelligence, and evidence-based analytics.
      </p>
    </motion.header>

    {/* What it does */}
    <motion.section {...fade} transition={{ delay: 0.1 }}>
      <h2 className="text-2xl font-display mb-4">What DIIS Does</h2>
      <div className="glass-card !p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          DIIS tracks agricultural and development innovations across multiple countries.
          For each innovation, the system calculates a <strong className="text-foreground">Need–Demand Gap</strong> — the distance
          between how urgently a solution is needed and how effectively current systems can supply and scale it.
        </p>
        <p>
          This gap is visualized on the <strong className="text-foreground">Innovation Demand Map</strong> as glowing signals:
          red for critical gaps, yellow for moderate, green for well-aligned ecosystems. Every data point is backed by
          evidence from sources like FAOSTAT, CGIAR, World Bank LSMS, and local surveys.
        </p>
        <p>
          The platform enables governments, development finance institutions, researchers, and private sector actors to make
          <strong className="text-foreground"> evidence-based decisions</strong> about where to invest, what to scale, and which innovations
          need ecosystem strengthening.
        </p>
      </div>
    </motion.section>

    {/* 4 Core Pillars */}
    <motion.section {...fade} transition={{ delay: 0.15 }}>
      <h2 className="text-2xl font-display mb-4">The 4 Core Pillars</h2>
      <p className="text-sm text-muted-foreground mb-6">Every innovation is assessed across four foundational dimensions — each scored 0–10.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="glass-card !p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{p.icon}</span>
              <h3 className="text-base font-display" style={{ color: p.color }}>{p.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </motion.section>

    {/* Signal Legend */}
    <motion.section {...fade} transition={{ delay: 0.2 }}>
      <h2 className="text-2xl font-display mb-4">Signal Definitions</h2>
      <p className="text-sm text-muted-foreground mb-6">
        The Innovation Demand Map uses colour-coded glowing signals to communicate gap severity at a glance.
      </p>
      <div className="space-y-3">
        {SIGNALS.map((s) => (
          <div key={s.label} className="glass-card !p-4 flex items-start gap-4">
            <span className={`h-4 w-4 rounded-full ${s.color} shrink-0 mt-0.5`} />
            <div>
              <h4 className="text-sm font-bold" style={{ color: s.hex }}>{s.label}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.meaning}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>

    {/* 7 Scaling Domains */}
    <motion.section {...fade} transition={{ delay: 0.25 }}>
      <h2 className="text-2xl font-display mb-4">7 Scaling Domains</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Behind every insight, seven analytical domains power the scoring engine. They define the enabling conditions for innovation scaling.
      </p>
      <div className="space-y-3">
        {DOMAINS.map((d, i) => (
          <div key={d.title} className="glass-card !p-4 flex items-start gap-4">
            <span className="text-xs font-bold text-primary bg-primary/10 rounded-full h-7 w-7 flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div>
              <h4 className="text-sm font-bold text-foreground">{d.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>

    {/* Methodology */}
    <motion.section {...fade} transition={{ delay: 0.3 }}>
      <h2 className="text-2xl font-display mb-4">Methodology & Scoring</h2>
      <div className="glass-card !p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          All scores are on a <strong className="text-foreground">0–10 continuous scale</strong> derived from multi-source data synthesis.
          The scoring tiers are:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { tier: "Nascent", range: "0–3", color: "hsl(var(--rose))" },
            { tier: "Emerging", range: "4–6", color: "hsl(var(--amber))" },
            { tier: "Strategic", range: "7–8", color: "hsl(var(--sky))" },
            { tier: "Scaled", range: "9–10", color: "hsl(var(--emerald))" },
          ].map((t) => (
            <div key={t.tier} className="text-center p-3 rounded-xl border" style={{ borderColor: t.color + "40" }}>
              <p className="text-lg font-display" style={{ color: t.color }}>{t.range}</p>
              <p className="text-xs font-bold mt-1" style={{ color: t.color }}>{t.tier}</p>
            </div>
          ))}
        </div>
        <p>
          The <strong className="text-foreground">6 Interaction Pillars</strong> capture bi-directional relationships
          (e.g. Need↔Supply, Demand↔Scaling) to reveal systemic bottlenecks.
          The <strong className="text-foreground">Strategic Gap</strong> (Need − Demand) determines signal severity on the map.
        </p>
        <p>
          Data sources include FAOSTAT, CGIAR research outputs, World Bank LSMS, AfDB diagnostics,
          GLoMIP price intelligence, IRENA renewable energy data, WFP food prices, and local survey evidence.
        </p>
      </div>
    </motion.section>

    {/* How to use */}
    <motion.section {...fade} transition={{ delay: 0.35 }}>
      <h2 className="text-2xl font-display mb-4">How to Use the Platform</h2>
      <div className="glass-card !p-6 space-y-3 text-sm text-muted-foreground leading-relaxed">
        <div className="flex gap-3 items-start">
          <span className="text-primary font-bold">1.</span>
          <p><strong className="text-foreground">Search & Filter</strong> — Use the search bar and dropdowns to find innovations by name, country, or signal type.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-primary font-bold">2.</span>
          <p><strong className="text-foreground">Explore the Map</strong> — Glowing markers show gap signals geospatially. Click any marker to drill into that innovation.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-primary font-bold">3.</span>
          <p><strong className="text-foreground">Review Insights</strong> — Domain charts update dynamically. Compare scaling context, stakeholders, market intelligence, and more.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-primary font-bold">4.</span>
          <p><strong className="text-foreground">Deep Analysis</strong> — Click the side panel for pillar radar, interaction nexus, domain scores, and evidence traceability.</p>
        </div>
        <div className="flex gap-3 items-start">
          <span className="text-primary font-bold">5.</span>
          <p><strong className="text-foreground">Export Reports</strong> — Generate a professional 5-page PDF with executive summary, trends, risks, and strategic recommendations.</p>
        </div>
      </div>
    </motion.section>

    <footer className="text-center text-xs text-muted-foreground pb-8">
      DIIS — Demand-Led Innovation Intelligence System · Built for evidence-based decision making
    </footer>
  </main>
);

export default Extract;
