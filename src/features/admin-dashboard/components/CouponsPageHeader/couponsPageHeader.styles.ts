/**
 * Named class groups for the coupons page header (Rule 5).
 */
export const couponsPageHeaderStyles = {
  root: "space-y-6",
  headerRow:
    "flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  heading: "text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]",
  dialog: "max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto",
  form: "space-y-1",
  batchesSection: "space-y-3",
  batchesHeading: "text-[1rem] font-semibold text-ink",
  statusMuted: "text-body-sm text-ink-muted",
  statusError: "text-body-sm text-danger",
  batchDialog: "max-w-md",
  batchStack3: "space-y-3",
  batchDl: "space-y-2 text-[0.875rem]",
  batchRow: "flex justify-between gap-4",
  batchDt: "text-ink-muted",
  batchDd: "tabular-nums font-medium",
  batchCodesList:
    "max-h-56 space-y-1 overflow-y-auto rounded-md border border-line p-2 font-mono text-body-sm",
  batchCodeItem: "px-1 py-0.5 text-ink",
} as const;
