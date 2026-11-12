import { cn } from "@/shared/utils/dom/cn";

export const cartLineStyles = {
  // Compact cart line styles
  // B-63: only the image fades on an unavailable line; dimming the text dropped it
  // to 2.2–3.4:1 contrast. The "Out of stock" badge says why.
  compactRoot: (_available: boolean) => "flex items-center gap-3 py-2",
  compactImageWrapper: (available: boolean) =>
    cn(
      "relative h-14 w-14 shrink-0 overflow-hidden rounded-sm",
      !available && "opacity-50 grayscale",
    ),
  compactGrid:
    "grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.5",
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
  setToAvailable: "h-8 w-fit px-3 text-[0.8125rem]",
  compactPriceChange: "col-span-2 text-[0.6875rem] leading-snug",
  // The wording carries the direction; both stay at body-text contrast.
  priceChangeTone: (direction: "UP" | "DOWN" | null) =>
    direction ? "font-medium text-ink" : "",
  fullPriceChange: "mt-1 text-body-sm",
  compactSkeleton: "h-3.5 w-16",
  /**
   * Drawer-sized cell: the stepper sits in the row's lower half beside the `h-14` thumbnail,
   * so page-sized 44px cells (the project's default control height) made the row 96px tall
   * with the buttons hanging below the image. 32px matches the drawer's remove button.
   */
  compactQuantityControl: "h-8 w-8 min-h-8 max-h-8 [&_svg]:size-3.5",
  compactQuantityValue: "h-4 w-5 text-body-sm",

  // Full cart line styles
  fullRoot: (available: boolean) =>
    cn(
      "group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-4",
      !available && "text-ink-muted",
    ),
  fullImageLink: (available: boolean) =>
    cn(
      "relative aspect-square self-end overflow-hidden rounded-sm border border-line bg-paper",
      !available && "opacity-50 grayscale",
    ),
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
  fullQuantityControl: "h-11 w-11 min-h-11 max-h-11",
  fullQuantityValue: "h-4 w-5 text-[0.75rem] sm:h-5 sm:w-6 sm:text-body-sm",
  fullAmountColumn:
    "hidden flex-col items-end justify-start gap-1 pt-0.5 sm:flex",
  fullTotalAmount: "font-display text-[1.125rem] tabular-nums text-ink",
  fullAmountSkeleton: "h-4 w-20",
  fullEachPrice: "text-[0.75rem] text-ink-muted",
  fullEmptyAmountSpacer: "hidden sm:block",
} as const;
