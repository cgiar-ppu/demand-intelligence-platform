import { useBrief, type PinnedItemType } from "@/lib/BriefContext";

interface PinButtonProps {
  id: string;
  type: PinnedItemType;
  title: string;
  summary: string;
  evidence?: string;
  source?: string;
  score?: number;
  size?: "sm" | "md";
}

export function PinButton({ id, type, title, summary, evidence, source, score, size = "sm" }: PinButtonProps) {
  const { pinItem, unpinItem, isPinned } = useBrief();
  const pinned = isPinned(id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinned) {
      unpinItem(id);
    } else {
      pinItem({ id, type, title, summary, evidence, source, score });
    }
  };

  const sizeClasses = size === "sm"
    ? "w-6 h-6 text-[10px]"
    : "w-8 h-8 text-xs";

  return (
    <button
      onClick={handleClick}
      title={pinned ? "Remove from Decision Brief" : "Pin to Decision Brief"}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all ${
        pinned
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          : "bg-muted/50 text-muted-foreground hover:bg-primary/20 hover:text-primary"
      }`}
    >
      {pinned ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
        </svg>
      )}
    </button>
  );
}
