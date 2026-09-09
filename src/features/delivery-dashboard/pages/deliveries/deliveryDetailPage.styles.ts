export const deliveryDetailPageStyles = {
  container: "w-full min-w-0 space-y-6",
  backNav: "flex items-center gap-2",
  backLink:
    "inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink transition-colors",
  backIcon: "size-4",
  header:
    "flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between",
  titleMono:
    "mt-1 font-mono text-[1.5rem] sm:text-[1.75rem] font-bold tracking-tight text-ink",
  titleDisplay:
    "mt-1 font-display text-[1.5rem] sm:text-[1.75rem] font-bold text-ink",
  subtitle: "mt-1 text-body-sm text-ink-muted",
  headerActions: "flex flex-col items-end gap-2",
  errorText: "text-body-sm text-danger",
  loadingText: "text-ink-muted",
  notFoundText: "text-danger",
  grid: "grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8",
  mainColumn: "space-y-6 lg:col-span-7 xl:col-span-8",
  asideColumn: "space-y-6 lg:col-span-5 xl:col-span-4",
  processedBanner:
    "flex items-center gap-3 border border-line bg-surface p-5 shadow-elevation-1 text-success",
  processedIcon: "size-5 shrink-0",
  processedTitle: "font-medium",
  processedSubtitle: "text-body-sm text-ink-muted",
  failureNoteBanner:
    "border border-line bg-surface p-4 text-body-sm text-warning shadow-elevation-1",
  failureNoteLabel: "font-medium",
} as const;
