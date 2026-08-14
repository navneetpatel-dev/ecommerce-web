'use client'

import { useState } from 'react'
import { ChevronDown, Tag } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { couponsApi } from '@/features/coupons/api/coupons.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { formatLabel } from '@/shared/utils/formatLabel'
import {
  PDP_OFFERS_EXPANDED_SCROLL_CLASS,
  PDP_OFFERS_FETCH_LIMIT,
  PDP_OFFERS_PREVIEW_COUNT,
  PDP_OFFERS_STALE_MS,
} from '../constants/pdpOffers'

interface ProductEligibleOffersProps {
  productId: string
  className?: string
  /** When false, skip the network call (e.g. product still loading). */
  enabled?: boolean
}

function offerDetailLabel(offer: {
  discount: number
  type: string
}): string {
  if (offer.discount > 0) {
    return `₹${offer.discount.toLocaleString('en-IN')} ${LABELS.couponDiscount.toLowerCase()}`
  }
  if (offer.type === 'FREE_SHIPPING') return LABELS.couponTypeFreeShipping
  return LABELS.offersAtCheckout
}

export function ProductEligibleOffers({
  productId,
  className,
  enabled = true,
}: ProductEligibleOffersProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const [expanded, setExpanded] = useState(false)

  const offersQuery = useQuery({
    queryKey: ['coupons', 'eligible', 'product', productId, Boolean(accessToken)],
    queryFn: () =>
      accessToken
        ? couponsApi.eligible({ productId, limit: PDP_OFFERS_FETCH_LIMIT })
        : couponsApi.eligiblePublic({ productId, limit: PDP_OFFERS_FETCH_LIMIT }),
    enabled: Boolean(productId) && enabled,
    staleTime: PDP_OFFERS_STALE_MS,
  })

  if (!enabled) return null

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

  const canExpand = offers.length > PDP_OFFERS_PREVIEW_COUNT
  const visibleOffers = expanded ? offers : offers.slice(0, PDP_OFFERS_PREVIEW_COUNT)
  const hiddenCount = offers.length - PDP_OFFERS_PREVIEW_COUNT
  const isScrollable = expanded && canExpand

  return (
    <div
      className={cn(
        'rounded-lg border border-line bg-surface/60 px-2.5 py-2',
        className,
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Tag className="h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
          <p className="truncate text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            {LABELS.availableOffers}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-paper px-1.5 py-px text-[0.6875rem] tabular-nums text-ink-muted">
          {formatLabel(LABELS.availableOffersCount, { count: offers.length })}
        </span>
      </div>

      <ul
        className={cn('space-y-1 pr-0.5', isScrollable && PDP_OFFERS_EXPANDED_SCROLL_CLASS)}
        aria-label={isScrollable ? LABELS.availableOffersList : LABELS.availableOffers}
        tabIndex={isScrollable ? 0 : undefined}
      >
        {visibleOffers.map((offer) => (
          <li
            key={offer.code}
            className="flex items-center justify-between gap-2 rounded-md border border-dashed border-brand/25 bg-brand-subtle/30 px-2 py-1"
          >
            <span className="truncate font-mono text-[0.75rem] font-semibold tracking-wide text-ink">
              {offer.code}
            </span>
            <span className="shrink-0 text-[0.6875rem] text-ink-muted">
              {offerDetailLabel(offer)}
            </span>
          </li>
        ))}
      </ul>

      {canExpand ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-1 h-auto min-h-0 max-h-none w-full gap-1 px-0 py-1 text-[0.75rem] font-medium text-brand hover:bg-transparent hover:text-brand-hover"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded
            ? LABELS.showLessOffers
            : formatLabel(LABELS.showMoreOffers, { count: hiddenCount })}
          <ChevronDown
            className={cn('!size-3.5 transition-transform', expanded && 'rotate-180')}
            aria-hidden
          />
        </Button>
      ) : null}

      <p className="mt-1 text-[0.6875rem] leading-snug text-ink-faint">{LABELS.offersAtCheckout}</p>
    </div>
  )
}
