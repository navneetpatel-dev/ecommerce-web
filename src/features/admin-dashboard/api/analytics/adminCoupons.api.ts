import { apiClient } from "@/shared/api/client/client";
import {
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
      }),
    );
    return unwrapPaginatedList(res);
  },

  createCoupon: (body: unknown) =>
    apiClient.post<Coupon>(API.coupons.create, body),
  updateCoupon: (id: string, body: unknown) =>
    apiClient.patch<Coupon>(API.coupons.detail(id), body),
  updateCouponStatus: (id: string, status: CouponStatus) =>
    apiClient.patch<Coupon>(API.coupons.status(id), { status }),
  couponAnalytics: (id: string) =>
    apiClient.get<CouponAnalytics>(API.coupons.analytics(id)),
  bulkGenerateCoupons: (body: unknown) =>
    apiClient.post<BulkGenerateResult>(API.coupons.bulk, body),
  couponBatches: () => apiClient.get<CouponBatch[]>(API.coupons.batches),
  notifyCouponAlerts: () =>
    apiClient.post<{ notified: number }>(API.coupons.notifyAlerts),
};
