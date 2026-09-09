import { Skeleton } from "@/shared/components/ui/skeleton";
import { productDetailSkeletonStyles as styles } from "../../styles/detail/productDetailSkeleton.styles";

export function ProductDetailSkeleton() {
  return (
    <div className={styles.container}>
      <Skeleton className={styles.breadcrumb} />
      <div className={styles.grid}>
        <div className={styles.galleryCol}>
          <div className={styles.galleryFlex}>
            <div className={styles.thumbnailStrip}>
              <Skeleton className={styles.thumbnail} />
              <Skeleton className={styles.thumbnail} />
              <Skeleton className={styles.thumbnailHiddenMobile} />
            </div>
            <Skeleton className={styles.stageImage} />
          </div>
        </div>
        <div className={styles.detailsCol}>
          <Skeleton className={styles.skelH5W28} />
          <Skeleton className={styles.skelH3W20} />
          <Skeleton className={styles.skelH10Full} />
          <Skeleton className={styles.skelH5W32} />
          <Skeleton className={styles.skelH14Full} />
          <Skeleton className={styles.skelH24RoundedXl} />
          <Skeleton className={styles.skelH28RoundedXl} />
        </div>
      </div>
    </div>
  );
}
