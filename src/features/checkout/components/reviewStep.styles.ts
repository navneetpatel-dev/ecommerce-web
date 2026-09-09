export const REVIEW_STEP_STYLES = {
  root: "space-y-5",
  errorContainer: "border border-danger bg-danger-subtle px-5 py-8",
  errorTitle: "font-display text-[1.125rem] text-danger-foreground",
  errorMessage: "mt-1 text-[0.875rem] text-danger-foreground/90",
  preparingContainer: "border border-line bg-paper/60 px-5 py-8",
  preparingTitle: "font-display text-[1.125rem] text-ink",
  preparingSubtitle: "mt-1 text-[0.875rem] text-ink-muted",
  breakdownsList: "space-y-4",
  giftWrapContainer: "space-y-2 border border-line bg-surface-raised p-4",
  giftWrapHint: "text-body-sm text-ink-muted",
  giftMessageTextarea: "mt-2",
  warningBanner:
    "flex items-start gap-2 rounded-sm border border-warning bg-warning-subtle px-4 py-3",
  warningIcon: "mt-0.5 shrink-0 text-warning",
  warningText: "text-[0.875rem] text-warning-foreground",
  actionsRow: "flex flex-col-reverse gap-3 sm:flex-row sm:items-center",
  placeOrderBtn: "gap-2",
} as const;
