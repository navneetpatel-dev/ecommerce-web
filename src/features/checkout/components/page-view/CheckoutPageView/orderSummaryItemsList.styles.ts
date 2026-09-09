export const ORDER_SUMMARY_ITEMS_LIST_STYLES = {
  root: "min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-4 md:px-6",
  itemsList: "mt-3 space-y-3",
  itemRow: "flex gap-3",
  imageWrapper:
    "relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-line bg-paper",
  itemDetails: "min-w-0 flex-1",
  itemName: "truncate text-[0.875rem] font-medium text-ink",
  itemQty: "mt-0.5 text-[0.75rem] text-ink-muted",
  itemPrice: "shrink-0 text-[0.875rem] tabular-nums text-ink",
} as const;
