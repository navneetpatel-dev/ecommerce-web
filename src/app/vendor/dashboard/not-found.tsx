import { LABELS } from "@/shared/constants/labels";
import { ErrorState } from "@/shared/components/system/ErrorState.component";

/**
 * Vendor-workspace not-found: keeps the vendor layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function VendorDashboardNotFound() {
  return (
    <ErrorState
      variant="notFound"
      heading={LABELS.notFoundHeading}
      message={LABELS.notFoundVendorBody}
    />
  );
}
