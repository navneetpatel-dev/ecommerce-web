"use client";

import { useProductQnaView } from "../../hooks/list/useProductQnaView.hook";
import { useAskQuestionForm } from "../../hooks/ask-form/useAskQuestionForm.hook";
import { useAnswerQuestionForm } from "../../hooks/answer-form/useAnswerQuestionForm.hook";
import { ProductQuestions } from "../../components/list/ProductQuestions.component";
import { AskQuestionForm } from "../../components/ask-form/AskQuestionForm.component";
import { productQnaStyles } from "../../styles/list/productQna.styles";

interface ProductQnaContainerProps {
  productId: string;
  enabled?: boolean;
}

export function ProductQnaContainer({
  productId,
  enabled = true,
}: ProductQnaContainerProps) {
  const view = useProductQnaView(productId, { enabled });
  const askForm = useAskQuestionForm(productId);
  const answerForm = useAnswerQuestionForm(productId);
  const answering = answerForm.canAnswer
    ? {
        openId: answerForm.openId,
        submittedId: answerForm.submittedId,
        draft: answerForm.draft,
        isPending: answerForm.isPending,
        error: answerForm.error,
        onToggle: answerForm.toggle,
        onDraftChange: answerForm.handleDraftChange,
        onSubmit: answerForm.handleSubmit,
      }
    : undefined;

  return (
    <div className={productQnaStyles.container}>
      <AskQuestionForm
        register={askForm.register}
        errors={askForm.errors}
        question={askForm.question}
        isPending={askForm.isPending}
        isSuccess={askForm.isSuccess}
        formLevelError={askForm.formLevelError}
        onSubmit={askForm.handleSubmit(askForm.onSubmit)}
      />
      <ProductQuestions
        questions={view.questions}
        isLoading={view.isLoading}
        answering={answering}
      />
    </div>
  );
}
