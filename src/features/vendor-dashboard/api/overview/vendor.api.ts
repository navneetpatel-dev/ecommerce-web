import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import {
  inventoryApi,
  type LowStockInventoryRow,
} from "@/shared/api/inventory.api";
import {
  asClientPaginatedList,
  type PaginatedList,
} from "@/shared/api/client/pagination";
import type {
  VendorSummary,
  VendorAnalytics,
  CommissionLedgerEntry,
  PayoutEntry,
} from "@/shared/api/types";
import type { VendorEntityType } from "@/shared/constants/statuses";
import { productsApi } from "@/features/products";
import { commissionsApi } from "@/features/admin-dashboard";

export type { LowStockInventoryRow };

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
  lowStock: inventoryApi.lowStock,
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
  products: (page = 1, filters?: { status?: string; search?: string }) =>
    productsApi.list({
      page,
      status: filters?.status,
      search: filters?.search,
    }),
  commissions: (page = 1): Promise<PaginatedList<CommissionLedgerEntry>> =>
    commissionsApi.list({ page }),
  payouts: async (vendorId: string): Promise<PaginatedList<PayoutEntry>> => {
    const res = await apiClient.getWithResponse<PayoutEntry[]>(
      API.payouts.vendor(vendorId),
    );
    return asClientPaginatedList(Array.isArray(res.data) ? res.data : []);
  },
};
