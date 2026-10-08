"use client";

import { useState, type ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { LABELS } from "@/shared/constants/labels";

interface VendorQnaAnswerDialogProps {
  open: boolean;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answer: string) => void;
}

/** In-app answer dialog for a customer's product question — mirrors VendorReviewRespondDialog. */
export function VendorQnaAnswerDialog({
  open,
  submitting = false,
  onOpenChange,
  onSubmit,
}: VendorQnaAnswerDialogProps) {
  const [answer, setAnswer] = useState("");

  const close = () => {
    if (submitting) return;
    onOpenChange(false);
  };

  const canSend = Boolean(answer.trim());

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      close();
      setAnswer("");
      return;
    }
    onOpenChange(true);
  };
  const handleAnswerChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setAnswer(event.target.value);

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
        onClick: close,
      }}
      primaryAction={{
        label: LABELS.submitAnswer,
        loading: submitting,
        disabled: !canSend,
        disabledHint: !answer.trim() ? LABELS.answerEmptyHint : undefined,
        onClick: () => onSubmit(answer.trim()),
      }}
    >
      <FormFieldFrame
        label={LABELS.yourAnswer}
        htmlFor="vendor-qna-answer"
        hint={!answer.trim() ? LABELS.answerEmptyHint : undefined}
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
