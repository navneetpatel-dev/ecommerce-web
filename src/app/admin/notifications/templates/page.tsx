import { AdminEmailTemplatesPage } from "@/features/admin-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = generateNoIndexMetadata("Email templates");

export default function EmailTemplatesPage() {
  return <AdminEmailTemplatesPage />;
}
