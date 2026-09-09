import { useQuery } from "@tanstack/react-query";
import { adminApi } from "./admin.api";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";

export const adminKeys = {
  all: ["admin"] as const,
  dashboard: () => [...adminKeys.all, "dashboard"] as const,
  analytics: () => [...adminKeys.all, "analytics"] as const,
  vendors: {
    all: ["admin", "vendors"] as const,
    pendingMeta: () => [...adminKeys.vendors.all, "pending", "meta"] as const,
  },
  products: {
    all: ["admin", "products"] as const,
    pendingMeta: () => [...adminKeys.products.all, "pending", "meta"] as const,
  },
  coupons: {
    all: ["admin", "coupons"] as const,
    page: (page: number, limit: number, vendorScoped?: boolean) =>
      [...adminKeys.coupons.all, page, limit, vendorScoped] as const,
  },
  couponAnalytics: (couponId: string | null | undefined) =>
    [...adminKeys.all, "coupon-analytics", couponId] as const,
  couponBatches: ["admin", "coupon-batches"] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminApi.dashboard(),
  });
}

/** Lightweight fetch for tab badge counts (uses pagination total). */
export function usePendingVendors() {
  return useQuery({
    queryKey: adminKeys.vendors.pendingMeta(),
    queryFn: () => adminApi.pendingVendors({ page: 1, limit: 1 }),
  });
}

export function usePendingProducts() {
  return useQuery({
    queryKey: adminKeys.products.pendingMeta(),
    queryFn: () => adminApi.pendingProducts({ page: 1, limit: 1 }),
  });
}

export function useAdminCoupons(
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
  vendorScoped?: boolean,
) {
  return useQuery({
    queryKey: adminKeys.coupons.page(page, limit, vendorScoped),
    queryFn: () => adminApi.coupons({ page, limit, vendorScoped }),
    placeholderData: (prev) => prev,
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminApi.analytics(),
  });
}
