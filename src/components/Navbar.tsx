import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useVersion } from "@/lib/VersionContext";
import { useBrief } from "@/lib/BriefContext";

export function Navbar() {
  const location = useLocation();
  const { version, toggleVersion } = useVersion();
  const { briefCount } = useBrief();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dip-dark");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dip-dark", String(next));
  };

  const navLink = (to: string, label: string) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-sm font-semibold transition-colors whitespace-nowrap ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
      >
        {label}
      </Link>
    );
  };

  const isJournal = version === "journal";

  return (
    <nav className="glass-nav sticky top-0 z-50 flex items-center justify-between px-6 py-3 md:px-10">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
        <h1 className="text-lg font-display tracking-tight">DIP</h1>
        <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
          {isJournal ? "Intelligence Journal" : "7\u21925\u21921 Demand Intelligence Platform"}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {isJournal ? (
          <>
            {navLink("/v2/demand", "Demand")}
            {navLink("/v2/country", "Country")}
            {navLink("/v2/innovation", "Innovation")}
            {navLink("/v2/findings", "Findings")}
            <Link
              to="/v2/brief"
              className={`text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                location.pathname === "/v2/brief" ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Brief
              {briefCount > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                  {briefCount}
                </span>
              )}
            </Link>
          </>
        ) : (
          <>
            {navLink("/", "Intelligence Hub")}
            {navLink("/analysis", "Signal Analysis")}
            {navLink("/network", "Signal Network")}
            {navLink("/ingestion", "Data Ingestion")}
            {navLink("/extract", "Framework Guide")}
            {navLink("/framework", "Framework")}
            {navLink("/nigeria", "Nigeria Intel")}
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Version Toggle */}
        <button
          onClick={toggleVersion}
          className="flex items-center gap-1.5 rounded-full border border-input px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          title={`Switch to ${isJournal ? "Classic" : "Intelligence Journal"} view`}
        >
          <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isJournal ? "bg-emerald-500" : "bg-amber-500"}`} />
          {isJournal ? "Journal" : "Classic"}
        </button>

        {/* Dark mode toggle */}
        <button onClick={toggle} className="text-lg bg-transparent border-none cursor-pointer">
          {dark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
        </button>
      </div>
    </nav>
  );
}
