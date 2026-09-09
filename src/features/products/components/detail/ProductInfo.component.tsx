import { productDetailsMiscStyles } from "../../styles/detail/productDetailsMisc.styles";

interface ProductInfoProps {
  product: { description?: string | null };
}

export function ProductInfo({ product }: ProductInfoProps) {
  if (!product.description) return null;

  return (
    <p className={productDetailsMiscStyles.productDescription}>
      {product.description}
    </p>
  );
}
