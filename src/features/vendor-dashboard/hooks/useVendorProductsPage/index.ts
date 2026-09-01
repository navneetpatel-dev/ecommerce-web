"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePermissions } from "@/shared/hooks/usePermissions.hook";
import { useRouteQueryDialog } from "@/shared/hooks/useRouteQueryDialog.hook";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { QUERY_PARAMS } from "@/shared/constants/queryParams";
import type { ProductListingFormValues } from "@/features/products";
import { VendorProductImagesDialog } from "../../components/VendorProductImagesDialog.component";
import { useVendorProductsTable } from "../useVendorProductsTable.hook";
import { useVendorProductFormState } from "./useVendorProductFormState.hook";
import { useVendorProductsListView } from "./useVendorProductsListView.hook";

export function useVendorProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const table = useVendorProductsTable();
  const { hasPermission } = usePermissions();
  const dialog = useRouteQueryDialog();

  const canCreate = hasPermission(PERMISSIONS.PRODUCT_CREATE);
  const canEdit = hasPermission(PERMISSIONS.PRODUCT_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.PRODUCT_DELETE);

  const { open, mode, editId, openCreate, openEdit, close, setOpen, setQuery } =
    dialog;

  const form = useVendorProductFormState({ mode, editId, close });

  const lastDialogKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !mode) {
      lastDialogKeyRef.current = null;
      return;
    }

    const dialogKey = mode === "edit" ? `edit:${editId ?? ""}` : "create";
    if (lastDialogKeyRef.current === dialogKey) return;
    lastDialogKeyRef.current = dialogKey;

    if (mode === "create") {
      if (!canCreate) {
        close();
        return;
      }
      queueMicrotask(() => form.resetFormState(form.categories[0]?.id));
      return;
    }

    if (mode === "edit" && editId) {
      if (!canEdit) {
        close();
        return;
      }
      queueMicrotask(() => {
        void form.loadEditProduct(editId);
      });
    }
  }, [canCreate, canEdit, close, editId, form, mode, open]);

  const imagesProductId = searchParams.get(QUERY_PARAMS.images);

  const view = useVendorProductsListView({
    table,
    canCreate,
    canEdit,
    canDelete,
    openCreate,
    openEdit,
    setQuery,
    imagesProductId,
    refresh: () => router.refresh(),
  });

  const showProductDialog =
    open && ((mode === "create" && canCreate) || (mode === "edit" && canEdit));

  const formDialogProps = {
    open: showProductDialog,
    mode: (mode === "edit" ? "edit" : "create") as "create" | "edit",
    onOpenChange: setOpen,
    onCancel: close,
    formProps: {
      values: form.values,
      categories: form.categories,
      imageUrls: form.imageUrls,
      draftUploadId: editId ?? form.draftUploadId,
      submitError: form.submitError,
      apiFieldErrors: form.apiFieldErrors,
      submitting: form.submitting,
      loading: form.loading,
      onChange: (patch: Partial<ProductListingFormValues>) => {
        form.setValues((current) => ({ ...current, ...patch }));
      },
      onImageUrlsChange: form.setImageUrls,
      onValidSubmit: form.handleValidSubmit,
    },
  };

  return {
    permission: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
    ] as const,
    formDialogProps,
    tableViewProps: view.tableViewProps,
    deleteDialogProps: view.deleteDialogProps,
    imagesDialogProps: view.imagesDialogProps,
    ImagesDialog: VendorProductImagesDialog,
  };
}
