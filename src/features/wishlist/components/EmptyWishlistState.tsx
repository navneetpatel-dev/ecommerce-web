import { EmptyState } from '@/shared/components/EmptyState'
import { Heart } from 'lucide-react'

export function EmptyWishlistState() {
  return (
    <EmptyState
      message="Your wishlist is empty"
      icon={Heart}
      actionLabel="Browse products"
      actionTo="/"
    />
  )
}
