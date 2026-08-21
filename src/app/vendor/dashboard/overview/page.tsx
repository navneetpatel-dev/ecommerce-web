import { generateNoIndexMetadata } from "@/shared/seo/metadata";
import { VendorOverview } from "@/features/vendor-dashboard";

export const metadata = generateNoIndexMetadata("Overview");

export default function VendorDashboard() {
  return <VendorOverview />;
}
