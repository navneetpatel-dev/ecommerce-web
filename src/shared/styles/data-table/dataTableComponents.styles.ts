export const keysetDataTableStyles = {
  container: "space-y-4",
} as const;

export const tableRowActionsStyles = {
  container: "relative flex shrink-0 items-center justify-end",
  triggerBtn:
    "h-8 w-8 shrink-0 p-0 text-ink-muted hover:text-ink [&_svg]:size-4",
} as const;

export const infiniteLoadMoreStyles = {
  container: "flex flex-col items-center gap-3 border-t border-line/70 pt-4",
  sentinel: "h-1 w-full",
  status: "sr-only",
} as const;
