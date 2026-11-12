/** Copy for the shared illustrated `ErrorState` (route boundaries, page-level load failures). Subset of LABELS. */
export const errorStateLabels = {
  errorStateEyebrow: "Temporary hiccup",
  notFoundStateEyebrow: "Not found",
  errorReference: "Reference",
  productLoadFailedBody:
    "Something went wrong on our side while fetching this product. It's usually temporary, so please try again in a moment.",
  productNotFoundBody:
    "This product may have been removed or is no longer available. Explore the shop to find something similar.",
  ordersLoadFailedTitle: "We couldn't load your orders",
} as const;
