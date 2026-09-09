"use client";

import { useCallback } from "react";
import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable.component";
import { useProductModerationTableColumns } from "./useProductModerationTableColumns.hook";
import { ProductModerationRowActions } from "./ProductModerationRowActions.component";

interface Product {
  id: string;
  name: string;
  imageUrl?: string | null;
  basePrice: number;
}

export interface ProductModerationTableProps {
  products: Product[];
  onApprove: (id: string) => void | Promise<unknown>;
  onReject: (id: string, note: string) => void | Promise<unknown>;
  isApproving?: boolean;
  isRejecting?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  pagination?: DataTablePaginationProps;
}

export function ProductModerationTable({
  products,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
  loading = false,
  onRefresh,
  pagination,
}: ProductModerationTableProps) {
  const columns = useProductModerationTableColumns();
  const rowBusy = isApproving || isRejecting;

  const getRowId = useCallback((row: Product) => row.id, []);

  const renderActions = useCallback(
    (p: Product) => (
      <ProductModerationRowActions
        product={p}
        rowBusy={rowBusy}
        onApprove={onApprove}
        onReject={onReject}
      />
    ),
    [rowBusy, onApprove, onReject],
  );

  return (
    <DataTable
      columns={columns}
      rows={products}
      loading={loading}
      onRefresh={onRefresh}
      getRowId={getRowId}
      pagination={pagination}
      actions={renderActions}
    />
  );
}
