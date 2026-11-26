"use client";

import { useCallback } from "react";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import { DiscardChangesDialog } from "@/shared/components/dialogs/DiscardChangesDialog.component";
import type { ProductDetail } from "@/shared/api/types";
import { useDiscardChangesGuard } from "@/shared/hooks/dialogs/useDiscardChangesGuard.hook";
import { ProductEditorDialogBody } from "./ProductEditorDialogBody.component";
import type { ProductEditorForm } from "./ProductEditorForm.component";
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
  /** The saved product when editing, for the customer preview. */
  savedProduct?: ProductDetail | null;
}

/** Route-synced create/edit product dialog — matches admin workspace dialog patterns. */
export function ProductEditorDialog({
  open,
  mode,
  isDirty = false,
  onOpenChange,
  formProps,
  onCancel,
  savedProduct,
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
          <ProductEditorDialogBody
            mode={mode}
            formProps={formProps}
            onCancel={handleCancel}
            savedProduct={savedProduct}
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
