"use client";

import {
  Columns2,
  Package,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  type LucideIcon,
} from "lucide-react";
import { FilterSidebar } from "@/features/products/components/FilterSidebar";
import { SortBar } from "@/features/products/components/SortBar";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductCompareBar } from "@/features/products/components/ProductCompareBar";
import { ProductCompareSection } from "@/features/products/components/ProductCompareSection";
import { PaginationContainer } from "@/shared/containers/PaginationContainer";
import { Button } from "@/shared/components/ui/button";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { EmptyState } from "@/shared/components/EmptyState";
import { SelectableOptionButton } from "@/shared/components/SelectableOptionButton";
import { useCategories } from "@/features/categories";
import { SORT_OPTIONS, useProductListing } from "../hooks/useProductListing";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { ProductFilters } from "../api/products.api";

function getListingEmptyState(
  filters: ProductFilters,
  categoryName?: string,
): {
  icon: LucideIcon;
  eyebrow: string;
  heading: string;
  message: string;
  actionLabel: string;
  actionTo?: string;
  onAction?: "clearFilters";
} {
  const hasFacets =
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined;

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

      <div className="sticky top-14 z-20 -mx-4 mb-6 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur-sm xl:hidden lg:top-[72px]">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={listing.openFilters}
          >
            <SlidersHorizontal size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.filters}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 gap-1.5"
            onClick={listing.openSort}
          >
            <ArrowUpDown size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.sort}
          </Button>
          <Button
            variant={listing.compareMode ? "default" : "secondary"}
            size="sm"
            className="flex-1 gap-1.5"
            onClick={listing.toggleCompareMode}
            aria-pressed={listing.compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.compare}
          </Button>
        </div>
      </div>

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
          <SortBar
            sort={listing.filters.sort}
            totalProducts={listing.data?.total}
            isFetching={listing.isFetching}
            onSortChange={(v) => listing.updateFilter("sort", v)}
            compareMode={listing.compareMode}
            onToggleCompare={listing.toggleCompareMode}
          />

          {!listing.data && listing.isFetching ? (
            <ProductGrid loading skeletonCount={12} />
          ) : listing.data?.items.length === 0 ? (
            <EmptyState
              icon={empty.icon}
              eyebrow={empty.eyebrow}
              heading={empty.heading}
              message={empty.message}
              actionLabel={empty.actionLabel}
              actionTo={empty.actionTo}
              onAction={
                empty.onAction === "clearFilters"
                  ? listing.clearFilters
                  : undefined
              }
            />
          ) : (
            <>
              <ProductGrid
                products={listing.data?.items}
                compareMode={listing.compareMode}
                comparedIds={listing.comparedIds}
                onToggleCompare={listing.toggleCompareProduct}
              />
              {listing.data && listing.data.totalPages > 1 && (
                <PaginationContainer
                  currentPage={listing.filters.page ?? 1}
                  totalPages={listing.data.totalPages}
                  onPageChange={(p) => listing.updateFilter("page", p)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <BottomSheet
        open={listing.filterOpen}
        onClose={listing.closeFilters}
        title={LABELS.filters}
      >
        <FilterSidebar
          idPrefix="mobile"
          className="w-full"
          minPrice={listing.filters.minPrice}
          maxPrice={listing.filters.maxPrice}
          rating={listing.filters.rating}
          onUpdateFilter={listing.updateFilterDebounced}
          onClear={() => {
            listing.clearFilters();
            listing.closeFilters();
          }}
        />
        <Button className="mt-4 w-full" onClick={listing.closeFilters}>
          {LABELS.showResults}
        </Button>
      </BottomSheet>

      <BottomSheet
        open={listing.sortOpen}
        onClose={listing.closeSort}
        title={LABELS.sort}
      >
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <SelectableOptionButton
              key={option.value}
              selected={listing.filters.sort === option.value}
              onClick={() => listing.selectSort(option.value)}
            >
              {option.label}
            </SelectableOptionButton>
          ))}
        </div>
      </BottomSheet>

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
