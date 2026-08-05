import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { SuccessCheckmarkContainer } from '@/shared/containers/SuccessCheckmarkContainer'

interface OrderConfirmationProps {
  orderId: string | undefined
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <SuccessCheckmarkContainer />
      <h1 className="text-[1.75rem] font-semibold text-ink mb-2 font-display">Order confirmed!</h1>
      <p className="font-mono text-[0.8125rem] text-ink-muted mb-4">Order #{orderId?.slice(0, 8)}</p>
      <p className="text-[0.9375rem] text-ink-muted mb-2 max-w-md mx-auto">
        You&apos;ll get a shipping update by email for each seller&apos;s package separately.
      </p>
      <p className="text-[0.8125rem] text-ink-faint mb-8 max-w-md mx-auto">
        Your order may arrive in multiple shipments from different vendors. Each vendor handles their own shipping.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href={orderId ? `/orders/${orderId}` : '/orders'}>View order</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
