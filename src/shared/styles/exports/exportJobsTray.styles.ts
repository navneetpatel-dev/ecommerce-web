export const exportJobsTrayStyles = {
  container: "fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2",
  trayHeader:
    "px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted",
  card: "rounded-lg border border-line bg-surface-raised p-3 shadow-elevation-3",
  header: "flex items-center justify-between gap-2",
  title: "text-sm font-medium",
  meta: "text-xs text-ink-muted",
  progressRow: "mt-2 flex items-center gap-2",
  actions: "mt-2 flex justify-end gap-2",
  errorText: "mt-1 text-xs text-danger",
} as const;
