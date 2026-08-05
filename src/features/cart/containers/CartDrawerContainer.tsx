'use client'

import { useCartDrawer } from '../hooks/useCartDrawer'
import { CartDrawer } from '../components/CartDrawer'

export function CartDrawerContainer() {
  const drawer = useCartDrawer()

  return (
    <CartDrawer
      isOpen={drawer.isOpen}
      onClose={drawer.close}
      hasItems={drawer.hasItems}
      groupedByVendor={drawer.groupedByVendor}
      total={drawer.total}
      onDecreaseQuantity={drawer.decreaseQuantity}
      onIncreaseQuantity={drawer.increaseQuantity}
      onRemoveItem={drawer.removeItem}
    />
  )
}
