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
      total={cart.total}
      hasUnavailableItems={cart.hasUnavailableItems}
      onUpdateQuantity={cart.updateQuantity}
      onRemoveItem={cart.removeItem}
    />
  )
}
