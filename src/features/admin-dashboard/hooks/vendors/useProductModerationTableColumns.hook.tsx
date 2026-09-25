import { useMemo } from "react";
import type { DataTableColumn } from "@/shared/components/DataTable.component";
import { TableCellImage } from "@/shared/components/TableCellImage.component";
import { LABELS } from "@/shared/constants/labels";
import { productModerationTableStyles } from "../../styles/vendors/productModerationTable.styles";
import { formatInr } from "@/shared/utils/formatting/orderFormat";

interface Product {
  id: string;
  name: string;
  imageUrl?: string | null;
  basePrice: number;
}

export function useProductModerationTableColumns() {
  const columns: DataTableColumn<Product>[] = useMemo(
    () => [
      {
        id: "product",
        header: LABELS.product,
        truncate: false,
        cell: (p) => (
          <div className={productModerationTableStyles.productCell}>
            <TableCellImage src={p.imageUrl} alt={p.name} />
            <span className={productModerationTableStyles.productName}>
              {p.name}
            </span>
          </div>
        ),
      },
      {
        id: "price",
        header: LABELS.price,
        className: productModerationTableStyles.priceCell,
        cell: (p) => formatInr(p.basePrice),
      },
    ],
    [],
  );

  return columns;
}
