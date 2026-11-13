"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS, type UgcLimit } from "@/shared/constants/ugc/ugcLimits";
import { isUgcTextValid } from "@/shared/schemas/ugcText.schema";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";
import {
  useUpdateAnswer,
  useUpdateQuestion,
} from "../../api/qna/productQna.queries";

type EditTarget =
  { kind: "question"; id: string } | { kind: "answer"; id: string };

const DIALOG_COPY = {
  question: {
    title: LABELS.editQuestionTitle,
    label: LABELS.yourQuestion,
    limits: UGC_LIMITS.question,
  },
  answer: {
    title: LABELS.editAnswerTitle,
    label: LABELS.yourAnswer,
    limits: UGC_LIMITS.answer,
  },
} as const satisfies Record<
  EditTarget["kind"],
  { title: string; label: string; limits: UgcLimit }
>;

/** Owner edits of a question (while unanswered) or an answer; edits are re-moderated. */
export function useQnaEditing() {
  const currentUserId = useAuthStore((s) => s.currentUser?.id ?? null);
  const updateQuestion = useUpdateQuestion();
  const updateAnswer = useUpdateAnswer();
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [draft, setDraft] = useState("");
  const mutation = target?.kind === "answer" ? updateAnswer : updateQuestion;
  const copy = DIALOG_COPY[target?.kind ?? "question"];

  const open = (next: EditTarget, text: string) => {
    updateQuestion.reset();
    updateAnswer.reset();
    setDraft(text);
    setTarget(next);
  };
  const close = () => setTarget(null);
  const onSaved = () => {
    close();
    notifySuccess(LABELS.editSubmitted);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!target || !isUgcTextValid(draft, copy.limits)) return;
    const text = draft.trim();
    if (target.kind === "answer") {
      updateAnswer.mutate(
        { answerId: target.id, answer: text },
        { onSuccess: onSaved },
      );
    } else {
      updateQuestion.mutate(
        { questionId: target.id, question: text },
        { onSuccess: onSaved },
      );
    }
  };

  return {
    actions: {
      currentUserId,
      editQuestion: (q: ProductQuestion) =>
        open({ kind: "question", id: q.id }, q.question),
      editAnswer: (a: ProductAnswer) =>
        open({ kind: "answer", id: a.id }, a.answer),
    },
    dialog: {
      open: Boolean(target),
      fieldId: `edit-${target?.kind ?? "post"}`,
      ...copy,
      draft,
      canSave: isUgcTextValid(draft, copy.limits),
      isPending: mutation.isPending,
      error: mutation.isError
        ? getApiErrorMessage(mutation.error, LABELS.couldNotSaveEdit)
        : null,
      onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) =>
        setDraft(event.target.value),
      onOpenChange: (next: boolean) => {
        if (!next) close();
      },
      onCancel: close,
      onSubmit: handleSubmit,
    },
  };
}

export type QnaEditDialogState = ReturnType<typeof useQnaEditing>["dialog"];
