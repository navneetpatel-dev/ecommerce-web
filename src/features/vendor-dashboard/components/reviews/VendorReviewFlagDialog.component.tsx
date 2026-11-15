"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { useVendorReviewFlagDialog } from "../../hooks/reviews/useVendorReviewFlagDialog.hook";

interface VendorReviewFlagDialogProps {
  open: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
}

export function VendorReviewFlagDialog({
  open,
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorReviewFlagDialogProps) {
  const {
    reason,
    canSend,
    close,
    handleOpenChange,
    handleReasonChange,
    handleSubmit,
  } = useVendorReviewFlagDialog({ submitting, onOpenChange, onSubmit });

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="warning"
      title="Flag Review for Moderation"
      description="Report an abusive, fraudulent, or policy-violating review to platform administration."
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: close,
      }}
      primaryAction={{
        label: "Submit Report",
        loading: submitting,
        disabled: !canSend,
        onClick: handleSubmit,
      }}
    >
      <FormFieldFrame
        label="Reason for Flagging"
        htmlFor="vendor-review-flag-reason"
        hint="Please explain why this review violates platform terms (e.g. abusive language, competitor slander, wrong product)."
      >
        <Textarea
          id="vendor-review-flag-reason"
          placeholder="Describe the issue with this review..."
          value={reason}
          onChange={handleReasonChange}
          disabled={submitting}
        />
      </FormFieldFrame>
    </StatusDialog>
  );
}
