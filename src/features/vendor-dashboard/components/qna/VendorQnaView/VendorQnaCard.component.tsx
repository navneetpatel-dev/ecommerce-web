"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import { vendorFeedbackViewsStyles as styles } from "../../../styles/reviews/vendorFeedbackViews.styles";

interface VendorQnaCardProps {
  question: ProductQuestion;
  onOpenAnswer: (questionId: string) => void;
}

export function VendorQnaCard({ question, onOpenAnswer }: VendorQnaCardProps) {
  const handleOpenAnswer = () => onOpenAnswer(question.id);

  return (
    <article className={styles.card}>
      {question.productName ? (
        <p className={styles.cardSubtitle}>{question.productName}</p>
      ) : null}
      <p className={styles.cardTitle}>{question.question}</p>
      <Button
        className={styles.actionBtn}
        size="sm"
        variant="secondary"
        type="button"
        onClick={handleOpenAnswer}
      >
        {LABELS.answerQuestion}
      </Button>
    </article>
  );
}
