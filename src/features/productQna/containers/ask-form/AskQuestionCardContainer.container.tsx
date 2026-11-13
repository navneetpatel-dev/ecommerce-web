"use client";

import { useAskQuestionForm } from "../../hooks/ask-form/useAskQuestionForm.hook";
import { AskQuestionForm } from "../../components/ask-form/AskQuestionForm.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** "Ask a question" in its own card — used on the PDP and the all-questions page. */
export function AskQuestionCardContainer({ productId }: { productId: string }) {
  const askForm = useAskQuestionForm(productId);

  return (
    <div className={styles.askCard}>
      <AskQuestionForm
        register={askForm.register}
        errors={askForm.errors}
        question={askForm.question}
        isPending={askForm.isPending}
        isSuccess={askForm.isSuccess}
        formLevelError={askForm.formLevelError}
        onSubmit={askForm.handleSubmit(askForm.onSubmit)}
      />
    </div>
  );
}
