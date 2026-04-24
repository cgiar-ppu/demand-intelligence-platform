import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type AppVersion = "classic" | "journal";

interface VersionContextType {
  version: AppVersion;
  setVersion: (v: AppVersion) => void;
  toggleVersion: () => void;
}

const VersionContext = createContext<VersionContextType>({
  version: "journal",
  setVersion: () => {},
  toggleVersion: () => {},
});

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState<AppVersion>(() => {
    const saved = localStorage.getItem("dip-version");
    return (saved === "classic" || saved === "journal") ? saved : "journal";
  });

  useEffect(() => {
    localStorage.setItem("dip-version", version);
  }, [version]);

  const toggleVersion = () => setVersion((v) => (v === "classic" ? "journal" : "classic"));

  return (
    <VersionContext.Provider value={{ version, setVersion, toggleVersion }}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersion() {
  return useContext(VersionContext);
}
