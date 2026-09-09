import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import type {
  AppliedCouponSummary,
  Coupon,
  CouponAnalytics,
  CouponStatus,
  EligibleCoupon,
} from "@/shared/api/types";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";

export type RemoveCouponResult = {
  cleared: boolean;
  appliedCoupon: AppliedCouponSummary | null;
  appliedCoupons: AppliedCouponSummary[];
};

export const couponsApi = {
  apply: (code: string) =>
    apiClient.post<AppliedCouponSummary & { type: string }>(API.coupons.apply, {
      code,
    }),
  /** Omit `code` to clear the entire stacked-coupon set. */
  remove: (code?: string) =>
    apiClient.delete<RemoveCouponResult>(
      code
        ? `${API.coupons.remove}?code=${encodeURIComponent(code)}`
        : API.coupons.remove,
    ),
  eligible: (params: { productId?: string; limit?: number } = {}) =>
    apiClient.get<EligibleCoupon[]>(
      withQuery(API.coupons.eligible, {
        productId: params.productId,
        limit: params.limit,
      }),
    ),
  eligiblePublic: (params: { productId: string; limit?: number }) =>
    apiClient.get<EligibleCoupon[]>(
      withQuery(API.coupons.eligiblePublic, {
        productId: params.productId,
        limit: params.limit,
      }),
    ),

  vendorList: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<Coupon>> => {
    const res = await apiClient.getWithResponse<Coupon[]>(
      withQuery(API.coupons.vendor.list, params),
    );
    return unwrapPaginatedList(res);
  },
  vendorCreate: (body: unknown) =>
    apiClient.post<Coupon>(API.coupons.vendor.create, body),
  vendorUpdateStatus: (id: string, status: CouponStatus) =>
    apiClient.patch<Coupon>(API.coupons.vendor.status(id), { status }),
  vendorAnalytics: (id: string) =>
    apiClient.get<CouponAnalytics>(API.coupons.vendor.analytics(id)),
  vendorAbsorbedSummary: () =>
    apiClient.get<{
      vendorId: string;
      absorbedDiscountTotal: number;
      couponCount: number;
      periodStart?: string;
      periodEnd?: string;
    }>(API.coupons.vendor.absorbedSummary),
};
