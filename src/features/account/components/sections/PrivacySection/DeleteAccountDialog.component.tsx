"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { FormError } from "@/shared/components/FormError.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  confirmText: string;
  canConfirm: boolean;
  pending: boolean;
  error: Error | null;
  onConfirmTextChange: (value: string) => void;
  onConfirm: () => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  confirmText,
  canConfirm,
  pending,
  error,
  onConfirmTextChange,
  onConfirm,
}: DeleteAccountDialogProps) {
  return (
    <StatusDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="danger"
      icon={Trash2}
      title={LABELS.deleteAccountConfirmTitle}
      description={LABELS.deleteAccountConfirmBody}
      secondaryAction={{
        label: LABELS.cancel,
        onClick: () => onOpenChange(false),
      }}
      primaryAction={{
        label: LABELS.deleteAccount,
        variant: "destructive",
        disabled: !canConfirm,
        loading: pending,
        onClick: onConfirm,
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="delete-confirm">{LABELS.confirmation}</Label>
        <Input
          id="delete-confirm"
          value={confirmText}
          onChange={(e) => onConfirmTextChange(e.target.value)}
          placeholder="DELETE"
          autoComplete="off"
        />
      </div>
      <FormError error={error} fallback={LABELS.couldNotDeleteAccount} />
    </StatusDialog>
  );
}
