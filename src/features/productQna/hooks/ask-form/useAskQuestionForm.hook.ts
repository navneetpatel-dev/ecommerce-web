"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { useRequireAuth } from "@/shared/hooks/auth/useRequireAuth.hook";
import {
  AskQuestionFormSchema,
  type AskQuestionFormInput,
} from "../../schemas/ask-form/productQna.schema";
import { useAskQuestion } from "../../api/qna/productQna.queries";

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
