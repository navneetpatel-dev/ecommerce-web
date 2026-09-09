import type { ProductListItem } from "@/shared/api/types";
import { productCompareSectionStyles } from "../../../styles/compare/productCompareSection.styles";
import { ProductCompareCard } from "./ProductCompareCard.component";

interface ProductCompareGridProps {
  products: ProductListItem[];
}

export function ProductCompareGrid({ products }: ProductCompareGridProps) {
  return (
    <div className={productCompareSectionStyles.grid}>
      {products.map((product) => (
        <ProductCompareCard key={product.id} product={product} />
      ))}
    </div>
  );
}
