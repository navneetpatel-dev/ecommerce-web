'use client'

import { useCartPage } from '../hooks/useCartPage'
import { CartPageView } from '../components/CartPageView'

export function CartPage() {
  const cart = useCartPage()

  return (
    <CartPageView
      isLoading={cart.isLoading}
      hasItems={cart.hasItems}
      itemCount={cart.itemCount}
      groupedByVendor={cart.groupedByVendor}
      subtotal={cart.subtotal}
      total={cart.total}
      hasUnavailableItems={cart.hasUnavailableItems}
      onUpdateQuantity={cart.updateQuantity}
      onRemoveItem={cart.removeItem}
      couponInput={cart.couponInput}
      couponMessage={cart.couponMessage}
      couponError={cart.couponError}
      couponPending={cart.couponPending}
      appliedCouponCode={cart.appliedCouponCode}
      appliedDiscount={cart.appliedDiscount}
      eligible={cart.eligible}
      eligibleLoading={cart.eligibleLoading}
      onCouponInputChange={cart.setCouponInput}
      onApplyCoupon={() => void cart.applyCoupon()}
      onRemoveCoupon={() => void cart.removeCoupon()}
      onApplyEligible={(code) => void cart.applyEligible(code)}
    />
  )
}
