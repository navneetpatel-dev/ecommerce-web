'use client'

import { useMyOrders } from '@/features/orders'
import { useWishlist } from '@/features/wishlist'
import { useWalletBalance, useWalletTransactions } from '@/features/wallet'
import { useAccountProfile } from '../api/account.queries'
import type { Order } from '@/shared/api/types'

/** Customer account overview — always uses storefront orders, not vendor suborders. */
export function useAccountOverview() {
  const profileQuery = useAccountProfile()
  const ordersQuery = useMyOrders()
  const wishlistQuery = useWishlist()
  const walletQuery = useWalletBalance()
  const walletTxQuery = useWalletTransactions(1)

  const ordersPayload = ordersQuery.data
  const orders: Order[] = Array.isArray(ordersPayload?.items) ? ordersPayload.items : []
  const recentOrders = orders.slice(0, 5)
  const recentWalletTx = walletTxQuery.data?.items?.slice(0, 3) ?? []

  return {
    profile: profileQuery.data,
    isLoadingProfile: profileQuery.isLoading,
    profileError: profileQuery.error as Error | null,
    ordersCount: ordersPayload?.total ?? orders.length,
    wishlistCount: wishlistQuery.data?.items?.length ?? 0,
    walletBalance: walletQuery.data ?? 0,
    recentOrders,
    recentWalletTx,
    isLoadingStats:
      ordersQuery.isLoading || wishlistQuery.isLoading || walletQuery.isLoading,
    isLoadingWalletTx: walletTxQuery.isLoading,
  }
}
