import { cn } from "@/shared/utils/cn";
import { PDP_OFFERS_EXPANDED_SCROLL_CLASS } from "../../constants/pdpOffers";

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
  list: (isScrollable: boolean) =>
    cn("space-y-1 pr-0.5", isScrollable && PDP_OFFERS_EXPANDED_SCROLL_CLASS),
  offerItem:
    "flex items-center justify-between gap-2 rounded-md border border-dashed border-brand/25 bg-brand-subtle/30 px-2 py-1",
  offerCode:
    "truncate font-mono text-[0.75rem] font-semibold tracking-wide text-ink",
  offerDetail: "shrink-0 text-[0.6875rem] text-ink-muted",
  expandButton:
    "mt-1 h-auto min-h-0 max-h-none w-full gap-1 px-0 py-1 text-[0.75rem] font-medium text-brand hover:bg-transparent hover:text-brand-hover",
  expandIcon: (expanded: boolean) =>
    cn("!size-3.5 transition-transform", expanded && "rotate-180"),
  footerHint: "mt-1 text-[0.6875rem] leading-snug text-ink-faint",
} as const;
