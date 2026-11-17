"use client";

import { useEffect, useState } from "react";
import { productQnaApi } from "@/features/productQna";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { ProductQuestion } from "@/shared/api/types";

export function useVendorQnaPage() {
  const vendorId = useAuthStore((state) => state.currentUser?.vendorId);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vendorId) return;

    let cancelled = false;

    void productQnaApi
      .forVendorMe()
      .then((items) => {
        if (!cancelled) {
          setQuestions(items);
          setLoadError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setQuestions([]);
          setLoadError(getApiErrorMessage(err, LABELS.couldNotLoadQuestions));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const handleAnswer = async (questionId: string, answer: string) => {
    setSubmitting(true);
    try {
      const created = await productQnaApi.answer(questionId, { answer });
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          const answers = q.answers ? [...q.answers] : [];
          const answerObj: ProductQuestion["answers"][number] = created || {
            id: `${questionId}-answer`,
            answer,
            authorType: "VENDOR",
            authorName: null,
            status: "PUBLISHED",
            createdAt: new Date().toISOString(),
          };
          return {
            ...q,
            answers: [...answers, answerObj],
          };
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAnswer = async (answerId: string, answer: string) => {
    setSubmitting(true);
    try {
      const updated = await productQnaApi.updateAnswer(answerId, { answer });
      setQuestions((prev) =>
        prev.map((q) => {
          const hasAnswer = q.answers?.some((a) => a.id === answerId);
          if (!hasAnswer) return q;
          return {
            ...q,
            answers: (q.answers ?? []).map((a) =>
              a.id === answerId ? { ...a, ...updated, answer } : a,
            ),
          };
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    questions,
    isLoading: vendorId ? isLoading : false,
    loadError,
    submitting,
    handleAnswer,
    handleUpdateAnswer,
  };
}
