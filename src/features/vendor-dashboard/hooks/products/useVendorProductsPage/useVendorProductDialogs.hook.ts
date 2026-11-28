"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { useVendorProductsTable } from "../useVendorProductsTable.hook";

interface UseVendorProductDialogsParams {
  table: ReturnType<typeof useVendorProductsTable>;
  products: Array<{ id: string; name: string }>;
  setQuery: (updates: Record<string, string | null | undefined>) => void;
  imagesProductId: string | null;
  variantsProductId: string | null;
  refresh: () => void;
}

/** The delete confirmation and the images and variants dialogs (kept in the URL). */
export function useVendorProductDialogs({
  table,
  products,
  setQuery,
  imagesProductId,
  variantsProductId,
  refresh,
}: UseVendorProductDialogsParams) {
  const imagesTarget = useMemo(() => {
    if (!imagesProductId) return null;
    const product = products.find((row) => row.id === imagesProductId);
    return product ? { id: product.id, name: product.name } : null;
  }, [imagesProductId, products]);

  const variantsTarget = useMemo(() => {
    if (!variantsProductId) return null;
    const product = products.find((row) => row.id === variantsProductId);
    return product ? { id: product.id, name: product.name } : null;
  }, [variantsProductId, products]);

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

  const variantsDialogProps = variantsTarget
    ? {
        productId: variantsTarget.id,
        productName: variantsTarget.name,
        open: true,
        onOpenChange: (open: boolean) => {
          if (!open) setQuery({ [QUERY_PARAMS.variants]: null });
        },
        onChanged: () => refresh(),
      }
    : null;

  return { deleteDialogProps, imagesDialogProps, variantsDialogProps };
}
