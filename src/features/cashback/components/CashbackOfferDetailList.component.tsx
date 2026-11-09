import type { CashbackOfferCopy } from "../hooks/useCashbackOfferBadge.hook";
import { cashbackOfferBadgeStyles as styles } from "../styles/cashbackOfferBadge.styles";
import { CashbackOfferDetail } from "./CashbackOfferDetail.component";

export function CashbackOfferDetailList({
  offers,
}: {
  offers: CashbackOfferCopy[];
}) {
  return (
    <ul className={styles.list}>
      {offers.map((copy) => (
        <li key={copy.id}>
          <CashbackOfferDetail copy={copy} />
        </li>
      ))}
    </ul>
  );
}
