export const searchSuggestionRowStyles = {
  typeIcon: "h-4 w-4",
  thumbImageWrapper:
    "relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-paper",
  thumbImage:
    "h-full w-full object-cover transition-transform duration-300 group-hover/row:scale-[1.04]",
  fallbackThumb:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-brand-subtle text-brand transition-colors duration-200 group-hover/row:border-brand/25 group-hover/row:bg-brand group-hover/row:text-paper",
  fallbackInitial: "font-display text-body leading-none tracking-tight",
  rowButton:
    "group/row flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 outline-none focus-visible:bg-brand-subtle/70",
  rowActive: "bg-brand-subtle/80",
  rowInactive: "hover:bg-paper",
  contentCol: "min-w-0 flex-1",
  nameRow: "flex items-center gap-2",
  nameText:
    "truncate text-body font-medium leading-snug text-ink transition-colors group-hover/row:text-brand",
  nameActive: "text-brand",
  metaRow: "mt-0.5 flex min-w-0 items-center gap-2",
  typeBadge:
    "inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink-muted",
  metaText: "truncate text-body-sm text-ink-muted",
  arrowButton:
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent text-ink-faint transition-all duration-200 group-hover/row:border-line group-hover/row:bg-surface group-hover/row:text-brand",
  arrowActive: "border-line bg-surface text-brand",
  arrowIcon: "h-3.5 w-3.5",
  srOnly: "sr-only",
} as const;
