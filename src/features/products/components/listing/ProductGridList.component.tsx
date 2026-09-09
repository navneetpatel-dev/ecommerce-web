import { memo } from "react";
import type { ProductListItem } from "@/shared/api/types";
import { ProductCardContainer } from "../../containers/card/ProductCardContainer.container";
import { PRODUCT_GRID_STYLES } from "./productGrid.styles";

interface ProductGridListProps {
  products: ProductListItem[];
  compareMode?: boolean;
  comparedIds?: string[];
  compareAtLimit?: boolean;
  onToggleCompare?: (product: ProductListItem) => void;
}

export const ProductGridList = memo(function ProductGridList({
  products,
  compareMode = false,
  comparedIds = [],
  compareAtLimit = false,
  onToggleCompare,
}: ProductGridListProps) {
  return (
    <div className={PRODUCT_GRID_STYLES.grid}>
      {products.map((product) => (
        <ProductCardContainer
          key={product.id}
          product={product}
          compareMode={compareMode}
          isCompared={comparedIds.includes(product.id)}
          compareAtLimit={compareAtLimit}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
});
