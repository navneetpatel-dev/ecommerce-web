import { useAddToCart } from '@/features/cart/api/cart.queries'
import { useVariantSelection } from '../hooks/useVariantSelection'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Badge } from '@/shared/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { ProductVariant } from '@/shared/api/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  basePrice: number
  baseStock: number
  className?: string
}

export function VariantSelector({ variants, basePrice, baseStock, className }: VariantSelectorProps) {
  const addToCart = useAddToCart()
  const {
    attributeGroups,
    currentPrice,
    currentStock,
    variantId,
    isAvailable,
    isActive,
    selectValue,
    hasPriceChange,
  } = useVariantSelection(variants, basePrice, baseStock)

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        {Object.entries(attributeGroups).map(([key, values]) => (
          <div key={key}>
            <p className="text-sm font-medium mb-2 capitalize">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const available = isAvailable(key, value)
                const active = isActive(key, value)
                return (
                  <button
                    key={value}
                    disabled={!available}
                    onClick={() => selectValue(key, value)}
                    className={cn(
                      'px-3 py-1.5 rounded-md border text-sm font-medium transition-colors',
                      active
                        ? 'border-brand bg-brand text-white'
                        : available
                        ? 'border-line bg-surface hover:border-brand hover:text-brand'
                        : 'border-line bg-paper text-ink/30 line-through cursor-not-allowed'
                    )}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-baseline gap-3">
        <span className="font-mono text-3xl font-bold text-brand">₹{currentPrice}</span>
        {hasPriceChange && (
          <span className="font-mono text-lg text-ink/40 line-through">₹{basePrice}</span>
        )}
      </div>

      <div className="space-y-3">
        <ConditionalStockBadge currentStock={currentStock} />

        <Button
          size="lg"
          className="w-full"
          disabled={currentStock === 0}
          onClick={() => variantId && addToCart.mutate(variantId)}
          loading={addToCart.isPending}
        >
          <ShoppingCart className="h-5 w-5" /> Add to Cart
        </Button>
      </div>
    </div>
  )
}

function ConditionalStockBadge({ currentStock }: { currentStock: number }) {
  return (
    <div className="flex items-center gap-2">
      {currentStock === 0 ? (
        <Badge variant="destructive">Out of stock</Badge>
      ) : currentStock <= 5 ? (
        <Badge variant="destructive">Only {currentStock} left</Badge>
      ) : (
        <Badge variant="success">In stock</Badge>
      )}
      <p className="text-sm text-ink/50">Free shipping over ₹499</p>
    </div>
  )
}
