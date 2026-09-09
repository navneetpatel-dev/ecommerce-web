export const cookieBannerStyles = {
  wrapper: "fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom",
  banner:
    "relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-surface-raised border-t border-line shadow-elevation-3",
  text: "text-body-sm text-ink-muted flex-1 pr-6 sm:pr-0",
  actions: "flex items-center gap-2 shrink-0",
  prefLink: "text-body-sm",
  dismissButton:
    "absolute top-2 right-2 h-8 w-8 min-h-8 max-h-8 sm:hidden text-ink-muted",
} as const;

export const cookiePreferencesDialogStyles = {
  stack: "space-y-4",
  itemRow:
    "flex items-start justify-between gap-4 rounded-md border border-line bg-surface p-4",
  title: "text-body font-medium text-ink",
  description: "mt-1 text-body-sm text-ink-muted",
} as const;
