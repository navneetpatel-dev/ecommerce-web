import { LABELS } from "@/shared/constants/labels";
import { notFoundStyles as styles } from "@/shared/styles/notFound.styles";

/**
 * Delivery-workspace not-found: keeps the delivery layout context instead of falling through to
 * the storefront 404 (Rule 13 route-level coverage), mirroring the admin/vendor equivalents.
 */
export default function DeliveryDashboardNotFound() {
  return (
    <div className={styles.workspaceContainer}>
      <h2 className={styles.workspaceHeading}>{LABELS.notFoundHeading}</h2>
      <p className={styles.workspaceBody}>{LABELS.notFoundDeliveryBody}</p>
    </div>
  );
}
