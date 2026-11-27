"use client";

import { ShieldCheck } from "lucide-react";
import type { ChangeEvent } from "react";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { ADMIN_NOTE_LIMITS } from "@/features/products";
import { useApproveOwnWork } from "../../hooks/vendors/useApproveOwnWork.hook";
import { adminProductEditorStyles } from "./adminProductEditor.styles";

interface ApproveOwnWorkDialogProps {
  open: boolean;
  onConfirm: (reason: string) => Promise<unknown>;
  onClose: () => void;
}

/** Super Admin only: approve a listing you prepared yourself, with the reason kept in the audit trail. */
export function ApproveOwnWorkDialog({
  open,
  onConfirm,
  onClose,
}: ApproveOwnWorkDialogProps) {
  const form = useApproveOwnWork({ onConfirm });
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    form.setReason(event.target.value);
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };
  const handleConfirm = () => void form.confirm();

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="success"
      icon={ShieldCheck}
      title={LABELS.approveOwnWorkTitle}
      description={LABELS.approveOwnWorkBody}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: form.busy,
        onClick: onClose,
      }}
      primaryAction={{
        label: LABELS.approveOwnWorkConfirm,
        loading: form.busy,
        disabled: !form.canConfirm,
        onClick: handleConfirm,
      }}
    >
      <FormFieldFrame
        label={LABELS.approveOwnWorkReason}
        required
        counter={{ value: form.reason, max: ADMIN_NOTE_LIMITS.MAX }}
      >
        <Textarea
          value={form.reason}
          maxLength={ADMIN_NOTE_LIMITS.MAX}
          placeholder={LABELS.approveOwnWorkPlaceholder}
          disabled={form.busy}
          className={adminProductEditorStyles.noteTextarea}
          onChange={handleChange}
        />
      </FormFieldFrame>
    </StatusDialog>
  );
}
