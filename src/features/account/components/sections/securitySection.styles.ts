export const securitySectionStyles = {
  container: "space-y-6",
  sessionsSection: "border border-line bg-surface shadow-elevation-1",
  headerRow:
    "flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4",
  title: "font-display text-[1.125rem] text-ink",
  subtitle: "mt-0.5 text-body-sm text-ink-muted",
  skeletonContainer: "space-y-3 p-5",
  skeletonItem: "h-14 w-full",
  errorContainer: "px-5 py-8 text-center",
  emptyState: "py-12 md:py-14",
  sessionsList: "divide-y divide-line",
  sessionRow: "flex flex-wrap items-center justify-between gap-3 px-5 py-4",
  sessionDetails: "min-w-0",
  deviceName: "font-medium text-ink",
  currentDeviceBadge:
    "ml-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand",
  sessionMeta: "mt-0.5 text-body-sm text-ink-muted",
  revokeButton: "text-danger hover:text-danger",
  errorWrapper: "px-5 pb-4",
} as const;
