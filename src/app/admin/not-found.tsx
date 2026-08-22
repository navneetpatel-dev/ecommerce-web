import { LABELS } from "@/shared/constants/labels";

/**
 * Admin-surface not-found: keeps the admin layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-[1.375rem] font-semibold text-ink">
        {LABELS.notFoundHeading}
      </h2>
      <p className="max-w-md text-center text-[0.9375rem] text-ink-muted">
        {LABELS.notFoundAdminBody}
      </p>
    </div>
  );
}
