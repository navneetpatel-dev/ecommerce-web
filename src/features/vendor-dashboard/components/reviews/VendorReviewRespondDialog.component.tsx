"use client";

import { useState, type ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

interface VendorReviewRespondDialogProps {
  open: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (response: string) => void;
}

/** In-app review reply dialog — replaces window.prompt. */
export function VendorReviewRespondDialog({
  open,
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorReviewRespondDialogProps) {
  const [response, setResponse] = useState("");

  const close = () => {
    if (submitting) return;
    onOpenChange(false);
  };

  const canSend = Boolean(response.trim());

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      close();
      setResponse("");
      return;
    }
    onOpenChange(true);
  };
  const handleResponseChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setResponse(event.target.value);

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
        onClick: close,
      }}
      primaryAction={{
        label: LABELS.respondToReview,
        loading: submitting,
        disabled: !canSend,
        disabledHint: !response.trim()
          ? LABELS.reviewResponseEmptyHint
          : undefined,
        onClick: () => onSubmit(response.trim()),
      }}
    >
      <FormFieldFrame
        label={LABELS.reviewResponseLabel}
        htmlFor="vendor-review-response"
        hint={!response.trim() ? LABELS.reviewResponseEmptyHint : undefined}
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
