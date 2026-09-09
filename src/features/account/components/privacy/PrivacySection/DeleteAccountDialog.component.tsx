"use client";

import type { ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { FormError } from "@/shared/components/FormError.component";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { privacySectionStyles as styles } from "../../../styles/privacy/privacySection.styles";

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
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onConfirmTextChange(e.target.value);
  };

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
        onClick: handleCancel,
      }}
      primaryAction={{
        label: LABELS.deleteAccount,
        variant: "destructive",
        disabled: !canConfirm,
        loading: pending,
        onClick: onConfirm,
      }}
    >
      <div className={styles.inputGroup}>
        <Label htmlFor="delete-confirm">{LABELS.confirmation}</Label>
        <Input
          id="delete-confirm"
          value={confirmText}
          onChange={handleInputChange}
          placeholder="DELETE"
          autoComplete="off"
        />
      </div>
      <FormError error={error} fallback={LABELS.couldNotDeleteAccount} />
    </StatusDialog>
  );
}
