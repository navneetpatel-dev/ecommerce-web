import { VendorQnaPage } from "@/features/vendor-dashboard";
import { WORKSPACE_PAGE_COPY } from "@/shared/seo/constants";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

/** Workspace route: never indexed (Rule 27); title from centralized copy. */
export const metadata = generateNoIndexMetadata(
  WORKSPACE_PAGE_COPY["/vendor/dashboard/qna"].title,
);

export default function VendorQnaRoute() {
  return <VendorQnaPage />;
}
