"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";

const FILTER_KEYS = [
  "search",
  "status",
  "categoryId",
  "vendorId",
  "inStock",
  "minPrice",
  "maxPrice",
  "sort",
] as const;

type FilterKey = (typeof FILTER_KEYS)[number];

/**
 * The filters of an admin product list: what is typed (starting from the URL), the debounced
 * query to send, and the change handlers.
 */
export function useProductListFilters() {
  const searchParams = useSearchParams();
  const [userFilters, setUserFilters] = useState<
    Partial<Record<string, string>>
  >({});
  const get = (k: FilterKey, alt?: string) =>
    userFilters[k] ??
    searchParams.get(k) ??
    (alt ? searchParams.get(alt) : null) ??
    "";

  const values = {
    search: get("search", "q"),
    status: get("status"),
    categoryId: get("categoryId"),
    vendorId: get("vendorId"),
    inStock: get("inStock"),
    minPrice: get("minPrice"),
    maxPrice: get("maxPrice"),
    sort: get("sort"),
  };
  const { categoryId, vendorId, inStock, sort } = values;
  const search = useDebouncedValue(values.search.trim(), 350);
  const minPrice = useDebouncedValue(values.minPrice.trim(), 350);
  const maxPrice = useDebouncedValue(values.maxPrice.trim(), 350);

  /** Everything but the status, which each list decides for itself. */
  const query = useMemo(
    () => ({
      search: search || undefined,
      categoryId: categoryId || undefined,
      vendorId: vendorId || undefined,
      inStock: inStock === "true" || inStock === "in_stock" ? true : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort || undefined,
    }),
    [search, categoryId, vendorId, inStock, minPrice, maxPrice, sort],
  );

  const setFilter = (key: FilterKey) => (value: string) =>
    setUserFilters((prev) => ({ ...prev, [key]: value }));

  const onClear = useCallback(() => {
    setUserFilters(Object.fromEntries(FILTER_KEYS.map((key) => [key, ""])));
  }, []);

  return {
    values,
    query,
    handlers: {
      onSearchChange: setFilter("search"),
      onStatusChange: setFilter("status"),
      onCategoryChange: setFilter("categoryId"),
      onVendorChange: setFilter("vendorId"),
      onInStockChange: setFilter("inStock"),
      onMinPriceChange: setFilter("minPrice"),
      onMaxPriceChange: setFilter("maxPrice"),
      onSortChange: setFilter("sort"),
      onClear,
    },
  };
}
