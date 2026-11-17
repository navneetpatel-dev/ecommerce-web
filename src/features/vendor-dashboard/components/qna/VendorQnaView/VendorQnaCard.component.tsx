"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import type { ProductQuestion } from "@/shared/api/types";
import { vendorFeedbackViewsStyles as styles } from "../../../styles/reviews/vendorFeedbackViews.styles";

interface VendorQnaCardProps {
  question: ProductQuestion;
  onOpenAnswer: (questionId: string) => void;
}

export function VendorQnaCard({ question, onOpenAnswer }: VendorQnaCardProps) {
  const handleOpenAnswer = () => onOpenAnswer(question.id);
  const vendorAnswer = question.answers?.find((a) => a.authorType === "VENDOR");

  return (
    <article className={styles.card}>
      {question.productName ? (
        <p className={styles.cardSubtitle}>{question.productName}</p>
      ) : null}
      <p className={styles.cardTitle}>{question.question}</p>
      {vendorAnswer ? (
        <div className={styles.replyBox}>
          <div className={styles.replyHeader}>
            <span className={styles.replyTitle}>Your Answer:</span>
            {vendorAnswer.createdAt ? (
              <span>{formatDate(vendorAnswer.createdAt)}</span>
            ) : null}
          </div>
          <p className={styles.replyBody}>{vendorAnswer.answer}</p>
          <div className={styles.replyActions}>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleOpenAnswer}
              className={styles.editReplyBtn}
            >
              Edit Answer
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className={styles.actionBtn}
          size="sm"
          variant="secondary"
          type="button"
          onClick={handleOpenAnswer}
        >
          {LABELS.answerQuestion}
        </Button>
      )}
    </article>
  );
}
