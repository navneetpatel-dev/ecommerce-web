"use client";

import { useVendorSummary } from "../api/vendor.queries";

export function useVendorOverview() {
  const { data: summary, isLoading } = useVendorSummary();
  return { summary, isLoading };
}
