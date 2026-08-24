"use client";

import { Package } from "lucide-react";
import { FilterSidebar } from "@/features/products";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useCategoryPlp } from "../../hooks/useCategoryPlp.hook";
import { CategoryHeader } from "./CategoryHeader.component";
import { MobileActionBar } from "./MobileActionBar.component";
import { ProductResults } from "./ProductResults.component";
import { FilterSheet } from "./FilterSheet.component";
import { SortSheet } from "./SortSheet.component";
import { CompareTray } from "./CompareTray.component";

interface CategoryPlpPageProps {
  slugPath: string[];
}

export function CategoryPlpPage({ slugPath }: CategoryPlpPageProps) {
  const plp = useCategoryPlp(slugPath);

  if (plp.categoryLoading) {
    return (
      <div className="storefront-container py-4 md:py-5">
        <div className="h-4 w-40 animate-pulse rounded bg-paper" />
        <div className="mt-3 h-7 w-56 animate-pulse rounded bg-paper" />
        <div className="mt-6 h-64 animate-pulse rounded-md bg-paper" />
      </div>
    );
  }

  if (plp.categoryError || !plp.category) {
    return (
      <div className="storefront-container py-10 md:py-14">
        <EmptyState
          icon={Package}
          eyebrow={LABELS.shop}
          heading={LABELS.categoryNotFound}
          message={LABELS.categoryPlpEmpty}
          actionLabel={LABELS.allCategories}
          actionTo={PATHS.categories}
        />
      </div>
    );
  }

  const parentCategoryLabel =
    plp.breadcrumbItems[plp.breadcrumbItems.length - 2]?.label ??
    LABELS.categories;

  return (
    <div className="storefront-container pb-8 pt-3 sm:pt-4 md:pt-5">
      <CategoryHeader
        category={plp.category}
        breadcrumbItems={plp.breadcrumbItems}
        slugPath={slugPath}
      />

      <MobileActionBar
        onOpenFilters={plp.openFilters}
        onOpenSort={plp.openSort}
        compareMode={plp.compareMode}
        onToggleCompareMode={plp.toggleCompareMode}
      />

      <div className="mb-12 flex gap-6 sm:mb-16 xl:mb-24 xl:gap-10">
        <FilterSidebar
          idPrefix="cat-desktop"
          minPrice={plp.filters.minPrice}
          maxPrice={plp.filters.maxPrice}
          rating={plp.filters.rating}
          facets={plp.facets}
          facetSelections={plp.facetSelections}
          onToggleFacet={plp.toggleFacetValue}
          onUpdateFilter={plp.updateFilter}
          onClear={plp.clearFilters}
        />

        <ProductResults
          filters={plp.filters}
          data={plp.data}
          isFetching={plp.isFetching}
          compareMode={plp.compareMode}
          comparedIds={plp.comparedIds}
          onToggleCompare={plp.toggleCompareProduct}
          onToggleCompareMode={plp.toggleCompareMode}
          onUpdateFilter={plp.updateFilter}
          hasActiveFacets={plp.hasActiveFacets}
          categoryName={plp.category.name}
          onClearFilters={plp.clearFilters}
          parentCategoryLabel={parentCategoryLabel}
          slugPath={slugPath}
        />
      </div>

      <FilterSheet
        open={plp.filterOpen}
        onClose={plp.closeFilters}
        filters={plp.filters}
        facets={plp.facets}
        facetSelections={plp.facetSelections}
        onToggleFacet={plp.toggleFacetValue}
        onUpdateFilter={plp.updateFilter}
        onClear={plp.clearFilters}
      />

      <SortSheet
        open={plp.sortOpen}
        onClose={plp.closeSort}
        sortOptions={plp.sortOptions}
        currentSort={plp.filters.sort}
        onSelect={plp.selectSort}
      />

      <CompareTray
        ref={plp.compareSectionRef}
        products={plp.comparedProducts}
        onToggleProduct={plp.toggleCompareProduct}
        onClear={plp.clearComparedProducts}
        onCompareNow={plp.scrollToCompare}
      />
    </div>
  );
}
