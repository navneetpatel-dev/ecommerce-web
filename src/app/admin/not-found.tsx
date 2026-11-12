import { LABELS } from "@/shared/constants/labels";
import { ErrorState } from "@/shared/components/system/ErrorState.component";

/**
 * Admin-surface not-found: keeps the admin layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function AdminNotFound() {
  return (
    <ErrorState
      variant="notFound"
      heading={LABELS.notFoundHeading}
      message={LABELS.notFoundAdminBody}
    />
  );
}
