import type { ProductAnswer } from "@/shared/api/types";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";
import { AnswerItem } from "./AnswerItem.component";

export function AnswerList({
  answers,
  id,
}: {
  answers: ProductAnswer[];
  id?: string;
}) {
  return (
    <div id={id} className={styles.answersList}>
      {answers.map((answer) => (
        <AnswerItem key={answer.id} answer={answer} />
      ))}
    </div>
  );
}
