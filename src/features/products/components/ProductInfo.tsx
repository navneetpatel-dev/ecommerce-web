interface ProductInfoProps {
  product: { description?: string | null }
}

export function ProductInfo({ product }: ProductInfoProps) {
  if (!product.description) return null

  return (
    <p className="text-[1.0625rem] leading-relaxed text-ink-muted whitespace-pre-wrap">
      {product.description}
    </p>
  )
}
