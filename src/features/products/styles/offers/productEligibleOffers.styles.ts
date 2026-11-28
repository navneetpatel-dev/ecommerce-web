import { cn } from "@/shared/utils/dom/cn";

export const productEligibleOffersStyles = {
  root: (className?: string) =>
    cn("rounded-lg border border-line bg-surface/60 px-2.5 py-2", className),
  loading: (className?: string) => cn("text-body-sm text-ink-muted", className),
  empty: (className?: string) => cn("text-body-sm text-ink-muted", className),
  header: "mb-1.5 flex items-center justify-between gap-2",
  headerLeft: "flex min-w-0 items-center gap-1.5",
  tagIcon: "h-3.5 w-3.5 shrink-0 text-brand",
  title:
    "truncate text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-muted",
  countBadge:
    "shrink-0 rounded-full bg-paper px-1.5 py-px text-[0.6875rem] tabular-nums text-ink-muted",
  // Grows in place when expanded: a short scroll box showed 2 of 12 offers at a time.
  list: "space-y-1",
  offerItem:
    "flex items-center justify-between gap-2 rounded-md border border-dashed border-brand/25 bg-brand-subtle/30 px-2.5 py-1.5",
  offerLeft: "flex min-w-0 items-center gap-2",
  copiedIcon: "size-3 text-success",
  copyIcon: "size-3 opacity-60",
  offerCodeBadge:
    "inline-flex items-center gap-1 rounded bg-brand/10 px-1.5 py-0.5 font-mono text-[0.6875rem] font-bold tracking-wider text-brand hover:bg-brand/20 transition-colors cursor-pointer shrink-0 select-all",
  offerName: "truncate text-[0.75rem] font-medium text-ink",
  offerRight: "flex shrink-0 items-center gap-1.5 text-right",
  offerCode:
    "truncate font-mono text-[0.75rem] font-semibold tracking-wide text-ink",
  offerDetail: "shrink-0 text-[0.6875rem] text-ink-muted",
  expandButton:
    "mt-1 h-auto min-h-0 max-h-none w-full gap-1 px-0 py-1 text-[0.75rem] font-medium text-brand hover:bg-transparent hover:text-brand-hover",
  expandIcon: (expanded: boolean) =>
    cn("!size-3.5 transition-transform", expanded && "rotate-180"),
  footerHint: "mt-1 text-[0.6875rem] leading-snug text-ink-faint",
} as const;
