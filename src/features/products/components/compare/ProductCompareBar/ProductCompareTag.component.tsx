import { useCallback } from "react";
import type { ProductListItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { productCompareBarStyles } from "./productCompareBar.styles";

interface ProductCompareTagProps {
  product: ProductListItem;
  onToggleProduct: (product: ProductListItem) => void;
}

export function ProductCompareTag({
  product,
  onToggleProduct,
}: ProductCompareTagProps) {
  const handleToggle = useCallback(() => {
    onToggleProduct(product);
  }, [onToggleProduct, product]);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={productCompareBarStyles.tagButton}
      onClick={handleToggle}
    >
      {product.name}
    </Button>
  );
}
