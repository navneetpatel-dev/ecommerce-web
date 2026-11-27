"use client";

import { Send } from "lucide-react";
import type { ChangeEvent } from "react";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldFrame } from "@/shared/components/forms";
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
    <StatusDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={Send}
      title={formatLabel(LABELS.submitOnBehalfTitle, { name: productName })}
      description={LABELS.submitOnBehalfBody}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: form.submitting,
        onClick: handleCancel,
      }}
      primaryAction={{
        label: LABELS.submitForReview,
        loading: form.submitting,
        disabled: !form.canSubmit,
        onClick: handleSubmit,
      }}
    >
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
    </StatusDialog>
  );
}
