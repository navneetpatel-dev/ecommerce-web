import { ProductCompareBar, ProductCompareSection } from "@/features/products";
import type { ProductListItem } from "@/shared/api/types";

interface CompareTrayProps {
  products: ProductListItem[];
  ref: React.Ref<HTMLElement>;
  onToggleProduct: (product: ProductListItem) => void;
  onClear: () => void;
  onCompareNow: () => void;
}

export function CompareTray({
  products,
  ref,
  onToggleProduct,
  onClear,
  onCompareNow,
}: CompareTrayProps) {
  return (
    <>
      <ProductCompareBar
        products={products}
        onToggleProduct={onToggleProduct}
        onClear={onClear}
        onCompareNow={onCompareNow}
      />

      <ProductCompareSection ref={ref} products={products} />
    </>
  );
}
