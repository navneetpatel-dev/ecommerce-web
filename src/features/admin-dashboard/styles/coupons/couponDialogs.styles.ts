export const couponDialogStyles = {
  filters: "flex flex-wrap items-center gap-2",
  searchInput: "w-full sm:w-56",
  filterSelect: "w-full sm:w-40",
  dialog: "max-h-[85vh] overflow-y-auto sm:max-w-2xl",
  detailList: "space-y-2",
  detailRow: "flex justify-between gap-4 text-body-sm",
  detailLabel: "text-ink-muted",
  detailValue: "text-right text-ink",
  batchChip:
    "flex flex-wrap items-center gap-2 rounded-md border border-brand/30 bg-brand/5 px-3 py-1.5 text-body-sm text-ink",
  batchChipText: "min-w-0 break-words",
  batchStatusMessage: "text-body-sm text-success",
  batchStatusError: "text-body-sm text-danger",
  rejectionNote: "rounded-md border border-line p-2 text-body-sm text-ink",
  actions: "flex flex-wrap gap-2",
} as const;
