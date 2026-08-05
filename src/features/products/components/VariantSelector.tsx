import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { ShoppingCart } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface VariantSelectorProps {
  attributeGroups: Record<string, string[]>
  currentPrice: number
  currentStock: number
  basePrice: number
  hasPriceChange: boolean
  isAvailable: (key: string, value: string) => boolean
  isActive: (key: string, value: string) => boolean
  onSelectValue: (key: string, value: string) => void
  onAddToCart: () => void
  isAddingToCart?: boolean
  className?: string
}

export function VariantSelector({
  attributeGroups,
  currentPrice,
  currentStock,
  basePrice,
  hasPriceChange,
  isAvailable,
  isActive,
  onSelectValue,
  onAddToCart,
  isAddingToCart,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        {Object.entries(attributeGroups).map(([key, values]) => (
          <div key={key}>
            <p className="text-[0.9375rem] font-medium mb-2 capitalize">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const available = isAvailable(key, value)
                const active = isActive(key, value)
                return (
                  <button
                    key={value}
                    disabled={!available}
                    onClick={() => onSelectValue(key, value)}
                    className={cn(
                      'px-4 py-2 rounded-md border text-[0.9375rem] font-medium transition-colors',
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
        <span className="font-mono text-[1.75rem] font-bold text-brand">₹{currentPrice}</span>
        {hasPriceChange && (
          <span className="font-mono text-[1.125rem] text-ink-faint line-through">₹{basePrice}</span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {currentStock === 0 ? (
            <Badge variant="destructive">Out of stock</Badge>
          ) : currentStock <= 5 ? (
            <Badge variant="destructive">Only {currentStock} left</Badge>
          ) : (
            <Badge variant="success">In stock</Badge>
          )}
          <p className="text-[0.9375rem] text-ink-muted">Free shipping over ₹499</p>
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={currentStock === 0}
          onClick={onAddToCart}
          loading={isAddingToCart}
        >
          <ShoppingCart className="h-5 w-5" /> Add to Cart
        </Button>
      </div>
    </div>
  )
}
