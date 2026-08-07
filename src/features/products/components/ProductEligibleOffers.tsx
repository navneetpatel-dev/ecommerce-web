'use client'

import { useQuery } from '@tanstack/react-query'
import { couponsApi } from '@/features/coupons/api/coupons.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { LABELS } from '@/shared/constants/labels'

interface ProductEligibleOffersProps {
  productId: string
}

export function ProductEligibleOffers({ productId }: ProductEligibleOffersProps) {
  const accessToken = useAuthStore((s) => s.accessToken)

  const offersQuery = useQuery({
    queryKey: ['coupons', 'eligible', 'product', productId],
    queryFn: () => couponsApi.eligible({ productId, limit: 5 }),
    enabled: Boolean(accessToken && productId),
  })

  if (!accessToken) {
    return <p className="text-[0.8125rem] text-ink-muted">{LABELS.signInToApplyCoupon}</p>
  }

  if (offersQuery.isLoading) {
    return <p className="text-[0.8125rem] text-ink-muted">{LABELS.loading}</p>
  }

  const offers = offersQuery.data ?? []
  if (offers.length === 0) {
    return <p className="text-[0.8125rem] text-ink-muted">{LABELS.noPdpOffers}</p>
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-muted">
        {LABELS.availableOffers}
      </p>
      <ul className="space-y-1">
        {offers.map((offer) => (
          <li key={offer.code} className="font-mono text-[0.8125rem] text-ink">
            {offer.code}
            {offer.discount > 0
              ? ` · ₹${offer.discount.toLocaleString('en-IN')} ${LABELS.couponDiscount.toLowerCase()}`
              : offer.type === 'FREE_SHIPPING'
                ? ` · ${LABELS.couponTypeFreeShipping}`
                : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
