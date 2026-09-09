export const returnRequestCardStyles = {
  card: "border border-line bg-surface-raised px-5 py-4",
  header: "flex flex-wrap items-start justify-between gap-3",
  contentCol: "min-w-0",
  title: "font-medium text-ink",
  subMeta: "mt-1 text-body-sm text-ink-muted",
  reason: "mt-1 text-[0.875rem] text-ink-muted",
  refundBox: "mt-1 space-y-0.5 text-body-sm tabular-nums text-ink",
  refundMuted: "text-ink-muted",
  refundDanger: "text-danger",
  creditNote: "mt-1 text-body-sm text-ink-muted",
  creditNoteAction: "mt-3",
  timelineGrid: "mt-5 grid gap-6 border-t border-line pt-5 md:grid-cols-2",
  eyebrowMargin: "mb-3",
  sectionDivided: "mt-5 border-t border-line pt-5",
  rejectionBanner:
    "rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-danger",
  pickupFailSection: "mt-5 space-y-3 border-t border-line pt-5",
  pickupFailBanner:
    "rounded-md border border-line bg-surface-muted px-3 py-2 text-body-sm text-warning",
  errorText: "text-body-sm text-danger",
  breakdownList:
    "mt-2 space-y-0.5 border-t border-line pt-2 text-body-sm text-ink-muted",
  breakdownRow: "flex justify-between gap-4",
  breakdownValue: "tabular-nums text-ink",
} as const;
