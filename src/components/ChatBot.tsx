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
      const avgNeed = avg("need_score", c);
      const avgSupply = avg("supply_score", c);
      const avgDemand = avg("effective_demand_score", c);
      const avgScaling = avg("scaling_opportunity_score", c);
      const gap = (avgNeed - avgDemand).toFixed(1);
      return `**${c}** (${cd.length} innovations): Need ${avgNeed}, Supply ${avgSupply}, Demand ${avgDemand}, Scaling ${avgScaling}. Avg Strategic Gap: ${gap}.\n\nTop innovation: ${cd.sort((a, b) => b.need_score - a.need_score)[0].innovation_name} (Need: ${cd[0].need_score}/10). Sources: ${[...new Set(cd.map((x) => x.source_reference))].join(", ")}.`;
    }
  }

  const found = masterData.find(
    (d) => q.includes(d.innovation_name.toLowerCase()) || q.includes(d.innovation_name.split(" ")[0].toLowerCase())
  );
  if (found) {
    const gap = (found.need_score - found.effective_demand_score).toFixed(1);
    return `**${found.innovation_name}** (${found.country}):\n• Need: ${found.need_score}/10 | Supply: ${found.supply_score}/10 | Demand: ${found.effective_demand_score}/10 | Scaling: ${found.scaling_opportunity_score}/10\n• Strategic Gap: ${gap}\n• Source: ${found.source_reference} (${found.evidence_date})\n• ${found.scaling_justification}`;
  }

  if (q.includes("gap") || q.includes("critical")) {
    const critical = masterData.filter((d) => d.need_score - d.effective_demand_score > 2).sort((a, b) => (b.need_score - b.effective_demand_score) - (a.need_score - a.effective_demand_score));
    if (critical.length) return `**Critical Gaps (Need−Demand > 2):**\n${critical.map((d) => `• ${d.innovation_name} (${d.country}): Gap ${d.need_score - d.effective_demand_score}`).join("\n")}`;
  }

  return "I can analyze the **10-pillar strategic nexus** and **country diagnostics**. Try:\n• A country name (e.g., *Nigeria*)\n• An innovation (e.g., *Solar Irrigation*)\n• *critical gaps*";
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Ready to query the Demand Intelligence vault. Ask about countries, innovations, or scoring standards." },
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
              <span className="text-sm font-bold font-display">DIIS Intelligence Assistant</span>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
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
                placeholder="Ask about countries, pillars, or innovations..."
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
        DIIS Assistant 💬
      </button>
    </>
  );
}
