import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { orderConfirmationSkeletonStyles as styles } from "./orderConfirmationSkeleton.styles";

/**
 * Mirrors OrderConfirmation's hero band plus items/totals split, so arriving
 * from checkout lands on the shape the confirmed order will occupy.
 */
export function OrderConfirmationSkeleton() {
  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.radialBg} />

      <div
        className={styles.container}
        aria-busy="true"
        aria-label={LABELS.orderDetailsLoading}
      >
        <div className={styles.contentWrapper}>
          <div className={styles.heroRow}>
            <div className={styles.heroLeft}>
              <div className={styles.heroBadgeRow}>
                <Skeleton className={styles.heroBadgeIcon} />
                <Skeleton className={styles.heroBadgeText} />
              </div>
              <div className={styles.heroTitles}>
                <Skeleton className={styles.heroHeading} />
                <Skeleton className={styles.heroMeta} />
                <Skeleton className={styles.heroDescription} />
              </div>
            </div>
            <div className={styles.heroActions}>
              <Skeleton className={styles.heroButtonLeft} />
              <Skeleton className={styles.heroButtonRight} />
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.column}>
              <Skeleton className={styles.sectionEyebrow} />
              <Skeleton className={styles.sectionTitle} />
              <div className={styles.itemsList}>
                {[0, 1].map((group) => (
                  <div key={group} className={styles.itemCard}>
                    <div className={styles.itemCardHeader}>
                      <Skeleton className={styles.itemHeaderTitle} />
                      <Skeleton className={styles.itemHeaderMeta} />
                    </div>
                    <div className={styles.itemCardBody}>
                      <Skeleton className={styles.itemImage} />
                      <div className={styles.itemContent}>
                        <Skeleton className={styles.itemName} />
                        <Skeleton className={styles.itemQty} />
                      </div>
                      <Skeleton className={styles.itemPrice} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.column}>
              <Skeleton className={styles.sectionEyebrow} />
              <Skeleton className={styles.sectionTitleAside} />
              <div className={styles.asideCard}>
                <Skeleton className={styles.asideLine1} />
                <Skeleton className={styles.asideLine2} />
                <Skeleton className={styles.asideTotal} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
