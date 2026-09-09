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
import { categoryPlpPageStyles as styles } from "./categoryPlpPage.styles";

interface CategoryPlpPageProps {
  slugPath: string[];
}

export function CategoryPlpPage({ slugPath }: CategoryPlpPageProps) {
  const plp = useCategoryPlp(slugPath);

  if (plp.categoryLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingLine1} />
        <div className={styles.loadingLine2} />
        <div className={styles.loadingBox} />
      </div>
    );
  }

  if (plp.categoryError || !plp.category) {
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
    plp.breadcrumbItems[plp.breadcrumbItems.length - 2]?.label ??
    LABELS.categories;

  return (
    <div className={styles.pageContainer}>
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

      <div className={styles.layoutRow}>
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
          compareAtLimit={plp.compareAtLimit}
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
