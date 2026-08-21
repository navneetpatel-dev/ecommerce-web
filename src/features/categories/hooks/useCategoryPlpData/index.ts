"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { categoriesApi } from "../../api/categories.api";
import { categoryKeys } from "../../api/categories.queries";
import { useProductList } from "@/features/products";
import type { ProductFilters } from "@/features/products";

const RESERVED_PARAMS = new Set([
  "page",
  "limit",
  "sort",
  "minPrice",
  "maxPrice",
  "rating",
  "search",
  "categoryId",
  "vendorId",
  "includeDescendants",
]);

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseFacetSelections(
  params: URLSearchParams,
): Record<string, string[]> {
  const selected: Record<string, string[]> = {};
  params.forEach((value, key) => {
    if (RESERVED_PARAMS.has(key) || !value) return;
    selected[key] = value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  });
  return selected;
}

export function useCategoryPlpData(slugPath: string[]) {
  const searchParams = useSearchParams();
  const path = slugPath.join("/");

  const categoryQuery = useQuery({
    queryKey: categoryKeys.resolve(path),
    queryFn: () => categoriesApi.resolvePath(path),
    enabled: slugPath.length > 0,
    retry: false,
  });

  const facetSelections = useMemo(
    () => parseFacetSelections(searchParams),
    [searchParams],
  );

  const facetsQuery = useQuery({
    queryKey: categoryKeys.facets(categoryQuery.data?.id, facetSelections),
    queryFn: () =>
      categoriesApi.facets(categoryQuery.data!.id, facetSelections),
    enabled: Boolean(categoryQuery.data?.id),
  });

  const filters: ProductFilters = useMemo(
    () => ({
      categoryId: categoryQuery.data?.id,
      includeDescendants: true,
      minPrice: parseOptionalNumber(searchParams.get("minPrice")),
      maxPrice: parseOptionalNumber(searchParams.get("maxPrice")),
      rating: parseOptionalNumber(searchParams.get("rating")),
      sort: searchParams.get("sort") || undefined,
      page: parseOptionalNumber(searchParams.get("page")) || 1,
      limit: 20,
      attrs: facetSelections,
    }),
    [categoryQuery.data?.id, searchParams, facetSelections],
  );

  const productsQuery = useProductList(filters, {
    enabled: Boolean(categoryQuery.data?.id),
  });

  return { categoryQuery, facetsQuery, facetSelections, filters, productsQuery };
}
