import type { ProductDetail } from '@/shared/api/types'

interface ProductInfoProps {
  product: ProductDetail | { description?: string; vendor?: any; [key: string]: any }
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="md:col-span-7">
      <h2 className="font-semibold mb-4" style={{ fontSize: 'var(--text-h2)' }}>Description</h2>
      <p className="text-ink-muted leading-relaxed whitespace-pre-wrap">{product.description}</p>
    </div>
  )
}
