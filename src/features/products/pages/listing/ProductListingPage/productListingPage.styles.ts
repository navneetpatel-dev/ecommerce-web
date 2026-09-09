export const productListingPageStyles = {
  container: "storefront-container pb-8 pt-6 md:pt-8",
  srOnly: "sr-only",
  mainLayout: "mb-20 flex gap-10 xl:mb-28 xl:gap-12",
  resultsWrapper: "min-w-0 flex-1",

  // MobileActionBar
  mobileBarRoot:
    "sticky top-14 z-20 -mx-4 mb-6 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur-sm xl:hidden lg:top-[72px]",
  mobileBarRow: "flex items-center gap-2",
  mobileBarButton: "flex-1 gap-1.5",

  // FiltersBottomSheet
  filterSidebarFull: "w-full",
  filterSubmitButton: "mt-4 w-full",

  // SortBottomSheet
  sortOptionsList: "space-y-2",
} as const;
