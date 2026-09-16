import { cn } from "@/shared/utils/dom/cn";

export const addressCardStyles = {
  card: "flex flex-col border border-line bg-surface p-4 shadow-elevation-1",
  details: "min-w-0 flex-1",
  line1: "font-medium text-ink",
  line2: "mt-1 text-[0.875rem] text-ink-muted",
  country: "mt-0.5 text-body-sm text-ink-muted",
  defaultBadge:
    "mt-3 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand",
  actionsRow: "mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 border-t border-line pt-3",
  actionButton: "w-full justify-center gap-1.5",
  deleteButton: "w-full justify-center gap-1.5 text-danger hover:text-danger",
  setDefaultButton: (isDefault: boolean) =>
    cn(
      "w-full justify-center gap-1.5 transition-colors",
      isDefault
        ? "text-brand hover:text-brand disabled:opacity-100"
        : "text-ink-muted hover:text-brand",
    ),
} as const;
