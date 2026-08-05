import { EmptyState } from '@/shared/components/EmptyState'
import { ShoppingBag } from 'lucide-react'

export function EmptyCart() {
  return (
    <EmptyState
      icon={ShoppingBag}
      heading="Your cart is empty"
      message="Add some items to get started."
      actionLabel="Continue shopping"
      actionTo="/products"
      maxWidth="max-w-2xl"
    />
  )
}
