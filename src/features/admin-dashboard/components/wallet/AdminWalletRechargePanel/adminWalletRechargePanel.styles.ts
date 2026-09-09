export const adminWalletRechargePanelStyles = {
  summaryContainer: "space-y-4",
  summaryTitle: "font-display text-body font-semibold text-ink",
  summaryGrid: "grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4",
  tableContainer: "space-y-3",
  tableScroll: "overflow-x-auto rounded-lg border border-line bg-surface",
  table: "min-w-full text-left text-[0.875rem]",
  thead: "border-b border-line bg-paper/70 text-ink-muted",
  th: "px-4 py-3 font-medium",
  tbody: "divide-y divide-line/60",
  tr: "transition-colors hover:bg-paper/40",
  cellMono: "px-4 py-3 font-mono text-body-sm text-ink",
  cellNumBold: "px-4 py-3 tabular-nums font-medium text-ink",
  cellNum: "px-4 py-3 tabular-nums text-ink",
  cellBadge: "px-4 py-3",
  badge:
    "inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line",
  cellMuted: "px-4 py-3 text-ink-muted",
  tableEmpty:
    "flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-8 px-4 text-center",
  tableEmptyText: "text-body text-ink-muted",
  paginationLoading: "pointer-events-none opacity-60",
} as const;
