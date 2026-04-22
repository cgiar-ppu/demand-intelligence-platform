import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Navbar() {
  const location = useLocation();
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
        className={`text-sm font-semibold transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="glass-nav sticky top-0 z-50 flex items-center justify-between px-6 py-3 md:px-10">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
        <h1 className="text-lg font-display tracking-tight">DIP</h1>
        <span className="hidden md:inline text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
          7&#x2192;5&#x2192;1 Demand Intelligence Platform
        </span>
      </div>
      <div className="flex gap-6">
        {navLink("/", "Intelligence Hub")}
        {navLink("/analysis", "Signal Analysis")}
        {navLink("/network", "Signal Network")}
        {navLink("/ingestion", "Data Ingestion")}
        {navLink("/extract", "Framework Guide")}
        {navLink("/framework", "Framework")}
      </div>
      <button onClick={toggle} className="text-lg bg-transparent border-none cursor-pointer">
        {dark ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}
