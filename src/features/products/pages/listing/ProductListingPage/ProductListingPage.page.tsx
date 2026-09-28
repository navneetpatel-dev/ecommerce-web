"use client";

import { FilterSidebar } from "@/features/products/components/filters/FilterSidebar.component";
import { ProductCompareBar } from "@/features/products/components/compare/ProductCompareBar.component";
import { ProductCompareSection } from "@/features/products/components/compare/ProductCompareSection.component";
import { useCategories } from "@/features/categories";
import { suggestionHref, useSearchDidYouMean } from "@/features/search";
import { useProductListing } from "../../../hooks/listing/useProductListing.hook";
import { useAppliedFilterChips } from "../../../hooks/filters/useAppliedFilterChips.hook";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { MobileActionBar } from "./MobileActionBar.component";
import { ListingResults } from "./ListingResults.component";
import { FiltersBottomSheet } from "./FiltersBottomSheet.component";
import { SortBottomSheet } from "./SortBottomSheet.component";
import { getListingEmptyState } from "./emptyState";
import { productListingPageStyles } from "./productListingPage.styles";

export function ProductListingPage() {
  const listing = useProductListing();
  const { data: categories } = useCategories();
  const categoryName = categories?.find(
    (category) => category.id === listing.filters.categoryId,
  )?.name;
  const empty = getListingEmptyState(listing.filters, categoryName);
  const chips = useAppliedFilterChips({
    filters: listing.filters,
    removeFilters: listing.removeFilters,
    removeAttrValue: listing.removeAttrValue,
    categoryName,
  });
  const didYouMean = useSearchDidYouMean({
    term: listing.filters.search,
    hasNoResults: listing.data?.items.length === 0,
  });
  const didYouMeanHref = didYouMean ? suggestionHref(didYouMean) : undefined;

  return (
    <div className={productListingPageStyles.container}>
      <h1 className={productListingPageStyles.srOnly}>{LABELS.allProducts}</h1>

      <MobileActionBar
        compareMode={listing.compareMode}
        onOpenFilters={listing.openFilters}
        onOpenSort={listing.openSort}
        onToggleCompareMode={listing.toggleCompareMode}
        sortDisabled={listing.isSearchActive}
      />

      <div className={productListingPageStyles.mainLayout}>
        <FilterSidebar
          idPrefix="desktop"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilterDebounced}
          onClear={listing.clearFilters}
          hideRatingFilter={listing.isSearchActive}
        />

        <div className={productListingPageStyles.resultsWrapper}>
          <ListingResults
            sort={listing.filters.sort}
            totalProducts={listing.data?.total}
            chips={chips}
            isFetching={listing.isFetching}
            onSortChange={(v) => listing.updateFilter("sort", v)}
            sortDisabled={listing.isSearchActive}
            compareMode={listing.compareMode}
            onToggleCompare={listing.toggleCompareMode}
            isLoading={!listing.data && listing.isFetching}
            isEmpty={listing.data?.items.length === 0}
            empty={empty}
            didYouMean={
              didYouMean && didYouMeanHref
                ? { term: didYouMean.name, href: didYouMeanHref }
                : undefined
            }
            products={listing.data?.items}
            comparedIds={listing.comparedIds}
            compareAtLimit={listing.compareAtLimit}
            onToggleCompareProduct={listing.toggleCompareProduct}
            currentPage={listing.filters.page ?? 1}
            totalPages={listing.data?.totalPages}
            onPageChange={(p) => listing.updateFilter("page", p)}
            onClearFilters={listing.clearFilters}
          />
        </div>
      </div>

      <FiltersBottomSheet
        open={listing.filterOpen}
        onClose={listing.closeFilters}
        minPrice={listing.filters.minPrice}
        maxPrice={listing.filters.maxPrice}
        rating={listing.filters.rating}
        onUpdateFilter={listing.updateFilterDebounced}
        onClear={() => {
          listing.clearFilters();
          listing.closeFilters();
        }}
        hideRatingFilter={listing.isSearchActive}
      />

      <SortBottomSheet
        open={listing.sortOpen}
        onClose={listing.closeSort}
        sort={listing.filters.sort}
        onSelectSort={listing.selectSort}
      />

      <ProductCompareBar
        products={listing.comparedProducts}
        onToggleProduct={listing.toggleCompareProduct}
        onClear={listing.clearComparedProducts}
        onCompareNow={listing.scrollToCompare}
        compareHref={PATHS.compare}
      />

      <ProductCompareSection
        ref={listing.compareSectionRef}
        products={listing.comparedProducts}
      />
    </div>
  );
}
