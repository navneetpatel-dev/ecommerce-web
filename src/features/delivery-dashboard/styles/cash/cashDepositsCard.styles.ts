import { cn } from "@/shared/utils/dom/cn";

export const cashDepositsCardStyles = {
  container: "border border-line bg-surface shadow-elevation-1",
  header: "border-b border-line bg-paper/55 px-5 py-4 md:px-6",
  headerTop: "flex items-center gap-2",
  headerIcon: "size-4 text-brand",
  headerEyebrow: "!mb-0",
  title: "mt-1 font-display text-[1.125rem] font-medium text-ink",
  subtitle: "mt-1 text-[0.875rem] text-ink-muted",
  body: "p-5 md:p-6",
  emptyText: "text-body-sm text-ink-muted",
  tableWrapper: "overflow-x-auto",
  table: "w-full min-w-[560px] text-body-sm",
  theadRow: "border-b border-line text-left text-ink-muted",
  th: "py-2 pr-3 font-medium",
  tr: "border-b border-line/60",
  tdText: "py-2 pr-3 text-ink-muted",
  tdMono: "py-2 pr-3 font-mono",
  tdExpected: (mismatch: boolean) =>
    cn("py-2 pr-3 font-mono", mismatch ? "text-danger" : "text-ink-muted"),
  cellMono: "font-mono",
  cellExpected: (mismatch: boolean) =>
    cn("font-mono", mismatch ? "text-danger" : "text-ink-muted"),
  tdStatus: "py-2 pr-3",
} as const;
