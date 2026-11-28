"use client";

import { useEffect, useRef, useState } from "react";
import {
  useProductEditorState,
  type ProductListingFormValues,
  type VariantDraft,
} from "@/features/products";

import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useRouteQueryDialog } from "@/shared/hooks/navigation/useRouteQueryDialog.hook";

export interface ProductTarget {
  id: string;
  name: string;
}

/**
 * The admin Products page's editor: list a product for a vendor, edit it, manage its variants and
 * submit it on the vendor's behalf. Create and edit follow the URL like the vendor page.
 */
export function useAdminProductEditor(onChanged: () => void) {
  const { hasPermission } = usePermissions();
  const dialog = useRouteQueryDialog();
  const { open, mode, editId, openCreate, openEdit, close, setOpen } = dialog;

  // Listing for a vendor needs both powers; editing needs product.manage.
  const canManage = hasPermission(PERMISSIONS.PRODUCT_MANAGE);
  const canCreate = canManage && hasPermission(PERMISSIONS.PRODUCT_CREATE);

  const form = useProductEditorState({
    mode,
    editId,
    close,
    onSaved: onChanged,
    requireVendor: true,
  });

  const [formDirty, setFormDirty] = useState(false);
  const [variantsTarget, setVariantsTarget] = useState<ProductTarget | null>(
    null,
  );
  const [submitTarget, setSubmitTarget] = useState<ProductTarget | null>(null);
  const [previewTarget, setPreviewTarget] = useState<ProductTarget | null>(
    null,
  );
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !mode) {
      lastKeyRef.current = null;
      return;
    }
    const key = mode === "edit" ? `edit:${editId ?? ""}` : "create";
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    setFormDirty(false);

    if (mode === "create") {
      if (!canCreate) return close();
      queueMicrotask(() => form.resetFormState());
      return;
    }
    if (!canManage) return close();
    if (editId) queueMicrotask(() => void form.loadEditProduct(editId));
  }, [canCreate, canManage, close, editId, form, mode, open]);

  const showDialog =
    open &&
    ((mode === "create" && canCreate) || (mode === "edit" && canManage));

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
  const handleVendorChange = (vendorId: string) => {
    setFormDirty(true);
    form.setVendorId(vendorId);
  };

  const editorDialogProps = {
    open: showDialog,
    mode: (mode === "edit" ? "edit" : "create") as "create" | "edit",
    isDirty: formDirty,
    savedProduct: form.product,
    onOpenChange: setOpen,
    onCancel: close,
    vendorId: form.vendorId,
    onVendorChange: handleVendorChange,
    editing:
      mode === "edit" && form.product
        ? {
            vendorName: form.product.vendor?.businessName ?? null,
            listedByPlatform: Boolean(form.product.listedByPlatform),
          }
        : null,
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

  const variantsDialogProps = variantsTarget
    ? {
        productId: variantsTarget.id,
        productName: variantsTarget.name,
        open: true,
        onOpenChange: (next: boolean) => {
          if (!next) setVariantsTarget(null);
        },
        onChanged,
      }
    : null;

  const previewDialogProps = previewTarget
    ? {
        productId: previewTarget.id,
        open: true,
        onOpenChange: (next: boolean) => {
          if (!next) setPreviewTarget(null);
        },
      }
    : null;

  const submitDialogProps = submitTarget
    ? {
        productId: submitTarget.id,
        productName: submitTarget.name,
        open: true,
        onOpenChange: (next: boolean) => {
          if (!next) setSubmitTarget(null);
        },
        onSubmitted: () => {
          setSubmitTarget(null);
          onChanged();
        },
      }
    : null;

  return {
    canCreate,
    canManage,
    openCreate,
    openEdit,
    openVariants: setVariantsTarget,
    openSubmit: setSubmitTarget,
    openPreview: setPreviewTarget,
    previewDialogProps,
    editorDialogProps,
    variantsDialogProps,
    submitDialogProps,
  };
}
