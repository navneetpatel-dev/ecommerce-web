import { CustomerBugReportDetailPage } from "@/features/bugReports";
import { WORKSPACE_PAGE_COPY } from "@/shared/seo/constants";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

/** Workspace route: never indexed (Rule 27); title from centralized copy. */
export const metadata = generateNoIndexMetadata(
  WORKSPACE_PAGE_COPY["/support/bug-reports/[id]"].title,
);

export default function BugReportDetailRoute() {
  return <CustomerBugReportDetailPage />;
}
