export const ordersComponentsStyles = {
  // OrderReturnStatusBanner
  bannerWrapper: "flex flex-wrap gap-2",

  // BuyAgainButton
  buyAgainWrapper: "space-y-1.5",
  buyAgainSummary: "text-body-sm text-ink-muted",

  // OrderCancelAction
  cancelButton: "w-full border-danger/40 text-danger hover:bg-danger-subtle",
  cancelSuccess: "text-body-sm text-success",
  cancelError: "text-body-sm text-danger",

  // OrderMoneyBreakdown
  defaultDl: "space-y-2.5 text-[0.875rem]",
  row: "flex items-center justify-between gap-4",
  rowSuccess: "flex items-center justify-between gap-4 text-success",
  rowTotal: "flex items-end justify-between gap-4 border-t border-line pt-3",
  label: "text-ink-muted",
  value: "tabular-nums text-ink",
  valueTabular: "tabular-nums",
  totalLabel:
    "text-body-sm font-semibold uppercase tracking-[0.08em] text-brand",
  totalValue:
    "font-display text-[1.25rem] leading-none tabular-nums text-brand",

  // OrderPaymentSummary
  paymentWrapper: "space-y-2 text-[0.875rem]",
  paymentTitle: "font-medium text-ink",
  paymentMuted: "text-ink-muted",
  paymentWarning: "text-body-sm leading-relaxed text-warning-foreground",
  cashbackPending: "mt-3 text-body-sm text-brand",
  cashbackCredited: "mt-3 text-body-sm text-success",

  // DeliveryRatingPrompt
  promptRoot:
    "mt-2 flex flex-col gap-2 rounded-md border border-line bg-surface-muted p-3",
  promptHeader: "flex items-center justify-between gap-2",
  promptTitle: "text-body-sm font-medium text-ink",
  promptDismissButton: "text-ink-muted hover:text-ink",
  promptDismissIcon: "size-4",
  promptStarsRow: "flex items-center gap-1",
  starSelected: "size-5 fill-warning text-warning",
  starUnselected: "size-5 text-ink-muted",
  promptSubmitButton: "self-start",

  // LiveDeliveryMap
  mapContainer: "h-56 w-full rounded-md border border-line",

  // TrackingForm
  formRow: "flex gap-2",
  inputFlex: "min-w-0 flex-1",
  buttonShrink: "shrink-0",

  // TrackingResult
  resultContent: "space-y-3",
  carrierRow: "flex items-center gap-2",
  carrierText: "text-body-sm text-ink-muted",
  updateText: "text-body text-ink-muted",
  detailText: "text-body-sm text-ink-muted",
  codText: "text-body-sm text-ink",
  failureNote:
    "rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning",
  podLink: "inline-block text-body-sm font-medium text-brand hover:underline",
  liveLocationStack: "space-y-1",
  liveLocationHeader:
    "flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5",
  liveLocationTitle: "text-body-sm font-medium text-ink",
  liveLocationTime: "text-caption text-ink-muted",
} as const;
