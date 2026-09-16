export const dataTableStyles = {
  section: "min-w-0 space-y-5",
  skeletonHeight: "h-12 w-full",
  error: "text-body text-danger",
  emptyContainer:
    "rounded-md border border-line bg-surface px-4 py-14 text-center text-ink-muted",
  paginationWrapper: "flex justify-center border-t border-line/70 pt-2",
} as const;

export const dataTableDesktopStyles = {
  tableFixed: "table-fixed w-full min-w-0",
  headerRow: "border-line",
  headAutoTruncate: "max-w-[14rem]",
  headText: "text-[0.75rem] uppercase tracking-[0.04em]",
  rowInteractive:
    "cursor-pointer focus-visible:bg-[color-mix(in_srgb,var(--brand-subtle)_40%,var(--surface))]",
  cellFixed: "max-w-0",
  cellAutoTruncate: "max-w-[14rem]",
} as const;

export const dataTableHeaderStyles = {
  container: "flex flex-wrap items-center justify-between gap-3",
  titleGroup: "min-w-0 space-y-1",
  title:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  buttonGroup: "sm:shrink-0",
} as const;

export const dataTableMobileStyles = {
  list: "space-y-3 lg:hidden",
  card: "rounded-md border border-line bg-surface p-4 shadow-card-hairline",
  cardInteractive:
    "cursor-pointer transition-colors hover:border-brand/30 hover:bg-brand-subtle/20 active:bg-brand-subtle/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  primaryCell: "min-w-0 text-body text-ink",
  dl: "space-y-2.5",
  dlWithPrimary: "mt-3 border-t border-line/80 pt-3",
  rowItem: "grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-x-3 gap-y-1",
  dt: "text-[0.75rem] font-medium uppercase tracking-[0.04em] text-ink-muted",
  dd: "min-w-0 break-words text-[0.875rem] text-ink",
  actionsWrapper: "mt-4 border-t border-line/80 pt-3",
  actionsAlign: "justify-end",
} as const;

export const dataTableUtilsStyles = {
  imagesWrap: "flex flex-nowrap items-center gap-2",
  imagesOverflow: "text-[0.75rem] text-ink-muted",
} as const;
