import { AdminNotificationsPage } from "@/features/admin-dashboard";
import { generateNoIndexMetadata } from "@/shared/seo/metadata";

export const metadata = generateNoIndexMetadata("Notifications");

export default function NotificationsPage() {
  return <AdminNotificationsPage />;
}
