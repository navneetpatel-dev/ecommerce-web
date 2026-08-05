import { SubOrderCard } from './SubOrderCard'
import { StatusBadge } from '@/shared/components/StatusBadge'

interface Order {
  id: string
  status: string
  createdAt: string
  subOrders?: any[]
}

interface OrderDetailContentProps {
  order: Order
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <p className="font-mono text-[0.8125rem] text-ink-muted">Order #{order.id.slice(0, 8)}</p>
        <h1 className="font-display text-[1.75rem] font-semibold text-ink">Order Details</h1>
        <div className="flex gap-3 mt-2">
          <StatusBadge status={order.status} />
          <span className="text-[0.9375rem] text-ink-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {order.subOrders?.map((so) => <SubOrderCard key={so.id} subOrder={so} />)}
    </div>
  )
}
