import Link from "next/link";
import { Star } from "lucide-react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { AwaitingReviewItem } from "../../types/productReviews.types";
import { awaitingReviewsStyles as styles } from "../../styles/awaiting/awaitingReviews.styles";

/** One delivered product → its page, Reviews tab open, review box focused. */
export function AwaitingReviewCard({ item }: { item: AwaitingReviewItem }) {
  const href = PATHS.productWriteReview(item.productSlug, item.orderItemId);

  return (
    <li className={styles.card}>
      <div className={styles.product}>
        <Link href={href} className={styles.thumb} tabIndex={-1} aria-hidden>
          <MediaImage
            src={item.imageUrl}
            alt={item.productName}
            sizes="80px"
            imageClassName={styles.thumbImage}
          />
        </Link>
        <div className={styles.body}>
          <p className={styles.name}>{item.productName}</p>
          <p className={styles.meta}>
            {formatLabel(LABELS.deliveredOn, {
              date: formatOrderDate(item.deliveredAt),
            })}
          </p>
        </div>
      </div>
      <Button asChild size="sm" className={styles.actionButton}>
        <Link href={href}>
          <Star className={styles.actionIcon} aria-hidden />
          {LABELS.writeAReview}
        </Link>
      </Button>
    </li>
  );
}
