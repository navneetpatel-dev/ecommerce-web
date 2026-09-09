"use client";

import { useProductQnaView } from "../hooks/useProductQnaView.hook";
import { useAskQuestionForm } from "../hooks/useAskQuestionForm.hook";
import { ProductQuestions } from "../components/ProductQuestions.component";
import { AskQuestionForm } from "../components/AskQuestionForm.component";
import { productQnaStyles } from "../components/productQna.styles";

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
