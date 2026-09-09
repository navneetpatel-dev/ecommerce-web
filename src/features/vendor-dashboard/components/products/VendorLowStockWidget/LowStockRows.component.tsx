import { TableRow, TableCell } from "@/shared/components/ui/table";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table/table";
import { cn } from "@/shared/utils/dom/cn";
import type { LowStockInventoryRow } from "../../../api/overview/vendor.api";
import {
  LOW_STOCK_AT_CELL,
  LOW_STOCK_COUNT_DANGER,
  LOW_STOCK_COUNT_WARNING,
  LOW_STOCK_NAME_CELL,
  LOW_STOCK_SKU_CELL,
} from "../../../styles/products/vendorLowStockWidget.styles";

interface LowStockRowsProps {
  rows: LowStockInventoryRow[];
}

export function LowStockRows({ rows }: LowStockRowsProps) {
  return (
    <>
      {rows.map((row) => {
        const stockClassName =
          row.stock <= 0 ? LOW_STOCK_COUNT_DANGER : LOW_STOCK_COUNT_WARNING;
        return (
          <TableRow key={row.id}>
            <TableCell
              className={cn(TABLE_DATA_CELL_CLASS, LOW_STOCK_NAME_CELL)}
            >
              {row.productName}
            </TableCell>
            <TableCell
              className={cn(TABLE_DATA_CELL_CLASS, LOW_STOCK_SKU_CELL)}
            >
              {row.sku}
            </TableCell>
            <TableCell className={cn(TABLE_DATA_CELL_CLASS, stockClassName)}>
              {row.stock}
            </TableCell>
            <TableCell className={cn(TABLE_DATA_CELL_CLASS, LOW_STOCK_AT_CELL)}>
              {row.lowStockAt}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
