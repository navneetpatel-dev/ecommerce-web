export const createDeliveryAgentFormStyles = {
  root: "rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-5",
  header: "flex items-center justify-between border-b border-line/60 pb-3",
  headerLeft: "flex items-center gap-2",
  bikeIcon: "size-5 text-brand",
  title: "font-display text-[1.125rem] font-semibold text-ink",
  cancelGhostButton: "text-ink-muted hover:text-ink",
  footer:
    "flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-3",
  footerActions: "flex items-center gap-3",
  bulkWrapper: "flex items-center gap-3",
  bulkHint: "text-caption font-medium text-ink-muted",
  errorText: "text-body-sm text-danger",
  grid: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  fieldWrapper: "space-y-1.5",
  fieldLabel: "text-caption font-medium text-ink-muted",
  selectTrigger: "w-full",
} as const;
