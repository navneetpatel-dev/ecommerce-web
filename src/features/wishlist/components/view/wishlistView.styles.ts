export const wishlistViewStyles = {
  loadingContainer: "storefront-container py-8",
  container: "storefront-container py-8",
  title: "text-[1.75rem] font-semibold text-ink mb-6",
  errorText: "mb-4 text-[0.875rem] text-danger",
  grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6",
  unavailableCard:
    "relative rounded-sm border border-line bg-surface opacity-60 grayscale",
  overlay:
    "absolute inset-0 flex flex-col items-start justify-start gap-2 p-3 bg-transparent pointer-events-none",
  badge: "text-[0.6875rem] pointer-events-none",
  notifyWrapper: "pointer-events-auto",
  removeButton:
    "absolute right-2 top-2 z-10 h-8 w-8 min-h-8 max-h-8 rounded-full text-ink-muted hover:bg-danger-subtle hover:text-danger",
  availableCard: "relative",
  priceDropBadgeWrapper: "absolute left-2 top-2 z-10 pointer-events-none",
  paginationWrapper: "mt-8",
} as const;
