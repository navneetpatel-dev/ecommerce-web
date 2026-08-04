import type { ProductDetail } from '@/shared/api/types'
import { Separator } from '@/shared/components/ui/separator'

interface ProductInfoProps {
  product: ProductDetail
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="md:col-span-7">
      <h2 className="font-display text-xl font-semibold mb-4">Description</h2>
      <p className="text-ink/80 leading-relaxed whitespace-pre-wrap">{product.description}</p>
    </div>
  )
}

export function ProductDeliveryInfo({ product }: ProductInfoProps) {
  return (
    <div className="md:col-span-5">
      <div className="rounded-lg border border-line p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-ink/60">Delivery estimate</span>
          <span>3-7 business days</span>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span className="text-ink/60">Return policy</span>
          <span>7 days from delivery</span>
        </div>
        <Separator />
        <p className="text-xs text-ink/40">
          Sold and shipped by {product.vendor.businessName}. Multiple vendors ships separately.
        </p>
      </div>
    </div>
  )
}
