import { useMemo } from "react";
import type { CategoryFacet } from "@/shared/api/types";

interface UseFilterSidebarPresentationParams {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  rating: number | undefined;
  facets?: CategoryFacet[];
  facetSelections?: Record<string, string[]>;
}

export function useFilterSidebarPresentation({
  minPrice,
  maxPrice,
  rating,
  facets = [],
  facetSelections = {},
}: UseFilterSidebarPresentationParams) {
  const hasFacetSelections = useMemo(
    () => Object.values(facetSelections).some((values) => values.length > 0),
    [facetSelections],
  );

  const hasFilters =
    minPrice !== undefined ||
    maxPrice !== undefined ||
    rating !== undefined ||
    hasFacetSelections;

  const defaultOpen = useMemo(
    () => ["price", "rating", ...facets.map((facet) => facet.filterKey)],
    [facets],
  );

  const accordionKey = useMemo(
    () => facets.map((f) => f.id).join("-") || "base",
    [facets],
  );

  return {
    hasFilters,
    defaultOpen,
    accordionKey,
  };
}
