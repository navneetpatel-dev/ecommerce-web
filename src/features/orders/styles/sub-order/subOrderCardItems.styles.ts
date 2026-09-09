export const SUB_ORDER_CARD_ITEMS_STYLES = {
  list: "divide-y divide-line",
  itemRow:
    "grid grid-cols-[3.5rem_1fr] items-start gap-3 py-3 sm:grid-cols-[4rem_1fr_auto] sm:gap-4",
  imageWrapper:
    "relative aspect-square self-start overflow-hidden rounded-sm border border-line bg-paper",
  detailsCol: "flex min-w-0 flex-col gap-0.5",
  productName:
    "block text-body font-medium leading-snug text-ink transition-colors",
  productLink:
    "block text-body font-medium leading-snug text-ink transition-colors hover:text-brand",
  variantAttrs: "font-mono text-[0.6875rem] tracking-wide text-ink-muted",
  quantityText: "mt-1 text-body-sm text-ink-muted",
  subtotalMobile:
    "mt-1 font-display text-[1.125rem] tabular-nums text-ink sm:hidden",
  returnButton:
    "mt-1 h-auto min-h-0 max-h-none self-start px-0 py-0 text-body-sm text-brand hover:bg-transparent hover:text-brand-hover",
  desktopPricingCol: "hidden flex-col items-end gap-1 sm:flex",
  subtotalDesktop: "font-display text-[1.125rem] tabular-nums text-ink",
  unitPrice: "text-[0.75rem] tabular-nums text-ink-muted",
} as const;
