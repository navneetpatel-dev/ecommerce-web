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
        <p className="font-mono text-sm text-ink/50">Order #{order.id.slice(0, 8)}</p>
        <h1 className="font-display text-2xl font-semibold">Order Details</h1>
        <div className="flex gap-3 mt-2">
          <StatusBadge status={order.status} />
          <span className="text-sm text-ink/50">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {order.subOrders?.map((so) => <SubOrderCard key={so.id} subOrder={so} />)}
    </div>
  )
}
