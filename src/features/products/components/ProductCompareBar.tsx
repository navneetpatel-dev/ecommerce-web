import type { ProductListItem } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'

interface ProductCompareBarProps {
  products: ProductListItem[]
  onToggleProduct: (product: ProductListItem) => void
  onClear: () => void
  onCompareNow: () => void
}

export function ProductCompareBar({
  products,
  onToggleProduct,
  onClear,
  onCompareNow,
}: ProductCompareBarProps) {
  if (products.length === 0) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 rounded-lg border border-line bg-surface-raised p-4 shadow-elevation-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className="rounded-full bg-brand-subtle px-3 py-1 text-[0.8125rem] font-medium text-brand"
              onClick={() => onToggleProduct(product)}
            >
              {product.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={products.length < 2}
            onClick={onCompareNow}
          >
            Compare now
          </Button>
        </div>
      </div>
    </div>
  )
}
