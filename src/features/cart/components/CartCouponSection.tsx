'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import type { EligibleCoupon } from '@/shared/api/types'

interface CartCouponSectionProps {
  couponInput: string
  couponMessage: string | null
  couponError: string | null
  couponPending: boolean
  appliedCouponCode: string | null
  appliedDiscount?: number
  eligible: EligibleCoupon[]
  eligibleLoading?: boolean
  onCouponInputChange: (value: string) => void
  onApplyCoupon: () => void
  onRemoveCoupon: () => void
  onApplyEligible: (code: string) => void
  compact?: boolean
}

export function CartCouponSection({
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  appliedDiscount = 0,
  eligible,
  eligibleLoading,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
  compact,
}: CartCouponSectionProps) {
  const unusedOffers = eligible.filter(
    (offer) => offer.code.toUpperCase() !== appliedCouponCode?.toUpperCase(),
  )

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <label htmlFor="cart-coupon-code" className="block text-[0.8125rem] font-medium text-ink">
        {LABELS.couponCodeLabel}
      </label>
      <div className="flex w-full items-stretch gap-2">
        <Input
          id="cart-coupon-code"
          placeholder={LABELS.couponCodePlaceholder}
          className="min-w-0 flex-1"
          value={couponInput}
          onChange={(e) => onCouponInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onApplyCoupon()
            }
          }}
        />
        <DisabledActionHint
          disabled={!couponInput.trim()}
          message={LABELS.enterCouponCodeToApply}
          className="shrink-0"
        >
          <Button
            variant="outline"
            className="h-11 shrink-0 px-4"
            onClick={onApplyCoupon}
            loading={couponPending}
            disabled={!couponInput.trim()}
          >
            {LABELS.applyCoupon}
          </Button>
        </DisabledActionHint>
      </div>

      {appliedCouponCode ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-success-subtle/40 px-3 py-2">
          <p className="text-[0.8125rem] text-success">
            {formatLabel(LABELS.couponAppliedLabel, { code: appliedCouponCode })}
            {appliedDiscount > 0
              ? ` (−₹${appliedDiscount.toLocaleString('en-IN')})`
              : ''}
          </p>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 text-ink-muted"
            onClick={onRemoveCoupon}
            disabled={couponPending}
          >
            {LABELS.removeCoupon}
          </Button>
        </div>
      ) : null}

      {couponMessage && !appliedCouponCode ? (
        <p className="text-[0.8125rem] text-success">{couponMessage}</p>
      ) : null}
      {couponMessage && appliedCouponCode ? (
        <p className="text-[0.8125rem] text-ink-muted">{couponMessage}</p>
      ) : null}
      {couponError ? <p className="text-[0.8125rem] text-danger">{couponError}</p> : null}

      <div className="space-y-1.5">
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-muted">
          {LABELS.availableOffers}
        </p>
        {eligibleLoading ? (
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.loading}</p>
        ) : unusedOffers.length === 0 ? (
          <p className="text-[0.8125rem] text-ink-muted">{LABELS.noAvailableOffers}</p>
        ) : (
          <ul className="space-y-1.5">
            {unusedOffers.map((offer) => (
              <li
                key={offer.code}
                className="flex items-center justify-between gap-2 text-[0.8125rem]"
              >
                <span className="font-mono text-ink">
                  {offer.code}
                  {offer.discount > 0
                    ? ` · ₹${offer.discount.toLocaleString('en-IN')} ${LABELS.couponDiscount.toLowerCase()}`
                    : ''}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7"
                  onClick={() => onApplyEligible(offer.code)}
                  disabled={couponPending}
                >
                  {LABELS.applyOffer}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
