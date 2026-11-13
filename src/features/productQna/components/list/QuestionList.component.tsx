import type { ProductQuestion } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";
import { QuestionItem } from "./QuestionItem.component";
import type { AnsweringState } from "./QuestionAnswerSlot.component";

interface QuestionListProps {
  questions: ProductQuestion[];
  answering?: AnsweringState;
}

export function QuestionList({ questions, answering }: QuestionListProps) {
  return (
    <>
      {/* Once, above the list: why there is no Answer button (C-01). */}
      {answering?.mode === "notBuyer" ? (
        <p className={styles.answerPolicyNote}>{LABELS.answerBuyersOnly}</p>
      ) : null}
      <div className={styles.questionsList}>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            answering={answering}
          />
        ))}
      </div>
    </>
  );
}
