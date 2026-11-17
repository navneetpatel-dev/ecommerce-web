"use client";

import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";
import { useVendorQnaAnswerDialog } from "../../hooks/qna/useVendorQnaAnswerDialog.hook";

interface VendorQnaAnswerDialogProps {
  open: boolean;
  initialAnswer?: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answer: string) => void;
}

/** In-app answer dialog for a customer's product question — mirrors VendorReviewRespondDialog. */
export function VendorQnaAnswerDialog({
  open,
  initialAnswer = "",
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorQnaAnswerDialogProps) {
  const {
    answer,
    canSend,
    handleClose,
    handleOpenChange,
    handleAnswerChange,
    handleSubmit,
  } = useVendorQnaAnswerDialog({
    initialAnswer,
    submitting,
    onOpenChange,
    onSubmit,
  });

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="info"
      title={LABELS.answerQuestionTitle}
      description={LABELS.answerQuestionBody}
      secondaryAction={{
        label: LABELS.cancel,
        disabled: submitting,
        onClick: handleClose,
      }}
      primaryAction={{
        label: LABELS.submitAnswer,
        loading: submitting,
        disabled: !canSend,
        disabledHint: !canSend ? LABELS.answerEmptyHint : undefined,
        onClick: handleSubmit,
      }}
    >
      <FormFieldFrame
        label={LABELS.yourAnswer}
        htmlFor="vendor-qna-answer"
        hint={!canSend ? LABELS.answerEmptyHint : undefined}
      >
        <Textarea
          id="vendor-qna-answer"
          value={answer}
          onChange={handleAnswerChange}
          disabled={submitting}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: this control lives in a dialog/popover that opened from a user action, where moving focus into the panel is the expected behaviour
          autoFocus
        />
      </FormFieldFrame>
    </StatusDialog>
  );
}
