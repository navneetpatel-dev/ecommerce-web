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
} as const;
