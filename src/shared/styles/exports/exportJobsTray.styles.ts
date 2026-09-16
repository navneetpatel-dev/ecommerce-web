export const exportJobsTrayStyles = {
  container:
    "fixed inset-x-4 bottom-28 z-50 flex max-h-[60vh] flex-col gap-2 overflow-y-auto sm:inset-x-auto sm:right-4 sm:w-80",
  trayHeader:
    "px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted",
  card: "rounded-lg border border-line bg-surface-raised p-3 shadow-elevation-3 animate-slide-in-bottom",
  header: "flex items-center justify-between gap-2",
  title: "text-sm font-medium",
  meta: "text-xs text-ink-muted",
  progressRow: "mt-2 flex items-center gap-2",
  actions: "mt-2 flex justify-end gap-2",
  errorText: "mt-1 text-xs text-danger",
} as const;
