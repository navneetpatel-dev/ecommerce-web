import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { adminKeys } from "../api/admin.queries";

/**
 * Owns the coupon-batches listing query for the admin coupons page.
 * Returns named pending/error states plus a retry callback (Rule 13).
 */
export function useCouponBatches() {
  const batchesQuery = useQuery({
    queryKey: adminKeys.couponBatches,
    queryFn: () => adminApi.couponBatches(),
  });

  return {
    batches: batchesQuery.data,
    isLoading: batchesQuery.isLoading,
    isError: batchesQuery.isError,
    onRetry: batchesQuery.refetch,
  };
}
