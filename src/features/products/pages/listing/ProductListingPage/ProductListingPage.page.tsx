"use client";

import { FilterSidebar } from "@/features/products/components/filters/FilterSidebar.component";
import { ProductCompareBar } from "@/features/products/components/compare/ProductCompareBar.component";
import { ProductCompareSection } from "@/features/products/components/compare/ProductCompareSection.component";
import { useCategories } from "@/features/categories";
import { suggestionHref, useSearchDidYouMean } from "@/features/search";
import { useProductListing } from "../../../hooks/listing/useProductListing.hook";
import { useAppliedFilterChips } from "../../../hooks/filters/useAppliedFilterChips.hook";
import { PATHS } from "@/shared/constants/paths/paths";
import { MobileActionBar } from "@/shared/components/listing/MobileActionBar.component";
import { ListingResults } from "./ListingResults.component";
import { FiltersBottomSheet } from "./FiltersBottomSheet.component";
import { SortBottomSheet } from "./SortBottomSheet.component";
import { getListingEmptyState } from "./emptyState";
import { getListingHeading } from "./listingHeading";
import { productListingPageStyles } from "./productListingPage.styles";

export function ProductListingPage() {
  const listing = useProductListing();
  const {
    clearComparedProducts,
    clearFilters,
    closeFilters,
    closeSort,
    compareAtLimit,
    compareMode,
    compareSectionRef,
    comparedIds,
    comparedProducts,
    data,
    filterOpen,
    filters,
    isFetching,
    isSearchActive,
    openFilters,
    openSort,
    removeAttrValue,
    removeFilters,
    scrollToCompare,
    selectSort,
    sortOpen,
    toggleCompareMode,
    toggleCompareProduct,
    updateFilter,
    updateFilterDebounced,
  } = listing;
  const { data: categories } = useCategories();
  const categoryName = categories?.find(
    (category) => category.id === filters.categoryId,
  )?.name;
  const empty = getListingEmptyState(filters, categoryName);
  const heading = getListingHeading(filters, categoryName);
  const chips = useAppliedFilterChips({
    filters: filters,
    removeFilters: removeFilters,
    removeAttrValue: removeAttrValue,
    categoryName,
  });
  const didYouMean = useSearchDidYouMean({
    term: filters.search,
    hasNoResults: data?.items.length === 0,
  });
  const didYouMeanHref = didYouMean ? suggestionHref(didYouMean) : undefined;

  const handleSortChange = (value: string) => updateFilter("sort", value);
  const handlePageChange = (page: number) => updateFilter("page", page);
  const handleClearFiltersInSheet = () => {
    clearFilters();
    closeFilters();
  };

  return (
    <div className={productListingPageStyles.container}>
      <h1 className={productListingPageStyles.srOnly}>{heading}</h1>

      <MobileActionBar
        compareMode={compareMode}
        onOpenFilters={openFilters}
        onOpenSort={openSort}
        onToggleCompareMode={toggleCompareMode}
        sortDisabled={isSearchActive}
      />

      <div className={productListingPageStyles.mainLayout}>
        <FilterSidebar
          idPrefix="desktop"
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          rating={filters.rating}
          onUpdateFilter={updateFilterDebounced}
          onClear={clearFilters}
          hideRatingFilter={isSearchActive}
        />

        <div className={productListingPageStyles.resultsWrapper}>
          <ListingResults
            sort={filters.sort}
            totalProducts={data?.total}
            chips={chips}
            isFetching={isFetching}
            onSortChange={handleSortChange}
            sortDisabled={isSearchActive}
            compareMode={compareMode}
            onToggleCompare={toggleCompareMode}
            isLoading={!data && isFetching}
            isEmpty={data?.items.length === 0}
            empty={empty}
            didYouMean={
              didYouMean && didYouMeanHref
                ? { term: didYouMean.name, href: didYouMeanHref }
                : undefined
            }
            products={data?.items}
            comparedIds={comparedIds}
            compareAtLimit={compareAtLimit}
            onToggleCompareProduct={toggleCompareProduct}
            currentPage={filters.page ?? 1}
            totalPages={data?.totalPages}
            onPageChange={handlePageChange}
            onClearFilters={clearFilters}
          />
        </div>
      </div>

      <FiltersBottomSheet
        open={filterOpen}
        onClose={closeFilters}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        rating={filters.rating}
        onUpdateFilter={updateFilterDebounced}
        onClear={handleClearFiltersInSheet}
        hideRatingFilter={isSearchActive}
      />

      <SortBottomSheet
        open={sortOpen}
        onClose={closeSort}
        sort={filters.sort}
        onSelectSort={selectSort}
      />

      <ProductCompareBar
        products={comparedProducts}
        onToggleProduct={toggleCompareProduct}
        onClear={clearComparedProducts}
        onCompareNow={scrollToCompare}
        compareHref={PATHS.compare}
      />

      <ProductCompareSection
        ref={compareSectionRef}
        products={comparedProducts}
      />
    </div>
  );
}
