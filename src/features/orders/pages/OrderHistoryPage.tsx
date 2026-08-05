'use client'

import { useOrderHistoryPage } from '../hooks/useOrderHistoryPage'
import { OrdersList } from '../components/OrdersList'
import { EmptyOrdersState } from '../components/EmptyOrdersState'
import { SkeletonCard } from '@/shared/components/Skeletons'

export function OrderHistoryPage() {
  const history = useOrderHistoryPage()

  if (history.isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SkeletonCard count={3} />
      </div>
    )
  }

  if (history.isEmpty) return <EmptyOrdersState />

  return <OrdersList orders={history.orders} />
}
