import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { masterData, COUNTRIES } from "@/lib/data";

interface Message {
  role: "user" | "bot";
  text: string;
}

function avg(key: string, country?: string) {
  const d = country ? masterData.filter((x) => x.country === country) : masterData;
  if (!d.length) return 0;
  return +(d.reduce((a, b) => a + (Number((b as any)[key]) || 0), 0) / d.length).toFixed(1);
}

function findAnswer(q: string): string {
  for (const c of COUNTRIES) {
    if (q.includes(c.toLowerCase())) {
      const cd = masterData.filter((d) => d.country === c);
      if (!cd.length) continue;
      const avgDem = avg("demand_signals_score", c);
      const avgSup = avg("innovation_supply_score", c);
      const avgFeas = avg("investment_feasibility_score", c);
      const avgGaps = avg("demand_gaps_score", c);
      const avgScaling = avg("scaling_opportunity_score", c);
      const topScaling = [...cd].sort((a, b) => b.scaling_opportunity_score - a.scaling_opportunity_score)[0];
      return `**${c}** (${cd.length} innovations):\n• Demand Signals: ${avgDem}/10 | Supply: ${avgSup}/10\n• Investment Feasibility: ${avgFeas}/10 | Demand Gaps: ${avgGaps}/10\n• Scaling Opportunity: ${avgScaling}/10\n\nTop opportunity: ${topScaling.innovation_name} (Scaling: ${topScaling.scaling_opportunity_score}/10). Sources: ${[...new Set(cd.map((x) => x.source_reference))].join(", ")}.`;
    }
  }

  const found = masterData.find(
    (d) => q.includes(d.innovation_name.toLowerCase()) || q.includes(d.innovation_name.split(" ")[0].toLowerCase())
  );
  if (found) {
    const gapSignal = found.demand_gaps_score > 6 ? "High Gap" : found.demand_gaps_score >= 3 ? "Moderate" : "Low Gap";
    return `**${found.innovation_name}** (${found.country}):\n• Geo & Priority: ${found.geography_priority_score}/10 | Demand Signals: ${found.demand_signals_score}/10\n• Innovation Supply: ${found.innovation_supply_score}/10 | Demand Gaps: ${found.demand_gaps_score}/10\n• Investment Feasibility: ${found.investment_feasibility_score}/10 | Scaling Opp.: ${found.scaling_opportunity_score}/10\n• Gap Signal: ${gapSignal}\n• Source: ${found.source_reference} (${found.evidence_date})\n• ${found.scaling_justification}`;
  }

  if (q.includes("gap") || q.includes("critical")) {
    const critical = masterData.filter((d) => d.demand_gaps_score > 6).sort((a, b) => b.demand_gaps_score - a.demand_gaps_score);
    if (critical.length) return `**Critical Demand Gaps (score > 6):**\n${critical.map((d) => `\u2022 ${d.innovation_name} (${d.country}): Gaps ${d.demand_gaps_score}/10`).join("\n")}`;
  }

  if (q.includes("scaling") || q.includes("opportunity")) {
    const top = [...masterData].sort((a, b) => b.scaling_opportunity_score - a.scaling_opportunity_score).slice(0, 5);
    return `**Top Scaling Opportunities:**\n${top.map((d) => `\u2022 ${d.innovation_name} (${d.country}): ${d.scaling_opportunity_score}/10`).join("\n")}`;
  }

  if (q.includes("framework") || q.includes("7") || q.includes("5") || q.includes("dimension")) {
    return `**The 7\u21925\u21921 Demand Signaling Framework:**\n\n**7 Data Signal Domains** (outer layer): Scaling Context, Sector, Stakeholders, Enabling Environment, Resource & Investment, Market Intelligence, Innovation Portfolio.\n\n**5 Demand Signaling Dimensions** (inner layer): Geography & Priority, Demand Signals, Innovation Supply, Demand Gaps, Investment Feasibility.\n\n**Center:** Scaling Opportunity — where all 5 dimensions align and effective demand emerges.`;
  }

  return "I can analyze the **7\u21925\u21921 Demand Signaling Framework** across all innovations. Try:\n\u2022 A country name (e.g., *Nigeria*)\n\u2022 An innovation (e.g., *Solar Irrigation*)\n\u2022 *critical gaps* or *scaling opportunities*\n\u2022 *framework* for methodology";
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Ready to query the 7\u21925\u21921 Demand Intelligence Platform. Ask about countries, innovations, demand gaps, or the framework." },
  ]);

  const send = () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: findAnswer(q.toLowerCase()) }]);
    }, 400);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex w-[420px] max-h-[520px] flex-col rounded-3xl border bg-card shadow-2xl overflow-hidden"
            style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}
          >
            <div className="flex items-center justify-between border-b px-5 py-3" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
              <span className="text-sm font-bold font-display">CGIAR Demand Intelligence Assistant</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">&#x2715;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((m, i) => (
                <div key={i} className={`text-sm leading-relaxed ${m.role === "bot" ? "text-muted-foreground" : "text-foreground font-medium text-right"}`}>
                  {m.text.split("\n").map((line, j) => (
                    <span key={j}>
                      {line.split(/(\*\*[^*]+\*\*)/g).map((seg, k) =>
                        seg.startsWith("**") && seg.endsWith("**")
                          ? <strong key={k} className="text-foreground">{seg.slice(2, -2)}</strong>
                          : <span key={k}>{seg}</span>
                      )}
                      {j < m.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="border-t p-3 flex gap-2" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about countries, dimensions, or gaps..."
                className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none"
              />
              <button onClick={send} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Ask</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-lg transition hover:-translate-y-0.5"
      >
        DIP Assistant
      </button>
    </>
  );
}
