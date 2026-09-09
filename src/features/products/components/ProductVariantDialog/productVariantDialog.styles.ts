export const productVariantDialogStyles = {
  dialogContent: "max-h-[min(42rem,calc(100dvh-2rem))] sm:max-w-lg",
  loaderWrapper: "flex min-h-32 items-center justify-center",
  spinner:
    "h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent",
  emptyText: "py-8 text-center text-body-sm text-ink-muted",
  confirmButton: "w-full sm:w-auto",
} as const;
