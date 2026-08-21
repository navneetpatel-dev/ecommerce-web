"use client";

import { Button } from "@/shared/components/ui/button";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { cn } from "@/shared/utils/cn";
import type { EligibleCoupon } from "@/shared/api/types";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface CartCouponSectionProps {
  couponInput: string;
  couponMessage: string | null;
  couponError: string | null;
  couponPending: boolean;
  appliedCouponCode: string | null;
  appliedDiscount?: number;
  appliedCashbackAmount?: number;
  orderTotal?: number;
  eligible: EligibleCoupon[];
  eligibleLoading?: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
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
  appliedCashbackAmount = 0,
  orderTotal = 0,
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

      {appliedCouponCode ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-success-subtle/40 px-3 py-2">
          <div className="min-w-0">
            <p className="text-[0.8125rem] text-success">
              {formatLabel(LABELS.couponAppliedLabel, {
                code: appliedCouponCode,
              })}
              {appliedDiscount > 0
                ? ` (−₹${formatInrAmount(appliedDiscount)})`
                : ""}
            </p>
            {appliedCashbackAmount > 0 ? (
              <CashbackCouponNotice
                className="mt-1 text-[0.75rem] text-brand"
                payNow={orderTotal}
                cashbackAmount={appliedCashbackAmount}
              />
            ) : null}
          </div>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-ink-muted"
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
      {couponError ? (
        <p className="text-[0.8125rem] text-danger">{couponError}</p>
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
              <p className="text-[0.8125rem] text-ink-muted">
                {LABELS.loading}
              </p>
            ) : unusedOffers.length === 0 ? (
              <p className="text-[0.8125rem] text-ink-muted">
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
                    className="flex items-center justify-between gap-2 text-[0.8125rem]"
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
