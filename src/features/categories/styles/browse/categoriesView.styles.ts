import { cn } from "@/shared/utils/dom/cn";

export const categoriesViewStyles = {
  container: "storefront-container py-10 md:py-14",
  headerWrapper: "mb-10 max-w-2xl",
  headerEyebrow: "mb-2",
  headerTitle:
    "font-display text-[2rem] font-semibold leading-tight text-ink md:text-[2.5rem]",
  headerHint: "mt-3 text-body-lg text-ink-muted",
  emptyContainer:
    "rounded-md border border-line bg-surface px-6 py-16 text-center",
  emptyIcon: "mx-auto h-8 w-8 text-ink-faint",
  emptyTitle: "mt-4 text-body-lg font-medium text-ink",
  emptyLink: "mt-3 inline-flex items-center gap-1 text-body text-brand",
  emptyArrowIcon: "h-3.5 w-3.5",
  contentWrapper: "space-y-12",
  rootsGrid:
    "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4",
  subcategoriesSection: "space-y-10 border-t border-line pt-10",
  subcategoriesEyebrow: "mb-2",
  subcategoriesTitle: "text-[1.375rem] font-semibold text-ink",
  groupHeader: "mb-4 flex items-baseline justify-between gap-3",
  groupTitle: "text-body-lg font-semibold text-ink",
  shopAllLink: "text-body-sm font-medium text-brand hover:text-brand-hover",
  childrenGrid:
    "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  childLink: cn(
    "flex items-center gap-3 rounded-md border border-line bg-surface px-4 py-3",
    "text-body font-medium text-ink transition-colors",
    "hover:border-brand hover:text-brand",
  ),
  childIcon: "h-4 w-4 shrink-0 text-ink-faint",
  childName: "truncate",
} as const;
