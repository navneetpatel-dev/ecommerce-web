"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useRouteQueryDialog } from "@/shared/hooks/navigation/useRouteQueryDialog.hook";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { QUERY_PARAMS } from "@/shared/constants/navigation/queryParams";
import type {
  ProductListingFormValues,
  VariantDraft,
} from "@/features/products";
import { VendorProductImagesDialog } from "../../../components/products/VendorProductImagesDialog.component";
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
  const [formDirty, setFormDirty] = useState(false);

  useEffect(() => {
    if (!open || !mode) {
      lastDialogKeyRef.current = null;
      return;
    }

    const dialogKey = mode === "edit" ? `edit:${editId ?? ""}` : "create";
    if (lastDialogKeyRef.current === dialogKey) return;
    lastDialogKeyRef.current = dialogKey;
    setFormDirty(false);

    if (mode === "create") {
      if (!canCreate) {
        close();
        return;
      }
      queueMicrotask(() => form.resetFormState());
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
  const variantsProductId = searchParams.get(QUERY_PARAMS.variants);

  const view = useVendorProductsListView({
    table,
    canCreate,
    canEdit,
    canDelete,
    openCreate,
    openEdit,
    setQuery,
    imagesProductId,
    variantsProductId,
    refresh: () => router.refresh(),
  });

  const showProductDialog =
    open && ((mode === "create" && canCreate) || (mode === "edit" && canEdit));

  /** User edits mark the form dirty so the dialog can confirm before discarding. */
  const handleFormChange = (patch: Partial<ProductListingFormValues>) => {
    setFormDirty(true);
    form.setValues((current) => ({ ...current, ...patch }));
  };
  const handleImageUrlsChange = (urls: string[]) => {
    setFormDirty(true);
    form.setImageUrls(urls);
  };

  const handleVariantRowsChange = (rows: VariantDraft[]) => {
    setFormDirty(true);
    form.setVariantRows(rows);
  };

  const formDialogProps = {
    open: showProductDialog,
    mode: (mode === "edit" ? "edit" : "create") as "create" | "edit",
    isDirty: formDirty,
    savedProduct: form.product,
    onOpenChange: setOpen,
    onCancel: close,
    formProps: {
      values: form.values,
      category: {
        selected: form.selectedCategory,
        onSelect: form.setSelectedCategory,
      },
      imageUrls: form.imageUrls,
      draftUploadId: editId ?? form.draftUploadId,
      submitError: form.submitError,
      apiFieldErrors: form.apiFieldErrors,
      submitting: form.submitting,
      loading: form.loading,
      onChange: handleFormChange,
      onImageUrlsChange: handleImageUrlsChange,
      onValidSubmit: form.handleValidSubmit,
      pricingLock: form.pricing.lock,
      reason: {
        required: form.pricing.reasonRequired,
        value: form.changeReason,
        error: form.reasonError,
        onChange: form.handleReasonChange,
      },
      variants: {
        rows: form.variantRows,
        errors: form.variantErrors,
        onChange: handleVariantRowsChange,
      },
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
    variantsDialogProps: view.variantsDialogProps,
    previewDialogProps: view.previewDialogProps,
    ImagesDialog: VendorProductImagesDialog,
  };
}
