export const dateTimePickerStyles = {
  trigger: {
    base: "flex h-11 w-full min-w-[10rem] cursor-pointer items-center justify-between gap-3 rounded-sm border bg-surface-raised px-3.5 text-left text-body outline-none hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50",
    error: "border-danger",
    defaultBorder: "border-line-strong",
    labelBase: "truncate",
    labelSelected: "text-ink",
    labelPlaceholder: "text-ink-faint",
    icon: "shrink-0 ml-1 text-ink-muted",
  },
  popoverContent: "w-[min(100vw-2rem,20rem)] space-y-4 p-3",
  header: "flex items-center justify-between gap-2",
  navButton:
    "flex h-8 w-8 items-center justify-center rounded-sm text-ink-muted transition-colors hover:bg-paper hover:text-ink",
  monthLabel: "text-[0.875rem] font-semibold tracking-tight text-ink",
  footer: "flex justify-end gap-2",
  calendar: {
    grid: "grid grid-cols-7 gap-1",
    weekdayHeader:
      "flex h-8 items-center justify-center text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint",
    emptyCell: "h-8",
    dayButtonBase:
      "flex h-8 items-center justify-center rounded-sm text-body-sm tabular-nums transition-colors",
    dayButtonSelected: "bg-brand font-semibold text-paper",
    dayButtonDefault: "text-ink hover:bg-brand-subtle",
    dayButtonToday: "ring-1 ring-brand/50",
  },
  timeSelectors: {
    container: "grid grid-cols-2 gap-2 border-t border-line pt-3",
    fieldGroup: "space-y-1.5",
    label:
      "text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint",
  },
} as const;
