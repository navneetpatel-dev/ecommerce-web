import { apiClient } from "@/shared/api/client/client";
import {
  buildSearchParams,
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  Coupon,
  CouponAnalytics,
  CouponBatch,
  CouponCustomerOption,
  BulkGenerateResult,
  CouponStatus,
} from "@/shared/api/types";

export const adminCouponsApi = {
  coupons: async (
    params: PaginationQuery & {
      vendorId?: string | null;
      status?: string;
      search?: string;
      vendorScoped?: boolean;
      type?: string;
      batchId?: string;
      excludeBatches?: boolean;
    } = {},
  ): Promise<PaginatedList<Coupon>> => {
    const res = await apiClient.getWithResponse<Coupon[]>(
      withQuery(API.coupons.list, {
        page: params.page,
        limit: params.limit,
        vendorId: params.vendorId,
        status: params.status,
        search: params.search,
        vendorScoped: params.vendorScoped,
        type: params.type,
        batchId: params.batchId,
        excludeBatches: params.excludeBatches,
      }),
    );
    return unwrapPaginatedList(res);
  },

  createCoupon: (body: unknown) =>
    apiClient.post<Coupon>(API.coupons.create, body),
  updateCoupon: (id: string, body: unknown) =>
    apiClient.patch<Coupon>(API.coupons.detail(id), body),
  updateCouponStatus: (id: string, status: CouponStatus, note?: string) =>
    apiClient.patch<Coupon>(API.coupons.status(id), { status, note }),
  /** Customers for the "specific customers" picker; needs only coupon access. */
  couponCustomerOptions: async (
    params: PaginationQuery & { search?: string } = {},
  ): Promise<PaginatedList<CouponCustomerOption>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<CouponCustomerOption[]>(
        API.coupons.customerOptions(
          buildSearchParams({
            page: params.page,
            limit: params.limit,
            search: params.search,
          }).toString(),
        ),
      ),
    ),
  updateBatchStatus: (id: string, status: "ACTIVE" | "PAUSED") =>
    apiClient.patch<{ updated: number }>(API.coupons.batchStatus(id), {
      status,
    }),
  couponAnalytics: (id: string) =>
    apiClient.get<CouponAnalytics>(API.coupons.analytics(id)),
  bulkGenerateCoupons: (body: unknown) =>
    apiClient.post<BulkGenerateResult>(API.coupons.bulk, body),
  couponBatches: () => apiClient.get<CouponBatch[]>(API.coupons.batches),
  notifyCouponAlerts: () =>
    apiClient.post<{ notified: number }>(API.coupons.notifyAlerts),
};
