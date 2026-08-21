"use client";

import { LABELS } from "@/shared/constants/labels";
import { motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { CartPageSkeleton } from "@/shared/components/Skeletons";
import type { CartItem, EligibleCoupon } from "@/shared/api/types";
import { EmptyCart } from "./EmptyCart";
import { VendorGroups } from "./VendorGroups";
import { OrderSummaryAside } from "./OrderSummaryAside";

export interface CartPageViewProps {
  isLoading?: boolean;
  hasItems: boolean;
  itemCount: number;
  groupedByVendor: Record<string, CartItem[]>;
  subtotal: number;
  total: number;
  hasUnavailableItems: boolean;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
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

export function CartPageView({
  isLoading,
  hasItems,
  itemCount,
  groupedByVendor,
  subtotal,
  total,
  hasUnavailableItems,
  onUpdateQuantity,
  onRemoveItem,
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
}: CartPageViewProps) {
  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (!hasItems) {
    return <EmptyCart />;
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
        >
          <TextEyebrow brand>Shopping bag</TextEyebrow>
          <h1
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: "var(--text-display-sm)" }}
          >
            {LABELS.yourCart}
          </h1>
        </motion.header>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <VendorGroups
              groupedByVendor={groupedByVendor}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          </div>

          <OrderSummaryAside
            itemCount={itemCount}
            subtotal={subtotal}
            total={total}
            hasUnavailableItems={hasUnavailableItems}
            couponInput={couponInput}
            couponMessage={couponMessage}
            couponError={couponError}
            couponPending={couponPending}
            appliedCouponCode={appliedCouponCode}
            appliedDiscount={appliedDiscount}
            appliedCashbackAmount={appliedCashbackAmount}
            appliedCouponType={appliedCouponType}
            vendorDiscountBreakdown={vendorDiscountBreakdown}
            eligible={eligible}
            eligibleLoading={eligibleLoading}
            onCouponInputChange={onCouponInputChange}
            onApplyCoupon={onApplyCoupon}
            onRemoveCoupon={onRemoveCoupon}
            onApplyEligible={onApplyEligible}
          />
        </div>
      </div>
    </div>
  );
}
