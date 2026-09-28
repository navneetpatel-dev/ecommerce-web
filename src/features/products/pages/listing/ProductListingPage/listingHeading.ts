import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductFilters } from "../../../api/listing/products.api";

/**
 * The listing's `<h1>` (visually hidden — the grid + chips carry the visual
 * hierarchy). It must still describe *this* listing: screen-reader and search
 * users need "Sarees" or "Results for “kurta”", not a generic "All Products"
 * on every one of the listing's many URLs.
 */
export function getListingHeading(
  filters: ProductFilters,
  categoryName?: string,
): string {
  if (filters.search) {
    return formatLabel(LABELS.searchResultsHeading, {
      search: filters.search,
    });
  }
  // A category id whose name is still loading falls through to the generic
  // label rather than rendering an empty heading.
  if (filters.categoryId && categoryName) return categoryName;
  return LABELS.allProducts;
}
