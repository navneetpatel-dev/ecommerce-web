import { ContentPageSkeleton } from "@/shared/components/Skeletons.component";
import { loadingPagesStyles as styles } from "@/app/_styles/loading-pages.styles";

export default function VendorRegisterLoading() {
  return (
    <div className={styles.screenBgPaper}>
      <ContentPageSkeleton />
    </div>
  );
}
