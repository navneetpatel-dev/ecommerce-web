import { cn } from "@/shared/utils/dom/cn";

export const cartLineStyles = {
  // Compact cart line styles
  compactRoot: (available: boolean) =>
    cn("flex items-center gap-3 py-2", !available && "opacity-50 grayscale"),
  compactImageWrapper: "relative h-14 w-14 shrink-0 overflow-hidden rounded-sm",
  compactGrid:
    "grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1",
  compactTitle:
    "truncate text-body-sm font-medium leading-snug text-ink hover:text-brand",
  compactRemoveButton:
    "h-8 w-8 min-h-8 max-h-8 shrink-0 justify-self-end p-0 text-ink-muted hover:bg-danger-subtle hover:text-danger",
  compactAmount: (isPendingOrNull: boolean) =>
    cn(
      "truncate text-body-sm font-semibold tabular-nums",
      isPendingOrNull ? "text-ink-muted" : "text-brand",
    ),
  compactBadge: "w-fit text-[0.6875rem]",
  compactSkeleton: "h-3.5 w-16",
  compactQuantityControl: "h-8 w-8 min-h-8 max-h-8 [&_svg]:size-3.5",
  compactQuantityValue: "h-4 w-5 text-body-sm",

  // Full cart line styles
  fullRoot: (available: boolean) =>
    cn(
      "group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-4",
      !available && "opacity-50 grayscale",
    ),
  fullImageLink:
    "relative aspect-square self-end overflow-hidden rounded-sm border border-line bg-paper",
  fullImage:
    "object-cover transition-transform duration-[var(--motion-moderate)] group-hover:scale-[1.03]",
  fullDetailsColumn: "min-w-0 flex flex-col gap-2.5",
  fullHeaderRow: "flex items-start justify-between gap-2",
  fullHeaderInfo: "min-w-0",
  fullTitle:
    "block text-body font-medium leading-snug text-ink transition-colors hover:text-brand",
  fullAttributes:
    "mt-0.5 font-mono text-[0.6875rem] tracking-wide text-ink-muted",
  fullMobileEachPrice: "mt-1 text-body-sm text-ink-muted sm:hidden",
  fullBadge: "mt-1 text-[0.6875rem]",
  fullMobileRemoveButton:
    "h-9 w-9 min-h-9 max-h-9 shrink-0 text-ink-muted hover:bg-danger-subtle hover:text-danger sm:hidden",
  fullActionsRow: "flex min-w-0 flex-wrap items-center gap-3",
  fullDesktopRemoveButton:
    "hidden h-auto min-h-0 max-h-none items-center gap-1.5 px-0 py-0 text-body-sm text-ink-muted hover:bg-transparent hover:text-danger sm:inline-flex",
  fullQuantityControl:
    "h-8 w-8 min-h-8 max-h-8 sm:h-9 sm:w-9 sm:min-h-9 sm:max-h-9 lg:h-10 lg:w-10 lg:min-h-10 lg:max-h-10",
  fullQuantityValue: "h-4 w-5 text-[0.75rem] sm:h-5 sm:w-6 sm:text-body-sm",
  fullAmountColumn:
    "hidden flex-col items-end justify-start gap-1 pt-0.5 sm:flex",
  fullTotalAmount: "font-display text-[1.125rem] tabular-nums text-ink",
  fullAmountSkeleton: "h-4 w-20",
  fullEachPrice: "text-[0.75rem] text-ink-muted",
  fullEmptyAmountSpacer: "hidden sm:block",
} as const;
