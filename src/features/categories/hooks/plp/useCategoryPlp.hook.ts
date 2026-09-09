"use client";

import { useState } from "react";
import { SORT_OPTIONS } from "@/features/products";
import { useCategoryPlpData } from "./useCategoryPlpData/index";
import { useCategoryPlpParams } from "./useCategoryPlpParams/index";
import { useCompareTray } from "../compare/useCompareTray/index";
import { useCategoryBreadcrumbs } from "./useCategoryBreadcrumbs/index";

export function useCategoryPlp(slugPath: string[]) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const {
    categoryQuery,
    facetsQuery,
    facetSelections,
    filters,
    productsQuery,
  } = useCategoryPlpData(slugPath);
  const { updateFilter, toggleFacetValue, clearFilters } =
    useCategoryPlpParams(facetSelections);
  const compareTray = useCompareTray();

  const hasActiveFacets =
    Object.keys(facetSelections).length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined;

  const hasSeoNoindex =
    hasActiveFacets || Boolean(filters.sort && filters.sort !== "trending");

  const breadcrumbItems = useCategoryBreadcrumbs(
    categoryQuery.data?.breadcrumb,
  );

  return {
    slugPath,
    category: categoryQuery.data,
    categoryError: categoryQuery.isError,
    categoryLoading: categoryQuery.isLoading,
    facets: facetsQuery.data?.facets ?? [],
    facetSelections,
    filters,
    data: productsQuery.data,
    isFetching: productsQuery.isFetching,
    filterOpen,
    sortOpen,
    compareMode: compareTray.compareMode,
    comparedProducts: compareTray.comparedProducts,
    comparedIds: compareTray.comparedProducts.map((item) => item.id),
    compareAtLimit: compareTray.compareAtLimit,
    compareSectionRef: compareTray.compareSectionRef,
    breadcrumbItems,
    hasActiveFacets,
    hasSeoNoindex,
    sortOptions: SORT_OPTIONS,
    openFilters: () => setFilterOpen(true),
    closeFilters: () => setFilterOpen(false),
    openSort: () => setSortOpen(true),
    closeSort: () => setSortOpen(false),
    toggleCompareMode: compareTray.toggleCompareMode,
    toggleCompareProduct: compareTray.toggleCompareProduct,
    clearComparedProducts: compareTray.clearComparedProducts,
    scrollToCompare: compareTray.scrollToCompare,
    updateFilter,
    toggleFacetValue,
    clearFilters,
    selectSort: (value: string) => {
      updateFilter("sort", value);
      setSortOpen(false);
    },
  };
}
