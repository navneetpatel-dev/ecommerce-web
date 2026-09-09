"use client";

import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import {
  TABLE_ACTIONS_CELL_CLASS,
  TABLE_DATA_CELL_CLASS,
} from "@/shared/constants/table/table";
import { cn } from "@/shared/utils/dom/cn";
import { ProductActions } from "./ProductActions.component";
import type { ProductRowActionsProps } from "./types";

/** Desktop table row for a vendor product. */
export function ProductRow(props: ProductRowActionsProps) {
  const {
    product,
    onEdit,
    onDelete,
    onSubmitForApproval,
    onManageImages,
    isDeleting,
    isSubmitting,
  } = props;
  const lowStock = product.stock <= product.lowStockAt;
  const stockClassName = lowStock ? "text-danger font-medium" : "";

  return (
    <TableRow>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-medium")}>
        {product.name}
      </TableCell>
      <TableCell
        className={cn(TABLE_DATA_CELL_CLASS, "font-mono text-body-sm")}
      >
        {product.sku}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <span className={stockClassName}>{product.stock}</span>
      </TableCell>
      <TableCell className={cn(TABLE_DATA_CELL_CLASS, "font-mono")}>
        ₹{product.basePrice}
      </TableCell>
      <TableCell className={TABLE_DATA_CELL_CLASS}>
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell className={TABLE_ACTIONS_CELL_CLASS}>
        <ProductActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmitForApproval={onSubmitForApproval}
          onManageImages={onManageImages}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
        />
      </TableCell>
    </TableRow>
  );
}
