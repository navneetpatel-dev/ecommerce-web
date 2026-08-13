import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cn } from '@/shared/utils/cn'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'

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
  /** Hide price/stock block when the parent buy box already shows them. */
  optionsOnly?: boolean
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
  optionsOnly = false,
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
    <div className={cn('space-y-5', className)}>
      {hasAttributes ? (
        <div className="space-y-4">
          {Object.entries(attributeGroups).map(([key, values]) => {
            const selected = values.find((value) => isActive(key, value))
            return (
              <div key={key}>
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                    {key}
                  </p>
                  {selected ? (
                    <p className="truncate text-[0.8125rem] font-medium text-ink">{selected}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {values.map((value) => {
                    const available = isAvailable(key, value)
                    const active = isActive(key, value)
                    return (
                      <DisabledActionHint
                        key={value}
                        disabled={!available}
                        message={LABELS.variantUnavailableHint}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!available}
                          aria-pressed={active}
                          onClick={() => onSelectValue(key, value)}
                          className={cn(
                            'h-10 min-h-10 max-h-none rounded-full px-4 font-medium transition-all',
                            active
                              ? 'border-brand bg-brand text-paper hover:bg-brand-hover hover:text-paper'
                              : available
                                ? 'border-line bg-surface hover:border-brand hover:text-brand'
                                : 'border-line bg-paper text-ink/30 line-through',
                          )}
                        >
                          {value}
                        </Button>
                      </DisabledActionHint>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}

      {!optionsOnly ? (
        <>
          <Separator />

          <div className="flex items-baseline gap-3">
            <span className="font-sans text-[1.75rem] font-semibold text-brand">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {hasPriceChange ? (
              <span className="text-[1.0625rem] text-ink-faint line-through">
                ₹{basePrice.toLocaleString('en-IN')}
              </span>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {currentStock === 0 ? (
                <Badge variant="destructive">{LABELS.outOfStock}</Badge>
              ) : currentStock <= 5 ? (
                <Badge variant="destructive">
                  {formatLabel(LABELS.onlyLeft, { count: currentStock })}
                </Badge>
              ) : (
                <Badge variant="success">{LABELS.inStock}</Badge>
              )}
              {typeof freeShippingThreshold === 'number' ? (
                <p className="text-[0.8125rem] text-ink-muted">
                  {formatLabel(LABELS.freeDeliveryAbove, {
                    amount: freeShippingThreshold.toLocaleString('en-IN'),
                  })}
                </p>
              ) : null}
            </div>

            {showAddToCart ? (
              <DisabledActionHint
                disabled={currentStock === 0 || !canAddToCart}
                message={
                  currentStock === 0
                    ? LABELS.outOfStockHint
                    : !canAddToCart
                      ? LABELS.selectAllOptionsHint
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
                  {LABELS.addToCart}
                </Button>
              </DisabledActionHint>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  )
}
