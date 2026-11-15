"use client";

import { useState, useCallback } from "react";

interface UseVendorQnaViewStateOptions {
  onAnswer: (questionId: string, answer: string) => void | Promise<void>;
}

export function useVendorQnaViewState({
  onAnswer,
}: UseVendorQnaViewStateOptions) {
  const [targetId, setTargetId] = useState<string | null>(null);

  const handleOpenAnswer = useCallback((questionId: string) => {
    setTargetId(questionId);
  }, []);

  const handleAnswerOpenChange = useCallback((open: boolean) => {
    if (!open) setTargetId(null);
  }, []);

  const handleAnswerSubmit = useCallback(
    (answer: string) => {
      if (!targetId) return;
      void Promise.resolve(onAnswer(targetId, answer)).then(() => {
        setTargetId(null);
      });
    },
    [onAnswer, targetId],
  );

  return {
    targetId,
    handleOpenAnswer,
    handleAnswerOpenChange,
    handleAnswerSubmit,
  };
}
