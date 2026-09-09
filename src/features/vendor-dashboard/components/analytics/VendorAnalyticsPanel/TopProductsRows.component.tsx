import { TableRow, TableCell } from "@/shared/components/ui/table";
import { TABLE_DATA_CELL_CLASS } from "@/shared/constants/table/table";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { cn } from "@/shared/utils/dom/cn";
import {
  TOP_PRODUCTS_NAME_CELL,
  TOP_PRODUCTS_NUMERIC_CELL,
} from "./vendorAnalyticsPanel.styles";

export interface TopProduct {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

interface TopProductsRowsProps {
  topProducts: TopProduct[];
}

export function TopProductsRows({ topProducts }: TopProductsRowsProps) {
  return (
    <>
      {topProducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell
            className={cn(TABLE_DATA_CELL_CLASS, TOP_PRODUCTS_NAME_CELL)}
          >
            {product.name}
          </TableCell>
          <TableCell
            className={cn(TABLE_DATA_CELL_CLASS, TOP_PRODUCTS_NUMERIC_CELL)}
          >
            {product.unitsSold}
          </TableCell>
          <TableCell
            className={cn(TABLE_DATA_CELL_CLASS, TOP_PRODUCTS_NUMERIC_CELL)}
          >
            {formatInr(product.revenue)}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
