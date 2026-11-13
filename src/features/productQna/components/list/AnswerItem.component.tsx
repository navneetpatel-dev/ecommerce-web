"use client";

import { Store } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_ANSWER_AUTHOR_TYPE } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductAnswer } from "@/shared/api/types";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { ANSWER_CLAMP_CHARS } from "../../constants/productQna.constants";
import { useQnaEditActions } from "../../context/qnaEdit.context";
import { OwnerEditButton } from "./OwnerEditButton.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** "A" + the answer, then who answered (seller tag or verified buyer) and when. */
export function AnswerItem({ answer }: { answer: ProductAnswer }) {
  const isSeller = answer.authorType === PRODUCT_ANSWER_AUTHOR_TYPE.VENDOR;
  const { currentUserId, editAnswer } = useQnaEditActions();
  const isMine = Boolean(currentUserId && answer.authorId === currentUserId);
  const handleEdit = () => editAnswer(answer);

  return (
    <div className={styles.answerItem}>
      <span className={styles.aBadge} aria-hidden>
        {LABELS.answerLabel}
      </span>
      <div className={styles.answerContent}>
        <ExpandableText
          text={answer.answer}
          threshold={ANSWER_CLAMP_CHARS}
          className={styles.answerBody}
        />
        <p className={styles.answerAuthor}>
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
          {isMine ? (
            <OwnerEditButton
              label={LABELS.editAnswerAria}
              onClick={handleEdit}
            />
          ) : null}
        </p>
      </div>
    </div>
  );
}
