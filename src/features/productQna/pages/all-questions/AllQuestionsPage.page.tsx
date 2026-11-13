"use client";

import { ProductSubPageHeader } from "@/shared/components/layout/ProductSubPageHeader.component";
import { ProductSubPageFallback } from "@/shared/components/layout/ProductSubPageFallback.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { LABELS } from "@/shared/constants/labels";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";
import { useAllQuestionsPage } from "../../hooks/all-questions/useAllQuestionsPage.hook";
import { useAnsweringState } from "../../hooks/answer-form/useAnsweringState.hook";
import { QnaSummaryCard } from "../../components/list/QnaSummaryCard.component";
import { AllQuestionsToolbar } from "../../components/all-questions/AllQuestionsToolbar.component";
import { AllQuestionsResults } from "../../components/all-questions/AllQuestionsResults.component";
import { AskQuestionCardContainer } from "../../containers/ask-form/AskQuestionCardContainer.container";
import { QnaEditProvider } from "../../containers/edit/QnaEditProvider.container";

/** Every question about a product: search, answered filter, sort, pages, and ask. */
export function AllQuestionsPage() {
  const view = useAllQuestionsPage();
  const answering = useAnsweringState(view.productId);

  if (view.isProductLoading) {
    return (
      <div className={styles.container}>
        <ReviewListSkeleton count={4} />
      </div>
    );
  }

  if (view.isProductMissing || !view.product) {
    return (
      <div className={styles.container}>
        <ProductSubPageFallback
          loadFailed={view.productLoadFailed}
          onRetry={view.retryProduct}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProductSubPageHeader
        productHref={view.productHref}
        productName={view.product.name}
        imageUrl={view.productImage}
        eyebrow={LABELS.questionsAndAnswers}
        title={view.title}
      />
      <div className={styles.layout}>
        <aside className={styles.aside}>
          <div className={styles.asideSticky}>
            <QnaSummaryCard summary={view.summary} />
            <AskQuestionCardContainer productId={view.productId} />
          </div>
        </aside>
        <QnaEditProvider>
          <section
            className={styles.main}
            aria-label={LABELS.questionsAndAnswers}
          >
            <AllQuestionsToolbar
              search={view.search.value}
              onSearchChange={view.search.handleChange}
              answered={view.answered}
              onAnsweredChange={view.setAnswered}
              sort={view.sort}
              onSortChange={view.setSort}
            />
            <AllQuestionsResults
              questions={view.questions}
              answering={answering}
              isLoading={view.isLoading}
              isFetching={view.isFetching}
              isError={view.isError}
              onRetry={view.retry}
              hasFilters={view.hasFilters}
              onClearFilters={view.clearFilters}
              page={view.page}
              totalPages={view.totalPages}
              total={view.total}
              from={view.from}
              to={view.to}
              onPageChange={view.setPage}
            />
          </section>
        </QnaEditProvider>
      </div>
    </div>
  );
}
