import { WishlistCard } from './WishlistCard'

interface WishlistItem {
  id: string
  [key: string]: any
}

interface WishlistGridProps {
  items: WishlistItem[]
  onMoveToCart: (id: string) => void
  onRemove: (id: string) => void
}

export function WishlistGrid({ items, onMoveToCart, onRemove }: WishlistGridProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold mb-6">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <WishlistCard 
            key={item.id} 
            item={item} 
            onMoveToCart={onMoveToCart} 
            onRemove={onRemove} 
          />
        ))}
      </div>
    </div>
  )
}
