"use client";

import { Trash2 } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { paymentMethodsLabels as LABELS } from "@/shared/constants/labels/paymentMethods";
import type { SavedPaymentMethod } from "../../../types";

interface DeleteSavedPaymentMethodDialogProps {
  target: SavedPaymentMethod | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSavedPaymentMethodDialog({
  target,
  deleting,
  onClose,
  onConfirm,
}: DeleteSavedPaymentMethodDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <StatusDialog
      open={Boolean(target)}
      onOpenChange={handleOpenChange}
      variant="danger"
      icon={Trash2}
      title={LABELS.deleteSavedPaymentMethodTitle}
      description={LABELS.deleteSavedPaymentMethodDescription}
      secondaryAction={{ label: "Cancel", onClick: onClose }}
      primaryAction={{
        label: "Remove",
        variant: "destructive",
        loading: deleting,
        onClick: onConfirm,
      }}
    />
  );
}
