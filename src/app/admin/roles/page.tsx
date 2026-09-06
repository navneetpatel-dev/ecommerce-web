import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AdminRolesPage } from "@/features/admin-dashboard";

export const metadata = generateNoIndexMetadata("Roles");

export default function AdminRoles() {
  return <AdminRolesPage />;
}
