export const overviewSectionStyles = {
  container: "space-y-8",
  loadingSkeletonCard: "space-y-4 border border-line bg-surface p-6",
  loadingSkeletonRow: "flex items-center gap-4",
  loadingSkeletonAvatar: "h-24 w-24 rounded-full",
  loadingSkeletonInfo: "space-y-2",
  loadingSkeletonName: "h-6 w-40",
  loadingSkeletonEmail: "h-4 w-56",
  errorContainer: "border border-line bg-surface px-5 py-10 text-center",
  cardSection: "border border-line bg-surface shadow-elevation-1",
  cardHeader: "border-b border-line px-5 py-4 md:px-6",
  cardSubtitle: "mt-1 text-[0.875rem] text-ink-muted",
} as const;
