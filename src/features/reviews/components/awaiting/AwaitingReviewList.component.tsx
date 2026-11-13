import type { AwaitingReviewItem } from "../../types/productReviews.types";
import { awaitingReviewsStyles as styles } from "../../styles/awaiting/awaitingReviews.styles";
import { AwaitingReviewCard } from "./AwaitingReviewCard.component";

export function AwaitingReviewList({ items }: { items: AwaitingReviewItem[] }) {
  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <AwaitingReviewCard key={item.productId} item={item} />
      ))}
    </ul>
  );
}
