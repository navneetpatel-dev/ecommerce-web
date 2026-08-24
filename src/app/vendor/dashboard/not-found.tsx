import { LABELS } from "@/shared/constants/labels";

/**
 * Vendor-workspace not-found: keeps the vendor layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function VendorDashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-[1.375rem] font-semibold text-ink">
        {LABELS.notFoundHeading}
      </h2>
      <p className="max-w-md text-center text-body text-ink-muted">
        {LABELS.notFoundVendorBody}
      </p>
    </div>
  );
}
