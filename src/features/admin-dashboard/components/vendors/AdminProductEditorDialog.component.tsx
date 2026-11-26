"use client";

import type { ComponentProps } from "react";
import { ProductEditorDialog } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { ProductVendorReadOnly } from "./ProductVendorReadOnly.component";
import { AdminVendorFilterSelect } from "./AdminVendorFilterSelect.component";

type EditorDialogProps = ComponentProps<typeof ProductEditorDialog>;

interface AdminProductEditorDialogProps extends Omit<
  EditorDialogProps,
  "formProps"
> {
  formProps: EditorDialogProps["formProps"];
  vendorId: string;
  onVendorChange: (vendorId: string) => void;
  /** Super Admin: may leave the vendor empty for the platform's own product. */
  allowPlatformProduct?: boolean;
  /** The product being edited, to show whose it is. */
  editing?: { vendorName?: string | null; listedByPlatform?: boolean } | null;
}

/** The shared product editor, with the vendor the product is listed for chosen first (create only). */
export function AdminProductEditorDialog({
  formProps,
  vendorId,
  onVendorChange,
  allowPlatformProduct = false,
  editing,
  mode,
  ...rest
}: AdminProductEditorDialogProps) {
  const vendorField =
    mode === "edit" ? (
      editing ? (
        <ProductVendorReadOnly
          vendorName={editing.vendorName}
          listedByPlatform={editing.listedByPlatform}
        />
      ) : null
    ) : (
      <AdminVendorFilterSelect
        value={vendorId}
        onChange={onVendorChange}
        label={LABELS.listForVendor}
        placeholder={
          allowPlatformProduct
            ? LABELS.platformProductOption
            : LABELS.listForVendorPlaceholder
        }
        hint={allowPlatformProduct ? LABELS.platformProductHint : undefined}
        status="APPROVED"
        allowNone={allowPlatformProduct}
        required={!allowPlatformProduct}
      />
    );
  return (
    <ProductEditorDialog
      {...rest}
      mode={mode}
      formProps={{ ...formProps, vendorField }}
    />
  );
}
