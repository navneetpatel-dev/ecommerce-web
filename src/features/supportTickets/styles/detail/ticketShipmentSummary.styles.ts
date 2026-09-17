export const ticketShipmentSummaryStyles = {
  section: "border-t border-line/60 pt-4",
  list: "mt-3 space-y-3",
  itemCard: "space-y-2 rounded-md border border-line bg-surface p-3",
  itemHeader: "flex items-center justify-between gap-3",
  vendorName: "min-w-0 truncate text-body-sm font-medium text-ink",
  tracking: "font-mono text-[0.75rem] text-ink-muted",
  emptyText: "mt-2 text-body-sm text-ink-muted",
  loadingText: "mt-2 text-body-sm text-ink-muted",
} as const;
