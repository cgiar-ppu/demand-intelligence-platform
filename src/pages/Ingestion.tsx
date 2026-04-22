import { useState } from "react";
import { motion } from "framer-motion";
import { masterRegistry, COUNTRIES, type RegistrySource } from "@/lib/data";

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  ACTIVE: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary" },
  VAULTING: { bg: "bg-amber/10", text: "text-amber", dot: "bg-amber" },
  EXTRACTING: { bg: "bg-sky/10", text: "text-sky", dot: "bg-sky" },
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const Ingestion = () => {
  const [registry, setRegistry] = useState<RegistrySource[]>(masterRegistry);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", pillar: "System Need / Gap", country: "Global", formats: "", desc: "" });

  const activeCount = registry.filter((s) => s.status === "ACTIVE").length;
  const vaultingCount = registry.filter((s) => s.status === "VAULTING").length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSubmitting(true);
    setTimeout(() => {
      setRegistry((r) => [
        { name: formData.name, pillar: formData.pillar, formats: formData.formats.split(",").map((f) => f.trim()), status: "VAULTING" as const, lastRefresh: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
        ...r,
      ]);
      setSubmitting(false);
      setFormData({ name: "", pillar: "System Need / Gap", country: "Global", formats: "", desc: "" });
    }, 1500);
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8 md:px-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block h-2 w-2 rounded-full bg-amber" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber">Data Pipeline</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl tracking-tight">
              Data Ingestion<br />
              <span className="text-muted-foreground">Hub</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm max-w-lg">Contribute private or local datasets to the Demand Intelligence vault.</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-display text-primary">{activeCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-amber">{vaultingCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Vaulting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display text-foreground">{registry.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</div>
            </div>
          </div>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass-card md:col-span-2">
          <h3 className="text-lg mb-1">Submit Knowledge Asset</h3>
          <p className="text-xs text-muted-foreground mb-5">PDF, CSV, XLSX, or scanned documents (OCR-enabled).</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Asset / Source Name">
              <input value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. NGO Local Survey 2025" required className="form-input" />
            </Field>
            <Field label="Strategic Pillar">
              <select value={formData.pillar} onChange={(e) => setFormData((f) => ({ ...f, pillar: e.target.value }))} className="form-input">
                {["System Need / Gap", "Effective Demand / Readiness", "Supply Capability / Inputs", "Scaling Opportunity / Policy", "Multi-Pillar Nexus Analysis"].map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Region">
              <select value={formData.country} onChange={(e) => setFormData((f) => ({ ...f, country: e.target.value }))} className="form-input">
                <option>Global</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Formats (comma separated)">
              <input value={formData.formats} onChange={(e) => setFormData((f) => ({ ...f, formats: e.target.value }))} placeholder="PDF, CSV, XLSX" className="form-input" />
            </Field>
            <Field label="Description / URL">
              <textarea value={formData.desc} onChange={(e) => setFormData((f) => ({ ...f, desc: e.target.value }))} rows={2} placeholder="Brief summary or source URL..." className="form-input resize-none" />
            </Field>
            <div className="rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary/40 transition group" style={{ borderColor: "hsl(var(--glass-border) / 0.15)" }}>
              <div className="text-2xl mb-1 group-hover:scale-110 transition">📁</div>
              <p className="text-xs text-muted-foreground">Drop file here or click to browse</p>
            </div>
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
              {submitting ? "REGISTERING..." : "Register & Vault"}
            </button>
          </form>
        </div>

        <div className="glass-card md:col-span-3 !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
            <h3 className="text-lg font-display">Master Source Registry</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{registry.length} connectors</span>
          </div>
          <div className="max-h-[620px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20" style={{ borderColor: "hsl(var(--glass-border) / 0.08)" }}>
                  <th className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-4 font-bold tracking-wider">Source</th>
                  <th className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-4 font-bold tracking-wider">Pillar</th>
                  <th className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-4 font-bold tracking-wider">Formats</th>
                  <th className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-4 font-bold tracking-wider">Status</th>
                  <th className="text-left text-[10px] uppercase text-muted-foreground py-2.5 px-4 font-bold tracking-wider">Refreshed</th>
                </tr>
              </thead>
              <tbody>
                {registry.map((s, i) => {
                  const st = STATUS_STYLE[s.status] || STATUS_STYLE.ACTIVE;
                  return (
                    <tr key={`${s.name}-${i}`} className="border-b hover:bg-primary/5 transition" style={{ borderColor: "hsl(var(--glass-border) / 0.04)" }}>
                      <td className="py-3 px-4 font-semibold">{s.name}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{s.pillar}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {s.formats.map((f) => (
                            <span key={f} className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">{f}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-muted-foreground">{s.lastRefresh}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Ingestion;
