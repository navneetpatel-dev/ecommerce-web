"use client";

import { useState } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { StatusDialog } from "@/shared/components/StatusDialog.component";
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

  return (
    <StatusDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          close();
          setAnswer("");
          return;
        }
        onOpenChange(true);
      }}
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
          onChange={(event) => setAnswer(event.target.value)}
          disabled={submitting}
          autoFocus
        />
      </FormFieldFrame>
    </StatusDialog>
  );
}
