import { productDetailsMiscStyles } from "../../styles/detail/productDetailsMisc.styles";

interface ProductInfoProps {
  product: { description?: string | null };
}

export function ProductInfo({ product }: ProductInfoProps) {
  if (!product.description?.trim()) return null;

  return (
    <div className={productDetailsMiscStyles.productDescription}>
      {product.description}
    </div>
  );
}
