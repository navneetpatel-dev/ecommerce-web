"use client";

import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import type { AppliedCouponSummary, EligibleCoupon } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { AppliedCouponChips } from "./AppliedCouponChips.component";

interface CartCouponSectionProps {
  couponInput: string;
  couponMessage: string | null;
  couponError: string | null;
  couponPending: boolean;
  appliedCouponCode: string | null;
  appliedDiscount?: number;
  appliedCoupons?: AppliedCouponSummary[];
  appliedCashbackAmount?: number;
  payNowGrandTotal?: number;
  eligible: EligibleCoupon[];
  eligibleLoading?: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: (code?: string) => void;
  onApplyEligible: (code: string) => void;
  compact?: boolean;
}

export function CartCouponSection({
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  appliedDiscount = 0,
  appliedCoupons = [],
  appliedCashbackAmount = 0,
  payNowGrandTotal,
  eligible,
  eligibleLoading,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
  compact,
}: CartCouponSectionProps) {
  // Fall back to the singular field so older cart responses still render.
  const chips: AppliedCouponSummary[] =
    appliedCoupons.length > 0
      ? appliedCoupons
      : appliedCouponCode
        ? [{ code: appliedCouponCode, discount: appliedDiscount }]
        : [];
  const appliedCodes = new Set(chips.map((c) => c.code.toUpperCase()));
  const unusedOffers = eligible.filter(
    (offer) => !appliedCodes.has(offer.code.toUpperCase()),
  );
  const offersLabel =
    unusedOffers.length > 0
      ? formatLabel(LABELS.availableOffersCount, { count: unusedOffers.length })
      : LABELS.availableOffers;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <FormFieldFrame label={LABELS.couponCodeLabel} htmlFor="cart-coupon-code">
        <div className="flex w-full items-stretch gap-2">
          <Input
            id="cart-coupon-code"
            placeholder={LABELS.couponCodePlaceholder}
            className="min-w-0 flex-1"
            value={couponInput}
            onChange={(e) => onCouponInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onApplyCoupon();
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
              className="shrink-0 px-4"
              onClick={onApplyCoupon}
              loading={couponPending}
              disabled={!couponInput.trim()}
            >
              {LABELS.applyCoupon}
            </Button>
          </DisabledActionHint>
        </div>
      </FormFieldFrame>

      <AppliedCouponChips
        chips={chips}
        couponPending={couponPending}
        appliedCashbackAmount={appliedCashbackAmount}
        payNowGrandTotal={payNowGrandTotal}
        onRemoveCoupon={onRemoveCoupon}
      />

      {couponMessage && chips.length === 0 ? (
        <p className="text-body-sm text-success">{couponMessage}</p>
      ) : null}
      {couponMessage && chips.length > 0 ? (
        <p className="text-body-sm text-ink-muted">{couponMessage}</p>
      ) : null}
      {couponError ? (
        <p className="text-body-sm text-danger">{couponError}</p>
      ) : null}

      <Accordion type="single" collapsible>
        <AccordionItem value="offers" className="border-0">
          <AccordionTrigger
            className={cn(
              "py-2 text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-ink",
              compact && "py-1.5",
            )}
          >
            {offersLabel}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            {eligibleLoading ? (
              <p className="text-body-sm text-ink-muted">{LABELS.loading}</p>
            ) : unusedOffers.length === 0 ? (
              <p className="text-body-sm text-ink-muted">
                {LABELS.noAvailableOffers}
              </p>
            ) : (
              <ul
                className={cn(
                  "space-y-1.5 overflow-y-auto overscroll-contain pr-1",
                  compact ? "max-h-36" : "max-h-48",
                )}
              >
                {unusedOffers.map((offer) => (
                  <li
                    key={offer.code}
                    className="flex items-center justify-between gap-2 text-body-sm"
                  >
                    <span className="min-w-0 truncate font-mono text-ink">
                      {offer.code}
                      {offer.discount > 0
                        ? ` · ₹${formatInrAmount(offer.discount)} ${LABELS.couponDiscount.toLowerCase()}`
                        : ""}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={() => onApplyEligible(offer.code)}
                      disabled={couponPending}
                    >
                      {LABELS.applyOffer}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
