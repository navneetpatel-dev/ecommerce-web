import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import type { Order, ReturnRequest } from '@/shared/api/types'
import type { OrderStatus } from '@/shared/constants/statuses'

export const ordersApi = {
  myOrders: async (page = 1, limit = DEFAULT_PAGE_LIMIT) => {
    const res = await apiClient.getWithResponse<Order[]>(
      API.orders.list(`page=${page}&limit=${limit}`),
    )
    return unwrapPaginatedList(res)
  },
  detail: (id: string) => apiClient.get<Order>(API.orders.detail(id)),
  cancel: (id: string) =>
    apiClient.post<{ orderId: string; cancelled: boolean }>(API.orders.cancel(id)),
  create: (body: { shippingAddressId: string; couponId?: string }) =>
    apiClient.post<Order>(API.orders.list(), body),
  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<{ message: string }>(API.orders.status(id), { status }),
}

export const subOrdersApi = {
  vendorSubOrders: async (page = 1, limit = DEFAULT_PAGE_LIMIT) => {
    const res = await apiClient.getWithResponse<Order[]>(
      API.suborders.list(`page=${page}&limit=${limit}`),
    )
    return unwrapPaginatedList(res)
  },
  updateStatus: (id: string, body: { status: string; trackingId?: string }) =>
    apiClient.patch<{ message: string }>(API.suborders.status(id), body),
}

export const returnApi = {
  create: (body: { orderItemId: string; reasonCode: string; reason: string }) =>
    apiClient.post<ReturnRequest>(API.returns.create, body),
  list: () => apiClient.get<ReturnRequest[]>(API.returns.list),
  transition: (id: string, body: { status: string }) =>
    apiClient.patch<{ message: string }>(API.returns.transition(id), body),
}
