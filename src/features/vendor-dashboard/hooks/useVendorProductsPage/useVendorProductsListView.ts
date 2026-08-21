"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import type { ProductListItem } from "@/shared/api/types";
import { QUERY_PARAMS } from "@/shared/constants/queryParams";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { useVendorProductsTable } from "../useVendorProductsTable";

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
    isLoading: table.isLoading,
    products,
    page: table.page,
    totalPages: table.data?.totalPages,
    isDeleting: table.isDeleting,
    isSubmitting: table.isSubmitting,
    actionMessage: table.actionMessage,
    onSearchChange: table.handleSearchChange,
    onPageChange: table.setPage,
    onAddProduct: canCreate ? () => openCreate() : undefined,
    onEditProduct: canEdit
      ? (product: { id: string }) => openEdit(product.id)
      : undefined,
    onDeleteProduct: canDelete
      ? (product: { id: string; name: string }) =>
          table.setDeleteTarget({ id: product.id, name: product.name })
      : undefined,
    onSubmitForApproval: canEdit
      ? (product: { id: string }) => table.submitForApproval(product.id)
      : undefined,
    onManageImages: canEdit
      ? (product: { id: string; name: string }) =>
          setQuery({
            [QUERY_PARAMS.images]: product.id,
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
