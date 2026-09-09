import { apiClient } from "@/shared/api/client/client";
import {
  asClientPaginatedList,
  unwrapPaginatedList,
  type PaginatedList,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type {
  VendorSummary,
  VendorAnalytics,
  CommissionLedgerEntry,
  PayoutEntry,
  ProductListItem,
} from "@/shared/api/types";
import type { VendorEntityType } from "@/shared/constants/statuses";

type LowStockVariantResponse = {
  id: string;
  sku: string;
  stock: number;
  lowStockAt: number;
  product?: { name?: string | null } | null;
};

export type LowStockInventoryRow = {
  id: string;
  productName: string;
  sku: string;
  stock: number;
  lowStockAt: number;
};

export type VendorPayoutFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export type VendorShop = {
  id: string;
  businessName: string;
  returnShippingFee: number | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  entityType?: VendorEntityType | null;
  categoryIds?: string[];
  status?: string;
  codEnabled?: boolean;
  payoutFrequency?: VendorPayoutFrequency | null;
};

export const vendorApi = {
  summary: () => apiClient.get<VendorSummary>(API.vendors.dashboardSummary),
  analytics: () =>
    apiClient.get<VendorAnalytics>(API.vendors.dashboardAnalytics),
  lowStock: async (): Promise<LowStockInventoryRow[]> => {
    const rows = await apiClient.get<LowStockVariantResponse[]>(
      API.inventory.lowStock,
    );
    return rows.map((row) => ({
      id: row.id,
      productName: row.product?.name ?? "Unknown product",
      sku: row.sku,
      stock: Number(row.stock),
      lowStockAt: Number(row.lowStockAt),
    }));
  },
  getMyShop: () => apiClient.get<VendorShop>(API.vendors.me),
  updateMyShop: (body: {
    returnShippingFee?: number | null;
    logoUrl?: string | null;
    bannerUrl?: string | null;
    entityType?: VendorEntityType;
    categoryIds?: string[];
    codEnabled?: boolean;
    payoutFrequency?: VendorPayoutFrequency | null;
  }) => apiClient.patch<VendorShop>(API.vendors.me, body),
  products: (page = 1, filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams({ page: String(page) });
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    return apiClient.get<{
      items: ProductListItem[];
      total: number;
      totalPages: number;
    }>(API.products.list(params.toString()));
  },
  commissions: async (
    page = 1,
  ): Promise<PaginatedList<CommissionLedgerEntry>> => {
    const res = await apiClient.getWithResponse<CommissionLedgerEntry[]>(
      `${API.commissions.list}?page=${page}`,
    );
    return unwrapPaginatedList(res);
  },
  payouts: async (vendorId: string): Promise<PaginatedList<PayoutEntry>> => {
    const res = await apiClient.getWithResponse<PayoutEntry[]>(
      API.payouts.vendor(vendorId),
    );
    return asClientPaginatedList(Array.isArray(res.data) ? res.data : []);
  },
};
