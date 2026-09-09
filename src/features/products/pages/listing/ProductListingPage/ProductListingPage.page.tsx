"use client";

import { FilterSidebar } from "@/features/products/components/filters/FilterSidebar.component";
import { ProductCompareBar } from "@/features/products/components/compare/ProductCompareBar.component";
import { ProductCompareSection } from "@/features/products/components/compare/ProductCompareSection.component";
import { useCategories } from "@/features/categories";
import { useProductListing } from "../../../hooks/listing/useProductListing.hook";
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

  return (
    <div className={productListingPageStyles.container}>
      <h1 className={productListingPageStyles.srOnly}>{LABELS.allProducts}</h1>

      <MobileActionBar
        compareMode={listing.compareMode}
        onOpenFilters={listing.openFilters}
        onOpenSort={listing.openSort}
        onToggleCompareMode={listing.toggleCompareMode}
      />

      <div className={productListingPageStyles.mainLayout}>
        <FilterSidebar
          idPrefix="desktop"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilterDebounced}
          onClear={listing.clearFilters}
        />

        <div className={productListingPageStyles.resultsWrapper}>
          <ListingResults
            sort={listing.filters.sort}
            totalProducts={listing.data?.total}
            isFetching={listing.isFetching}
            onSortChange={(v) => listing.updateFilter("sort", v)}
            compareMode={listing.compareMode}
            onToggleCompare={listing.toggleCompareMode}
            isLoading={!listing.data && listing.isFetching}
            isEmpty={listing.data?.items.length === 0}
            empty={empty}
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
      />

      <ProductCompareSection
        ref={listing.compareSectionRef}
        products={listing.comparedProducts}
      />
    </div>
  );
}
