export const productPreviewStyles = {
  dialogContent: "max-h-[94dvh] w-[min(96vw,80rem)] max-w-none",
  header: "space-y-1 pr-8 text-left",
  title: "flex items-center gap-2 text-[1.125rem]",
  titleIcon: "size-5 text-brand",
  description: "text-body-sm text-ink-muted",
  notLiveNotice:
    "rounded-md border border-warning/40 bg-warning-subtle px-4 py-2.5 text-body-sm text-ink",
  /** The storefront page sits in a plain frame, like it does on the site. */
  page: "min-w-0 rounded-lg border border-line bg-surface",
} as const;
