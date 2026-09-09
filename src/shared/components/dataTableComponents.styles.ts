export const keysetDataTableStyles = {
  container: "space-y-4",
} as const;

export const tableRowActionsStyles = {
  itemSpan: "block w-full min-w-0",
  menuItemDiv:
    "w-full min-w-0 overflow-hidden border-t border-line/70 first:rounded-t-sm first:border-t-0 last:rounded-b-sm",
  container: "flex shrink-0 items-center justify-end",
  triggerBtn:
    "h-8 w-8 shrink-0 p-0 text-ink-muted hover:text-ink [&_svg]:size-4",
  popoverContent:
    "z-[80] w-[12.5rem] overflow-hidden rounded-sm! p-0 [&_button]:w-full [&_button]:min-w-0 [&_button]:justify-start [&_button]:rounded-none! [&_button]:border-transparent [&_button]:shadow-none [&_a]:w-full [&_a]:min-w-0 [&_a]:justify-start [&_a]:rounded-none! [&_a]:border-transparent [&_a]:shadow-none [&_a]:inline-flex [&_a]:items-center",
} as const;

export const infiniteLoadMoreStyles = {
  container: "flex flex-col items-center gap-3 border-t border-line/70 pt-4",
  sentinel: "h-1 w-full",
} as const;
