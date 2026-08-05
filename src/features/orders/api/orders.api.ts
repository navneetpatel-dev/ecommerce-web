import { apiClient } from '@/shared/api/client'
import type { Order, ReturnRequest } from '@/shared/api/types'

export const ordersApi = {
  myOrders: async (page = 1) => {
    const res = await apiClient.getWithResponse<Order[]>(`/api/orders?page=${page}`)
    const pagination = res.meta?.pagination as { total?: number; totalPages?: number } | undefined
    return {
      items: Array.isArray(res.data) ? res.data : [],
      total: pagination?.total ?? 0,
      totalPages: pagination?.totalPages ?? 1,
    }
  },
  detail: (id: string) => apiClient.get<Order>(`/api/orders/${id}`),
  create: (body: { shippingAddressId: string; couponId?: string }) =>
    apiClient.post<Order>('/api/orders', body),
  updateStatus: (id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED') =>
    apiClient.patch<{ message: string }>(`/api/orders/${id}/status`, { status }),
}

export const subOrdersApi = {
  vendorSubOrders: (page = 1) =>
    apiClient.get<{ items: Order[]; total: number; totalPages: number }>(`/api/suborders?page=${page}`),
  updateStatus: (id: string, body: { status: string; trackingId?: string }) =>
    apiClient.patch<{ message: string }>(`/api/suborders/${id}/status`, body),
}

export const returnApi = {
  create: (body: { orderItemId: string; reasonCode: string; reason: string }) =>
    apiClient.post<ReturnRequest>('/api/returns', body),
  list: () => apiClient.get<ReturnRequest[]>('/api/returns'),
  transition: (id: string, body: { status: string }) =>
    apiClient.patch<{ message: string }>(`/api/returns/${id}/transition`, body),
}
