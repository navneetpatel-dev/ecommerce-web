export const vendorProductFormDialogStyles = {
  dialogContent: "max-h-[min(92vh,48rem)] max-w-3xl overflow-y-auto",
  description: "text-[0.875rem] text-ink-muted",
} as const;

export const vendorBulkImportDialogStyles = {
  stack: "space-y-3",
  errorMessage: "text-body-sm text-danger",
  summaryText: "text-body-sm text-ink",
  rowCell: "font-mono",
  detailCell: "text-body-sm text-ink-muted",
} as const;
