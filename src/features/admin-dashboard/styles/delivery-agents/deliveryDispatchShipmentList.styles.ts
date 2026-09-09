import { cn } from "@/shared/utils/dom/cn";

export const deliveryDispatchShipmentListStyles = {
  root: "rounded-lg border border-line bg-surface p-4 shadow-elevation-1 space-y-3",
  header:
    "flex items-center justify-between gap-2 border-b border-line/60 pb-3",
  headerLeft: "flex items-center gap-2",
  headerTitle: "text-body font-medium text-ink",
  badge:
    "inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-caption font-semibold text-brand",
  assignIcon: "size-4",
  scrollArea: "max-h-72 space-y-1.5 overflow-y-auto pr-1",
  loadingText: "text-body-sm text-ink-muted",
  emptyText: "py-4 text-center text-body-sm text-ink-muted",
  selectAllLabel:
    "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-body-sm font-medium text-ink-muted hover:bg-paper/40 cursor-pointer select-none transition-colors border-b border-line/40 pb-2",
  groupWrapper: "pt-2",
  groupBadgeWrapper: "mb-1.5",
  groupBadge:
    "inline-flex items-center gap-1.5 rounded bg-paper/60 px-2 py-0.5 text-caption font-semibold uppercase tracking-wider text-ink-muted border border-line/40",
  groupRows: "space-y-1",
  shipmentRow: (isSelected: boolean) =>
    cn(
      "flex items-center gap-3 rounded-md px-2.5 py-2 text-body-sm transition-all cursor-pointer select-none border",
      isSelected
        ? "bg-brand/10 border-brand/40 text-ink shadow-xs"
        : "border-transparent hover:bg-paper/60 text-ink hover:text-ink",
    ),
  trackingNumber: "min-w-0 flex-1 truncate font-mono text-body-sm font-medium",
  vendorBadge:
    "shrink-0 text-caption font-medium rounded bg-paper/80 px-2 py-0.5 text-ink-muted border border-line/50",
} as const;
