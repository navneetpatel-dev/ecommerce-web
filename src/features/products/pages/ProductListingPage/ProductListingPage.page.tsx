"use client";

import { FilterSidebar } from "@/features/products/components/FilterSidebar.component";
import { ProductCompareBar } from "@/features/products/components/ProductCompareBar.component";
import { ProductCompareSection } from "@/features/products/components/ProductCompareSection.component";
import { useCategories } from "@/features/categories";
import { useProductListing } from "../../hooks/useProductListing.hook";
import { LABELS } from "@/shared/constants/labels";
import { MobileActionBar } from "./MobileActionBar.component";
import { ListingResults } from "./ListingResults.component";
import { FiltersBottomSheet } from "./FiltersBottomSheet.component";
import { SortBottomSheet } from "./SortBottomSheet.component";
import { getListingEmptyState } from "./emptyState";

export function ProductListingPage() {
  const listing = useProductListing();
  const { data: categories } = useCategories();
  const categoryName = categories?.find(
    (category) => category.id === listing.filters.categoryId,
  )?.name;
  const empty = getListingEmptyState(listing.filters, categoryName);

  return (
    <div className="storefront-container pb-8 pt-6 md:pt-8">
      <h1 className="sr-only">{LABELS.allProducts}</h1>

      <MobileActionBar
        compareMode={listing.compareMode}
        onOpenFilters={listing.openFilters}
        onOpenSort={listing.openSort}
        onToggleCompareMode={listing.toggleCompareMode}
      />

      <div className="mb-20 flex gap-10 xl:mb-28 xl:gap-12">
        <FilterSidebar
          idPrefix="desktop"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilterDebounced}
          onClear={listing.clearFilters}
        />

        <div className="min-w-0 flex-1">
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
