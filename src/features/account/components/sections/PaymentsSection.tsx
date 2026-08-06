'use client'

import { CreditCard } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'

export function PaymentsSection() {
  return (
    <div className="border border-line bg-surface">
      <EmptyState
        icon={CreditCard}
        heading="No saved cards"
        message="Payments run through Razorpay at checkout. Card tokenization isn’t enabled on this store yet."
        className="py-14 md:py-16"
      />
    </div>
  )
}
