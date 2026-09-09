export const vendorKycDocumentsDialogStyles = {
  dialogContent: "max-w-lg",
  loadingText: "py-6 text-center text-body text-ink-muted",
  errorText: "py-6 text-center text-body text-danger",
  actionErrorText: "text-center text-body-sm text-danger",
  emptyText: "py-6 text-center text-body text-ink-muted",
  list: "space-y-3",
  itemCard:
    "group flex flex-col gap-3 rounded-lg border border-line bg-surface p-3.5 sm:p-4 transition-all hover:border-line-strong",
  itemHeader:
    "flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3",
  itemInfo: "flex min-w-0 items-center gap-3",
  itemTitle: "text-body font-semibold text-ink",
  itemBadgesRow: "flex flex-wrap items-center gap-2 sm:gap-2.5 sm:shrink-0",
  verifyButton:
    "h-7 text-xs font-semibold text-success hover:bg-success/10 hover:text-success",
  rejectButton:
    "h-7 text-xs font-semibold text-danger hover:bg-danger/10 hover:text-danger",
} as const;
