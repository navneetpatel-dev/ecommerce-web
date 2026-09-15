import {
  Package,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductFilters } from "../../../api/listing/products.api";

export interface ListingEmptyState {
  icon: LucideIcon;
  eyebrow: string;
  heading: string;
  message: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: "clearFilters";
}

export function getListingEmptyState(
  filters: ProductFilters,
  categoryName?: string,
): ListingEmptyState {
  // The search endpoint (GET /api/search) ignores `rating` entirely (see fetchProductList /
  // useProductListing.hook.ts's isSearchActive) — while searching, a leftover rating filter from
  // before the search started isn't actually influencing results, so it shouldn't take priority
  // over the "no results for {search}" messaging below. minPrice/maxPrice ARE still forwarded to
  // search, so they still count.
  const hasFacets =
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.rating !== undefined && !filters.search);

  if (hasFacets) {
    return {
      icon: SlidersHorizontal,
      eyebrow: LABELS.filters,
      heading: LABELS.nothingInThisRange,
      message: LABELS.nothingInThisRangeHint,
      actionLabel: LABELS.resetFilters,
      onAction: "clearFilters",
    };
  }

  if (filters.search) {
    return {
      icon: Search,
      eyebrow: LABELS.search,
      heading: LABELS.noSearchResultsHeading,
      message: formatLabel(LABELS.noSearchResultsHint, {
        search: filters.search,
      }),
      actionLabel: LABELS.browseAllProducts,
      actionTo: PATHS.products,
    };
  }

  if (filters.categoryId) {
    return {
      icon: Package,
      eyebrow: LABELS.category,
      heading: LABELS.noCategoryProductsHeading,
      message: categoryName
        ? formatLabel(LABELS.noCategoryProductsHintNamed, {
            name: categoryName,
          })
        : LABELS.noCategoryProductsHint,
      actionLabel: LABELS.browseAllProducts,
      actionTo: PATHS.products,
    };
  }

  if (filters.vendorId) {
    return {
      icon: Package,
      eyebrow: LABELS.shop,
      heading: LABELS.noVendorProductsHeading,
      message: LABELS.noVendorProductsHint,
      actionLabel: LABELS.browseAllProducts,
      actionTo: PATHS.products,
    };
  }

  return {
    icon: Package,
    eyebrow: LABELS.shop,
    heading: LABELS.noProductsYetHeading,
    message: LABELS.noProductsYetHint,
    actionLabel: LABELS.goToHomepage,
    actionTo: PATHS.home,
  };
}
