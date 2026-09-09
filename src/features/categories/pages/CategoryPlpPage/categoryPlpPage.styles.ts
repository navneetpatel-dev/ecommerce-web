import { cn } from "@/shared/utils/cn";

export const categoryPlpPageStyles = {
  loadingContainer: "storefront-container py-4 md:py-5",
  loadingLine1: "h-4 w-40 animate-pulse rounded bg-paper",
  loadingLine2: "mt-3 h-7 w-56 animate-pulse rounded bg-paper",
  loadingBox: "mt-6 h-64 animate-pulse rounded-md bg-paper",
  emptyContainer: "storefront-container py-10 md:py-14",
  pageContainer: "storefront-container pb-8 pt-3 sm:pt-4 md:pt-5",
  layoutRow: "mb-12 flex gap-6 sm:mb-16 xl:mb-24 xl:gap-10",
  header: "mb-3 sm:mb-4 md:mb-5",
  breadcrumbs: "mb-1.5 sm:mb-2",
  titleRow: "flex flex-col gap-2.5 lg:flex-row lg:items-end lg:gap-6 xl:gap-8",
  titleBlock:
    "min-w-0 shrink-0 lg:max-w-[min(100%,22rem)] xl:max-w-[min(100%,28rem)]",
  title: "font-display font-semibold tracking-tight text-ink",
  seoDescription:
    "mt-1 line-clamp-2 max-w-2xl text-ink-muted sm:line-clamp-none",
  nav: "min-w-0 flex-1 lg:pt-0.5",
  navEyebrow: "mb-1.5 text-eyebrow leading-none lg:text-right",
  navList:
    "-mx-4 flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain px-4 pb-0.5 [scrollbar-width:none] touch-pan-x sm:mx-0 sm:px-0 lg:justify-end [&::-webkit-scrollbar]:hidden",
  navItem: "shrink-0",
  childLink: cn(
    "group inline-flex h-8 items-center gap-0.5 rounded-md border border-line bg-surface px-2.5",
    "text-body-sm font-medium text-ink shadow-card-hairline-strong",
    "transition-colors hover:border-brand hover:bg-brand-subtle hover:text-brand",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ),
  chevronIcon:
    "h-3.5 w-3.5 text-ink-faint transition-colors group-hover:text-brand",
  actionBarContainer:
    "sticky top-14 z-20 -mx-4 mb-3 border-y border-line bg-paper/95 px-4 py-2 backdrop-blur-sm xl:hidden lg:top-[72px]",
  buttonRow: "flex items-center gap-1.5 sm:gap-2",
  actionButton: "min-w-0 flex-1 gap-1 px-2 sm:gap-1.5 sm:px-4",
  buttonText: "truncate",
  resultsContainer: "min-w-0 flex-1",
  sortBar: "mb-4 border-b-0 pb-0 xl:mb-6 xl:border-b xl:pb-4",
  emptyState: "py-14 md:py-16",
  filterSidebar: "w-full",
  showResultsButton: "mt-4 w-full",
  optionsContainer: "space-y-2",
} as const;
