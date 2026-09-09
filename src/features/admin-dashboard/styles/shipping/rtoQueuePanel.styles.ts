export const rtoQueuePanelStyles = {
  root: "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4",
  header: "flex items-center justify-between border-b border-line/60 pb-3",
  headerLeft: "flex items-center gap-2.5",
  headerIcon: "size-5 text-warning",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  badge:
    "inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning",
  loadingText: "text-body-sm text-ink-muted",
  emptyText: "py-6 text-center text-body-sm text-ink-muted",
  tableWrapper: "overflow-x-auto",
  table: "w-full min-w-[640px] text-body-sm",
  tableHeaderRow: "border-b border-line text-left text-ink-muted",
  tableHeaderCell: "py-2.5 pr-3 font-medium",
  tableRow: "border-b border-line/60 hover:bg-paper/40 transition-colors",
  tableCellMono: "py-2.5 pr-3 font-mono",
  tableCell: "py-2.5 pr-3",
  tableCellMuted: "py-2.5 pr-3 text-ink-muted",
} as const;
