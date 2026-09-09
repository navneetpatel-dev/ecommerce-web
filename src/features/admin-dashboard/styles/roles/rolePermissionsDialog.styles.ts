export const rolePermissionsDialogStyles = {
  dialogContent:
    "w-full sm:max-w-3xl max-h-[min(90vh,46rem)] h-[min(90vh,46rem)] p-0 sm:p-0 flex flex-col overflow-hidden gap-0",
  header: "border-b border-line px-6 py-4 bg-paper/50",
  headerRow: "flex items-center justify-between gap-3",
  titleWrapper: "flex items-center gap-2",
  shieldIcon: "size-5 text-brand shrink-0",
  title: "text-h3 font-semibold text-ink",
  counterBadge:
    "inline-flex shrink-0 items-center rounded-full bg-brand-subtle px-2.5 py-0.5 text-xs font-semibold text-brand tabular-nums",
  roleMetaRow: "mt-2 flex items-center gap-2 text-body-sm text-ink-muted",
  roleTag:
    "font-mono text-xs px-2 py-0.5 rounded-sm bg-surface border border-line text-ink font-semibold",
  systemBadge: "shrink-0 whitespace-nowrap",
  scrollArea: "min-h-0 flex-1 overflow-y-auto p-6",
  errorMessage: "mb-4 text-body-sm text-danger",
  footer:
    "border-t border-line px-6 py-4 bg-paper/50 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3",
  footerCount: "text-body-sm text-ink-muted",
  footerActions: "flex items-center justify-end gap-2",
  itemLabelBase:
    "group flex items-center justify-between gap-3 rounded-md border px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer select-none",
  itemLabelChecked:
    "border-brand bg-brand-subtle/30 text-ink shadow-xs ring-1 ring-brand/20",
  itemLabelUnchecked:
    "border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-raised",
  itemKeyText: "truncate text-body-sm font-mono",
  itemKeyChecked: "font-semibold text-ink",
  itemKeyUnchecked: "font-normal text-ink",
  emptyContainer:
    "py-12 text-center rounded-md border border-dashed border-line bg-surface/40",
  emptyText: "text-body font-medium text-ink-muted",
  clearSearchBtn: "mt-2 text-brand text-xs",
  gridSm2: "grid grid-cols-1 sm:grid-cols-2 gap-2.5",
  itemLabelRow: "flex items-center gap-2.5 min-w-0 flex-1",
  itemScopeText:
    "shrink-0 text-[10px] font-mono uppercase tracking-wider text-ink-faint group-hover:text-ink-muted",
  tooltipContent: "font-mono text-xs max-w-xs break-all",
  toolbarRoot:
    "mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between",
  searchWrap: "relative flex-1 sm:max-w-xs",
  searchIcon:
    "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-faint pointer-events-none",
  searchInput: "pl-9 pr-8 h-9 text-body-sm bg-surface border-line",
  clearIconBtn:
    "absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink",
  iconXs: "size-3.5",
  iconXsBrand: "size-3.5 text-brand",
  iconXsMuted: "size-3.5 text-ink-muted",
  toolbarActions: "flex items-center gap-2",
  actionBtn: "h-9 gap-1.5 text-xs font-medium",
  actionBtnMuted:
    "h-9 gap-1.5 text-xs font-medium text-ink-muted hover:text-ink",
} as const;
