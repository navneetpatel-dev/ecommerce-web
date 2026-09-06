"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/useApiFormErrors.hook";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth.hook";
import {
  AskQuestionFormSchema,
  type AskQuestionFormInput,
} from "../schemas/productQna.schema";
import { useAskQuestion } from "../api/productQna.queries";

export function useAskQuestionForm(productId: string) {
  const askQuestion = useAskQuestion();
  const { requireAuth } = useRequireAuth();

  const form = useForm<AskQuestionFormInput>({
    resolver: zodResolver(AskQuestionFormSchema),
    defaultValues: { question: "" },
  });

  const { formLevelError } = useApiFormErrors(
    form,
    askQuestion.error,
    LABELS.couldNotSubmitQuestion,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = form;

  const question = watch("question") || "";

  const onSubmit = (data: AskQuestionFormInput) => {
    if (
      !requireAuth({
        title: LABELS.askAQuestion,
        message: LABELS.signInToAskQuestion,
      })
    ) {
      return;
    }
    askQuestion.mutate(
      { productId, question: data.question },
      { onSuccess: () => reset() },
    );
  };

  return {
    register,
    handleSubmit,
    errors,
    formLevelError,
    question,
    onSubmit,
    isPending: askQuestion.isPending,
    isSuccess: askQuestion.isSuccess,
  };
}
