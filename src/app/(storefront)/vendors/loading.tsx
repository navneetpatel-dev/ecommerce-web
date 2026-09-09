import { SkeletonCard } from "@/shared/components/Skeletons.component";
import { loadingPagesStyles as styles } from "@/app/_styles/loading-pages.styles";

export default function VendorsLoading() {
  return (
    <div className={styles.vendorsContainer}>
      <SkeletonCard count={6} />
    </div>
  );
}
