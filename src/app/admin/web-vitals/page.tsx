import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AdminWebVitalsPage } from "@/features/admin-dashboard";

export const metadata = generateNoIndexMetadata("Web Vitals");

export default function AdminWebVitals() {
  return <AdminWebVitalsPage />;
}
