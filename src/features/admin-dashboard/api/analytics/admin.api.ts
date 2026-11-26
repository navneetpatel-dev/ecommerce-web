import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  buildSearchParams,
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
} from "@/shared/api/types";
import { adminCouponsApi } from "./adminCoupons.api";

export const adminApi = {
  ...adminCouponsApi,
  dashboard: () =>
    apiClient.get<{
      totalOrders: number;
      /** Null without `analytics.revenue`. */
      totalRevenue: number | null;
      totalVendors: number;
      totalCustomers: number;
      pendingApprovals: number;
    }>(API.admin.dashboard),

  pendingVendors: async (
    params: PaginationQuery & { search?: string } = {},
  ): Promise<PaginatedList<VendorInfo>> => {
    const res = await apiClient.getWithResponse<VendorInfo[]>(
      API.vendors.list(
        buildSearchParams({
          status: VENDOR_STATUS.PENDING,
          ...params,
        }).toString(),
      ),
    );
    return unwrapPaginatedList(res);
  },

  vendors: async (
    params: PaginationQuery & { search?: string; status?: string } = {},
  ): Promise<PaginatedList<VendorInfo>> => {
    const res = await apiClient.getWithResponse<VendorInfo[]>(
      API.vendors.list(buildSearchParams({ ...params }).toString()),
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
    params: PaginationQuery & {
      search?: string;
      categoryId?: string;
      vendorId?: string;
      inStock?: boolean;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    } = {},
  ): Promise<PaginatedList<ProductDetail>> => {
    const res = await apiClient.getWithResponse<ProductDetail[]>(
      API.products.list(
        buildSearchParams({
          status: PRODUCT_STATUS.PENDING_APPROVAL,
          ...params,
          inStock: params.inStock ? true : undefined,
        }).toString(),
      ),
    );
    return unwrapPaginatedList(res);
  },

  /** `ownWorkReason`: a Super Admin approving a listing they prepared themselves. */
  approveProduct: (id: string, ownWorkReason?: string) =>
    apiClient.post<{ message: string }>(
      API.products.approve(id),
      ownWorkReason ? { ownWorkReason } : {},
    ),
  rejectProduct: (id: string, rejectionNote: string) =>
    apiClient.post<{ message: string }>(API.products.reject(id), {
      rejectionNote,
    }),
  archiveProduct: (id: string) =>
    apiClient.post<{ message: string }>(API.products.archive(id), {}),
  unarchiveProduct: (id: string) =>
    apiClient.post<{ message: string }>(API.products.unarchive(id), {}),

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
    return downloadReportFile(
      API.admin.analyticsExport(params.toString()),
      buildReportExportFilenameFallback(
        "platform-analytics",
        range?.from ?? "",
        range?.to ?? "",
        format,
      ),
    );
  },
};
