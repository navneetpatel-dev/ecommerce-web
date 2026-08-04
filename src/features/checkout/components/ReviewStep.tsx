import type { CheckoutQuote } from '@/shared/api/types'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { Card, CardHeader, CardContent } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { Button } from '@/shared/components/ui/button'

interface ReviewStepProps {
  quote: CheckoutQuote
  isPending: boolean
  onPlaceOrder: () => void
  onBack: () => void
}

export function ReviewStep({ quote, isPending, onPlaceOrder, onBack }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Order review</h2>
      {quote.vendorBreakdowns.map((vb) => (
        <Card key={vb.vendorId}>
          <CardHeader><VendorStrip vendor={vb.vendor} /></CardHeader>
          <CardContent className="space-y-2">
            {vb.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span className="font-mono">₹{item.unitPrice * item.quantity}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-mono">₹{vb.subtotal}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span className="font-mono">₹{vb.shippingCost}</span></div>
            <div className="flex justify-between text-sm">
              <span>{vb.tax.igst > 0 ? 'IGST' : 'CGST + SGST'}</span>
              <span className="font-mono">₹{vb.tax.total}</span>
            </div>
            {vb.discount > 0 && (
              <div className="flex justify-between text-sm text-success"><span>Discount</span><span className="font-mono">-₹{vb.discount}</span></div>
            )}
            <div className="flex justify-between font-semibold border-t border-line pt-2"><span>Vendor total</span><span className="font-mono">₹{vb.total}</span></div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between text-lg font-bold p-4 bg-brand-light rounded-lg">
        <span>Order total</span>
        <span className="font-mono">₹{quote.grandTotal}</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button className="flex-1" onClick={onPlaceOrder} loading={isPending}>Place Order</Button>
      </div>
    </div>
  )
}
