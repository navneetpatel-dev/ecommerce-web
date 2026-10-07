import { StatusDialog } from "./StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

interface DiscardChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDiscard: () => void;
  onKeepEditing: () => void;
}

/** Shared confirmation for closing a dialog that holds unsaved edits. */
export function DiscardChangesDialog({
  open,
  onOpenChange,
  onDiscard,
  onKeepEditing,
}: DiscardChangesDialogProps) {
  return (
    <StatusDialog
      open={open}
      onOpenChange={onOpenChange}
      variant="warning"
      title={LABELS.discardChangesTitle}
      description={LABELS.discardChangesBody}
      primaryAction={{
        label: LABELS.discardChanges,
        variant: "destructive",
        onClick: onDiscard,
      }}
      secondaryAction={{
        label: LABELS.keepEditing,
        variant: "outline",
        onClick: onKeepEditing,
      }}
    />
  );
}
