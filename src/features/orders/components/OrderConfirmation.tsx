'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'

interface OrderConfirmationProps {
  orderId: string | undefined
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">✓</span>
      </div>
      <h1 className="font-display text-2xl font-semibold mb-2">Order confirmed!</h1>
      <p className="font-mono text-ink/50 mb-4">Order #{orderId?.slice(0, 8)}</p>
      <p className="text-ink/70 mb-8">
        You'll get a shipping update by email for each seller's package separately.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild variant="outline"><Link href={`/orders/${orderId}`}>View order</Link></Button>
        <Button asChild><Link href="/">Continue shopping</Link></Button>
      </div>
    </div>
  )
}
