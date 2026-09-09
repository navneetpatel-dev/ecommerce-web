import { ContentPageSkeleton } from "@/shared/components/Skeletons.component";
import { loadingPagesStyles as styles } from "@/app/loadingPages.styles";

export default function VendorRegisterLoading() {
  return (
    <div className={styles.screenBgPaper}>
      <ContentPageSkeleton />
    </div>
  );
}
