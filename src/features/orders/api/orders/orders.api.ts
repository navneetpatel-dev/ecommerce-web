import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  buildSearchParams,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import type { Order } from "@/shared/api/types";
import type { OrderStatus } from "@/shared/constants/statuses";

export const ordersApi = {
  /** `userId` is admin-only — the backend ignores it for non-admin callers, scoping to their own orders instead. */
  myOrders: async (
    page = 1,
    limit = DEFAULT_PAGE_LIMIT,
    userId?: string,
    options?: { status?: string; search?: string },
  ) => {
    const query = buildSearchParams({
      page,
      limit,
      userId,
      status: options?.status,
      search: options?.search,
    }).toString();
    const res = await apiClient.getWithResponse<Order[]>(
      API.orders.list(query),
    );
    return unwrapPaginatedList(res);
  },
  detail: (id: string) => apiClient.get<Order>(API.orders.detail(id)),
  cancel: (id: string) =>
    apiClient.post<{ orderId: string; cancelled: boolean }>(
      API.orders.cancel(id),
    ),
  create: (body: { shippingAddressId: string; couponId?: string }) =>
    apiClient.post<Order>(API.orders.list(), body),
  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<{ message: string }>(API.orders.status(id), { status }),
  /** Admin: retry a cancelled or RTO'd part's failed card refund. */
  retryPartRefund: (subOrderId: string) =>
    apiClient.post<{ id: string; cancelRefundStatus: string | null }>(
      API.suborders.retryRefund(subOrderId),
    ),
};

export const subOrdersApi = {
  vendorSubOrders: async (page = 1, limit = DEFAULT_PAGE_LIMIT) => {
    const res = await apiClient.getWithResponse<Order[]>(
      API.suborders.list(`page=${page}&limit=${limit}`),
    );
    return unwrapPaginatedList(res);
  },
  updateStatus: (id: string, body: { status: string; trackingId?: string }) =>
    apiClient.patch<{ message: string }>(API.suborders.status(id), body),
};
