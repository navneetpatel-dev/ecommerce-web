"use client";

import { Trash2 } from "lucide-react";
import type { Address } from "@/shared/api/types";
import { StatusDialog } from "@/shared/components/StatusDialog.component";

interface DeleteAddressDialogProps {
  target: Address | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAddressDialog({
  target,
  deleting,
  onClose,
  onConfirm,
}: DeleteAddressDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <StatusDialog
      open={Boolean(target)}
      onOpenChange={handleOpenChange}
      variant="danger"
      icon={Trash2}
      title="Delete address?"
      description="This removes the address from your account. You can add it again later."
      secondaryAction={{
        label: "Cancel",
        onClick: onClose,
      }}
      primaryAction={{
        label: "Delete",
        variant: "destructive",
        loading: deleting,
        onClick: onConfirm,
      }}
    />
  );
}
