import Link from "next/link";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { Button } from "@/shared/components/ui/button";
import { ErrorState } from "@/shared/components/system/ErrorState.component";

/**
 * Admin-surface not-found: keeps the admin layout context instead of
 * falling through to the storefront 404 (Rule 13 route-level coverage).
 */
export default function AdminNotFound() {
  return (
    <ErrorState
      variant="notFound"
      headingLevel="h1"
      heading={LABELS.notFoundHeading}
      message={LABELS.notFoundAdminBody}
      action={
        <Button asChild variant="outline">
          <Link href={PATHS.admin.root}>{LABELS.backToHome}</Link>
        </Button>
      }
    />
  );
}
