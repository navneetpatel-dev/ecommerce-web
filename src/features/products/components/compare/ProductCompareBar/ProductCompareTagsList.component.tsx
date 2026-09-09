import type { ProductListItem } from "@/shared/api/types";
import { productCompareBarStyles } from "./productCompareBar.styles";
import { ProductCompareTag } from "./ProductCompareTag.component";

interface ProductCompareTagsListProps {
  products: ProductListItem[];
  onToggleProduct: (product: ProductListItem) => void;
}

export function ProductCompareTagsList({
  products,
  onToggleProduct,
}: ProductCompareTagsListProps) {
  return (
    <div className={productCompareBarStyles.tagsList}>
      {products.map((product) => (
        <ProductCompareTag
          key={product.id}
          product={product}
          onToggleProduct={onToggleProduct}
        />
      ))}
    </div>
  );
}
