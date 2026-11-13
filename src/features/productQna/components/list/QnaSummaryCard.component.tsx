import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { QnaSummary } from "../../types/productQna.types";
import { answeredPercent, qnaSummaryText } from "../../utils/productQna.utils";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** "100 questions · 76 answered" with an answered-share bar. */
export function QnaSummaryCard({ summary }: { summary: QnaSummary }) {
  const percent = answeredPercent(summary);

  return (
    <section
      aria-label={LABELS.qnaSummaryHeading}
      className={styles.summaryCard}
    >
      <p className={styles.summaryEyebrow}>{LABELS.qnaSummaryHeading}</p>
      <p className={styles.summaryValue}>
        {summary.total.toLocaleString("en-IN")}
      </p>
      <p className={styles.summaryText}>{qnaSummaryText(summary)}</p>
      <div className={styles.summaryTrack} aria-hidden>
        <div className={styles.summaryFill} style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.summaryPercent}>
        {formatLabel(LABELS.qnaAnsweredShare, { percent })}
      </p>
    </section>
  );
}
