import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { Order, ReturnRequest } from '@/shared/api/types'
import type { OrderStatus } from '@/shared/constants/statuses'

export const ordersApi = {
  myOrders: async (page = 1) => {
    const res = await apiClient.getWithResponse<Order[]>(API.orders.list(`page=${page}`))
    const pagination = res.meta?.pagination as { total?: number; totalPages?: number } | undefined
    return {
      items: Array.isArray(res.data) ? res.data : [],
      total: pagination?.total ?? 0,
      totalPages: pagination?.totalPages ?? 1,
    }
  },
  detail: (id: string) => apiClient.get<Order>(API.orders.detail(id)),
  create: (body: { shippingAddressId: string; couponId?: string }) =>
    apiClient.post<Order>(API.orders.list(), body),
  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<{ message: string }>(API.orders.status(id), { status }),
}

export const subOrdersApi = {
  vendorSubOrders: async (page = 1) => {
    const res = await apiClient.getWithResponse<Order[]>(API.suborders.list(`page=${page}`))
    const pagination = res.meta?.pagination as { total?: number; totalPages?: number } | undefined
    return {
      items: Array.isArray(res.data) ? res.data : [],
      total: pagination?.total ?? 0,
      totalPages: pagination?.totalPages ?? 1,
    }
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
