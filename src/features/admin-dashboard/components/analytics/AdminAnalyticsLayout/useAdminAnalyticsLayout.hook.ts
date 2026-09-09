"use client";

import { useMemo } from "react";
import type { AdminAnalytics } from "@/shared/api/types";

export function useAdminAnalyticsLayout(data: AdminAnalytics) {
  const exportRange = useMemo(() => {
    if (data.orderVolume.length === 0) return undefined;
    return {
      from: data.orderVolume[0]!.date,
      to: data.orderVolume[data.orderVolume.length - 1]!.date,
    };
  }, [data.orderVolume]);

  const topVendorItems = useMemo(
    () =>
      data.topVendors.map((v) => ({
        id: v.id,
        label: v.businessName,
        revenue: v.revenue,
        sharePercent: v.sharePercent,
      })),
    [data.topVendors],
  );

  const topCategoryItems = useMemo(
    () =>
      data.topCategories.map((c) => ({
        id: c.id,
        label: c.name,
        revenue: c.revenue,
        sharePercent: c.sharePercent,
      })),
    [data.topCategories],
  );

  return {
    exportRange,
    topVendorItems,
    topCategoryItems,
  };
}
