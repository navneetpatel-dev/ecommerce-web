import { cn } from "@/shared/utils/cn";

export const cashbackWriteOffReportTableStyles = {
  container: "space-y-6",
  summarySection: "space-y-4",
  summaryTitle: "font-display text-body font-semibold text-ink",
  metricGrid: "grid gap-3.5 sm:grid-cols-2",
  metricCard:
    "rounded-lg border border-line bg-paper/50 p-4 transition-all duration-200 hover:border-line-strong hover:bg-paper/70",
  metricLabel:
    "text-body-xs font-medium uppercase tracking-wider text-ink-muted",
  metricValue: (variant?: "default" | "success" | "danger") =>
    cn(
      "mt-1.5 text-xl font-bold tabular-nums tracking-tight",
      variant === "success" && "text-success",
      variant === "danger" && "text-danger",
      variant === "default" && "text-ink",
    ),
  tableContainer: "space-y-3",
  tableScroll: "overflow-x-auto rounded-lg border border-line bg-surface",
  table: "min-w-full text-left text-[0.875rem]",
  thead: "border-b border-line bg-paper/70 text-ink-muted",
  th: "px-4 py-3 font-medium",
  tbody: "divide-y divide-line/60",
  row: "transition-colors hover:bg-paper/40",
  cellMono: "px-4 py-3 font-mono text-body-sm text-ink",
  cellMedium: "px-4 py-3 tabular-nums font-medium text-ink",
  cellSuccess: "px-4 py-3 tabular-nums text-success font-medium",
  cellStandard: "px-4 py-3 tabular-nums text-ink",
  cellBadgeContainer: "px-4 py-3",
  badge:
    "inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line",
  emptyContainer:
    "flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-8 px-4 text-center",
  emptyText: "text-body text-ink-muted",
  paginationWrapper: (loading: boolean) =>
    loading ? "pointer-events-none opacity-60" : undefined,
} as const;
