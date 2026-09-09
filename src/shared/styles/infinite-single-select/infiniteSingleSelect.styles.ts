export const infiniteSingleSelectStyles = {
  root: "w-full",
  popoverContent: "w-[var(--radix-popover-trigger-width)] space-y-2 p-1",
  optionRow: {
    base: "relative flex h-10 w-full cursor-pointer select-none items-center rounded-sm px-4 pr-10 text-left text-body outline-none hover:bg-brand-subtle focus-visible:bg-brand-subtle disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    selected: "bg-brand-subtle/60",
    label: "line-clamp-1 min-w-0 flex-1 text-ink",
    checkWrapper: "absolute right-2 flex items-center justify-center",
    checkIcon: "text-brand",
  },
  listbox: {
    container: "max-h-56 overflow-y-auto overscroll-contain p-1",
    disabled: "pointer-events-none opacity-60",
    hint: "px-4 py-2 text-body-sm text-ink-muted",
    sentinel: "h-1 w-full",
    loadingMore: "px-4 py-1 text-body-sm text-ink-muted",
    searchFieldContainer: "px-1 pt-1",
    triggerButton:
      "flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border border-line-strong bg-surface-raised px-4 text-left text-body outline-none hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50",
    triggerButtonError: "border-danger",
    triggerButtonMuted: "text-ink-muted",
    triggerButtonLabel: "line-clamp-1 min-w-0 flex-1",
    triggerButtonIcon: "shrink-0 text-ink-muted",
  },
} as const;
