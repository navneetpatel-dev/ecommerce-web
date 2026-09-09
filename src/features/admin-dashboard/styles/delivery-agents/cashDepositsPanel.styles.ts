import { cn } from "@/shared/utils/dom/cn";

export const cashDepositsPanelStyles = {
  root: "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4",
  header: "flex items-center justify-between border-b border-line/60 pb-3",
  headerLeft: "flex items-center gap-2.5",
  headerIcon: "size-5 text-brand",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  pendingBadge:
    "inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning",
  errorAlert:
    "rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger",
  loadingText: "text-body-sm text-ink-muted",
  emptyText: "py-6 text-center text-body-sm text-ink-muted",
  tableWrapper: "overflow-x-auto",
  table: "w-full min-w-[640px] text-body-sm",
  tableHeaderRow: "border-b border-line text-left text-ink-muted",
  tableHeaderCell: "py-2.5 pr-3 font-medium",
  tableRow: "border-b border-line/60 hover:bg-paper/40 transition-colors",
  tableCell: "py-2.5 pr-3",
  tableCellMono: "py-2.5 pr-3 font-mono font-medium",
  tableCellMuted: "py-2.5 pr-3 text-ink-muted",
  expectedCell: (mismatch: boolean) =>
    cn(
      "py-2.5 pr-3 font-mono",
      mismatch ? "text-danger font-semibold" : "text-ink-muted",
    ),
  statusBadge: (status: string) =>
    cn(
      "inline-flex items-center rounded px-2 py-0.5 text-caption font-semibold",
      status === "VERIFIED"
        ? "bg-success/15 text-success"
        : status === "REJECTED"
          ? "bg-danger/15 text-danger"
          : "bg-warning/15 text-warning",
    ),
  actionsWrapper: "flex gap-2",
  verifyButton:
    "h-8 border-success/40 text-success hover:bg-success hover:text-paper",
  rejectButton:
    "h-8 border-danger/40 text-danger hover:bg-danger hover:text-paper",
  actionIcon: "size-3.5",
} as const;
