"use client";

import { Package } from "lucide-react";
import { FilterSidebar } from "@/features/products";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useCategoryPlp } from "../../../hooks/plp/useCategoryPlp.hook";
import { CategoryHeader } from "./CategoryHeader.component";
import { MobileActionBar } from "@/shared/components/listing/MobileActionBar.component";
import { ProductResults } from "./ProductResults.component";
import { FilterSheet } from "./FilterSheet.component";
import { SortSheet } from "./SortSheet.component";
import { CompareTray } from "./CompareTray.component";
import { categoryPlpPageStyles as styles } from "./categoryPlpPage.styles";

interface CategoryPlpPageProps {
  slugPath: string[];
}

export function CategoryPlpPage({ slugPath }: CategoryPlpPageProps) {
  const plp = useCategoryPlp(slugPath);
  const {
    breadcrumbItems,
    category,
    categoryError,
    categoryLoading,
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
    facetSelections,
    facets,
    filterOpen,
    filters,
    hasActiveFacets,
    isFetching,
    openFilters,
    openSort,
    scrollToCompare,
    selectSort,
    sortOpen,
    sortOptions,
    toggleCompareMode,
    toggleCompareProduct,
    toggleFacetValue,
    updateFilter,
    updateFilterDebounced,
  } = plp;

  if (categoryLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingLine1} />
        <div className={styles.loadingLine2} />
        <div className={styles.loadingBox} />
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className={styles.emptyContainer}>
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
    breadcrumbItems[breadcrumbItems.length - 2]?.label ?? LABELS.categories;

  return (
    <div className={styles.pageContainer}>
      <CategoryHeader
        category={category}
        breadcrumbItems={breadcrumbItems}
        slugPath={slugPath}
      />

      <MobileActionBar
        onOpenFilters={openFilters}
        onOpenSort={openSort}
        compareMode={compareMode}
        onToggleCompareMode={toggleCompareMode}
        variant="dense"
      />

      <div className={styles.layoutRow}>
        <FilterSidebar
          idPrefix="cat-desktop"
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          rating={filters.rating}
          facets={facets}
          facetSelections={facetSelections}
          onToggleFacet={toggleFacetValue}
          onUpdateFilter={updateFilterDebounced}
          onClear={clearFilters}
        />

        <ProductResults
          filters={filters}
          data={data}
          isFetching={isFetching}
          compareMode={compareMode}
          comparedIds={comparedIds}
          compareAtLimit={compareAtLimit}
          onToggleCompare={toggleCompareProduct}
          onToggleCompareMode={toggleCompareMode}
          onUpdateFilter={updateFilter}
          hasActiveFacets={hasActiveFacets}
          categoryName={category.name}
          onClearFilters={clearFilters}
          parentCategoryLabel={parentCategoryLabel}
          slugPath={slugPath}
        />
      </div>

      <FilterSheet
        open={filterOpen}
        onClose={closeFilters}
        filters={filters}
        facets={facets}
        facetSelections={facetSelections}
        onToggleFacet={toggleFacetValue}
        onUpdateFilter={updateFilterDebounced}
        onClear={clearFilters}
      />

      <SortSheet
        open={sortOpen}
        onClose={closeSort}
        sortOptions={sortOptions}
        currentSort={filters.sort}
        onSelect={selectSort}
      />

      <CompareTray
        ref={compareSectionRef}
        products={comparedProducts}
        onToggleProduct={toggleCompareProduct}
        onClear={clearComparedProducts}
        onCompareNow={scrollToCompare}
      />
    </div>
  );
}
