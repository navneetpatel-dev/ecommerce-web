import { apiClient } from "@/shared/api/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { VENDOR_STATUS, PRODUCT_STATUS } from "@/shared/constants/statuses";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS } from "@/shared/constants/timing";
import { useAuthStore } from "@/shared/stores/auth.store";
import { resolveDownloadFilename } from "@/shared/utils/downloadFilename";
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

async function downloadBlob(path: string, fallbackName: string) {
  const token = useAuthStore.getState().accessToken;
  const res = await fetch(`${CLIENT_API_BASE_URL}${path}`, {
    credentials: "include",
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = resolveDownloadFilename(res, fallbackName);
  a.click();
  URL.revokeObjectURL(url);
}

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
    const q = new URLSearchParams({ status: VENDOR_STATUS.PENDING });
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const res = await apiClient.getWithResponse<VendorInfo[]>(
      API.vendors.list(q.toString()),
    );
    return unwrapPaginatedList(res);
  },

  vendors: async (
    params: PaginationQuery & { search?: string; status?: string } = {},
  ): Promise<PaginatedList<VendorInfo>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    if (params.status) q.set("status", params.status);
    const res = await apiClient.getWithResponse<VendorInfo[]>(
      API.vendors.list(q.toString()),
    );
    return unwrapPaginatedList(res);
  },

  approveVendor: (id: string) => apiClient.patch(API.vendors.approve(id), {}),
  rejectVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.reject(id), { reason }),
  suspendVendor: (id: string, reason: string) =>
    apiClient.patch(API.vendors.suspend(id), { reason }),
  deleteVendor: (id: string) => apiClient.delete(API.vendors.delete(id)),

  getVendorDocuments: (vendorId: string) =>
    apiClient.get<
      Array<{
        id: string;
        vendorId: string;
        type: import("@/shared/constants/statuses").VendorDocumentType;
        url: string;
        verified: boolean;
        createdAt?: string;
      }>
    >(API.vendorDocs.list(vendorId)),
  verifyVendorDocument: (documentId: string) =>
    apiClient.patch(API.vendorDocs.verify(documentId), {}),
  rejectVendorDocument: (documentId: string, reason: string) =>
    apiClient.patch<{ id: string; rejected: boolean; rejectionReason: string }>(
      API.vendorDocs.reject(documentId),
      {
        reason,
      },
    ),

  pendingProducts: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ProductDetail>> => {
    const q = new URLSearchParams({ status: PRODUCT_STATUS.PENDING_APPROVAL });
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const res = await apiClient.getWithResponse<ProductDetail[]>(
      API.products.list(q.toString()),
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

  coupons: async (
    params: PaginationQuery & {
      vendorId?: string | null;
      status?: string;
      vendorScoped?: boolean;
    } = {},
  ): Promise<PaginatedList<Coupon>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    if (params.vendorId) q.set("vendorId", params.vendorId);
    if (params.status) q.set("status", params.status);
    if (params.vendorScoped !== undefined)
      q.set("vendorScoped", String(params.vendorScoped));
    const qs = q.toString();
    const res = await apiClient.getWithResponse<Coupon[]>(
      qs ? `${API.coupons.list}?${qs}` : API.coupons.list,
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
  analytics: () => apiClient.get<AdminAnalytics>(API.admin.analytics),
  exportAnalytics: (format: "xlsx" | "csv" | "pdf" = "xlsx") =>
    downloadBlob(
      API.admin.analyticsExport(`format=${format}`),
      `platform-analytics_${new Date().toISOString().slice(0, 10)}.${format}`,
    ),
};
