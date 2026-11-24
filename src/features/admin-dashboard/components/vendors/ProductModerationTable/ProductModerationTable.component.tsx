"use client";

import { useCallback, useState } from "react";
import {
  DataTable,
  type DataTablePaginationProps,
} from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { useProductModerationTableColumns } from "../../../hooks/vendors/useProductModerationTableColumns.hook";
import { ProductModerationRowActions } from "./ProductModerationRowActions.component";
import { ProductModerationPreviewModal } from "./ProductModerationPreviewModal.component";
import { productsApi } from "@/features/products";
import type { ProductDetail } from "@/shared/api/types";

export interface ProductModerationTableProps {
  products: ProductDetail[];
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
  const [previewProduct, setPreviewProduct] = useState<ProductDetail | null>(
    null,
  );
  const columns = useProductModerationTableColumns();
  const rowBusy = isApproving || isRejecting;

  const getRowId = useCallback((row: ProductDetail) => row.id, []);

  const closePreview = useCallback(() => {
    setPreviewProduct(null);
  }, []);

  const fetchRowDetail = useCallback(
    async (row: ProductDetail) =>
      (await productsApi.detail(row.id)) as unknown as Record<string, unknown>,
    [],
  );

  const renderActions = useCallback(
    (p: ProductDetail) => (
      <ProductModerationRowActions
        product={p}
        rowBusy={rowBusy}
        onApprove={onApprove}
        onReject={onReject}
        onPreview={setPreviewProduct}
      />
    ),
    [rowBusy, onApprove, onReject],
  );

  return (
    <>
      <DataTable
        ariaLabel={LABELS.productModerationTableAria}
        columns={columns}
        rows={products}
        loading={loading}
        onRefresh={onRefresh}
        getRowId={getRowId}
        pagination={pagination}
        actions={renderActions}
        fetchRowDetail={fetchRowDetail}
        tableId="admin-product-moderation"
        enableColumnVisibility
        enableDensityToggle
        enableExport
        enableSorting
        enableFullscreen
      />
      <ProductModerationPreviewModal
        product={previewProduct}
        onClose={closePreview}
        onApprove={onApprove}
        onReject={onReject}
        rowBusy={rowBusy}
      />
    </>
  );
}
