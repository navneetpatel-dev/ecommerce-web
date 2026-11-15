"use client";

import { useState } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const close = () => {
    if (submitting) return;
    onOpenChange(false);
  };

  const canSubmit = Boolean(name.trim() && email.trim());

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      close();
      setName("");
      setEmail("");
      return;
    }
    onOpenChange(true);
  };

  const handleSubmit = async () => {
    const success = await onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    if (success) {
      setName("");
      setEmail("");
      onOpenChange(false);
    }
  };

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
      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-xs text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <FormFieldFrame label="Full Name" htmlFor="staff-name" required>
          <Input
            id="staff-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            disabled={submitting}
          />
        </FormFieldFrame>
        <FormFieldFrame label="Email Address" htmlFor="staff-email" required>
          <Input
            id="staff-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            disabled={submitting}
          />
        </FormFieldFrame>
      </div>
    </StatusDialog>
  );
}
