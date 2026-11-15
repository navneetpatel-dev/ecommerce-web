"use client";

import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import type { StaffMember } from "../../api/vendorStaff.api";

interface RemoveStaffDialogProps {
  member: StaffMember | null;
  submitting?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean>;
}

export function RemoveStaffDialog({
  member,
  submitting = false,
  error,
  onOpenChange,
  onConfirm,
}: RemoveStaffDialogProps) {
  const close = () => {
    if (submitting) return;
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <StatusDialog
      open={Boolean(member)}
      onOpenChange={onOpenChange}
      variant="danger"
      title="Remove Team Member"
      description={`Are you sure you want to remove ${member?.name || "this user"} (${member?.email}) from your vendor team? They will immediately lose access to your vendor dashboard.`}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: close,
      }}
      primaryAction={{
        label: "Remove Member",
        loading: submitting,
        onClick: handleConfirm,
      }}
    >
      {error && (
        <div className="mb-2 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}
    </StatusDialog>
  );
}
