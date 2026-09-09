import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  buildSearchParams,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { VENDOR_STATUS, PRODUCT_STATUS } from "@/shared/constants/statuses";
import { downloadReportFile } from "@/features/reports";
import { buildReportExportFilenameFallback } from "@/shared/utils/files/downloadFilename";
import type {
  AdminAnalytics,
  VendorInfo,
  ProductDetail,
  Coupon,
  CouponAnalytics,
  CouponBatch,
  BulkGenerateResult,
  CouponStatus,
} from "@/shared/api/types";

export const adminApi = {
  dashboard: () =>
    apiClient.get<{
      totalOrders: number;
      totalRevenue: number;
      totalVendors: number;
      totalCustomers: number;
      pendingApprovals: number;
    }>(API.admin.dashboard),

  pendingVendors: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<VendorInfo>> => {
    const res = await apiClient.getWithResponse<VendorInfo[]>(
      API.vendors.list(
        buildSearchParams({
          status: VENDOR_STATUS.PENDING,
          page: params.page,
          limit: params.limit,
        }).toString(),
      ),
    );
    return unwrapPaginatedList(res);
  },

  vendors: async (
    params: PaginationQuery & { search?: string; status?: string } = {},
  ): Promise<PaginatedList<VendorInfo>> => {
    const res = await apiClient.getWithResponse<VendorInfo[]>(
      API.vendors.list(
        buildSearchParams({
          page: params.page,
          limit: params.limit,
          search: params.search,
          status: params.status,
        }).toString(),
      ),
    );
    return unwrapPaginatedList(res);
  },

  approveVendor: (id: string, commissionRate?: number) =>
    apiClient.patch(
      API.vendors.approve(id),
      commissionRate != null ? { commissionRate } : {},
    ),
  rejectVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.reject(id), { reason }),
  suspendVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.suspend(id), { reason }),
  unsuspendVendor: (id: string) => apiClient.patch(API.vendors.unsuspend(id)),
  deleteVendor: (id: string) => apiClient.delete(API.vendors.delete(id)),

  pendingProducts: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ProductDetail>> => {
    const res = await apiClient.getWithResponse<ProductDetail[]>(
      API.products.list(
        buildSearchParams({
          status: PRODUCT_STATUS.PENDING_APPROVAL,
          page: params.page,
          limit: params.limit,
        }).toString(),
      ),
    );
    return unwrapPaginatedList(res);
  },

  approveProduct: (id: string) =>
    apiClient.post<{ message: string }>(API.products.approve(id), {}),
  rejectProduct: (id: string, rejectionNote: string) =>
    apiClient.post<{ message: string }>(API.products.reject(id), {
      rejectionNote,
    }),
  archiveProduct: (id: string) =>
    apiClient.post<{ message: string }>(API.products.archive(id), {}),
  unarchiveProduct: (id: string) =>
    apiClient.post<{ message: string }>(API.products.unarchive(id), {}),

  coupons: async (
    params: PaginationQuery & {
      vendorId?: string | null;
      status?: string;
      vendorScoped?: boolean;
    } = {},
  ): Promise<PaginatedList<Coupon>> => {
    const res = await apiClient.getWithResponse<Coupon[]>(
      withQuery(API.coupons.list, {
        page: params.page,
        limit: params.limit,
        vendorId: params.vendorId,
        status: params.status,
        vendorScoped: params.vendorScoped,
      }),
    );
    return unwrapPaginatedList(res);
  },

  createCoupon: (body: unknown) =>
    apiClient.post<Coupon>(API.coupons.create, body),
  updateCouponStatus: (id: string, status: CouponStatus) =>
    apiClient.patch<Coupon>(API.coupons.status(id), { status }),
  couponAnalytics: (id: string) =>
    apiClient.get<CouponAnalytics>(API.coupons.analytics(id)),
  bulkGenerateCoupons: (body: unknown) =>
    apiClient.post<BulkGenerateResult>(API.coupons.bulk, body),
  couponBatches: () => apiClient.get<CouponBatch[]>(API.coupons.batches),
  notifyCouponAlerts: () =>
    apiClient.post<{ notified: number }>(API.coupons.notifyAlerts),
  analytics: () => apiClient.get<AdminAnalytics>(API.admin.analytics),
  exportAnalytics: (
    format: "xlsx" | "csv" | "pdf" = "xlsx",
    range?: { from?: string; to?: string },
  ) => {
    const params = buildSearchParams({
      format,
      from: range?.from,
      to: range?.to,
    });
    const from = range?.from ?? "";
    const to = range?.to ?? "";
    return downloadReportFile(
      API.admin.analyticsExport(params.toString()),
      buildReportExportFilenameFallback("platform-analytics", from, to, format),
    );
  },
};
