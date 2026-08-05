'use client'

import { useOrderDetailPage } from '../hooks/useOrderDetailPage'
import { OrderDetailContent } from '../components/OrderDetailContent'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function OrderDetailPage() {
  const detail = useOrderDetailPage()

  if (detail.isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (detail.notFound || !detail.order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-ink-muted text-[0.9375rem]">Order not found</p>
      </div>
    )
  }

  return <OrderDetailContent order={detail.order} />
}
