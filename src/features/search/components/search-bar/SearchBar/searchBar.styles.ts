export const searchBarStyles = {
  root: "relative w-full",
  placeholderSpacer: "h-11 shrink-0",
  shellContainer: "w-full",
  shellOverlay: "absolute inset-x-0 top-0 z-50",
  shellExpanded:
    "overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-elevation-2",
  form: "relative",
  searchIcon:
    "pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2",
  searchIconMuted: "text-ink-muted",
  searchIconDark: "text-paper/70",
  inputBase:
    "h-11 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
  inputSm: "pl-9 text-body-sm",
  inputLg: "pl-11",
  inputExpanded:
    "rounded-none border-0 bg-transparent text-ink shadow-none placeholder:text-ink-faint focus-visible:border-transparent",
  inputCollapsed: "rounded-full",
  inputOnDark:
    "border-paper/25 bg-paper/10 text-paper placeholder:text-paper/55 focus-visible:border-paper/50",
  panelMotionWrapper: "overflow-hidden",
  panelListbox: "border-t border-line",
  panelInline: "max-h-[min(24rem,calc(85vh-12rem))] overflow-auto",
  panelDropdown: "max-h-80 overflow-auto",
  skeletonStack: "space-y-2 p-3",
  skeletonItem: "flex items-center gap-3 rounded-lg px-1 py-1",
  skeletonThumb: "h-11 w-11 shrink-0 animate-pulse rounded-lg bg-line/60",
  skeletonTextCol: "min-w-0 flex-1 space-y-2",
  skeletonTitle: "h-3.5 w-2/3 animate-pulse rounded bg-line/60",
  skeletonSubtitle: "h-3 w-1/3 animate-pulse rounded bg-line/50",
  emptyContainer: "flex flex-col items-center px-5 py-8 text-center",
  emptyIconWrapper:
    "mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink-faint",
  emptyIcon: "h-4 w-4",
  emptyTitle: "text-body font-medium text-ink",
  emptySubtitle: "mt-1 max-w-xs text-body-sm leading-relaxed text-ink-muted",
  suggestionsWrapper: "py-1.5",
  sectionDivider: "mt-1 border-t border-line/70 pt-1",
  sectionHeader:
    "px-4 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint",
  sectionList: "px-1.5",
} as const;
