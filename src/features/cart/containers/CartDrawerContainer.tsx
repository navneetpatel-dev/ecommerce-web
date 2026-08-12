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
      onContinueShopping={drawer.continueShopping}
      onUpdateQuantity={drawer.updateQuantity}
      onRemoveItem={drawer.removeItem}
    />
  )
}
