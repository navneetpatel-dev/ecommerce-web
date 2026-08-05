import Link from 'next/link'
import type { Order } from '@/shared/api/types'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card'

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.8125rem] text-ink-muted">Order #{order.id.slice(0, 8)}</span>
          <StatusBadge status={order.status} />
          <span className="text-[0.9375rem] text-ink-muted">{new Date(order.createdAt).toLocaleDateString()}</span>
        </div>
        <span className="font-mono font-bold">₹{order.totalAmount}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {order.subOrders?.map((so) => (
            <div key={so.id} className="flex items-center justify-between text-[0.9375rem]">
              <div className="flex items-center gap-2">
                <VendorStrip vendor={so.vendor} size="sm" />
                <StatusBadge status={so.status} />
              </div>
              <Link href={`/orders/${order.id}`} className="text-brand hover:underline text-[0.8125rem]">View details</Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
