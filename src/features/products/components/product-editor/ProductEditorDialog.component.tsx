"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DiscardChangesDialog } from "@/shared/components/dialogs/DiscardChangesDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { useDiscardChangesGuard } from "@/shared/hooks/dialogs/useDiscardChangesGuard.hook";
import { ProductEditorForm } from "./ProductEditorForm.component";
import { productEditorDialogStyles } from "../../styles/product-editor/productEditorForm.styles";
import type { ComponentProps } from "react";

type ProductEditorFormProps = ComponentProps<typeof ProductEditorForm>;

interface ProductEditorDialogProps {
  open: boolean;
  mode: "create" | "edit";
  /** Vendor edits are pending — closing asks for confirmation first. */
  isDirty?: boolean;
  onOpenChange: (open: boolean) => void;
  formProps: Omit<ProductEditorFormProps, "mode" | "onCancel">;
  onCancel: () => void;
}

/** Route-synced create/edit product dialog — matches admin workspace dialog patterns. */
export function ProductEditorDialog({
  open,
  mode,
  isDirty = false,
  onOpenChange,
  formProps,
  onCancel,
}: ProductEditorDialogProps) {
  const discard = useDiscardChangesGuard(isDirty);

  const performClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    discard.requestClose(performClose);
  };

  const handleCancel = () => {
    discard.requestClose(onCancel);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className={productEditorDialogStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? LABELS.editProductTitle : LABELS.createProduct}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className={productEditorDialogStyles.description}>
            {mode === "edit"
              ? LABELS.editProductBody
              : LABELS.createProductBody}
          </DialogDescription>
          <ProductEditorForm
            mode={mode}
            {...formProps}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      <DiscardChangesDialog
        open={discard.confirmOpen}
        onOpenChange={discard.handleConfirmOpenChange}
        onDiscard={discard.confirmDiscard}
        onKeepEditing={discard.cancelDiscard}
      />
    </>
  );
}
