import { memo } from "react";
import type { SpecRow } from "../../hooks/specs/useProductSpecifications.hook";
import { PRODUCT_SPECIFICATIONS_STYLES } from "../../styles/specs/productSpecifications.styles";

interface ProductSpecsListProps {
  rows: SpecRow[];
}

export const ProductSpecsList = memo(function ProductSpecsList({
  rows,
}: ProductSpecsListProps) {
  return (
    <dl className={PRODUCT_SPECIFICATIONS_STYLES.list}>
      {rows.map((row, index) => (
        <div
          key={`${index}-${row.label}`}
          className={PRODUCT_SPECIFICATIONS_STYLES.row}
        >
          <dt className={PRODUCT_SPECIFICATIONS_STYLES.label}>{row.label}</dt>
          <dd className={PRODUCT_SPECIFICATIONS_STYLES.value}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
});
