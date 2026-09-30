export const deliveryAreaStyles = {
  root: "space-y-2",
  chipRow: "flex flex-wrap items-center gap-2 text-body-sm",
  chipIcon: "h-4 w-4 shrink-0 text-brand",
  chipLabel: "font-medium text-ink",
  chipPincode: "font-mono tabular-nums text-ink",
  chipButton:
    "inline-flex items-center gap-1 rounded-sm text-body-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  editorRow: "flex flex-wrap items-center gap-2",
  editorInput: "w-[8.5rem]",
  noticeMuted: "text-body-sm leading-snug text-ink-muted",
  noticeDanger: "text-body-sm leading-snug text-danger",
  noticeSuccess: "text-body-sm leading-snug text-ink-muted",
} as const;
