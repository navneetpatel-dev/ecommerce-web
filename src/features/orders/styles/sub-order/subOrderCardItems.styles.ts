export const SUB_ORDER_CARD_ITEMS_STYLES = {
  list: "divide-y divide-line",
  itemRow:
    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 py-3 sm:gap-4",
  imageWrapper:
    "relative size-14 shrink-0 overflow-hidden rounded-sm border border-line bg-paper sm:size-16",
  detailsCol: "flex min-w-0 flex-col gap-0.5",
  productName:
    "block break-words text-body font-medium leading-snug text-ink transition-colors",
  productLink:
    "block break-words text-body font-medium leading-snug text-ink transition-colors hover:text-brand",
  variantAttrs: "font-mono text-[0.6875rem] tracking-wide text-ink-muted",
  quantityText: "mt-1 text-body-sm text-ink-muted",
  // Review slot under a delivered line
  lineActions: "mt-2 flex flex-wrap items-center gap-2",
  reviewButton: "h-8 gap-1.5 rounded-full px-3 text-body-sm",
  reviewIcon: "h-3.5 w-3.5",
  reviewStatus:
    "inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink-muted",
  reviewStatusGroup: "inline-flex items-center gap-x-2 whitespace-nowrap",
  reviewStatusStrong: "font-medium text-ink",
  reviewLink: "font-medium text-brand underline-offset-4 hover:underline",
  returnButton:
    "mt-1 h-auto min-h-0 max-h-none self-start border-0 px-0 py-0 text-body-sm text-brand hover:bg-transparent hover:text-brand-hover",
  desktopPricingCol: "flex shrink-0 flex-col items-end gap-1 pt-0.5",
  subtotalDesktop:
    "text-right font-display text-[1.125rem] tabular-nums text-ink",
  unitPrice: "text-right text-[0.75rem] tabular-nums text-ink-muted",
} as const;
