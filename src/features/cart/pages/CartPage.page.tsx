"use client";

import { useCartPage } from "../hooks/useCartPage.hook";
import { CartPageView } from "../components/CartPageView.component";

export function CartPage() {
  const cart = useCartPage();

  return (
    <CartPageView
      isLoading={cart.isLoading}
      hasItems={cart.hasItems}
      itemCount={cart.itemCount}
      groupedByVendor={cart.groupedByVendor}
      subtotal={cart.subtotal}
      subtotalPending={cart.subtotalPending}
      amountsUnavailable={cart.amountsUnavailable}
      onRetryAmounts={cart.retryAmounts}
      total={cart.total}
      totalIsEstimated={cart.totalIsEstimated}
      pendingLineTotals={cart.pendingLineTotals}
      pricingPreview={cart.pricingPreview}
      hasUnavailableItems={cart.hasUnavailableItems}
      onUpdateQuantity={cart.updateQuantity}
      onRemoveItem={cart.removeItem}
      onClearCart={cart.clearCart}
      isClearing={cart.isClearing}
      couponInput={cart.couponInput}
      couponMessage={cart.couponMessage}
      couponError={cart.couponError}
      couponPending={cart.couponPending}
      appliedCouponCode={cart.appliedCouponCode}
      appliedDiscount={cart.appliedDiscount}
      appliedCashbackAmount={cart.appliedCashbackAmount}
      payNowGrandTotal={cart.payNowGrandTotal}
      appliedCouponType={cart.appliedCouponType}
      vendorDiscountBreakdown={cart.vendorDiscountBreakdown}
      eligible={cart.eligible}
      eligibleLoading={cart.eligibleLoading}
      onCouponInputChange={cart.setCouponInput}
      onApplyCoupon={() => void cart.applyCoupon()}
      onRemoveCoupon={() => void cart.removeCoupon()}
      onApplyEligible={(code) => void cart.applyEligible(code)}
    />
  );
}
