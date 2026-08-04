'use client'
import { useParams } from 'next/navigation'
import { useOrder } from '../api/orders.queries'
import { OrderDetailContent } from '../components/OrderDetailContent'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function OrderDetailPage() {
  const params = useParams<{ orderId: string }>()
  const { data: order, isLoading } = useOrder(params?.orderId || '')

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-8"><Skeleton className="h-96 w-full" /></div>
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><p className="text-ink/50">Order not found</p></div>

  return <OrderDetailContent order={order} />
}
