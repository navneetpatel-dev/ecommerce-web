import type { ReactNode } from "react";
import { Store } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductAnswer } from "@/shared/api/types";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** Who answered (seller tag or "Name · Verified buyer"), when, and "Edited". */
export function AnswerByline({
  answer,
  isSeller,
  children,
}: {
  answer: ProductAnswer;
  isSeller: boolean;
  /** Trailing actions (Edit / Delete on the viewer's own unpinned answer). */
  children?: ReactNode;
}) {
  return (
    <div className={styles.answerAuthor}>
      {isSeller ? (
        <span className={styles.sellerTag}>
          <Store className={styles.authorIcon} aria-hidden />
          {LABELS.sellerAnswer}
        </span>
      ) : (
        <span>
          {formatLabel(LABELS.verifiedBuyerAnswer, {
            name: answer.authorName ?? LABELS.verifiedCustomer,
          })}
        </span>
      )}
      <span aria-hidden>·</span>
      <time dateTime={answer.createdAt} className={styles.answerDate}>
        {formatOrderDate(answer.createdAt)}
      </time>
      {answer.editedAt ? (
        <span className={styles.editedTag}>{LABELS.editedTag}</span>
      ) : null}
      {children}
    </div>
  );
}
