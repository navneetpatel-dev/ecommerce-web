"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import type { ProductListItem } from "@/shared/api/types";
import { QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { useVendorProductsTable } from "../useVendorProductsTable.hook";

type RichProductItem = ProductListItem & {
  sku?: string;
  status?: string;
  variants?: Array<{
    id: string;
    sku?: string;
    stock?: number;
    lowStockAt?: number;
  }>;
};

export function useVendorProductsListView(options: {
  table: ReturnType<typeof useVendorProductsTable>;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  openCreate: () => void;
  openEdit: (id: string) => void;
  setQuery: (updates: Record<string, string | null | undefined>) => void;
  imagesProductId: string | null;
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
    refresh,
  } = options;

  const products = useMemo(
    () =>
      (table.data?.items ?? []).map((product: RichProductItem) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.variants?.[0]?.sku ?? product.sku ?? "—",
        stock: product.stock ?? product.variants?.[0]?.stock ?? 0,
        lowStockAt: product.variants?.[0]?.lowStockAt ?? 5,
        basePrice: product.basePrice,
        status: product.status ?? PRODUCT_STATUS.LIVE,
      })),
    [table.data?.items],
  );

  const imagesTarget = useMemo(() => {
    if (!imagesProductId) return null;
    const product = products.find((row) => row.id === imagesProductId);
    return product ? { id: product.id, name: product.name } : null;
  }, [imagesProductId, products]);

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
  };

  const deleteDialogProps = {
    open: Boolean(table.deleteTarget),
    onOpenChange: (open: boolean) => {
      if (!open) table.setDeleteTarget(null);
    },
    variant: "danger" as const,
    icon: Trash2,
    title: LABELS.confirmDeleteProductTitle,
    description: table.deleteTarget
      ? formatLabel(LABELS.confirmDeleteProductBody, {
          name: table.deleteTarget.name,
        })
      : LABELS.confirmDeleteProductFallback,
    secondaryAction: {
      label: LABELS.cancel,
      onClick: () => table.setDeleteTarget(null),
    },
    primaryAction: {
      label: LABELS.delete,
      variant: "destructive" as const,
      loading: table.isDeleting,
      onClick: () => {
        table.confirmDelete();
      },
    },
  };

  const imagesDialogProps = imagesTarget
    ? {
        productId: imagesTarget.id,
        productName: imagesTarget.name,
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) {
            setQuery({ [QUERY_PARAMS.images]: null });
          }
        },
        onChanged: () => refresh(),
      }
    : null;

  return { tableViewProps, deleteDialogProps, imagesDialogProps };
}
