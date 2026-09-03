import { AdminInventoryPage } from "@/features/admin-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = generateNoIndexMetadata("Inventory");

export default function InventoryPage() {
  return <AdminInventoryPage />;
}
