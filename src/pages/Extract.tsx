import { motion } from "framer-motion";

const DOMAINS = [
  {
    num: 1,
    title: "Scaling Context",
    question: "Where does demand occur, and under what conditions?",
    description: "Geographies, regions, value chains, and ecosystems. Determines biophysical, socio-economic, and institutional conditions that define where and how innovations can scale.",
    feeds: "Geography & Priority",
    color: "#0d9488",
    elements: ["Biophysical conditions", "Socio-economic profiles", "Value chain systems", "Geographic suitability", "Risk & vulnerability"],
  },
  {
    num: 2,
    title: "Sector",
    question: "What system or problem is being addressed?",
    description: "Food, seed, and water systems, agriculture, aquaculture, agribusiness, and climate actions. Defines the sectoral landscape and performance constraints.",
    feeds: "Demand Signals",
    color: "#f59e0b",
    elements: ["Sector performance", "System constraints", "WEF nexus", "Investment flows", "Sectoral targets"],
  },
  {
    num: 3,
    title: "Stakeholders",
    question: "Who shapes and legitimizes demand?",
    description: "Public, private, investors, NGOs, researchers, and farmers. Captures networks, power relations, and capacity — who articulates demand and who can act on it.",
    feeds: "Demand Signals, Demand Gaps",
    color: "#8b5cf6",
    elements: ["Actor typology", "Needs & preferences", "Organizational capacity", "Network structure", "Power & inclusion"],
  },
  {
    num: 4,
    title: "Enabling Environment",
    question: "Can demand translate into action?",
    description: "Policies, institutions, governance conditions, incentives, and feasibility constraints. Determines whether demand signals can be acted upon at scale.",
    feeds: "Investment Feasibility",
    color: "#0ea5e9",
    elements: ["Policy frameworks", "Regulatory conditions", "Institutional capacity", "Public programs", "System constraints"],
  },
  {
    num: 5,
    title: "Resource & Investment Ecosystem",
    question: "Is demand fundable?",
    description: "Finance and credit systems, financial actors, instruments, and capital flows. Determines whether viable demand can attract and mobilize resources.",
    feeds: "Investment Feasibility",
    color: "#3b82f6",
    elements: ["Financial actors", "Instruments", "Infrastructure", "Capital flows", "Investment criteria"],
  },
  {
    num: 6,
    title: "Market & Market Intelligence",
    question: "Is demand economically viable?",
    description: "Demand trends, value chains, prices, consumer behavior, and market access. Informs both investment decisions and identifies structural demand gaps.",
    feeds: "Investment Feasibility, Demand Gaps",
    color: "#ec4899",
    elements: ["Demand trends", "Value chains", "Price signals", "Consumer behavior", "Market access"],
  },
  {
    num: 7,
    title: "Innovation Portfolio",
    question: "What solutions exist, are possible, and fit?",
    description: "Innovation inventory, pipeline, readiness, adoption, and delivery models. Matches available and emerging solutions to active demand signals.",
    feeds: "Innovation Supply",
    color: "#6366f1",
    elements: ["Innovation inventory", "Pipeline & readiness", "Adoption evidence", "Delivery models", "Bundling options"],
  },
];

const DIMENSIONS = [
  {
    num: 1,
    title: "Geography & Priority",
    question: "Where and for whom?",
    description: "Defines context and strategic focus. Uses Scaling Context data to establish which geographies, value chains, and populations should be the primary target of scaling efforts.",
    color: "#0d9488",
    icon: "G",
  },
  {
    num: 2,
    title: "Demand Signals",
    question: "What is needed?",
    description: "Identifies needs and opportunities from actors. Synthesizes Sector and Stakeholder data to understand what farmers, markets, and institutions are demanding.",
    color: "#f59e0b",
    icon: "D",
  },
  {
    num: 3,
    title: "Innovation Supply",
    question: "What solutions exist?",
    description: "Matches solutions to demand signals. Draws on the Innovation Portfolio domain to assess which technologies, practices, and delivery models are ready to scale.",
    color: "#8b5cf6",
    icon: "S",
  },
  {
    num: 4,
    title: "Demand Gaps",
    question: "What prevents scaling?",
    description: "Diagnoses why scaling is not happening despite apparent demand. Draws on Stakeholder and Market Intelligence data to identify adoption barriers, affordability constraints, and systemic failures.",
    color: "#f43f5e",
    icon: "G",
  },
  {
    num: 5,
    title: "Investment Feasibility",
    question: "Is it viable?",
    description: "Assesses cost-benefit, ROI, risk, and delivery mechanisms. Synthesizes Enabling Environment, Resource & Investment, and Market Intelligence to determine investment readiness.",
    color: "#0ea5e9",
    icon: "F",
  },
];

