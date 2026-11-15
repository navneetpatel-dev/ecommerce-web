"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { useAddStaffDialog } from "../../hooks/team/useAddStaffDialog.hook";
import { vendorTeamStyles as styles } from "../../styles/team/vendorTeam.styles";

interface AddStaffDialogProps {
  open: boolean;
  submitting?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; email: string }) => Promise<boolean>;
}

export function AddStaffDialog({
  open,
  submitting = false,
  error,
  onOpenChange,
  onSubmit,
}: AddStaffDialogProps) {
  const {
    name,
    email,
    canSubmit,
    close,
    handleOpenChange,
    handleNameChange,
    handleEmailChange,
    handleSubmit,
  } = useAddStaffDialog({ submitting, onOpenChange, onSubmit });

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="info"
      title="Add Team Member"
      description="Add a staff member to help manage products and fulfill orders. Staff have operational access without financial or legal settings visibility."
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: close,
      }}
      primaryAction={{
        label: "Add Member",
        loading: submitting,
        disabled: !canSubmit,
        onClick: handleSubmit,
      }}
    >
      {error ? <div className={styles.dialogError}>{error}</div> : null}
      <div className={styles.dialogStack}>
        <FormFieldFrame label="Full Name" htmlFor="staff-name" required>
          <Input
            id="staff-name"
            value={name}
            onChange={handleNameChange}
            placeholder="John Doe"
            disabled={submitting}
          />
        </FormFieldFrame>
        <FormFieldFrame label="Email Address" htmlFor="staff-email" required>
          <Input
            id="staff-email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="colleague@example.com"
            disabled={submitting}
          />
        </FormFieldFrame>
      </div>
    </StatusDialog>
  );
}
