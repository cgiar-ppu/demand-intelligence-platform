import { createContext, useContext, useState, type ReactNode } from "react";

export type PinnedItemType =
  | "signal"
  | "gap"
  | "innovation"
  | "finding"
  | "opportunity"
  | "chart"
  | "source";

export interface PinnedItem {
  id: string;
  type: PinnedItemType;
  title: string;
  summary: string;
  evidence?: string;
  source?: string;
  score?: number;
  pinnedAt: number;
}

interface BriefContextType {
  pinnedItems: PinnedItem[];
  pinItem: (item: Omit<PinnedItem, "pinnedAt">) => void;
  unpinItem: (id: string) => void;
  isPinned: (id: string) => boolean;
  clearBrief: () => void;
  briefCount: number;
}

const BriefContext = createContext<BriefContextType>({
  pinnedItems: [],
  pinItem: () => {},
  unpinItem: () => {},
  isPinned: () => false,
  clearBrief: () => {},
  briefCount: 0,
});

export function BriefProvider({ children }: { children: ReactNode }) {
  const [pinnedItems, setPinnedItems] = useState<PinnedItem[]>(() => {
    try {
      const saved = localStorage.getItem("dip-brief-items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const save = (items: PinnedItem[]) => {
    setPinnedItems(items);
    localStorage.setItem("dip-brief-items", JSON.stringify(items));
  };

  const pinItem = (item: Omit<PinnedItem, "pinnedAt">) => {
    save([...pinnedItems.filter((p) => p.id !== item.id), { ...item, pinnedAt: Date.now() }]);
  };

  const unpinItem = (id: string) => {
    save(pinnedItems.filter((p) => p.id !== id));
  };

  const isPinned = (id: string) => pinnedItems.some((p) => p.id === id);

  const clearBrief = () => save([]);

  return (
    <BriefContext.Provider
      value={{ pinnedItems, pinItem, unpinItem, isPinned, clearBrief, briefCount: pinnedItems.length }}
    >
      {children}
    </BriefContext.Provider>
  );
}

export function useBrief() {
  return useContext(BriefContext);
}
