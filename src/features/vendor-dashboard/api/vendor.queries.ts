import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth.store";
import { vendorApi } from "./vendor.api";

export type VendorProductFilters = { status?: string; search?: string };

export const vendorKeys = {
  all: ["vendor"] as const,
  summary: () => [...vendorKeys.all, "summary"] as const,
  products: {
    all: ["vendor", "products"] as const,
    page: (page: number, filters?: VendorProductFilters) =>
      [...vendorKeys.products.all, page, filters] as const,
  },
  commissions: {
    all: ["vendor", "commissions"] as const,
    page: (page: number) => [...vendorKeys.commissions.all, page] as const,
  },
  payouts: {
    all: ["vendor", "payouts"] as const,
    vendor: (vendorId: string) => [...vendorKeys.payouts.all, vendorId] as const,
  },
  suborders: {
    all: ["vendor", "suborders"] as const,
    page: (page: number) => [...vendorKeys.suborders.all, page] as const,
  },
};

export function useVendorSummary() {
  return useQuery({
    queryKey: vendorKeys.summary(),
    queryFn: () => vendorApi.summary(),
  });
}

export function useVendorProducts(page = 1, filters?: VendorProductFilters) {
  return useQuery({
    queryKey: vendorKeys.products.page(page, filters),
    queryFn: () => vendorApi.products(page, filters),
    placeholderData: (prev) => prev,
  });
}

export function useVendorCommissions(page = 1) {
  return useQuery({
    queryKey: vendorKeys.commissions.page(page),
    queryFn: () => vendorApi.commissions(page),
    placeholderData: (prev) => prev,
  });
}

export function useVendorPayouts() {
  const vendorId = useAuthStore((s) => s.currentUser?.vendorId);
  return useQuery({
    queryKey: vendorKeys.payouts.vendor(vendorId ?? ""),
    queryFn: () => vendorApi.payouts(vendorId!),
    enabled: Boolean(vendorId),
    placeholderData: (prev) => prev,
  });
}
