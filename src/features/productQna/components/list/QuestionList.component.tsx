import type { ProductQuestion } from "@/shared/api/types";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";
import { QuestionItem } from "./QuestionItem.component";
import type { AnsweringState } from "./QuestionAnswerSlot.component";

interface QuestionListProps {
  questions: ProductQuestion[];
  answering?: AnsweringState;
}

export function QuestionList({ questions, answering }: QuestionListProps) {
  return (
    <div className={styles.questionsList}>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          answering={answering}
        />
      ))}
    </div>
  );
}
