"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";
import {
  useDeleteAnswer,
  useDeleteQuestion,
} from "../../api/qna/productQna.queries";

type DeleteTarget =
  { kind: "question"; id: string } | { kind: "answer"; id: string };

const COPY = {
  question: {
    title: LABELS.deleteQuestionTitle,
    description: LABELS.deleteQuestionBody,
    done: LABELS.questionDeleted,
  },
  answer: {
    title: LABELS.deleteAnswerTitle,
    description: LABELS.deleteAnswerBody,
    done: LABELS.answerDeleted,
  },
} as const;

/** Confirm-then-delete for the shopper's own question (with its answers) or answer. */
export function useQnaDeleting() {
  const deleteQuestion = useDeleteQuestion();
  const deleteAnswer = useDeleteAnswer();
  const [target, setTarget] = useState<DeleteTarget | null>(null);
  const copy = COPY[target?.kind ?? "question"];
  const mutation = target?.kind === "answer" ? deleteAnswer : deleteQuestion;

  const onConfirm = () => {
    if (!target) return;
    const handlers = {
      onSuccess: () => {
        setTarget(null);
        notifySuccess(copy.done);
      },
      onError: (error: unknown) =>
        notifyError(getApiErrorMessage(error, LABELS.couldNotDelete)),
    };
    if (target.kind === "answer") deleteAnswer.mutate(target.id, handlers);
    else deleteQuestion.mutate(target.id, handlers);
  };

  return {
    deleteQuestion: (question: ProductQuestion) =>
      setTarget({ kind: "question", id: question.id }),
    deleteAnswer: (answer: ProductAnswer) =>
      setTarget({ kind: "answer", id: answer.id }),
    dialog: {
      open: Boolean(target),
      title: copy.title,
      description: copy.description,
      isPending: mutation.isPending,
      onConfirm,
      onOpenChange: (open: boolean) => {
        if (!open) setTarget(null);
      },
    },
  };
}
