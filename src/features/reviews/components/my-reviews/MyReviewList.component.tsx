import type { Review } from "@/shared/api/types";
import { myReviewsPageStyles as styles } from "../../pages/my-reviews/myReviewsPage.styles";
import { MyReviewCard } from "./MyReviewCard.component";

export function MyReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className={styles.reviewsList}>
      {reviews.map((review) => (
        <MyReviewCard key={review.id} review={review} />
      ))}
    </ul>
  );
}
