import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cn } from '@/shared/utils/cn'
import { LABELS } from '@/shared/constants/labels'

interface VariantSelectorProps {
  attributeGroups: Record<string, string[]>
  currentPrice: number
  currentStock: number
  basePrice: number
  hasPriceChange: boolean
  isAvailable: (key: string, value: string) => boolean
  isActive: (key: string, value: string) => boolean
  onSelectValue: (key: string, value: string) => void
  /** When true, shows Add to Cart (legacy). Prefer page-level ATC. */
  showAddToCart?: boolean
  onAddToCart?: () => void
  isAddingToCart?: boolean
  canAddToCart?: boolean
  freeShippingThreshold?: number
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
  showAddToCart = false,
  onAddToCart,
  isAddingToCart,
  canAddToCart = true,
  freeShippingThreshold,
  className,
}: VariantSelectorProps) {
  const hasAttributes = Object.keys(attributeGroups).length > 0

  if (!hasAttributes && !showAddToCart) {
    return null
  }

  return (
    <div className={cn('space-y-6', className)}>
      {hasAttributes && (
        <div className="space-y-4">
          {Object.entries(attributeGroups).map(([key, values]) => (
            <div key={key}>
              <p className="text-[0.9375rem] font-medium mb-2 capitalize">{key}</p>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const available = isAvailable(key, value)
                  const active = isActive(key, value)
                  return (
                    <DisabledActionHint
                      key={value}
                      disabled={!available}
                      message="Not available with your current selection."
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!available}
                        aria-pressed={active}
                        onClick={() => onSelectValue(key, value)}
                        className={cn(
                          'h-auto min-h-0 max-h-none px-4 py-2 font-medium',
                          active
                            ? 'border-brand bg-brand-subtle text-brand hover:bg-brand-subtle hover:text-brand'
                            : available
                              ? 'border-line hover:border-brand hover:text-brand'
                              : 'border-line bg-paper text-ink/30 line-through'
                        )}
                      >
                        {value}
                      </Button>
                    </DisabledActionHint>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

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
            <Badge variant="destructive">{LABELS.outOfStock}</Badge>
          ) : currentStock <= 5 ? (
            <Badge variant="destructive">Only {currentStock} left</Badge>
          ) : (
            <Badge variant="success">In stock</Badge>
          )}
          {typeof freeShippingThreshold === 'number' && (
            <p className="text-[0.9375rem] text-ink-muted">
              Free shipping over ₹{freeShippingThreshold.toLocaleString('en-IN')}
            </p>
          )}
        </div>

        {showAddToCart && (
          <DisabledActionHint
            disabled={currentStock === 0 || !canAddToCart}
            message={
              currentStock === 0
                ? 'This item is currently out of stock.'
                : !canAddToCart
                  ? 'Select all required options to add this item to your cart.'
                  : ''
            }
            className="w-full"
          >
            <Button
              size="lg"
              className="w-full"
              disabled={currentStock === 0 || !canAddToCart}
              onClick={onAddToCart}
              loading={isAddingToCart}
            >
              Add to Cart
            </Button>
          </DisabledActionHint>
        )}
      </div>
    </div>
  )
}
