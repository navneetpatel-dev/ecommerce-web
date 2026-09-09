import { useMemo } from "react";
import type { ProductVariant } from "@/shared/api/types";
import { useProductSpecifications } from "../../hooks/specs/useProductSpecifications.hook";
import { ProductSpecsList } from "./ProductSpecsList.component";
import { SecondaryCategoriesList } from "./SecondaryCategoriesList.component";
import { PRODUCT_SPECIFICATIONS_STYLES } from "../../styles/specs/productSpecifications.styles";

interface ProductSpecificationsProps {
  specs?: Record<string, string> | null;
  matchedVariant?: ProductVariant | null;
  categoryName?: string | null;
  secondaryCategories?: Array<{ id: string; name: string; slug: string }>;
  displayStock: number;
}

export function ProductSpecifications({
  specs,
  matchedVariant,
  categoryName,
  secondaryCategories,
  displayStock,
}: ProductSpecificationsProps) {
  const { rows } = useProductSpecifications({
    specs,
    matchedVariant,
    categoryName,
    displayStock,
  });

  const categories = useMemo(() => {
    return secondaryCategories ?? [];
  }, [secondaryCategories]);

  if (!rows.length) return null;

  return (
    <div className={PRODUCT_SPECIFICATIONS_STYLES.root}>
      <ProductSpecsList rows={rows} />
      <SecondaryCategoriesList categories={categories} />
    </div>
  );
}
