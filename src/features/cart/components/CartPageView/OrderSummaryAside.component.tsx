"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { CartCouponSection } from "../CartCouponSection.component";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import type { EligibleCoupon } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface OrderSummaryAsideProps {
  itemCount: number;
  subtotal: number;
  subtotalPending?: boolean;
  total: number;
  totalIsEstimated?: boolean;
  pendingLineTotals?: boolean;
  hasUnavailableItems: boolean;
  couponInput: string;
  couponMessage: string | null;
  couponError: string | null;
  couponPending: boolean;
  appliedCouponCode: string | null;
  appliedDiscount: number;
  appliedCashbackAmount?: number;
  appliedCouponType?: string | null;
  vendorDiscountBreakdown?: Array<{
    vendorId: string;
    name: string;
    amount: number;
  }>;
  eligible: EligibleCoupon[];
  eligibleLoading?: boolean;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onApplyEligible: (code: string) => void;
}

export function OrderSummaryAside({
  itemCount,
  subtotal,
  subtotalPending = false,
  total,
  totalIsEstimated = false,
  pendingLineTotals = false,
  hasUnavailableItems,
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  appliedDiscount,
  appliedCashbackAmount = 0,
  appliedCouponType,
  vendorDiscountBreakdown = [],
  eligible,
  eligibleLoading,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
}: OrderSummaryAsideProps) {
  const totalLabel = totalIsEstimated
    ? pendingLineTotals
      ? "Updating…"
      : "Estimated total"
    : LABELS.total;

  return (
    <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-[88px] lg:self-start lg:z-10">
      <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
        />

        <p className="text-[0.875rem] text-ink-muted">
          {itemCount} {itemCount === 1 ? "item" : "items"}
          <span className="mx-2 text-line">·</span>
          <span className="font-medium text-ink">
            {totalIsEstimated && pendingLineTotals
              ? "Updating…"
              : `₹${formatInrAmount(total)}`}
          </span>
        </p>

        <TextEyebrow className="mt-4">Order summary</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.25rem] text-ink">
          Ready to checkout
        </h2>

        <dl className="mt-5 space-y-2.5 text-[0.875rem]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">{LABELS.subtotal}</dt>
            <dd className="tabular-nums text-ink">
              {subtotalPending ? (
                <span className="text-ink-muted">Updating…</span>
              ) : (
                <>₹{formatInrAmount(subtotal)}</>
              )}
            </dd>
          </div>
          {appliedDiscount > 0 ? (
            <div className="flex items-center justify-between gap-4 text-success">
              <dt>{LABELS.couponDiscount}</dt>
              <dd className="tabular-nums">
                −₹{formatInrAmount(appliedDiscount)}
              </dd>
            </div>
          ) : null}
          {vendorDiscountBreakdown.length > 1
            ? vendorDiscountBreakdown.map((row) => (
                <div
                  key={row.vendorId}
                  className="flex items-center justify-between gap-4 pl-2 text-body-sm text-success"
                >
                  <dt className="text-ink-muted">
                    {LABELS.vendorDiscountBreakdown}: {row.name}
                  </dt>
                  <dd className="tabular-nums">
                    −₹{formatInrAmount(row.amount)}
                  </dd>
                </div>
              ))
            : null}
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-muted">{LABELS.shipping}</dt>
            <dd className="text-right text-ink-muted">
              {LABELS.calculatingShippingTaxes}
            </dd>
          </div>
        </dl>

        <div className="mt-4 border-t border-line pt-4">
          <CartCouponSection
            couponInput={couponInput}
            couponMessage={couponMessage}
            couponError={couponError}
            couponPending={couponPending}
            appliedCouponCode={appliedCouponCode}
            appliedDiscount={appliedDiscount}
            appliedCashbackAmount={appliedCashbackAmount}
            orderTotal={total}
            eligible={eligible}
            eligibleLoading={eligibleLoading}
            onCouponInputChange={onCouponInputChange}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            onApplyEligible={onApplyEligible}
          />
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-[0.875rem] font-medium text-ink">
              {totalLabel}
            </span>
            <span className="font-display text-[1.5rem] leading-none tabular-nums text-brand">
              {totalIsEstimated && pendingLineTotals ? (
                <span className="text-[1rem] text-ink-muted">Updating…</span>
              ) : (
                <>₹{formatInrAmount(total)}</>
              )}
            </span>
          </div>
          {(appliedCashbackAmount > 0 || appliedCouponType === "CASHBACK") && (
            <CashbackCouponNotice
              className="mt-3 text-body-sm text-brand"
              payNow={total}
              cashbackAmount={appliedCashbackAmount}
              code={appliedCouponCode}
            />
          )}
        </div>

        {hasUnavailableItems ? (
          <p className="mt-4 rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground">
            {LABELS.removeUnavailableToCheckout}
          </p>
        ) : (
          <Button asChild className="mt-5 w-full" size="lg">
            <Link
              href={PATHS.checkout}
              className="inline-flex items-center justify-center gap-2"
            >
              {LABELS.checkout}
              <ArrowRight size={16} />
            </Link>
          </Button>
        )}

        <p className="mt-3 text-center text-[0.75rem] text-ink-muted">
          Secure checkout · Easy returns
        </p>
      </div>
    </aside>
  );
}
