export const selectStyles = {
  trigger:
    "flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border border-line-strong bg-surface-raised px-4 text-body outline-none hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand data-[state=open]:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  triggerIcon: "text-ink-muted",
  content:
    "relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-md border border-line bg-surface-raised shadow-elevation-2 animate-scale-in",
  popperContent: "translate-y-1",
  viewport: "p-1",
  popperViewport:
    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
  item: "relative flex h-10 w-full cursor-pointer select-none items-center rounded-sm px-4 text-body outline-none hover:bg-brand-subtle focus-visible:bg-brand-subtle data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
  indicatorWrapper: "absolute right-2 flex items-center justify-center",
  indicatorIcon: "text-brand",
} as const;
