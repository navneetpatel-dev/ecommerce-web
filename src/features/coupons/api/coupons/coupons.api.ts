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
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";

function withPaginationQuery(base: string, params: PaginationQuery = {}) {
  const q = new URLSearchParams();
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  const qs = q.toString();
  return qs ? `${base}?${qs}` : base;
}

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
  eligible: (params: { productId?: string; limit?: number } = {}) => {
    const q = new URLSearchParams();
    if (params.productId) q.set("productId", params.productId);
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    return apiClient.get<EligibleCoupon[]>(
      qs ? `${API.coupons.eligible}?${qs}` : API.coupons.eligible,
    );
  },
  eligiblePublic: (params: { productId: string; limit?: number }) => {
    const q = new URLSearchParams();
    q.set("productId", params.productId);
    if (params.limit) q.set("limit", String(params.limit));
    return apiClient.get<EligibleCoupon[]>(
      `${API.coupons.eligiblePublic}?${q.toString()}`,
    );
  },

  vendorList: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<Coupon>> => {
    const res = await apiClient.getWithResponse<Coupon[]>(
      withPaginationQuery(API.coupons.vendor.list, params),
    );
    return unwrapPaginatedList(res);
  },
  vendorCreate: (body: unknown) =>
    apiClient.post<Coupon>(API.coupons.vendor.create, body),
  vendorUpdate: (id: string, body: unknown) =>
    apiClient.patch<Coupon>(API.coupons.vendor.detail(id), body),
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
