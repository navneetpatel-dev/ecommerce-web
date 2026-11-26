export const vendorCouponsViewStyles = {
  stack: "space-y-6",
  colMono: "font-mono",
  colMonoSm: "font-mono text-body-sm",
} as const;

export const couponsHeaderSectionStyles = {
  header:
    "flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
  titleGroup: "min-w-0 space-y-1",
  heading: "text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]",
  summary: "text-[0.875rem] text-ink-muted",
  dialogContent: "max-w-2xl",
} as const;

export const couponAnalyticsDialogStyles = {
  dialogContent: "max-w-xl",
  loadingText: "text-[0.875rem] text-ink-muted",
  statsList: "space-y-3 text-[0.875rem]",
  statRow: "flex justify-between gap-4",
  statLabel: "text-ink-muted",
  statValue: "tabular-nums font-medium",
  absorbedText: "text-body-sm text-ink-muted",
  errorText: "text-[0.875rem] text-ink-muted",
} as const;
