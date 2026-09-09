"use client";

import { LogOut } from "lucide-react";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  onConfirm: () => void;
}

export function LogoutDialog({
  open,
  onOpenChange,
  pending,
  onConfirm,
}: LogoutDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <StatusDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="warning"
      icon={LogOut}
      title={LABELS.signOutConfirmTitle}
      description={LABELS.signOutConfirmBody}
      secondaryAction={{
        label: LABELS.cancel,
        onClick: handleCancel,
      }}
      primaryAction={{
        label: LABELS.signOut,
        loading: pending,
        onClick: onConfirm,
      }}
    />
  );
}
