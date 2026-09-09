"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { CartCouponSection } from "../../coupons/CartCouponSection.component";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import { AmountsUnavailableNotice } from "@/shared/components/AmountsUnavailableNotice.component";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import { OrderSummaryTotalsList } from "./OrderSummaryTotalsList.component";
import type { AppliedCouponSummary, EligibleCoupon } from "@/shared/api/types";
import { cartPageViewStyles as styles } from "./cartPageView.styles";

interface OrderSummaryAsideProps {
  itemCount: number;
  subtotal?: number;
  subtotalPending?: boolean;
  /** Cart request failed — amounts are missing for good, not mid-refresh. */
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  total?: number;
  totalIsEstimated?: boolean;
  pendingLineTotals?: boolean;
  pricingPreview?: {
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
  hasUnavailableItems: boolean;
  couponInput: string;
  couponMessage: string | null;
  couponError: string | null;
  couponPending: boolean;
  appliedCouponCode: string | null;
  appliedDiscount: number;
  appliedCoupons?: AppliedCouponSummary[];
  appliedCashbackAmount?: number;
  payNowGrandTotal?: number;
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
  onRemoveCoupon: (code?: string) => void;
  onApplyEligible: (code: string) => void;
}

export function OrderSummaryAside({
  itemCount,
  subtotal,
  subtotalPending = false,
  amountsUnavailable = false,
  onRetryAmounts,
  total,
  pendingLineTotals = false,
  pricingPreview,
  hasUnavailableItems,
  couponInput,
  couponMessage,
  couponError,
  couponPending,
  appliedCouponCode,
  appliedDiscount,
  appliedCoupons = [],
  appliedCashbackAmount = 0,
  payNowGrandTotal,
  appliedCouponType,
  vendorDiscountBreakdown = [],
  eligible,
  eligibleLoading,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onApplyEligible,
}: OrderSummaryAsideProps) {
  const amountsPending = pendingLineTotals && !amountsUnavailable;
  const totalPending = total == null || amountsPending;
  const itemCountLabel = itemCount === 1 ? "item" : "items";

  const unavailableNoticeElement = amountsUnavailable ? (
    <AmountsUnavailableNotice
      className={styles.asideUnavailableNotice}
      onRetry={onRetryAmounts}
    />
  ) : null;

  const cashbackNoticeElement =
    (appliedCashbackAmount > 0 || appliedCouponType === "CASHBACK") &&
    payNowGrandTotal != null ? (
      <CashbackCouponNotice
        className={styles.asideCashbackNotice}
        payNow={payNowGrandTotal}
        cashbackAmount={appliedCashbackAmount}
        code={appliedCouponCode}
      />
    ) : null;

  const checkoutActionElement = hasUnavailableItems ? (
    <p className={styles.asideWarningBanner}>
      {LABELS.removeUnavailableToCheckout}
    </p>
  ) : (
    <Button asChild className={styles.asideCheckoutButton} size="lg">
      <Link href={PATHS.checkout} className={styles.asideCheckoutLink}>
        {LABELS.checkout}
        <ArrowRight size={16} />
      </Link>
    </Button>
  );

  return (
    <aside className={styles.aside}>
      <div className={styles.asideCard}>
        <div aria-hidden className={styles.asideAccentBar} />

        <p className={styles.asideItemCountRow}>
          {itemCount} {itemCountLabel}
          <span className={styles.asideItemCountDot}>·</span>
          <span className={styles.asideItemTotalBold}>
            <MoneyAmount
              value={total}
              pending={totalPending}
              unavailable={amountsUnavailable}
            />
          </span>
        </p>

        <TextEyebrow className={styles.asideEyebrow}>Order summary</TextEyebrow>
        <h2 className={styles.asideTitle}>Ready to checkout</h2>

        <OrderSummaryTotalsList
          subtotal={subtotal}
          subtotalPending={subtotalPending}
          amountsUnavailable={amountsUnavailable}
          amountsPending={amountsPending}
          appliedDiscount={appliedDiscount}
          vendorDiscountBreakdown={vendorDiscountBreakdown}
          pricingPreview={pricingPreview}
        />

        <div className={styles.asideDivider}>
          <CartCouponSection
            couponInput={couponInput}
            couponMessage={couponMessage}
            couponError={couponError}
            couponPending={couponPending}
            appliedCouponCode={appliedCouponCode}
            appliedDiscount={appliedDiscount}
            appliedCoupons={appliedCoupons}
            appliedCashbackAmount={appliedCashbackAmount}
            payNowGrandTotal={payNowGrandTotal}
            eligible={eligible}
            eligibleLoading={eligibleLoading}
            onCouponInputChange={onCouponInputChange}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            onApplyEligible={onApplyEligible}
          />
        </div>

        <div className={styles.asideDivider}>
          <div className={styles.asideTotalRow}>
            <span className={styles.asideTotalLabel}>{LABELS.total}</span>
            <span className={styles.asideTotalAmount}>
              <MoneyAmount
                value={total}
                pending={totalPending}
                unavailable={amountsUnavailable}
                fallbackClassName={styles.asideTotalFallback}
              />
            </span>
          </div>
          {unavailableNoticeElement}
          {cashbackNoticeElement}
        </div>

        {checkoutActionElement}

        <p className={styles.asideFooterNote}>Secure checkout · Easy returns</p>
      </div>
    </aside>
  );
}
