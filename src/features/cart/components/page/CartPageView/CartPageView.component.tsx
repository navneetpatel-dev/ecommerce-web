"use client";

import { LABELS } from "@/shared/constants/labels";
import { CartPageSkeleton } from "@/shared/components/Skeletons.component";
import type {
  AppliedCouponSummary,
  CartItem,
  EligibleCoupon,
} from "@/shared/api/types";
import { EmptyCartState } from "@/shared/components/display/EmptyCartState.component";
import type { DeliveryAreaSummary } from "@/shared/utils/delivery/deliveryArea";
import { CartPageHeader } from "./CartPageHeader.component";
import { VendorGroups } from "./VendorGroups.component";
import { OrderSummaryAside } from "./OrderSummaryAside.component";
import { CartMutationError } from "../../drawer/CartMutationError.component";
import { cartPageViewStyles as styles } from "../../../styles/page/cartPageView.styles";

export interface CartPageViewProps {
  isLoading?: boolean;
  hasItems: boolean;
  itemCount: number;
  groupedByVendor: Record<string, CartItem[]>;
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
    itemsTotal?: number;
    /** What coupons take off the items, GST included. */
    couponSavings?: number;
  };
  hasUnavailableItems: boolean;
  /** The delivery area this basket was checked against (owned by the cart page hook). */
  deliveryArea?: DeliveryAreaSummary;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  isClearing?: boolean;
  isCartMutating?: boolean;
  mutationError?: string | null;
  onDismissMutationError: () => void;
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

export function CartPageView({
  isLoading,
  hasItems,
  itemCount,
  groupedByVendor,
  subtotal,
  subtotalPending = false,
  amountsUnavailable = false,
  onRetryAmounts,
  total,
  totalIsEstimated = false,
  pendingLineTotals = false,
  pricingPreview,
  hasUnavailableItems,
  deliveryArea,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isClearing,
  isCartMutating = false,
  mutationError,
  onDismissMutationError,
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
}: CartPageViewProps) {
  if (isLoading) {
    return <CartPageSkeleton />;
  }

  if (!hasItems) {
    return (
      <EmptyCartState
        heading={LABELS.cartEmptyHeading}
        message={LABELS.cartEmptyMessage}
      />
    );
  }

  const clearCartDisabled = isCartMutating && !isClearing;

  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.ambientGradient} />

      <div className={styles.container}>
        <CartPageHeader
          onClearCart={onClearCart}
          isClearing={isClearing}
          clearDisabled={clearCartDisabled}
        />

        <CartMutationError
          message={mutationError ?? null}
          onDismiss={onDismissMutationError}
          className={styles.mutationErrorMargin}
        />

        <div className={styles.layoutGrid}>
          <div className={styles.mainItemsColumn}>
            <VendorGroups
              groupedByVendor={groupedByVendor}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              disabled={isCartMutating}
            />
          </div>

          <OrderSummaryAside
            itemCount={itemCount}
            deliveryArea={deliveryArea}
            subtotal={subtotal}
            subtotalPending={subtotalPending}
            amountsUnavailable={amountsUnavailable}
            onRetryAmounts={onRetryAmounts}
            total={total}
            totalIsEstimated={totalIsEstimated}
            pendingLineTotals={pendingLineTotals}
            pricingPreview={pricingPreview}
            hasUnavailableItems={hasUnavailableItems}
            couponInput={couponInput}
            couponMessage={couponMessage}
            couponError={couponError}
            couponPending={couponPending}
            appliedCouponCode={appliedCouponCode}
            appliedDiscount={appliedDiscount}
            appliedCoupons={appliedCoupons}
            appliedCashbackAmount={appliedCashbackAmount}
            payNowGrandTotal={payNowGrandTotal}
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
