export const vendorProductImagesDialogStyles = {
  dialogContent: "max-w-lg",
  loadingText: "text-ink-muted",
  errorText: "text-danger text-body-sm",
  imageList: "space-y-3",
} as const;

export const productImageRowStyles = {
  row: "flex flex-col gap-2 rounded-md border border-line bg-surface p-3 sm:flex-row sm:items-start",
  thumbnailWrapper:
    "relative h-20 w-20 shrink-0 overflow-hidden border border-line bg-paper",
  thumbnailImg: "object-cover",
  contentCol: "min-w-0 flex-1 space-y-2",
  primaryBadgeText: "text-[0.75rem] font-medium text-brand",
  starIcon: "mr-1 size-3.5",
  skuText: "text-[0.75rem] text-ink-muted",
} as const;
