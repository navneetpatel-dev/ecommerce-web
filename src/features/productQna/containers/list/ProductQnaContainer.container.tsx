"use client";

import { useProductQnaView } from "../../hooks/list/useProductQnaView.hook";
import { useAskQuestionForm } from "../../hooks/ask-form/useAskQuestionForm.hook";
import { ProductQuestions } from "../../components/list/ProductQuestions.component";
import { AskQuestionForm } from "../../components/ask-form/AskQuestionForm.component";
import { productQnaStyles } from "../../components/list/productQna.styles";

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
      <ProductQuestions questions={view.questions} isLoading={view.isLoading} />
    </div>
  );
}
