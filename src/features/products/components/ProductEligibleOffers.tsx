'use client'

import { Tag } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { couponsApi } from '@/features/coupons/api/coupons.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

interface ProductEligibleOffersProps {
  productId: string
  className?: string
}

export function ProductEligibleOffers({ productId, className }: ProductEligibleOffersProps) {
  const accessToken = useAuthStore((s) => s.accessToken)

  const offersQuery = useQuery({
    queryKey: ['coupons', 'eligible', 'product', productId],
    queryFn: () => couponsApi.eligible({ productId, limit: 5 }),
    enabled: Boolean(accessToken && productId),
  })

  if (!accessToken) {
    return (
      <p className={cn('text-[0.8125rem] text-ink-muted', className)}>
        {LABELS.signInToApplyCoupon}
      </p>
    )
  }

  if (offersQuery.isLoading) {
    return (
      <p className={cn('text-[0.8125rem] text-ink-muted', className)}>{LABELS.loading}</p>
    )
  }

  const offers = offersQuery.data ?? []
  if (offers.length === 0) {
    return (
      <p className={cn('text-[0.8125rem] text-ink-muted', className)}>{LABELS.noPdpOffers}</p>
    )
  }

  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-center gap-2">
        <Tag className="h-3.5 w-3.5 text-brand" strokeWidth={1.75} aria-hidden />
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink-muted">
          {LABELS.availableOffers}
        </p>
      </div>
      <ul className="space-y-2">
        {offers.map((offer) => (
          <li
            key={offer.code}
            className="flex items-start justify-between gap-3 rounded-lg border border-dashed border-brand/30 bg-brand-subtle/40 px-3 py-2.5"
          >
            <span className="min-w-0">
              <span className="block truncate font-mono text-[0.8125rem] font-semibold tracking-wide text-ink">
                {offer.code}
              </span>
              <span className="mt-0.5 block text-[0.75rem] text-ink-muted">
                {offer.discount > 0
                  ? `₹${offer.discount.toLocaleString('en-IN')} ${LABELS.couponDiscount.toLowerCase()}`
                  : offer.type === 'FREE_SHIPPING'
                    ? LABELS.couponTypeFreeShipping
                    : LABELS.offersAtCheckout}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