const INTERACTIONS = [
  { domain: "Scaling Context", arrow: "Geography & Priority", color: "#0d9488" },
  { domain: "Sector", arrow: "Demand Signals", color: "#f59e0b" },
  { domain: "Stakeholders", arrow: "Demand Signals", color: "#f59e0b" },
  { domain: "Stakeholders", arrow: "Demand Gaps", color: "#f43f5e" },
  { domain: "Enabling Environment", arrow: "Investment Feasibility", color: "#0ea5e9" },
  { domain: "Resource & Investment", arrow: "Investment Feasibility", color: "#0ea5e9" },
  { domain: "Market Intelligence", arrow: "Investment Feasibility", color: "#0ea5e9" },
  { domain: "Market Intelligence", arrow: "Demand Gaps", color: "#f43f5e" },
  { domain: "Innovation Portfolio", arrow: "Innovation Supply", color: "#8b5cf6" },
];

const SCENARIOS = [
  { condition: "Strong demand + weak investment feasibility", outcome: "No scaling", signal: "high", color: "#f43f5e" },
  { condition: "Strong innovation supply + weak demand signals", outcome: "Low adoption", signal: "high", color: "#f43f5e" },
  { condition: "Strong demand + unresolved demand gaps", outcome: "Stalled scaling", signal: "medium", color: "#f59e0b" },
  { condition: "All 5 dimensions aligned", outcome: "EFFECTIVE DEMAND — Scaling Opportunity", signal: "low", color: "#0f766e" },
];

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const Extract = () => (
  <main className="max-w-[1100px] mx-auto px-6 py-10 md:px-10 space-y-14">

    {/* Hero */}
    <motion.header {...fade} className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">CGIAR Demand Intelligence Platform</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-display tracking-tight leading-tight">
        The 7&#x2192;5&#x2192;1 Demand<br />Signaling Framework
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        From <strong className="text-foreground">Data Signal Domains</strong> to{" "}
        <strong className="text-foreground">Demand Signaling Dimensions</strong> to{" "}
        <strong className="text-foreground">Effective Demand</strong> — a structured pathway to scaling opportunity.
      </p>
    </motion.header>

    {/* Framework Overview — Concentric Layers */}
    <motion.section {...fade} transition={{ delay: 0.05 }}>
      <h2 className="text-2xl font-display mb-2">Framework Overview</h2>
      <p className="text-sm text-muted-foreground mb-6">
        The framework operates in three concentric layers. The outer ring provides raw intelligence. The inner ring sequences decisions. The center is the convergence point.
      </p>
      <div className="glass-card !p-8">
        <div className="flex flex-col items-center gap-0">
          {/* Outer Layer */}
          <div className="w-full max-w-2xl rounded-2xl border-2 p-6 text-center relative" style={{ borderColor: "#6366f1" + "60" }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#6366f1" }}>Outer Layer — 7 Data Signal Domains</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Sources, shapers, and filters of demand signals</p>
            <div className="flex flex-wrap justify-center gap-2">
              {DOMAINS.map((d) => (
                <span key={d.num} className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ color: d.color, borderColor: d.color + "40", background: d.color + "12" }}>
                  {d.num}. {d.title}
                </span>
              ))}
            </div>

            {/* Inner Layer */}
            <div className="mt-6 mx-auto max-w-lg rounded-xl border-2 p-5 text-center relative" style={{ borderColor: "#0d9488" + "60" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#0d9488" }}>Inner Layer — 5 Demand Signaling Dimensions</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Sequenced decision framework</p>
              <div className="flex flex-wrap justify-center gap-2">
                {DIMENSIONS.map((d) => (
                  <span key={d.num} className="text-[10px] font-bold px-2.5 py-1 rounded-full border" style={{ color: d.color, borderColor: d.color + "40", background: d.color + "12" }}>
                    {d.num}. {d.title}
                  </span>
                ))}
              </div>

              {/* Center */}
              <div className="mt-5 mx-auto max-w-xs rounded-xl p-4 text-center" style={{ background: "#0f766e", border: "2px solid #0f766e" }}>
                <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">Center — Convergence Point</p>
                <p className="text-base font-bold text-white">Scaling Opportunity</p>
                <p className="text-[10px] text-white/60 mt-1">Where effective demand emerges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    {/* Need → Demand → Effective Demand */}
    <motion.section {...fade} transition={{ delay: 0.1 }}>
      <h2 className="text-2xl font-display mb-2">Need &#x2192; Demand &#x2192; Effective Demand</h2>
      <p className="text-sm text-muted-foreground mb-6">
        The framework tracks the progression from observed field problems to actionable scaling opportunities.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: "NEED", desc: "Problem observed in the field (e.g. crops fail due to drought)", color: "#f43f5e", note: "Not yet an investment signal" },
          { label: "DEMAND", desc: "Priority articulated by institutions, policymakers, or markets", color: "#f59e0b", note: "Needs systemic backing" },
          { label: "DEMAND GAP", desc: "Difference between need for solution and ability to access, adopt, or use it", color: "#8b5cf6", note: "Structural barrier" },
          { label: "EFFECTIVE DEMAND", desc: "Demand backed by systemic capacity, investment readiness, and scaling conditions", color: "#0f766e", note: "Scaling is feasible" },
        ].map((step, i) => (
          <div key={step.label} className="relative glass-card !p-4 text-center">
            {i < 3 && (
              <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground text-lg font-bold">&#x2192;</div>
            )}
            <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: step.color }}>{step.label}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            <div className="mt-2 text-[10px] italic text-muted-foreground">{step.note}</div>
          </div>
        ))}
      </div>
    </motion.section>

    {/* 7 Data Signal Domains */}
    <motion.section {...fade} transition={{ delay: 0.15 }}>
      <h2 className="text-2xl font-display mb-2">The 7 Data Signal Domains</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Outer layer of the framework. Each domain is a source, shaper, or filter of demand signals — providing the raw intelligence that feeds the 5 dimensions.
      </p>
      <div className="space-y-3">
        {DOMAINS.map((d) => (
          <div key={d.num} className="glass-card !p-5">
            <div className="flex items-start gap-4">
              <span
                className="text-sm font-bold rounded-full h-8 w-8 flex items-center justify-center shrink-0 text-white"
                style={{ background: d.color }}
              >
                {d.num}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h4 className="text-base font-bold" style={{ color: d.color }}>{d.title}</h4>
                  <span className="text-[10px] italic text-muted-foreground">&#x2192; Feeds: {d.feeds}</span>
                </div>
                <p className="text-[11px] font-semibold text-muted-foreground mb-2">"{d.question}"</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{d.description}</p>
                <div className="flex flex-wrap gap-2">
                  {d.elements.map((el) => (
                    <span key={el} className="text-[10px] px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: d.color + "40", color: d.color, background: d.color + "0e" }}>
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>

    {/* 5 Demand Signaling Dimensions */}
    <motion.section {...fade} transition={{ delay: 0.2 }}>
      <h2 className="text-2xl font-display mb-2">The 5 Demand Signaling Dimensions</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Inner layer of the framework. These five sequenced dimensions form the decision pathway from context to investment. All must align for effective demand.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DIMENSIONS.map((d) => (
          <div key={d.num} className="glass-card !p-5">
            <div className="flex items-center gap-3 mb-3">
              <span
                className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-lg shrink-0"
                style={{ background: d.color }}
              >
                {d.num}
              </span>
              <div>
                <h4 className="text-sm font-bold" style={{ color: d.color }}>{d.title}</h4>
                <p className="text-[11px] text-muted-foreground italic">{d.question}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
          </div>
        ))}
        {/* Scaling Opportunity — center */}
        <div className="glass-card !p-5" style={{ borderColor: "#0f766e40", background: "#0f766e08" }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shrink-0" style={{ background: "#0f766e" }}>
              &#x2605;
            </span>
            <div>
              <h4 className="text-sm font-bold" style={{ color: "#0f766e" }}>Scaling Opportunity</h4>
              <p className="text-[11px] text-muted-foreground italic">Convergence Center</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Where all 5 dimensions align. Effective demand emerges when Geography, Demand Signals, Innovation Supply, minimal Gaps, and Investment Feasibility converge.
          </p>
        </div>
      </div>
    </motion.section>

    {/* Domain→Dimension Mapping */}
    <motion.section {...fade} transition={{ delay: 0.25 }}>
      <h2 className="text-2xl font-display mb-2">How Domains Feed Dimensions</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Each of the 7 data signal domains has a defined causal pathway to one or more of the 5 dimensions. There are 9 interaction pathways in total.
      </p>
      <div className="glass-card !p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/20" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
              <th className="text-left text-[10px] uppercase text-muted-foreground py-3 px-4 font-bold tracking-wider">Data Signal Domain</th>
              <th className="text-left text-[10px] uppercase text-muted-foreground py-3 px-4 font-bold tracking-wider">Guiding Question</th>
              <th className="text-left text-[10px] uppercase text-muted-foreground py-3 px-4 font-bold tracking-wider">Feeds Dimension</th>
            </tr>
          </thead>
          <tbody>
            {INTERACTIONS.map((ix, i) => {
              const domain = DOMAINS.find(d => d.title === ix.domain);
              return (
                <tr key={i} className="border-b hover:bg-primary/5 transition" style={{ borderColor: "hsl(var(--glass-border) / 0.04)" }}>
                  <td className="py-2.5 px-4 font-semibold" style={{ color: domain?.color }}>{ix.domain}</td>
                  <td className="py-2.5 px-4 text-xs text-muted-foreground italic">"{domain?.question}"</td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ color: ix.color, borderColor: ix.color + "40", background: ix.color + "12" }}>
                      {ix.arrow}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>

    {/* Alignment Scenarios */}
    <motion.section {...fade} transition={{ delay: 0.3 }}>
      <h2 className="text-2xl font-display mb-2">Alignment Scenarios</h2>
      <p className="text-sm text-muted-foreground mb-6">
        The gap signal reflects whether the 5 dimensions are aligned. Only when all converge does effective demand emerge and scaling become feasible.
      </p>
      <div className="space-y-3">
        {SCENARIOS.map((s) => (
          <div key={s.condition} className="glass-card !p-4 flex items-start gap-4">
            <span
              className={`h-4 w-4 rounded-full shrink-0 mt-0.5 ${s.signal === "high" ? "signal-high" : s.signal === "medium" ? "signal-medium" : "signal-low"}`}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">{s.condition}</span>
                <span className="text-xs font-bold" style={{ color: s.color }}>&#x2192; {s.outcome}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>

    {/* Signal Definitions */}
    <motion.section {...fade} transition={{ delay: 0.35 }}>
      <h2 className="text-2xl font-display mb-2">Signal Definitions</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Gap signals on the Innovation Demand Map reflect the Demand Gaps dimension score — the severity of barriers preventing scaling.
      </p>
      <div className="space-y-3">
        {[
          { label: "High Gap Signal", cssClass: "signal-high", color: "hsl(0, 85%, 55%)", meaning: "Demand Gaps score above 6 — severe structural barriers are preventing scaling despite apparent demand. Immediate systemic intervention required." },
          { label: "Moderate Signal", cssClass: "signal-medium", color: "hsl(45, 95%, 55%)", meaning: "Demand Gaps score 3-6 — partial gaps exist. Some ecosystem elements are in place, but targeted investment is needed to bridge remaining barriers." },
          { label: "Low Gap Signal", cssClass: "signal-low", color: "hsl(145, 65%, 45%)", meaning: "Demand Gaps score below 3 — gaps are manageable. Scaling conditions are broadly favorable. Focus on sustaining momentum and evidence documentation." },
        ].map((s) => (
          <div key={s.label} className="glass-card !p-4 flex items-start gap-4">
            <span className={`h-4 w-4 rounded-full ${s.cssClass} shrink-0 mt-0.5`} />
            <div>
              <h4 className="text-sm font-bold" style={{ color: s.color }}>{s.label}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.meaning}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>

    {/* Methodology */}
    <motion.section {...fade} transition={{ delay: 0.4 }}>
      <h2 className="text-2xl font-display mb-2">Scoring Methodology</h2>
      <div className="glass-card !p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          All scores are on a <strong className="text-foreground">0-10 continuous scale</strong> derived from multi-source data synthesis.
          The <strong className="text-foreground">Demand Gaps</strong> dimension is intentionally inverse: a higher score means more severe gaps and worse conditions for scaling.
        </p>
        <p>
          The <strong className="text-foreground">Scaling Opportunity</strong> score is computed as the average of the 5 dimensions with Demand Gaps inverted:
          <code className="ml-2 text-xs bg-muted/50 px-2 py-0.5 rounded">(Geo + Dem + Sup + (10 - Gaps) + Feas) / 5</code>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { tier: "Nascent", range: "0-3", color: "hsl(var(--rose))" },
            { tier: "Emerging", range: "4-6", color: "hsl(var(--amber))" },
            { tier: "Strategic", range: "7-8", color: "hsl(var(--sky))" },
            { tier: "Scaled", range: "9-10", color: "hsl(var(--emerald))" },
          ].map((t) => (
            <div key={t.tier} className="text-center p-3 rounded-xl border" style={{ borderColor: t.color + "40" }}>
              <p className="text-lg font-display" style={{ color: t.color }}>{t.range}</p>
              <p className="text-xs font-bold mt-1" style={{ color: t.color }}>{t.tier}</p>
            </div>
          ))}
        </div>
        <p>
          Data sources include FAOSTAT, CGIAR research outputs, World Bank LSMS, AfDB diagnostics,
          GLoMIP price intelligence, IRENA renewable energy data, WFP food prices, and local survey evidence.
        </p>
      </div>
    </motion.section>

    {/* How to Use */}
    <motion.section {...fade} transition={{ delay: 0.45 }}>
      <h2 className="text-2xl font-display mb-2">How to Use the Platform</h2>
      <div className="glass-card !p-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        {[
          { step: "1", title: "Intelligence Hub", desc: "View all innovations on the map and table. The 5-dimension scores appear in the Intelligence Matrix. Red signals indicate critical demand gaps requiring priority attention." },
          { step: "2", title: "Signal Analysis", desc: "Use the 5-Dimension Alignment Radar to see aggregate dimensional strength. The 9 Domain\u2192Dimension Interaction chart shows which causal pathways are strong or weak." },
          { step: "3", title: "Select an Innovation", desc: "Click any innovation to open the side panel. View the full dimension radar, all 9 interaction scores, 7 domain scores, and evidence traceability." },
          { step: "4", title: "Domain Deep Dive", desc: "Navigate the 7 domain tabs in Signal Analysis to explore sector performance, stakeholder networks, policy strength, capital flows, market signals, and portfolio readiness." },
          { step: "5", title: "Data Ingestion", desc: "Submit new evidence sources tagged to a Demand Signaling Dimension and Data Signal Domain. The platform maps incoming evidence to the 7\u21925\u21921 framework automatically." },
          { step: "6", title: "Export Reports", desc: "Generate a professional 6-page PDF with executive summary, 5-dimension scores, 9 interaction pathways, 7 domain assessment, risks, opportunities, and strategic recommendations." },
        ].map((s) => (
          <div key={s.step} className="flex gap-3 items-start">
            <span className="text-primary font-bold text-sm shrink-0 w-5">{s.step}.</span>
            <p><strong className="text-foreground">{s.title}</strong> — {s.desc}</p>
          </div>
        ))}
      </div>
    </motion.section>

    <footer className="text-center text-xs text-muted-foreground pb-8">
      CGIAR Demand Intelligence Platform · 7&#x2192;5&#x2192;1 Demand Signaling Framework · Evidence-based scaling decisions
    </footer>
  </main>
);

export default Extract;
