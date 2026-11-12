import { Store, User } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import {
  PRODUCT_ANSWER_AUTHOR_TYPE,
  PRODUCT_QUESTION_STATUS,
} from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductQuestion } from "@/shared/api/types";
import {
  QuestionAnswerSlot,
  type AnsweringState,
} from "./QuestionAnswerSlot.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** One question, its published answers and, for buyers, the Answer action. */
export function QuestionItem({
  question: q,
  answering,
}: {
  question: ProductQuestion;
  answering?: AnsweringState;
}) {
  return (
    <article className={styles.questionArticle}>
      <div className={styles.questionHeader}>
        <User className={styles.userIcon} />
        <div>
          <p className={styles.questionText}>{q.question}</p>
          <p className={styles.questionMeta}>
            {q.customerName ?? LABELS.verifiedCustomer} ·{" "}
            {formatOrderDate(q.createdAt)}
            {q.status === PRODUCT_QUESTION_STATUS.PENDING
              ? ` · ${LABELS.questionPendingReview}`
              : ""}
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
                  : formatLabel(LABELS.verifiedBuyerAnswer, {
                      name: a.authorName ?? LABELS.verifiedCustomer,
                    })}
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

      <QuestionAnswerSlot question={q} answering={answering} />
    </article>
  );
}
