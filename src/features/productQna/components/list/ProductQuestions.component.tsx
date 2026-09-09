import { MessageCircleQuestion, Store, User } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_ANSWER_AUTHOR_TYPE } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { ProductQuestion } from "@/shared/api/types";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

interface ProductQuestionsProps {
  questions: ProductQuestion[];
  isLoading?: boolean;
}

export function ProductQuestions({
  questions,
  isLoading,
}: ProductQuestionsProps) {
  if (isLoading) {
    return <ReviewListSkeleton count={3} />;
  }

  if (!questions.length) {
    return (
      <EmptyState
        heading={LABELS.noQuestionsYet}
        message={LABELS.beFirstToAskQuestion}
        icon={MessageCircleQuestion}
        maxWidth="max-w-[65ch]"
        className={styles.emptyState}
      />
    );
  }

  return (
    <div className={styles.questionsList}>
      {questions.map((q) => (
        <article key={q.id} className={styles.questionArticle}>
          <div className={styles.questionHeader}>
            <User className={styles.userIcon} />
            <div>
              <p className={styles.questionText}>{q.question}</p>
              <p className={styles.questionMeta}>
                {q.customerName ?? LABELS.verifiedCustomer} ·{" "}
                {formatOrderDate(q.createdAt)}
              </p>
            </div>
          </div>

          {q.answers.length > 0 ? (
            <div className={styles.answersList}>
              {q.answers.map((a) => (
                <div key={a.id} className={styles.answerItem}>
                  <p className={styles.answerAuthor}>
                    {a.authorType === PRODUCT_ANSWER_AUTHOR_TYPE.VENDOR ? (
                      <Store className={styles.authorIcon} />
                    ) : (
                      <User className={styles.authorIcon} />
                    )}
                    {a.authorType === PRODUCT_ANSWER_AUTHOR_TYPE.VENDOR
                      ? LABELS.sellerAnswer
                      : (a.authorName ?? LABELS.verifiedCustomer)}
                    <span className={styles.answerDate}>
                      {formatOrderDate(a.createdAt)}
                    </span>
                  </p>
                  <p className={styles.answerBody}>{a.answer}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noAnswersText}>{LABELS.noAnswersYet}</p>
          )}
        </article>
      ))}
    </div>
  );
}
