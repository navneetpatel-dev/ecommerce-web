export const productCompareBarStyles = {
  /* z-[45] sits between the mobile tab bar (z-40) and the drawer layer (z-50),
     and the offset clears the tab bar + home indicator on phones. */
  root: "fixed left-4 right-4 z-[45] bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3 md:bottom-4 md:z-30",
  container:
    "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
  leftColumn: "min-w-0 flex-1 space-y-2",
  countText: "text-body-sm text-ink-muted",
  warningText: "text-body-sm text-warning",
  tagsList: "flex flex-wrap items-center gap-2",
  tagButton:
    "h-auto min-h-0 max-h-none rounded-full bg-brand-subtle px-3 py-1 text-body-sm font-medium text-brand hover:bg-brand-subtle hover:text-brand",
  rightActions: "flex items-center gap-2",
} as const;
