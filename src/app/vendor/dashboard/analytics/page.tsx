import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorAnalyticsPage } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Sales analytics");

export default function VendorAnalyticsRoute() {
  return <VendorAnalyticsPage />;
}
