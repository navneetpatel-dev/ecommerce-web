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
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ADMIN_NOTE_LIMITS } from "@/features/products";
import { useSubmitOnBehalf } from "../../hooks/vendors/useSubmitOnBehalf.hook";
import { adminProductEditorStyles } from "./adminProductEditor.styles";

interface SubmitOnBehalfDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

/** The admin records the vendor's agreement, then the product waits for a different admin to approve it. */
export function SubmitOnBehalfDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onSubmitted,
}: SubmitOnBehalfDialogProps) {
  const form = useSubmitOnBehalf({ productId, onDone: onSubmitted });
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    form.handleNoteChange(event.target.value);
  const handleCancel = () => onOpenChange(false);
  const handleSubmit = () => void form.submit();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formatLabel(LABELS.submitOnBehalfTitle, { name: productName })}
          </DialogTitle>
          <DialogDescription>{LABELS.submitOnBehalfBody}</DialogDescription>
        </DialogHeader>
        <FormFieldFrame
          counter={{ value: form.note, max: ADMIN_NOTE_LIMITS.MAX }}
          label={LABELS.consentNoteLabel}
          error={form.error ?? undefined}
          required
        >
          <Textarea
            value={form.note}
            maxLength={ADMIN_NOTE_LIMITS.MAX}
            placeholder={LABELS.consentNotePlaceholder}
            disabled={form.submitting}
            className={adminProductEditorStyles.noteTextarea}
            onChange={handleChange}
          />
        </FormFieldFrame>
        <FormActions>
          <Button
            type="button"
            variant="outline"
            disabled={form.submitting}
            onClick={handleCancel}
          >
            {LABELS.cancel}
          </Button>
          <Button
            type="button"
            loading={form.submitting}
            disabled={!form.canSubmit}
            onClick={handleSubmit}
          >
            {LABELS.submitForReview}
          </Button>
        </FormActions>
      </DialogContent>
    </Dialog>
  );
}
