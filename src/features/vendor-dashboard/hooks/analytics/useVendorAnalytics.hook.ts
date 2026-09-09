"use client";

import { useVendorAnalytics as useVendorAnalyticsQuery } from "../../api/overview/vendor.queries";

export function useVendorAnalytics() {
  const { data: analytics, isLoading, isError } = useVendorAnalyticsQuery();
  return { analytics, isLoading, isError };
}
