import { Skeleton } from "@/shared/components/ui/skeleton";
import { loadingPagesStyles as styles } from "@/app/loadingPages.styles";

export default function ProductDetailLoading() {
  return (
    <div className={styles.productDetailContainer}>
      <div className={styles.productDetailGrid}>
        <Skeleton className={styles.productDetailImage} />
        <div className={styles.productDetailStack}>
          <Skeleton className={styles.skelH8W75} />
          <Skeleton className={styles.skelH6W24} />
          <Skeleton className={styles.skelH4Full} />
          <Skeleton className={styles.skelH4Full} />
          <Skeleton className={styles.skelH4W66} />
          <Skeleton className={styles.skelH10W32} />
        </div>
      </div>
    </div>
  );
}
