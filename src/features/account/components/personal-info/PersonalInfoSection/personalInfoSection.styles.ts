export const personalInfoSectionStyles = {
  container: "space-y-6",
  grid: "grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]",
  skeletonCard:
    "space-y-4 border border-line bg-surface p-6 shadow-elevation-1",
  skeletonTitle: "h-5 w-32",
  skeletonInput: "h-11 w-full",
  errorContainer: "border border-line bg-surface px-5 py-10 text-center",
  formNoticeWrapper: "sm:col-span-2 space-y-3",
  savedNotice: "text-[0.875rem] text-success",
  aside: "border border-line bg-surface shadow-elevation-1",
  asideHeader: "border-b border-line bg-paper/55 px-5 py-4 md:px-6",
  asideHint: "mt-1 text-[0.875rem] text-ink-muted",
  asideBody: "space-y-4 px-5 py-5 md:px-6",
  asideRow: "flex items-start gap-3",
  asideIconBox:
    "flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted",
  asideIconBoxBrand:
    "flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-brand",
  asideDetails: "min-w-0",
  asideLabel:
    "text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint",
  asideValue: "mt-1 text-body font-medium text-ink",
  asideValueBreak: "mt-1 break-all text-body font-medium text-ink",
  asideTextMuted: "mt-0.5 text-body-sm text-ink-muted",
  asideTextFaint: "mt-0.5 text-body-sm text-ink-faint",
  verificationWrapper: "mt-2",
  deliveryDetailRow: "flex items-start gap-3 border-t border-line/60 pt-4",
  asideFooter: "border-t border-line pt-4",
  asideFooterText: "text-body-sm leading-6 text-ink-muted",
} as const;
