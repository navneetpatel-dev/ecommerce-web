import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { myReviewsPageStyles as styles } from "../../pages/my-reviews/myReviewsPage.styles";

/** "3 delivered products are waiting for your review — Review now". */
export function AwaitingReviewsBanner({ label }: { label: string }) {
  return (
    <div className={styles.banner}>
      <span className={styles.bannerIconWrap} aria-hidden>
        <PackageCheck className={styles.bannerIcon} />
      </span>
      <p className={styles.bannerText}>{label}</p>
      <Button
        asChild
        size="sm"
        variant="outline"
        className={styles.bannerButton}
      >
        <Link href={PATHS.reviewsAwaiting}>
          {LABELS.reviewNow}
          <ArrowRight className={styles.editIcon} aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
