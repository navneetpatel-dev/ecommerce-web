"use client";

import { LABELS } from "@/shared/constants/labels";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";
import { useAnswerQuestionForm } from "./useAnswerQuestionForm.hook";
import type { AnsweringState } from "../../components/list/QuestionAnswerSlot.component";

/**
 * Who may answer this product's questions: its seller, or a shopper who has
 * received it (C-01). Signed-out visitors still see Answer — it asks them to
 * sign in; signed-in non-buyers get one explanatory note instead of buttons.
 */
export function useAnsweringState(productId: string): AnsweringState {
  const answerForm = useAnswerQuestionForm(productId);
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const mode = !isAuthenticated
    ? "signedOut"
    : answerForm.canAnswer
      ? "answer"
      : "notBuyer";

  return {
    mode,
    onSignIn: () => {
      requireAuth({
        title: LABELS.answerPromptTitle,
        message: LABELS.signInToAnswer,
      });
    },
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
