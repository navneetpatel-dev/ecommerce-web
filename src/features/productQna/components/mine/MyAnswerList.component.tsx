import type { MyAnswer } from "../../types/productQna.types";
import { MyAnswerCard } from "./MyAnswerCard.component";
import { myQnaPagesStyles as styles } from "../../styles/mine/myQnaPages.styles";

export function MyAnswerList({ answers }: { answers: MyAnswer[] }) {
  return (
    <ul className={styles.list}>
      {answers.map((answer) => (
        <MyAnswerCard key={answer.id} answer={answer} />
      ))}
    </ul>
  );
}
