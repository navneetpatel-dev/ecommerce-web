"use client";

import { useVendorAnalytics as useVendorAnalyticsQuery } from "../api/vendor.queries";

export function useVendorAnalytics() {
  const { data: analytics, isLoading, isError } = useVendorAnalyticsQuery();
  return { analytics, isLoading, isError };
}
