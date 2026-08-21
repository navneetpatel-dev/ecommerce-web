import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "@/features/coupons";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import type { CouponFormInput } from "@/features/admin-dashboard";
import { toCouponCreateBody } from "@/features/admin-dashboard";

export const vendorCouponKeys = {
  all: ["vendor", "coupons"] as const,
  list: (page: number) => [...vendorCouponKeys.all, "list", page] as const,
  analytics: (id: string) =>
    [...vendorCouponKeys.all, "analytics", id] as const,
  absorbed: [...(["vendor", "coupons"] as const), "absorbed"] as const,
};

export function useVendorCoupons(page = 1, limit = DEFAULT_PAGE_LIMIT) {
  return useQuery({
    queryKey: vendorCouponKeys.list(page),
    queryFn: () => couponsApi.vendorList({ page, limit }),
  });
}

export function useVendorAbsorbedSummary() {
  return useQuery({
    queryKey: vendorCouponKeys.absorbed,
    queryFn: () => couponsApi.vendorAbsorbedSummary(),
  });
}

export function useCreateVendorCoupon(vendorId?: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CouponFormInput) =>
      couponsApi.vendorCreate(
        toCouponCreateBody(body, { forceVendorId: vendorId ?? undefined }),
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vendorCouponKeys.all });
    },
  });
}

export function useVendorCouponAnalytics(id: string | null) {
  return useQuery({
    queryKey: vendorCouponKeys.analytics(id ?? ""),
    queryFn: () => couponsApi.vendorAnalytics(id!),
    enabled: Boolean(id),
  });
}
