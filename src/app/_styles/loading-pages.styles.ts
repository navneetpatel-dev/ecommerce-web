export const loadingPagesStyles = {
  // Orders, Tickets, Bug Reports
  paddedCardStack: "space-y-4 p-6",

  // Vendors
  vendorsContainer: "storefront-container space-y-4 py-6",

  // Products index
  productsContainer: "mx-auto max-w-7xl space-y-6 px-4 pt-8 pb-8",
  productsFlex: "flex gap-8",
  productsSidebar: "hidden w-64 shrink-0 space-y-4 lg:block",
  productsMain: "min-w-0 flex-1 space-y-4",
  productsHeaderRow: "flex items-center justify-between gap-4",
  skelH6W24: "h-6 w-24",
  skelH32Rounded: "h-32 w-full rounded-md",
  skelH24Rounded: "h-24 w-full rounded-md",
  skelH5W28: "h-5 w-28",
  skelH9W40: "h-9 w-40",

  // Product detail [slug]
  productDetailContainer: "max-w-6xl mx-auto p-6 space-y-8",
  productDetailGrid: "grid grid-cols-1 md:grid-cols-2 gap-8",
  productDetailImage: "aspect-square rounded-lg",
  productDetailStack: "space-y-4",
  skelH8W75: "h-8 w-3/4",
  skelH4Full: "h-4 w-full",
  skelH4W66: "h-4 w-2/3",
  skelH10W32: "h-10 w-32",

  // Admin
  adminContainer: "space-y-6",
  titleStack: "space-y-2",
  skelH8W48: "h-8 w-48",
  skelH4W72: "h-4 w-72",
  skelH40Rounded: "h-40 w-full rounded-md",

  // Vendor Dashboard
  skelH8W52: "h-8 w-52",
  skelH4W64: "h-4 w-64",
  vendorMetricGrid: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",

  // Vendor Register
  screenBgPaper: "min-h-screen bg-paper",
} as const;
