"use client";

import { cn } from "@/shared/utils/dom/cn";

export type NotificationTab = "logs" | "broadcasts" | "suppressions";

const TABS: ReadonlyArray<{ id: NotificationTab; label: string }> = [
  { id: "logs", label: "Delivery logs" },
  { id: "broadcasts", label: "Broadcast history" },
  { id: "suppressions", label: "Suppressed addresses" },
];

interface NotificationTabStripProps {
  activeTab: NotificationTab;
  onSelect: (tab: NotificationTab) => void;
}

/** Switches between delivery logs, past broadcasts and suppressed addresses. */
export function NotificationTabStrip({
  activeTab,
  onSelect,
}: NotificationTabStripProps) {
  return (
    <div className="flex items-center gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onSelect(tab.id)}
          className={cn(
            "px-4 py-2 text-body-sm font-medium border-b-2 transition-colors cursor-pointer",
            activeTab === tab.id
              ? "border-brand text-brand"
              : "border-transparent text-ink-muted hover:text-ink",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
