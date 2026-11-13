"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { isUgcTextValid } from "@/shared/schemas/ugcText.schema";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  useAnswerQuestion,
  useCanAnswer,
} from "../../api/qna/productQna.queries";

/**
 * Shopper answers on product questions (C-01, decision D7). Answer shows only for the
 * product's seller and shoppers who have received it; one answer box is open at a time
 * and answers wait for moderation.
 */
export function useAnswerQuestionForm(productId: string) {
  const signedIn = Boolean(useAuthStore((s) => s.accessToken));
  const canAnswerQuery = useCanAnswer(productId, signedIn);
  const answer = useAnswerQuestion();
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const toggle = (questionId: string) => {
    answer.reset();
    setDraft("");
    setOpenId((current) => (current === questionId ? null : questionId));
  };
  const handleDraftChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setDraft(event.target.value);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();
    if (!openId || !isUgcTextValid(text, UGC_LIMITS.answer)) return;
    const questionId = openId;
    answer.mutate(
      { questionId, answer: text },
      {
        onSuccess: () => {
          setSubmittedId(questionId);
          setOpenId(null);
          setDraft("");
        },
      },
    );
  };

  return {
    canAnswer: canAnswerQuery.data?.canAnswer === true,
    openId,
    draft,
    submittedId,
    isPending: answer.isPending,
    error: answer.isError
      ? getApiErrorMessage(answer.error, LABELS.couldNotSubmitAnswer)
      : null,
    toggle,
    handleDraftChange,
    handleSubmit,
  };
}
