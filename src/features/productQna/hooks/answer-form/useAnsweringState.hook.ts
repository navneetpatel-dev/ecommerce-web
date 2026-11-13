"use client";

import { useAnswerQuestionForm } from "./useAnswerQuestionForm.hook";
import type { AnsweringState } from "../../components/list/QuestionAnswerSlot.component";

/** The Answer controls for this product, or undefined when the viewer may not answer (C-01). */
export function useAnsweringState(
  productId: string,
): AnsweringState | undefined {
  const answerForm = useAnswerQuestionForm(productId);
  if (!answerForm.canAnswer) return undefined;
  return {
    openId: answerForm.openId,
    submittedId: answerForm.submittedId,
    draft: answerForm.draft,
    isPending: answerForm.isPending,
    error: answerForm.error,
    onToggle: answerForm.toggle,
    onDraftChange: answerForm.handleDraftChange,
    onSubmit: answerForm.handleSubmit,
  };
}
