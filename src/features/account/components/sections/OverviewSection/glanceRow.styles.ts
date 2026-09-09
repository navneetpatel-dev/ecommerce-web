export const glanceRowStyles = {
  row: "flex items-center justify-between gap-4 px-5 py-4 md:px-6",
  iconGroup: "flex min-w-0 items-center gap-3",
  icon: "shrink-0 text-ink-muted",
  textContainer: "min-w-0",
  label: "text-body text-ink",
  value: "mt-0.5 font-display text-[1.25rem] tabular-nums text-ink",
  actionContainer: "flex shrink-0 items-center gap-3",
  detailsButton:
    "h-auto min-h-0 max-h-none gap-1 px-0 py-0 text-body-sm font-medium text-brand hover:text-brand-hover",
  viewLink:
    "inline-flex items-center gap-1 text-body-sm font-medium text-brand hover:text-brand-hover",
} as const;
