'use client'

import { useMyOrders } from '@/features/orders'
import { useWishlist } from '@/features/wishlist'
import { useAccountProfile } from '../api/account.queries'
import type { Order } from '@/shared/api/types'

/** Customer account overview — storefront orders + wishlist stats. */
export function useAccountOverview() {
  const profileQuery = useAccountProfile()
  const ordersQuery = useMyOrders()
  const wishlistQuery = useWishlist()

  const ordersPayload = ordersQuery.data
  const orders: Order[] = Array.isArray(ordersPayload?.items) ? ordersPayload.items : []
  const recentOrders = orders.slice(0, 5)

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error as Error | null,
    ordersCount: ordersPayload?.total ?? orders.length,
    wishlistCount: wishlistQuery.data?.items?.length ?? 0,
    recentOrders,
    isLoadingStats: ordersQuery.isLoading || wishlistQuery.isLoading,
  }
}
