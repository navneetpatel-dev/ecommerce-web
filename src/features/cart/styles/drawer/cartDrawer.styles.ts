export const cartDrawerStyles = {
  backdrop: "fixed inset-0 bg-overlay z-50",
  drawer:
    "fixed right-0 top-0 z-50 flex h-full w-[min(100vw,24rem)] flex-col overflow-hidden border-l border-line bg-surface-raised shadow-elevation-4 overscroll-contain",
  header:
    "flex items-center justify-between px-4 h-14 border-b border-line shrink-0",
  title: "text-[1.125rem] font-semibold",
  headerActions: "flex items-center gap-1",
  scrollArea: "min-h-0 flex-1 space-y-4 overflow-auto overscroll-contain p-4",
  skeletonContainer: "space-y-3",
  skeletonItem: "h-20 w-full rounded-md",
  vendorGroupsList: "divide-y divide-line",
  vendorGroup: "space-y-1 py-3 first:pt-0 last:pb-0",

  // Drawer Summary styles
  summaryContainer: "shrink-0 space-y-3 border-t border-line p-4",
  pricingList: "space-y-1.5 text-body-sm",
  subtotalRow: "flex justify-between gap-3",
  subtotalLabel: "text-ink-muted",
  subtotalValue: "tabular-nums text-ink",
  taxShippingBreakdown: "space-y-1.5 text-body-sm",
  totalRow: "flex items-center justify-between",
  totalLabel: "text-body font-medium",
  totalValue: "text-[1.125rem] font-bold text-brand",
  totalFallback: "text-body font-medium",
  unavailableWarning:
    "rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground",
  fullWidthButton: "w-full",
} as const;
