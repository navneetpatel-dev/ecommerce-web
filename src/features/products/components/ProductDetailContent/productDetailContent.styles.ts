export const PRODUCT_DETAIL_CONTENT_STYLES = {
  container: "storefront-container pb-10 pt-4 sm:pt-6 md:pb-14 md:pt-8",
  breadcrumbs: "mb-5 sm:mb-6",
  layoutGrid:
    "grid grid-cols-1 items-start gap-8 md:grid-cols-12 lg:gap-10 xl:gap-14",

  // DetailTabsSection
  tabsContainer: "mt-12 border-t border-line pt-8 md:mt-16 md:pt-10",
  tabsList:
    "w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-line bg-transparent p-0",
  tabTrigger:
    "rounded-none border-b-2 border-transparent px-3 pb-3 pt-1 data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:shadow-none",
  tabContent: "py-6 md:py-8",
  descriptionWrapper: "max-w-3xl space-y-8",
  videoSection: "space-y-2",
  videoLabel:
    "text-body-sm font-semibold uppercase tracking-[0.08em] text-ink-muted",
  videoElement: "w-full rounded-xl border border-line bg-paper",

  // SellerPerksBlock
  soldByCard: "rounded-lg border border-line bg-surface px-3 py-3",
  soldByText: "text-body-sm text-ink-muted",
  soldByLink: "font-medium text-brand underline-offset-2 hover:underline",
  perksGrid: "grid gap-2.5 sm:grid-cols-2",
  perkCard:
    "flex items-start gap-2.5 rounded-lg border border-line bg-surface px-3 py-3",
  perkIcon: "mt-0.5 h-4 w-4 shrink-0 text-brand",
  perkTextStack: "space-y-1",
  perkText: "text-body-sm leading-snug text-ink-muted",

  // PriceAvailabilityBlock
  priceRow:
    "flex flex-wrap items-end justify-between gap-3 border-y border-line py-4",
  priceStack: "space-y-1.5",
  priceLine: "flex flex-wrap items-center gap-2",
  priceText: "font-sans text-[1.875rem] font-semibold leading-none text-brand",
  discountBadge: "rounded-full",
  listPriceText: "text-body text-ink-faint",
  listPriceLabel: "mr-1.5",
  strikeThrough: "line-through",
  listPriceStrike: "text-body text-ink-faint line-through",
  gstText: "text-body-sm text-ink-muted",
  hsnText: "text-body-sm text-ink-muted",
  taxEstimateText: "text-body-sm text-ink-faint",
  skuText: "text-body-sm text-ink-muted",

  // PurchasePanel
  purchasePanelRoot:
    "space-y-3 rounded-xl border border-line bg-paper/50 p-3 sm:p-4",
  helperText: "text-body-sm text-ink-muted",
  outOfStockStack: "space-y-2",
  actionRow:
    "flex flex-wrap items-center gap-2 border-t border-line pt-3 sm:gap-2.5",
  quantitySelector: "shrink-0",
  quantityControl: "h-9 w-9 min-h-9 max-h-9 [&_svg]:size-3.5",
  quantityValue: "h-5 w-6 text-body-sm",
  addToCartWrapper: "min-w-0 flex-1",
  addToCartButton: "w-full rounded-md sm:min-w-[10rem]",
  wishlistButton: "shrink-0 rounded-md border-line",
  heartWishlisted: "fill-danger text-danger animate-pulse-scale",
  heartUnwishlisted: "text-ink-muted",

  // ProductBuyBoxColumn
  buyBoxColumn: "min-w-0 md:col-span-6 lg:col-span-5",
  buyBoxStack: "space-y-5 lg:space-y-6",

  // StickyAddToCartBar
  stickyBarRoot:
    "fixed bottom-14 left-0 right-0 z-30 border-t border-line bg-surface/95 p-3 shadow-elevation-3 backdrop-blur-sm md:hidden",
  stickyBarRow: "flex items-center gap-3",
  stickyBarInfo: "min-w-0 flex-1",
  stickyBarTitle: "truncate text-body-sm font-medium text-ink",
  stickyBarPrice: "text-body font-semibold text-brand",
  stickyBarActionWrapper: "shrink-0",
  stickyBarButton: "rounded-full px-5",

  // ProductHeadingBlock
  headingStack: "space-y-3",
  eyebrowsRow: "flex flex-wrap items-center gap-2",
  headingTitle:
    "font-display font-semibold leading-[1.15] tracking-tight text-ink",
  ratingRow: "flex flex-wrap items-center gap-x-3 gap-y-1",
  reviewsLink:
    "text-body-sm text-ink-muted underline-offset-2 hover:text-brand hover:underline",
  tagsRow: "flex flex-wrap gap-1.5 pt-1",
  tagBadge: "rounded-full font-normal",
} as const;
