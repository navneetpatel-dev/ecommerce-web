'use client'

import { useCartPage } from '../hooks/useCartPage'
import { CartPageView } from '../components/CartPageView'

export function CartPage() {
  const cart = useCartPage()

  return (
    <CartPageView
      hasItems={cart.hasItems}
      groupedByVendor={cart.groupedByVendor}
      total={cart.total}
      onUpdateQuantity={cart.updateQuantity}
      onRemoveItem={cart.removeItem}
    />
  )
}
