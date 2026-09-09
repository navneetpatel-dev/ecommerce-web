"use client";

import { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
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

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        />
      </DialogContent>
    </Dialog>
  );
}
