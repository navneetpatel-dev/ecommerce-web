import { useQuery } from '@tanstack/react-query'
import { ordersApi, subOrdersApi } from './orders.api'

export function useMyOrders(role?: string) {
  return useQuery({
    queryKey: ['orders', 'mine', role],
    queryFn: () =>
      role === 'VENDOR_OWNER' || role === 'VENDOR_STAFF'
        ? subOrdersApi.vendorSubOrders()
        : ordersApi.myOrders(),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => ordersApi.detail(id),
    enabled: !!id,
  })
}
