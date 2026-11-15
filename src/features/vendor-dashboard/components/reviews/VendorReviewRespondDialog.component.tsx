"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { useVendorReviewRespondDialog } from "../../hooks/reviews/useVendorReviewRespondDialog.hook";

interface VendorReviewRespondDialogProps {
  open: boolean;
  initialResponse?: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (response: string) => void;
}

/** In-app review reply dialog — replaces window.prompt. */
export function VendorReviewRespondDialog({
  open,
  initialResponse = "",
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorReviewRespondDialogProps) {
  const {
    response,
    canSend,
    handleClose,
    handleOpenChange,
    handleResponseChange,
    handleSubmit,
  } = useVendorReviewRespondDialog({
    initialResponse,
    submitting,
    onOpenChange,
    onSubmit,
  });

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="info"
      title={LABELS.reviewResponseTitle}
      description={LABELS.reviewResponseBody}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: handleClose,
      }}
      primaryAction={{
        label: LABELS.respondToReview,
        loading: submitting,
        disabled: !canSend,
        disabledHint: !canSend ? LABELS.reviewResponseEmptyHint : undefined,
        onClick: handleSubmit,
      }}
    >
      <FormFieldFrame
        label={LABELS.reviewResponseLabel}
        htmlFor="vendor-review-response"
        hint={!canSend ? LABELS.reviewResponseEmptyHint : undefined}
      >
        <Textarea
          id="vendor-review-response"
          value={response}
          onChange={handleResponseChange}
          disabled={submitting}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: this control lives in a dialog/popover that opened from a user action, where moving focus into the panel is the expected behaviour
          autoFocus
        />
      </FormFieldFrame>
    </StatusDialog>
  );
}
