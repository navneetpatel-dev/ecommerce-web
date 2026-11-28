"use client";

import { useVendorLowStock as useVendorLowStockQuery } from "../../api/overview/vendor.queries";

/** The first `limit` low-stock variants of the store, and how many there are in all. */
export function useVendorLowStock(limit: number) {
  const { data, isLoading, isError } = useVendorLowStockQuery(limit);
  return {
    rows: data?.items ?? [],
    matching: data?.total ?? 0,
    isLoading,
    isError,
  };
}
