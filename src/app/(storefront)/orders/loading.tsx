import { SkeletonCard } from "@/shared/components/Skeletons.component";
import { loadingPagesStyles as styles } from "@/app/loadingPages.styles";

export default function OrdersLoading() {
  return (
    <div className={styles.paddedCardStack}>
      <SkeletonCard count={5} />
    </div>
  );
}
