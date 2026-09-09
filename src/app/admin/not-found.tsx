import { LABELS } from "@/shared/constants/labels";
import { notFoundStyles as styles } from "@/shared/styles/notFound.styles";

/**
 * Admin-surface not-found: keeps the admin layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function AdminNotFound() {
  return (
    <div className={styles.workspaceContainer}>
      <h2 className={styles.workspaceHeading}>{LABELS.notFoundHeading}</h2>
      <p className={styles.workspaceBody}>{LABELS.notFoundAdminBody}</p>
    </div>
  );
}
