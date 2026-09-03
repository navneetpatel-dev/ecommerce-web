import { AdminDeliveryAgentsPage } from "@/features/admin-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = generateNoIndexMetadata("Delivery operations");
export default function DeliveryAgentsPage() {
  return <AdminDeliveryAgentsPage />;
}
