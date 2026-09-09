"use client";

import { useVendorLowStock as useVendorLowStockQuery } from "../../api/overview/vendor.queries";

export function useVendorLowStock() {
  const { data: rows, isLoading, isError } = useVendorLowStockQuery();
  const safeRows = rows ?? [];
  return { rows: safeRows, isLoading, isError };
}
