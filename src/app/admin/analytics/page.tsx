import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { AdminAnalyticsPage } from "@/features/admin-dashboard";

export const metadata = generateNoIndexMetadata("Analytics");

export default function AdminAnalytics() {
  return <AdminAnalyticsPage />;
}
