"use client";

import { useCallback } from "react";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import type { StaffMember } from "../../api/vendorStaff.api";
import { vendorTeamStyles as styles } from "../../styles/team/vendorTeam.styles";

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
  const close = useCallback(() => {
    if (submitting) return;
    onOpenChange(false);
  }, [onOpenChange, submitting]);

  const handleConfirm = useCallback(async () => {
    const success = await onConfirm();
    if (success) {
      onOpenChange(false);
    }
  }, [onConfirm, onOpenChange]);

  const description = `Are you sure you want to remove ${member?.name || "this user"} (${member?.email}) from your vendor team? They will immediately lose access to your vendor dashboard.`;

  return (
    <StatusDialog
      open={Boolean(member)}
      onOpenChange={onOpenChange}
      variant="danger"
      title="Remove Team Member"
      description={description}
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
      {error ? <div className={styles.dialogError}>{error}</div> : null}
    </StatusDialog>
  );
}
