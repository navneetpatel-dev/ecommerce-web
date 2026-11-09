import { BadgePercent } from "lucide-react";
import type { CashbackOfferCopy } from "../hooks/useCashbackOfferBadge.hook";
import { cashbackOfferBadgeStyles as styles } from "../styles/cashbackOfferBadge.styles";

/** One offer: headline and the server's terms. */
export function CashbackOfferDetail({ copy }: { copy: CashbackOfferCopy }) {
  return (
    <p className={styles.detail}>
      <BadgePercent className={styles.detailIcon} aria-hidden />
      <span>
        <span className={styles.headline}>{copy.headline}</span>
        {copy.terms ? (
          <span className={styles.terms}> {copy.terms}</span>
        ) : null}
      </span>
    </p>
  );
}
