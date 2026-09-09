export const adminPromoBannersPageStyles = {
  container: "w-full min-w-0 space-y-6",
  headerGroup: "space-y-1",
  heading:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  subheading: "max-w-2xl text-body text-ink-muted",
  loadingText: "text-ink-muted",
  errorText: "text-danger",
  emptyText: "text-ink-muted",
} as const;

export const promoBannerSectionStyles = {
  colSpan2: "sm:col-span-2",
  editSection: "w-full border-0 shadow-none",
} as const;

export const promoBannersListStyles = {
  list: "divide-y divide-line rounded-md border border-line bg-surface",
  item: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
  itemInfo: "min-w-0 space-y-1",
  itemTitle: "truncate text-body font-medium text-ink",
  itemSubtitle: "text-body-sm text-ink-muted",
  actions: "shrink-0",
} as const;
