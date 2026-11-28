"use client";

import { useMemo, useState } from "react";
import { QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import type { useVendorProductsTable } from "../useVendorProductsTable.hook";
import { toVendorProductRows } from "../../../utils/products/vendorProductRows";
import { useVendorProductDialogs } from "./useVendorProductDialogs.hook";

export function useVendorProductsListView(options: {
  table: ReturnType<typeof useVendorProductsTable>;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  openCreate: () => void;
  openEdit: (id: string) => void;
  setQuery: (updates: Record<string, string | null | undefined>) => void;
  imagesProductId: string | null;
  variantsProductId: string | null;
  refresh: () => void;
}) {
  const {
    table,
    canCreate,
    canEdit,
    canDelete,
    openCreate,
    openEdit,
    setQuery,
    imagesProductId,
    variantsProductId,
    refresh,
  } = options;

  const products = useMemo(
    () => toVendorProductRows(table.data?.items),
    [table.data?.items],
  );

  const dialogs = useVendorProductDialogs({
    table,
    products,
    setQuery,
    imagesProductId,
    variantsProductId,
    refresh,
  });

  // "View as customer" is local to the page: no URL state needed.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewDialogProps = previewId
    ? {
        productId: previewId,
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) setPreviewId(null);
        },
      }
    : null;

  const tableViewProps = {
    search: table.search,
    status: table.status,
    categoryId: table.categoryId,
    inStock: table.inStock,
    minPrice: table.minPrice,
    maxPrice: table.maxPrice,
    sort: table.sort,
    isLoading: table.isLoading,
    products,
    page: table.page,
    totalPages: table.data?.totalPages,
    total: table.data?.total,
    isDeleting: table.isDeleting,
    isSubmitting: table.isSubmitting,
    actionMessage: table.actionMessage,
    onSearchChange: table.handleSearchChange,
    onStatusChange: table.handleStatusChange,
    onCategoryChange: table.handleCategoryChange,
    onInStockChange: table.handleInStockChange,
    onMinPriceChange: table.handleMinPriceChange,
    onMaxPriceChange: table.handleMaxPriceChange,
    onSortChange: table.handleSortChange,
    onClear: table.handleClear,
    onPageChange: table.setPage,
    onAddProduct: canCreate ? () => openCreate() : undefined,
    onEditProduct: canEdit ? (p: { id: string }) => openEdit(p.id) : undefined,
    onDeleteProduct: canDelete
      ? (p: { id: string; name: string }) =>
          table.setDeleteTarget({ id: p.id, name: p.name })
      : undefined,
    onSubmitForApproval: canEdit
      ? (p: { id: string }) => table.submitForApproval(p.id)
      : undefined,
    onManageImages: canEdit
      ? (p: { id: string; name: string }) =>
          setQuery({
            [QUERY_PARAMS.images]: p.id,
            [QUERY_PARAMS.create]: null,
            [QUERY_PARAMS.edit]: null,
          })
      : undefined,
    onPreview: (p: { id: string }) => setPreviewId(p.id),
    onManageVariants: canEdit
      ? (p: { id: string }) =>
          setQuery({
            [QUERY_PARAMS.variants]: p.id,
            [QUERY_PARAMS.images]: null,
            [QUERY_PARAMS.create]: null,
            [QUERY_PARAMS.edit]: null,
          })
      : undefined,
  };

  return {
    tableViewProps,
    ...dialogs,
    previewDialogProps,
  };
}
