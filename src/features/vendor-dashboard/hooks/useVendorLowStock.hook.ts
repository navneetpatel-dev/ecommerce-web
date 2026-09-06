"use client";

import { useVendorLowStock as useVendorLowStockQuery } from "../api/vendor.queries";

export function useVendorLowStock() {
  const { data: rows, isLoading, isError } = useVendorLowStockQuery();
  return { rows: rows ?? [], isLoading, isError };
}
