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
  /** The product being edited, to show whose it is. */
  editing?: { vendorName?: string | null; listedByPlatform?: boolean } | null;
}

/** The shared product editor, with the vendor the product is listed for chosen first (create only). */
export function AdminProductEditorDialog({
  formProps,
  vendorId,
  onVendorChange,
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
        placeholder={LABELS.listForVendorPlaceholder}
        status="APPROVED"
        allowNone={false}
        required
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
