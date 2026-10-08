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
import { VendorProductCreateForm } from "./VendorProductCreateForm/index";
import { vendorProductFormDialogStyles } from "../../styles/products/vendorDialogs.styles";
import type { ComponentProps } from "react";

type VendorProductCreateFormProps = ComponentProps<
  typeof VendorProductCreateForm
>;

interface VendorProductFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  /** Vendor edits are pending — closing asks for confirmation first. */
  isDirty?: boolean;
  onOpenChange: (open: boolean) => void;
  formProps: Omit<VendorProductCreateFormProps, "mode" | "onCancel">;
  onCancel: () => void;
}

/** Route-synced create/edit product dialog — matches admin workspace dialog patterns. */
export function VendorProductFormDialog({
  open,
  mode,
  isDirty = false,
  onOpenChange,
  formProps,
  onCancel,
}: VendorProductFormDialogProps) {
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
        <DialogContent className={vendorProductFormDialogStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? LABELS.editProductTitle : LABELS.createProduct}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription
            className={vendorProductFormDialogStyles.description}
          >
            {mode === "edit"
              ? LABELS.editProductBody
              : LABELS.createProductBody}
          </DialogDescription>
          <VendorProductCreateForm
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
