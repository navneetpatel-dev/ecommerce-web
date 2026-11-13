/** Shared shell for the "all reviews" and "all questions" product sub-pages. */
export const productSubPageStyles = {
  container: "storefront-container pb-16 pt-4 sm:pt-6 md:pt-8",
  backLink:
    "inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted transition-colors hover:text-ink",
  backIcon: "h-4 w-4",
  header:
    "mt-4 mb-8 flex items-center gap-4 border-b border-line pb-6 md:mb-10",
  headerThumb:
    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-surface sm:h-16 sm:w-16",
  headerThumbImage: "object-cover",
  layout: "grid gap-8 lg:grid-cols-12 lg:gap-12",
  aside: "lg:col-span-4",
  asideSticky: "space-y-6 lg:sticky lg:top-28",
  main: "min-w-0 lg:col-span-8",
  headerText: "min-w-0",
  eyebrow: "text-eyebrow",
  title:
    "mt-1 font-display text-[1.5rem] leading-tight tracking-tight text-ink text-balance sm:text-[1.875rem]",
  toolbar:
    "flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-center md:justify-between",
  toolbarFilters: "flex flex-wrap items-center gap-2",
  resultRow: "flex min-h-11 flex-wrap items-center justify-between gap-2 pt-4",
  resultText: "text-body-sm text-ink-muted",
  clearButton: "h-8 px-2 text-body-sm",
  results: "relative",
  resultsFetching: "opacity-60 transition-opacity",
  pagination: "mt-8",
  chipIcon: "h-3.5 w-3.5",
  searchWrap: "relative w-full md:max-w-sm",
  searchIcon:
    "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted",
  searchInput: "h-10 pl-9 text-[1rem] sm:text-body",
  toolbarStack: "flex flex-col gap-3 border-b border-line pb-4",
  toolbarRow:
    "flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
} as const;
