"use client";

import { useAdminAnalytics } from "../api/admin.queries";

export function useAdminAnalyticsPage() {
  const { data, isLoading } = useAdminAnalytics();
  const isEmpty = !isLoading && !data;

  return {
    data,
    isLoading,
    isEmpty,
  };
}
