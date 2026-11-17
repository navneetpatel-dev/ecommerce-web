"use client";

import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import { VendorQnaAnswerDialog } from "./VendorQnaAnswerDialog.component";
import { VendorQnaList } from "./VendorQnaView/VendorQnaList.component";
import { VendorQnaSkeletonList } from "./VendorQnaView/VendorQnaSkeletonList.component";
import { useVendorQnaViewState } from "../../hooks/qna/useVendorQnaViewState.hook";
import { vendorFeedbackViewsStyles as styles } from "../../styles/reviews/vendorFeedbackViews.styles";

interface VendorQnaViewProps {
  questions: ProductQuestion[];
  isLoading?: boolean;
  loadError?: string | null;
  submitting?: boolean;
  onAnswer: (questionId: string, answer: string) => void | Promise<void>;
  onUpdateAnswer?: (answerId: string, answer: string) => void | Promise<void>;
}

export function VendorQnaView({
  questions,
  isLoading = false,
  loadError = null,
  submitting = false,
  onAnswer,
  onUpdateAnswer,
}: VendorQnaViewProps) {
  const {
    targetId,
    initialAnswer,
    handleOpenAnswer,
    handleAnswerOpenChange,
    handleAnswerSubmit,
  } = useVendorQnaViewState({ questions, onAnswer, onUpdateAnswer });

  const loadingContent = isLoading ? <VendorQnaSkeletonList /> : null;

  const errorContent = loadError ? (
    <p role="alert" className={styles.errorBox}>
      {loadError}
    </p>
  ) : null;

  const emptyContent =
    !isLoading && !loadError && !questions.length ? (
      <p className={styles.emptyText}>{LABELS.noQuestionsFound}</p>
    ) : null;

  const listContent =
    !isLoading && !loadError && questions.length > 0 ? (
      <VendorQnaList questions={questions} onOpenAnswer={handleOpenAnswer} />
    ) : null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{LABELS.questionsAndAnswers}</h1>
          <p className={styles.hint}>{LABELS.vendorQnaHint}</p>
        </div>
      </div>

      {loadingContent}
      {errorContent}
      {emptyContent}
      {listContent}

      <VendorQnaAnswerDialog
        open={Boolean(targetId)}
        initialAnswer={initialAnswer}
        submitting={submitting}
        onOpenChange={handleAnswerOpenChange}
        onSubmit={handleAnswerSubmit}
      />
    </section>
  );
}
