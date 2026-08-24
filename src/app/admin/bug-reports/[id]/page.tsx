import { AdminBugReportDetailPage } from "@/features/bugReports";
import { WORKSPACE_PAGE_COPY } from "@/shared/seo/constants";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

/** Workspace route: never indexed (Rule 27); title from centralized copy. */
export const metadata = generateNoIndexMetadata(
  WORKSPACE_PAGE_COPY["/admin/bug-reports/[id]"].title,
);

export default function AdminBugReportDetailRoute() {
  return <AdminBugReportDetailPage />;
}
