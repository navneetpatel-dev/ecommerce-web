import type { MyQuestion } from "../../types/productQna.types";
import { MyQuestionCard } from "./MyQuestionCard.component";
import { myQnaPagesStyles as styles } from "../../styles/mine/myQnaPages.styles";

export function MyQuestionList({ questions }: { questions: MyQuestion[] }) {
  return (
    <ul className={styles.list}>
      {questions.map((question) => (
        <MyQuestionCard key={question.id} question={question} />
      ))}
    </ul>
  );
}
