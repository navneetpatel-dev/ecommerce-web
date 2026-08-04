'use client'
import { useMyOrders } from '../api/orders.queries'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { OrdersList } from '../components/OrdersList'
import { EmptyOrdersState } from '../components/EmptyOrdersState'
import { SkeletonCard } from '@/shared/components/Skeletons'

export function OrderHistoryPage() {
  const role = useAuthStore((s) => s.currentUser?.role)
  const { data, isLoading } = useMyOrders(role)

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><SkeletonCard count={3} /></div>
  if (!data?.items.length) return <EmptyOrdersState />

  return <OrdersList orders={data.items} />
}
