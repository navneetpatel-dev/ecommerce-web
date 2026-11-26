"use client";

import type { ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormActions, FormFieldFrame } from "@/shared/components/forms";
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{LABELS.approveOwnWorkTitle}</DialogTitle>
          <DialogDescription>{LABELS.approveOwnWorkBody}</DialogDescription>
        </DialogHeader>
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
        <FormActions>
          <Button
            type="button"
            variant="outline"
            disabled={form.busy}
            onClick={onClose}
          >
            {LABELS.cancel}
          </Button>
          <Button
            type="button"
            loading={form.busy}
            disabled={!form.canConfirm}
            onClick={handleConfirm}
          >
            {LABELS.approveOwnWorkConfirm}
          </Button>
        </FormActions>
      </DialogContent>
    </Dialog>
  );
}
