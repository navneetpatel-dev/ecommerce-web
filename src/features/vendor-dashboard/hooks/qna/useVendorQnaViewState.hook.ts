"use client";

import { useState, useCallback } from "react";
import type { ProductQuestion } from "@/shared/api/types";

interface UseVendorQnaViewStateOptions {
  questions: ProductQuestion[];
  onAnswer: (questionId: string, answer: string) => void | Promise<void>;
  onUpdateAnswer?: (answerId: string, answer: string) => void | Promise<void>;
}

export function useVendorQnaViewState({
  questions,
  onAnswer,
  onUpdateAnswer,
}: UseVendorQnaViewStateOptions) {
  const [targetId, setTargetId] = useState<string | null>(null);

  const activeQuestion = questions.find((q) => q.id === targetId);
  const vendorAnswer = activeQuestion?.answers?.find(
    (a) => a.authorType === "VENDOR",
  );
  const initialAnswer = vendorAnswer?.answer ?? "";

  const handleOpenAnswer = useCallback((questionId: string) => {
    setTargetId(questionId);
  }, []);

  const handleAnswerOpenChange = useCallback((open: boolean) => {
    if (!open) setTargetId(null);
  }, []);

  const handleAnswerSubmit = useCallback(
    (answer: string) => {
      if (!targetId) return;
      const promise =
        vendorAnswer && onUpdateAnswer
          ? onUpdateAnswer(vendorAnswer.id, answer)
          : onAnswer(targetId, answer);
      void Promise.resolve(promise).then(() => {
        setTargetId(null);
      });
    },
    [onAnswer, onUpdateAnswer, targetId, vendorAnswer],
  );

  return {
    targetId,
    initialAnswer,
    handleOpenAnswer,
    handleAnswerOpenChange,
    handleAnswerSubmit,
  };
}
