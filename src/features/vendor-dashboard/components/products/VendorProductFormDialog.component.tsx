"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { VendorProductCreateForm } from "./VendorProductCreateForm/index";
import { vendorProductFormDialogStyles } from "../../styles/products/vendorDialogs.styles";
import type { ComponentProps } from "react";

type VendorProductCreateFormProps = ComponentProps<
  typeof VendorProductCreateForm
>;

interface VendorProductFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  formProps: Omit<VendorProductCreateFormProps, "mode" | "onCancel">;
  onCancel: () => void;
}

/** Route-synced create/edit product dialog — matches admin workspace dialog patterns. */
export function VendorProductFormDialog({
  open,
  mode,
  onOpenChange,
  formProps,
  onCancel,
}: VendorProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={vendorProductFormDialogStyles.dialogContent}>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? LABELS.editProductTitle : LABELS.createProduct}
          </DialogTitle>
        </DialogHeader>
        <p className={vendorProductFormDialogStyles.description}>
          {mode === "edit" ? LABELS.editProductBody : LABELS.createProductBody}
        </p>
        <VendorProductCreateForm
          mode={mode}
          {...formProps}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
