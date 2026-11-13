"use client";

import { Trash2 } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { StatusDialog } from "./StatusDialog.component";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

/** Irreversible delete of the viewer's own content (AGENTS §11: confirm, no undo toast). */
export function ConfirmDeleteDialog({
  open,
  title,
  description,
  isPending,
  onConfirm,
  onOpenChange,
}: ConfirmDeleteDialogProps) {
  const handleKeep = () => onOpenChange(false);

  return (
    <StatusDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="danger"
      icon={Trash2}
      title={title}
      description={description}
      primaryAction={{
        label: LABELS.deleteConfirm,
        variant: "destructive",
        loading: isPending,
        onClick: onConfirm,
      }}
      secondaryAction={{
        label: LABELS.keepIt,
        variant: "outline",
        onClick: handleKeep,
      }}
    />
  );
}
