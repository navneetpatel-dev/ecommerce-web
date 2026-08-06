'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

/** Educational returns overview — real requests go through order history. */
export function ReturnsView() {
  return (
    <div className="mx-auto max-w-[720px] space-y-6 px-4 py-10">
      <h1 className="font-display text-[1.75rem] font-semibold text-ink">Returns</h1>
      <p className="text-[0.9375rem] text-ink-muted">
        Eligible items can be returned from your order history. Open an order, choose the item, and
        submit a return request. Our team reviews each request before pickup and refund.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-[0.9375rem] text-ink-muted">
        <li>Request a return from a delivered order item</li>
        <li>Wait for approval from support or the seller</li>
        <li>Schedule pickup if required</li>
        <li>Item received and inspected</li>
        <li>Refund issued to the original payment method</li>
      </ol>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href={PATHS.orders}>{LABELS.goToMyOrders}</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href={PATHS.myReturns}>View my returns</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={PATHS.help}>{LABELS.helpCenter}</Link>
        </Button>
      </div>
    </div>
  )
}
