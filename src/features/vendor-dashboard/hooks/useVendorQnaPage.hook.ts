"use client";

import { useEffect, useState } from "react";
import { productQnaApi } from "@/features/productQna";
import { useAuthStore } from "@/shared/stores/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { ProductQuestion } from "@/shared/api/types";

export function useVendorQnaPage() {
  const vendorId = useAuthStore((state) => state.currentUser?.vendorId);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vendorId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    void productQnaApi
      .forVendorMe()
      .then((items) => {
        if (!cancelled) setQuestions(items);
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
      await productQnaApi.answer(questionId, { answer });
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } finally {
      setSubmitting(false);
    }
  };

  return { questions, isLoading, loadError, submitting, handleAnswer };
}
