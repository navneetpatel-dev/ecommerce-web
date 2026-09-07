import { apiClient } from "@/shared/api/client";
import {
  unwrapPaginatedList,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/pagination";
import { API } from "@/shared/constants/apiRoutes";

export interface CreateShippingRateBody {
  zoneId: string;
  method: "STANDARD" | "EXPRESS";
  minWeightGrams?: number;
  maxWeightGrams: number;
  price: number;
  estimatedDays: number;
  freeShippingThreshold?: number;
  vendorId?: string;
}

export const adminShippingApi = {
  zones: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<Record<string, unknown>>> => {
    const q = new URLSearchParams();
    if (params.page) q.set("page", String(params.page));
    if (params.limit) q.set("limit", String(params.limit));
    const qs = q.toString();
    const res = await apiClient.getWithResponse<Record<string, unknown>[]>(
      qs ? `${API.shipping.zones}?${qs}` : API.shipping.zones,
    );
    return unwrapPaginatedList(res);
  },
  createZone: (body: {
    name: string;
    states?: string[];
    pincodePrefixes?: string[];
  }) => apiClient.post<unknown>(API.shipping.zones, body),
  updateZone: (
    id: string,
    body: { name?: string; states?: string[]; pincodePrefixes?: string[] },
  ) => apiClient.patch<unknown>(API.shipping.zone(id), body),
  deleteZone: (id: string) => apiClient.delete(API.shipping.zone(id)),
  rates: () =>
    apiClient.get<Record<string, unknown>[]>(API.shipping.adminRates),
  createRate: (body: CreateShippingRateBody) =>
    apiClient.post<Record<string, unknown>>(API.shipping.createRate, body),
  updateRate: (id: string, body: Partial<CreateShippingRateBody>) =>
    apiClient.patch<Record<string, unknown>>(API.shipping.rate(id), body),
  deleteRate: (id: string) => apiClient.delete(API.shipping.rate(id)),
};
