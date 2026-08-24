interface ProductInfoProps {
  product: { description?: string | null };
}

export function ProductInfo({ product }: ProductInfoProps) {
  if (!product.description) return null;

  return (
    <p className="text-body-lg leading-relaxed text-ink-muted whitespace-pre-wrap">
      {product.description}
    </p>
  );
}
