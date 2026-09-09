export const helpHomeViewStyles = {
  root: "relative",
  heroGlow:
    "pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: "storefront-container relative py-6 md:py-8",
  header: "max-w-2xl",
  title: "mt-1.5 font-display text-ink leading-[1.1] tracking-tight",
  subtitle: "mt-2 text-body text-ink-muted",
  searchWrapper: "relative mt-8 max-w-xl",
  searchIcon:
    "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted",
  searchInput: "pl-10",
  browseSection: "mt-12",
  browseGrid: "mt-3 grid gap-3 sm:grid-cols-2",
  categoryCard: "border border-line bg-surface-raised p-5 shadow-elevation-1",
  categoryCardTop: "flex items-start gap-3",
  categoryIconBox:
    "flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper",
  categoryIcon: "text-brand",
  categoryContent: "min-w-0",
  categoryTitle: "text-body-lg font-semibold tracking-tight text-ink",
  categoryDesc: "mt-1 text-body-sm text-ink-muted",
  articleList: "mt-4 divide-y divide-line border-t border-line",
  articleLink:
    "flex items-center justify-between gap-3 py-3 text-[0.875rem] text-ink transition-colors hover:text-brand",
  articleLinkTitle: "min-w-0 truncate",
  articleLinkChevron: "shrink-0 text-ink-muted",
  quickLinksSection: "mt-10",
  quickLinksGrid: "mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
  quickLinkCard:
    "flex h-full flex-col border border-line bg-surface-raised p-4 shadow-elevation-1 transition-colors hover:border-ink/25",
  quickLinkLabel: "font-medium text-ink",
  quickLinkDesc: "mt-1 text-body-sm text-ink-muted",
  contactSection:
    "mt-14 scroll-mt-24 border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-8",
  contactTitle: "mt-1.5 font-display text-ink leading-[1.15] tracking-tight",
  contactHint: "mt-2 max-w-xl text-body text-ink-muted",
  contactLinks: "mt-4 flex flex-wrap gap-3",
  contactLink: "text-[0.875rem] font-medium text-brand hover:text-brand-hover",
  contactFormWrapper: "mt-6",
  searchResultsSection:
    "mt-8 border border-line bg-surface-raised shadow-elevation-1",
  searchResultsHeader: "border-b border-line px-5 py-4",
  searchResultsCount: "text-[0.875rem] text-ink-muted",
  searchResultsList: "divide-y divide-line",
  searchResultLink:
    "flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper",
  searchResultContent: "min-w-0",
  searchResultTitle: "font-medium text-ink",
  searchResultSummary: "mt-1 text-[0.875rem] text-ink-muted",
  searchResultChevron: "mt-1 shrink-0 text-ink-muted",
  searchResultsEmpty: "px-5 py-10 text-center text-body text-ink-muted",
} as const;
