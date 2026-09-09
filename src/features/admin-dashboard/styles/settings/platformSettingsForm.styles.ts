export const platformSettingsFormStyles = {
  // Scheduled Reports Type Selector
  selectorContainer: "space-y-4",
  selectorHeaderRow:
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  selectorHeaderTitleGroup: "space-y-0.5",
  selectorHeaderTitleBadgeRow: "flex items-center gap-2.5",
  selectorHeaderTitle: "text-body font-semibold text-ink",
  selectorCountBadge:
    "inline-flex items-center rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-semibold text-brand",
  selectorHeaderSubtitle: "text-body-sm text-ink-muted",
  selectorHeaderActions: "flex items-center gap-2",
  selectorSelectAllButton: "gap-1.5",
  selectorSelectAllIcon: "size-4 text-brand",
  selectorClearAllButton: "gap-1.5 text-ink-muted hover:text-ink",
  selectorClearAllIcon: "size-4 text-ink-muted",
  selectorFilterSearchBar:
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  tabsRoot: "shrink-0",
  tabsList:
    "h-auto flex-wrap justify-start gap-1 rounded-md border border-line-strong bg-paper p-1",
  tabTrigger:
    "group gap-1.5 rounded-sm border-0 border-b-0 px-3 py-1.5 text-body-sm text-ink-muted hover:text-ink data-[state=active]:bg-brand data-[state=active]:text-paper data-[state=active]:hover:bg-brand-hover",
  tabCountBadge:
    "inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none bg-line-strong/60 text-ink-muted group-data-[state=active]:bg-paper group-data-[state=active]:text-brand",
  searchContainer: "relative w-full sm:w-64 sm:max-w-64 shrink-0",
  searchIcon:
    "absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-faint pointer-events-none",
  searchInput: "pl-10 pr-10",
  searchClearButton:
    "absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-ink-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  searchClearIcon: "size-4",

  // Header
  header:
    "flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
  headerTextGroup: "min-w-0 space-y-1.5",
  headerTitle:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  headerSubtitle: "max-w-3xl text-body leading-relaxed text-ink-muted",
  headerSaveButton: "hidden shrink-0 sm:inline-flex",

  // Scheduled Reports Section
  typeSelectorWrapper: "col-span-full border-t border-line/70 pt-6",

  // Report Type Checkbox Group
  emptyContainer:
    "py-10 text-center rounded-md border border-dashed border-line bg-surface/40",
  emptyText: "text-body font-medium text-ink-muted",
  emptyResetButton: "mt-2 text-brand text-xs",
  grid: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 pt-1",
  itemCardBase:
    "group flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer select-none",
  itemCardActive:
    "border-brand bg-brand-subtle/30 text-ink shadow-xs ring-1 ring-brand/20",
  itemCardInactive:
    "border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-raised",
  itemLeft: "flex items-center gap-2.5 min-w-0 flex-1",
  itemLabelBase: "truncate text-body-sm",
  itemLabelActive: "font-semibold text-ink",
  itemLabelInactive: "font-normal text-ink",
  itemCategory:
    "shrink-0 text-[10px] font-mono uppercase tracking-wider text-ink-faint group-hover:text-ink-muted",
  tooltipContent: "max-w-xs",
  root: "w-full min-w-0",
  formStack: "space-y-8",
} as const;
