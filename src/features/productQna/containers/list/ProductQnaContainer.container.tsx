"use client";

import { useProductQnaView } from "../../hooks/list/useProductQnaView.hook";
import { useAnsweringState } from "../../hooks/answer-form/useAnsweringState.hook";
import { ProductQuestions } from "../../components/list/ProductQuestions.component";
import { AskQuestionCardContainer } from "../ask-form/AskQuestionCardContainer.container";
import { QnaEditProvider } from "../edit/QnaEditProvider.container";

interface ProductQnaContainerProps {
  productId: string;
  productSlug: string;
  enabled?: boolean;
}

export function ProductQnaContainer({
  productId,
  productSlug,
  enabled = true,
}: ProductQnaContainerProps) {
  const view = useProductQnaView(productId, productSlug, { enabled });
  const answering = useAnsweringState(productId);

  return (
    <QnaEditProvider>
      <ProductQuestions
        questions={view.questions}
        summary={view.summary}
        isLoading={view.isLoading}
        isError={view.isError}
        onRetry={view.retry}
        answering={answering}
        askSlot={<AskQuestionCardContainer productId={productId} />}
        allQuestionsHref={view.allQuestionsHref}
        viewAllLabel={view.viewAllLabel}
        hasMore={view.hasMore}
      />
    </QnaEditProvider>
  );
}
