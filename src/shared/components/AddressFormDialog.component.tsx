"use client";

import { useCallback, useState } from "react";
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
import type { Address, AddressInput } from "@/shared/api/types";
import { AddressFormBody, addressFormDialogStyles } from "./AddressFormDialog";

export interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (body: AddressInput) => Promise<void>;
  isPending?: boolean;
  address?: Address | null;
  hasAddresses: boolean;
  title?: string;
  description?: string;
  submitLabel?: string;
}

/** Create/edit address dialog used by checkout and account addresses. */
export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  address,
  hasAddresses,
  title,
  description,
  submitLabel = LABELS.saveAddress,
}: AddressFormDialogProps) {
  const heading = title ?? (address ? LABELS.editAddress : LABELS.newAddress);
  const [isDirty, setIsDirty] = useState(false);
  const discard = useDiscardChangesGuard(isDirty);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDialogOpenChange = (next: boolean) => {
    if (next) {
      onOpenChange(true);
      return;
    }
    discard.requestClose(handleClose);
  };

  const handleRequestClose = () => {
    discard.requestClose(handleClose);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent className={addressFormDialogStyles.dialogContent}>
          <DialogHeader>
            <DialogTitle>{heading}</DialogTitle>
            <DialogDescription>
              {description ?? LABELS.addressFormHint}
            </DialogDescription>
          </DialogHeader>
          <AddressFormBody
            key={`${open ? "open" : "closed"}:${address?.id ?? "new"}`}
            address={address}
            hasAddresses={hasAddresses}
            isPending={isPending}
            submitLabel={submitLabel}
            onSubmit={onSubmit}
            onClose={handleClose}
            onRequestClose={handleRequestClose}
            onDirtyChange={setIsDirty}
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
