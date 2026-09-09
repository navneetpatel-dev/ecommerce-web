import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { loadingPagesStyles as styles } from "@/app/_styles/loading-pages.styles";

export default function ProductsLoading() {
  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsFlex}>
        <div className={styles.productsSidebar}>
          <Skeleton className={styles.skelH6W24} />
          <Skeleton className={styles.skelH32Rounded} />
          <Skeleton className={styles.skelH24Rounded} />
        </div>
        <div className={styles.productsMain}>
          <div className={styles.productsHeaderRow}>
            <Skeleton className={styles.skelH5W28} />
            <Skeleton className={styles.skelH9W40} />
          </div>
          <SkeletonGrid count={8} />
        </div>
      </div>
    </div>
  );
}
