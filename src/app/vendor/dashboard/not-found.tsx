import { LABELS } from "@/shared/constants/labels";
import { notFoundStyles as styles } from "@/shared/styles/notFound.styles";

/**
 * Vendor-workspace not-found: keeps the vendor layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function VendorDashboardNotFound() {
  return (
    <div className={styles.workspaceContainer}>
      <h2 className={styles.workspaceHeading}>{LABELS.notFoundHeading}</h2>
      <p className={styles.workspaceBody}>{LABELS.notFoundVendorBody}</p>
    </div>
  );
}
