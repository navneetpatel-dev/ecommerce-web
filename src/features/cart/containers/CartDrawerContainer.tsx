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
      couponInput={drawer.couponInput}
      couponMessage={drawer.couponMessage}
      couponError={drawer.couponError}
      couponPending={drawer.couponPending}
      appliedCouponCode={drawer.appliedCouponCode}
      onCouponInputChange={drawer.setCouponInput}
      onApplyCoupon={() => void drawer.applyCoupon()}
      onContinueShopping={drawer.continueShopping}
      onDecreaseQuantity={drawer.decreaseQuantity}
      onIncreaseQuantity={drawer.increaseQuantity}
      onRemoveItem={drawer.removeItem}
    />
  )
}
