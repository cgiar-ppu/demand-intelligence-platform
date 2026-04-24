import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useBrief, type PinnedItem, type PinnedItemType } from "@/lib/BriefContext";

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TYPE_META: Record<
  PinnedItemType,
  { label: string; plural: string; color: string; icon: JSX.Element }
> = {
  signal: {
    label: "Signal",
    plural: "Signals",
    color: "#10b981",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  gap: {
    label: "Gap",
    plural: "Gaps",
    color: "#ef4444",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  finding: {
    label: "Finding",
    plural: "Findings",
    color: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  innovation: {
    label: "Innovation",
    plural: "Innovations",
    color: "#0ea5e9",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  opportunity: {
    label: "Opportunity",
    plural: "Opportunities",
    color: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  chart: {
    label: "Chart",
    plural: "Charts",
    color: "#f97316",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  source: {
    label: "Source",
    plural: "Sources",
    color: "#64748b",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
};

// Order in which groups appear in the brief
const TYPE_ORDER: PinnedItemType[] = [
  "finding",
  "signal",
  "gap",
  "innovation",
  "opportunity",
  "chart",
  "source",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function groupByType(items: PinnedItem[]): Map<PinnedItemType, PinnedItem[]> {
  const map = new Map<PinnedItemType, PinnedItem[]>();
  for (const t of TYPE_ORDER) {
    const group = items.filter((i) => i.type === t);
    if (group.length > 0) map.set(t, group);
  }
  return map;
}

function averageScore(items: PinnedItem[]): string {
  const scored = items.filter((i) => i.score != null);
  if (scored.length === 0) return "N/A";
  return (scored.reduce((a, b) => a + (b.score ?? 0), 0) / scored.length).toFixed(1);
}

function confidenceLevel(items: PinnedItem[]): {
  label: string;
  color: string;
  description: string;
} {
  const typeCount = new Set(items.map((i) => i.type)).size;
  const total = items.length;

  if (total >= 6 && typeCount >= 3) {
    return {
      label: "High",
      color: "#10b981",
      description: "Brief draws from multiple evidence types with strong coverage",
    };
  }
  if (total >= 3 && typeCount >= 2) {
    return {
      label: "Medium",
      color: "#f59e0b",
      description: "Brief has moderate evidence diversity; consider adding more types",
    };
  }
  return {
    label: "Low",
    color: "#ef4444",
    description: "Brief has limited evidence; pin more items from different pages to strengthen",
  };
}

function deriveMainTheme(items: PinnedItem[]): string {
  // Extract keywords from titles, pick the most common meaningful word
  const stopWords = new Set([
    "the", "and", "for", "with", "from", "this", "that", "into", "have",
    "has", "are", "was", "were", "been", "will", "can", "may", "its",
    "not", "but", "all", "how", "what", "when", "who", "which", "their",
    "them", "there", "than", "more", "also", "very", "most", "some",
    "between", "through", "high", "low", "new", "key", "across",
  ]);
  const freq: Record<string, number> = {};
  for (const item of items) {
    const words = item.title.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && !stopWords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    }
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return "agricultural innovation";
  // Capitalize
  const top = sorted[0][0];
  return top.charAt(0).toUpperCase() + top.slice(1);
}

function deriveCountry(items: PinnedItem[]): string {
  // Look for country names in titles/summaries
  const countries = ["Nigeria", "Kenya", "Ethiopia", "Bangladesh", "Zambia", "India", "Ghana", "Tanzania"];
  const freq: Record<string, number> = {};
  for (const item of items) {
    const text = `${item.title} ${item.summary}`;
    for (const c of countries) {
      if (text.includes(c)) {
        freq[c] = (freq[c] || 0) + 1;
      }
    }
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : "Nigeria";
}

function generatePlainTextBrief(
  items: PinnedItem[],
  grouped: Map<PinnedItemType, PinnedItem[]>,
): string {
  const theme = deriveMainTheme(items);
  const country = deriveCountry(items);
  const conf = confidenceLevel(items);

  const lines: string[] = [];
  lines.push("=== DECISION BRIEF ===");
  lines.push("");
  lines.push(`Decision Question: What evidence supports action on ${theme} in ${country}?`);
  lines.push("");

  const findings = grouped.get("finding");
  if (findings) {
    lines.push("--- Key Findings ---");
    for (const f of findings) {
      lines.push(`  - [${TYPE_META[f.type].label}] ${f.title}`);
      lines.push(`    ${f.summary}`);
    }
    lines.push("");
  }

  const signals = grouped.get("signal");
  if (signals) {
    lines.push("--- Demand Evidence ---");
    lines.push(`  ${signals.length} signal(s), average strength: ${averageScore(signals)}`);
    for (const s of signals) {
      lines.push(`  - ${s.title}${s.score != null ? ` (score: ${s.score})` : ""}`);
    }
    lines.push("");
  }

  const gaps = grouped.get("gap");
  if (gaps) {
    lines.push("--- Gap Diagnosis ---");
    lines.push(`  ${gaps.length} gap(s), average severity: ${averageScore(gaps)}`);
    for (const g of gaps) {
      lines.push(`  - ${g.title}${g.score != null ? ` (severity: ${g.score})` : ""}`);
    }
    lines.push("");
  }

  const innovations = grouped.get("innovation");
  if (innovations) {
    lines.push("--- Innovation Supply Assessment ---");
    lines.push(`  ${innovations.length} innovation(s), avg scaling opportunity: ${averageScore(innovations)}`);
    for (const inn of innovations) {
      lines.push(`  - ${inn.title}${inn.score != null ? ` (score: ${inn.score})` : ""}`);
    }
    lines.push("");
  }

  // Recommended next steps
  lines.push("--- Recommended Next Steps ---");
  if (gaps) lines.push(`  - Address identified gaps: ${gaps.map((g) => g.title).join("; ")}`);
  if (findings) lines.push(`  - Act on strategic findings: ${findings.map((f) => f.title).join("; ")}`);
  if (innovations) lines.push(`  - Evaluate innovation fit: ${innovations.map((i) => i.title).join("; ")}`);
  if (!gaps && !findings && !innovations) lines.push("  - Gather additional evidence to form actionable steps");
  lines.push("");

  // Sources
  const sources = items.filter((i) => i.source).map((i) => i.source!);
  const uniqueSources = Array.from(new Set(sources));
  if (uniqueSources.length > 0) {
    lines.push("--- Evidence Sources ---");
    for (const s of uniqueSources) lines.push(`  - ${s}`);
    lines.push("");
  }

  lines.push(`Confidence Level: ${conf.label}`);
  lines.push(`  ${conf.description}`);
  lines.push("");
  lines.push(`Brief generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  lines.push(`Total evidence items: ${items.length}`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypeBadge({ type }: { type: PinnedItemType }) {
  const meta = TYPE_META[type];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{
        backgroundColor: meta.color + "18",
        color: meta.color,
      }}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

function PinnedItemCard({
  item,
  onUnpin,
}: {
  item: PinnedItem;
  onUnpin: (id: string) => void;
}) {
  const meta = TYPE_META[item.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ duration: 0.2 }}
      className="glass-card !p-4 group relative"
    >
      <button
        onClick={() => onUnpin(item.id)}
        title="Unpin item"
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center
          bg-muted/50 text-muted-foreground hover:bg-destructive/20 hover:text-red-400
          opacity-0 group-hover:opacity-100 transition-all"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: meta.color + "18", color: meta.color }}
        >
          {meta.icon}
        </div>
        <div className="min-w-0 flex-1 pr-6">
          <div className="flex items-center gap-2 mb-1">
            <TypeBadge type={item.type} />
            {item.score != null && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: meta.color + "18",
                  color: meta.color,
                }}
              >
                {item.score}/10
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-foreground leading-snug">{item.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
          {item.source && (
            <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono truncate">
              Source: {item.source}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Large pin icon */}
      <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-muted-foreground/40">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
      </div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
        Your Decision Brief is empty
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        Start by exploring Demand Areas, Country Intelligence, or Strategic Findings
        and pin items you want to include in your brief.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        {[
          { to: "/v2/demand", label: "Demand Areas", color: "#10b981" },
          { to: "/v2/country", label: "Country Intelligence", color: "#0ea5e9" },
          { to: "/v2/findings", label: "Strategic Findings", color: "#8b5cf6" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all hover:scale-105"
            style={{
              backgroundColor: link.color + "15",
              color: link.color,
              border: `1px solid ${link.color}30`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            {link.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function BriefSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
          {number}
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          {title}
        </h3>
      </div>
      <div className="pl-7">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

function DecisionBrief() {
  const { pinnedItems, unpinItem, clearBrief, briefCount } = useBrief();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const grouped = groupByType(pinnedItems);
  const hasItems = pinnedItems.length > 0;

  const theme = hasItems ? deriveMainTheme(pinnedItems) : "";
  const country = hasItems ? deriveCountry(pinnedItems) : "";
  const confidence = hasItems ? confidenceLevel(pinnedItems) : null;

  const signals = grouped.get("signal") || [];
  const gaps = grouped.get("gap") || [];
  const findings = grouped.get("finding") || [];
  const innovations = grouped.get("innovation") || [];

  const allSources = Array.from(
    new Set(pinnedItems.filter((i) => i.source).map((i) => i.source!)),
  );

  const handleCopy = async () => {
    const text = generatePlainTextBrief(pinnedItems, grouped);
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleClear = () => {
    clearBrief();
    setShowClearConfirm(false);
  };

  return (
    <div className="min-h-[calc(100vh-57px)] pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8">
        {/* ---- Hero ---- */}
        <motion.div {...fadeUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight">Decision Brief</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Compose evidence-backed intelligence for program, donor, or partner decisions
              </p>
            </div>
            {hasItems && (
              <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
                {briefCount} item{briefCount !== 1 ? "s" : ""} pinned
              </span>
            )}
          </div>
        </motion.div>

        {!hasItems ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ---- Left: Pinned Items ---- */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-5 space-y-6"
            >
              {/* Export actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                    bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {copySuccess ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy as Text
                    </>
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      border border-destructive/30 text-red-400 hover:bg-destructive/10 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Brief
                  </button>

                  <AnimatePresence>
                    {showClearConfirm && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 mt-2 z-50 glass-card !p-3 w-56"
                      >
                        <p className="text-xs text-muted-foreground mb-3">
                          Remove all {briefCount} pinned items? This cannot be undone.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={handleClear}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded bg-destructive text-destructive-foreground hover:opacity-90"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded bg-muted text-muted-foreground hover:bg-muted/80"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Grouped pinned items */}
              <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-6">
                {Array.from(grouped.entries()).map(([type, items]) => {
                  const meta = TYPE_META[type];
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span
                          className="text-[10px] font-bold uppercase tracking-[0.2em]"
                          style={{ color: meta.color }}
                        >
                          {meta.plural}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({items.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {items.map((item) => (
                            <PinnedItemCard
                              key={item.id}
                              item={item}
                              onUnpin={unpinItem}
                            />
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* ---- Right: Brief Preview ---- */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-7"
            >
              <div
                className="rounded-xl border shadow-lg overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(210 20% 98%) 0%, hsl(220 14% 96%) 100%)",
                  borderColor: "hsl(220 13% 91%)",
                }}
              >
                {/* Document header */}
                <div className="px-6 py-5 border-b" style={{ borderColor: "hsl(220 13% 91%)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">Decision Brief</h2>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Auto-generated from {briefCount} evidence item{briefCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {confidence && (
                      <span
                        className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: confidence.color + "18",
                          color: confidence.color,
                        }}
                      >
                        {confidence.label} confidence
                      </span>
                    )}
                  </div>
                </div>

                {/* Document body */}
                <div className="px-6 py-5 space-y-1 text-slate-700">
                  {/* 1. Decision Question */}
                  <BriefSection number={1} title="Decision Question">
                    <p className="text-sm italic leading-relaxed text-slate-600">
                      What evidence supports action on <strong>{theme}</strong> in{" "}
                      <strong>{country}</strong>?
                    </p>
                  </BriefSection>

                  {/* 2. Key Findings */}
                  {findings.length > 0 && (
                    <BriefSection number={2} title="Key Findings">
                      <ul className="space-y-2">
                        {findings.map((f) => (
                          <li key={f.id} className="flex items-start gap-2">
                            <TypeBadge type={f.type} />
                            <div>
                              <p className="text-sm font-medium text-slate-800">{f.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{f.summary}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </BriefSection>
                  )}

                  {/* 3. Demand Evidence */}
                  {signals.length > 0 && (
                    <BriefSection number={findings.length > 0 ? 3 : 2} title="Demand Evidence">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-emerald-600">{signals.length}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Signal{signals.length !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-emerald-600">{averageScore(signals)}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Strength</p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {signals.map((s) => (
                          <li key={s.id} className="text-xs text-slate-600 flex items-baseline gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                            {s.title}
                            {s.score != null && (
                              <span className="text-[10px] text-emerald-600 font-semibold ml-auto shrink-0">
                                {s.score}/10
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </BriefSection>
                  )}

                  {/* 4. Gap Diagnosis */}
                  {gaps.length > 0 && (
                    <BriefSection
                      number={
                        1 + (findings.length > 0 ? 1 : 0) + (signals.length > 0 ? 1 : 0) + 1
                      }
                      title="Gap Diagnosis"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-red-500">{gaps.length}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Gap{gaps.length !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-red-500">{averageScore(gaps)}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Severity</p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {gaps.map((g) => (
                          <li key={g.id} className="text-xs text-slate-600 flex items-baseline gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-red-400 shrink-0 mt-1.5" />
                            {g.title}
                            {g.score != null && (
                              <span className="text-[10px] text-red-500 font-semibold ml-auto shrink-0">
                                {g.score}/10
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </BriefSection>
                  )}

                  {/* 5. Innovation Supply Assessment */}
                  {innovations.length > 0 && (
                    <BriefSection
                      number={
                        1 +
                        (findings.length > 0 ? 1 : 0) +
                        (signals.length > 0 ? 1 : 0) +
                        (gaps.length > 0 ? 1 : 0) +
                        1
                      }
                      title="Innovation Supply Assessment"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-sky-50 dark:bg-sky-950/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-sky-500">{innovations.length}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Innovation{innovations.length !== 1 ? "s" : ""}</p>
                        </div>
                        <div className="bg-sky-50 dark:bg-sky-950/30 rounded-lg p-3 text-center">
                          <p className="text-2xl font-bold text-sky-500">{averageScore(innovations)}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Avg Scaling Score</p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {innovations.map((inn) => (
                          <li key={inn.id} className="text-xs text-slate-600 flex items-baseline gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                            {inn.title}
                            {inn.score != null && (
                              <span className="text-[10px] text-sky-500 font-semibold ml-auto shrink-0">
                                {inn.score}/10
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </BriefSection>
                  )}

                  {/* 6. Recommended Next Steps */}
                  <BriefSection
                    number={
                      1 +
                      (findings.length > 0 ? 1 : 0) +
                      (signals.length > 0 ? 1 : 0) +
                      (gaps.length > 0 ? 1 : 0) +
                      (innovations.length > 0 ? 1 : 0) +
                      1
                    }
                    title="Recommended Next Steps"
                  >
                    <ul className="space-y-2">
                      {gaps.length > 0 && (
                        <li className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">!</span>
                          <span>
                            <strong>Address identified gaps:</strong>{" "}
                            {gaps.map((g) => g.title).join("; ")}
                          </span>
                        </li>
                      )}
                      {findings.length > 0 && (
                        <li className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-violet-100 text-violet-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">*</span>
                          <span>
                            <strong>Act on strategic findings:</strong>{" "}
                            {findings.map((f) => f.title).join("; ")}
                          </span>
                        </li>
                      )}
                      {innovations.length > 0 && (
                        <li className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="w-4 h-4 rounded bg-sky-100 text-sky-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">?</span>
                          <span>
                            <strong>Evaluate innovation fit:</strong>{" "}
                            {innovations.map((i) => i.title).join("; ")}
                          </span>
                        </li>
                      )}
                      {gaps.length === 0 && findings.length === 0 && innovations.length === 0 && (
                        <li className="text-xs text-slate-500 italic">
                          Pin findings, gaps, or innovations to generate specific recommendations.
                        </li>
                      )}
                    </ul>
                  </BriefSection>

                  {/* 7. Evidence Sources */}
                  {allSources.length > 0 && (
                    <BriefSection
                      number={
                        1 +
                        (findings.length > 0 ? 1 : 0) +
                        (signals.length > 0 ? 1 : 0) +
                        (gaps.length > 0 ? 1 : 0) +
                        (innovations.length > 0 ? 1 : 0) +
                        2
                      }
                      title="Evidence Sources"
                    >
                      <ul className="space-y-1">
                        {allSources.map((src, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-baseline gap-1.5 font-mono">
                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0 mt-1.5" />
                            {src}
                          </li>
                        ))}
                      </ul>
                    </BriefSection>
                  )}

                  {/* 8. Confidence Level */}
                  {confidence && (
                    <BriefSection
                      number={
                        1 +
                        (findings.length > 0 ? 1 : 0) +
                        (signals.length > 0 ? 1 : 0) +
                        (gaps.length > 0 ? 1 : 0) +
                        (innovations.length > 0 ? 1 : 0) +
                        1 +
                        (allSources.length > 0 ? 1 : 0) +
                        1
                      }
                      title="Confidence Level"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: confidence.color + "18",
                            color: confidence.color,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: confidence.color }}
                          />
                          {confidence.label}
                        </span>
                        <p className="text-xs text-slate-500">{confidence.description}</p>
                      </div>
                    </BriefSection>
                  )}
                </div>

                {/* Document footer */}
                <div
                  className="px-6 py-3 border-t text-[10px] text-slate-400 flex items-center justify-between"
                  style={{ borderColor: "hsl(220 13% 91%)" }}
                >
                  <span>
                    Generated{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>{briefCount} evidence item{briefCount !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DecisionBrief;
