import { useQuery } from '@tanstack/react-query'
import { ROLES } from '@/shared/constants/labels'
import { ordersApi, subOrdersApi } from './orders.api'

export function useMyOrders(role?: string) {
  return useQuery({
    queryKey: ['orders', 'mine', role],
    queryFn: () =>
      role === ROLES.VENDOR_OWNER || role === ROLES.VENDOR_STAFF
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
