export const infiniteMultiSelectStyles = {
  root: "space-y-2",
  listbox:
    "max-h-48 space-y-1 overflow-y-auto overscroll-contain rounded-md border border-line p-2",
  listboxError: "border-danger",
  listboxDisabled: "pointer-events-none opacity-60",
  loading: "px-1 py-2 text-body-sm text-ink-muted",
  empty: "px-1 py-2 text-body-sm text-ink-muted",
  sentinel: "h-1 w-full",
  loadingMore: "px-1 py-1 text-body-sm text-ink-muted",
  summaryText: "text-body-sm text-ink-muted",
  optionRow: {
    label:
      "flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 hover:bg-surface",
    checkbox: "mt-0.5",
    text: "text-[0.875rem] leading-snug text-ink",
  },
} as const;
