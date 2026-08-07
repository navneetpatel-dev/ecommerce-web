'use client'

import { useCartDrawer } from '../hooks/useCartDrawer'
import { CartDrawer } from '../components/CartDrawer'

export function CartDrawerContainer() {
  const drawer = useCartDrawer()

  return (
    <CartDrawer
      isOpen={drawer.isOpen}
      onClose={drawer.close}
      isLoading={drawer.isLoading}
      hasItems={drawer.hasItems}
      groupedByVendor={drawer.groupedByVendor}
      total={drawer.total}
      hasUnavailableItems={drawer.hasUnavailableItems}
      couponInput={drawer.couponInput}
      couponMessage={drawer.couponMessage}
      couponError={drawer.couponError}
      couponPending={drawer.couponPending}
      appliedCouponCode={drawer.appliedCouponCode}
      appliedDiscount={drawer.appliedDiscount}
      eligible={drawer.eligible}
      eligibleLoading={drawer.eligibleLoading}
      onCouponInputChange={drawer.setCouponInput}
      onApplyCoupon={() => void drawer.applyCoupon()}
      onRemoveCoupon={() => void drawer.removeCoupon()}
      onApplyEligible={(code) => void drawer.applyEligible(code)}
      onContinueShopping={drawer.continueShopping}
      onUpdateQuantity={drawer.updateQuantity}
      onRemoveItem={drawer.removeItem}
    />
  )
}
