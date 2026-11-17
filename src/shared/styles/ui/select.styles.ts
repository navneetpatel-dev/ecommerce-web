export const selectStyles = {
  trigger:
    "flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-line bg-surface-raised px-3.5 text-body text-ink outline-none transition-all hover:border-line-strong hover:bg-surface-raised/90 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25 data-[state=open]:border-brand data-[state=open]:ring-2 data-[state=open]:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  triggerIcon: "text-ink-muted transition-transform duration-200",
  content:
    "relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-xl border border-line bg-surface-raised shadow-elevation-2 animate-scale-in p-1",
  popperContent: "translate-y-1",
  viewport: "p-1",
  popperViewport:
    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
  item: "relative flex h-9 w-full cursor-pointer select-none items-center rounded-md px-3 text-body-sm text-ink outline-none transition-colors hover:bg-brand-subtle hover:text-ink focus-visible:bg-brand-subtle focus-visible:text-ink data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  indicatorWrapper: "absolute right-2 flex items-center justify-center",
  indicatorIcon: "text-brand size-3.5",
} as const;
