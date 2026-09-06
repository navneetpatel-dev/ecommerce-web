import { AdminVendorDetailPage } from "@/features/admin-dashboard";
import { WORKSPACE_PAGE_COPY } from "@/shared/seo/constants";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

/** Workspace route: never indexed (Rule 27); title from centralized copy. */
export const metadata = generateNoIndexMetadata(
  WORKSPACE_PAGE_COPY["/admin/vendors/[id]"].title,
);

export default function AdminVendorDetailRoute() {
  return <AdminVendorDetailPage />;
}
