import type { SubOrder } from '@/shared/api/types'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

interface SubOrderCardProps {
  subOrder: SubOrder
}

export function SubOrderCard({ subOrder }: SubOrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <VendorStrip vendor={subOrder.vendor} />
          <StatusBadge status={subOrder.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {subOrder.items?.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-[0.9375rem]">
            <span>{item.productName} × {item.quantity}</span>
            <span className="font-mono">₹{item.unitPrice * item.quantity}</span>
          </div>
        ))}
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span className="font-mono">₹{subOrder.subtotal}</span>
        </div>
        {subOrder.shipment && (
          <div className="mt-3 bg-paper rounded-md p-3">
            <p className="text-[0.9375rem] font-medium">Tracking: {subOrder.shipment.carrier}</p>
            <p className="font-mono text-[0.8125rem] text-ink-muted">{subOrder.shipment.trackingNumber}</p>
            <StatusBadge status={subOrder.shipment.status} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
